/**
 * Emula a ferramenta `query_dataset` (a API "Dados Víssimo", PostgREST) sobre o Redshift.
 *
 * O código do dashboard (public/dash/data.js) foi escrito para essa API: pede uma view, filtros
 * no formato PostgREST, um select com agregados (`rec:price_to_pay.sum()`), ordem, limit e offset,
 * e lê a resposta como texto "N grupo(s)" + JSON. Aqui a mesma chamada vira SQL no Redshift.
 *
 * Desempenho: o dashboard original faz uma chamada por hora ou por dia (era o limite da API).
 * Para não rodar centenas de SQLs, uma chamada de uma hora é respondida a partir do dia inteiro
 * (agrupado por hora) e uma chamada de um dia passado, a partir do mês inteiro (agrupado por dia):
 * um SQL só, guardado em cache e fatiado aqui. O resultado é o mesmo; só muda quantas vezes o
 * banco é consultado.
 */
import { query, SCHEMA } from './redshift';

type Filter = { column: string; op: string; value: string };
type Sel = { key: string; col: string; fn?: 'sum' | 'count' | 'min' | 'max' | 'avg' };
type Row = Record<string, unknown>;
export type QueryArgs = {
  dataset: string;
  select?: string[];
  filters?: Filter[];
  order?: string;
  limit?: number;
  offset?: number;
};

const S = SCHEMA;
const ID = /^[a-z_][a-z0-9_]*$/i;
const TIME_COL = 'created_at_datetime';
const ASSINATURA = ['assinatura_plano', 'assinatura_periodicidade', 'assinatura_master_sku'];

/** View da API → tabela/view no Redshift. */
const DATASETS: Record<string, { from: (cols: Set<string>) => string; time?: boolean; ttl?: number }> = {
  vw_ev_fact_order_item: { from: () => `${S}.ev_fact_order_item`, time: true },
  vw_gc_fact_order_item: {
    time: true,
    // O plano da assinatura vem da vw_gc_assinatura_plano por recurrency_id (1 linha por assinatura).
    from: (cols) =>
      ASSINATURA.some((c) => cols.has(c))
        ? `(select f.*, a.plano as assinatura_plano, a.periodicidade as assinatura_periodicidade, a.master_sku as assinatura_master_sku
            from ${S}.gc_fact_order_item f left join ${S}.vw_gc_assinatura_plano a on a.recurrency_id = f.recurrency_id)`
        : `${S}.gc_fact_order_item`,
  },
  vw_ev_dim_product: { from: () => `${S}.ev_dim_product`, ttl: 3600 },
  vw_ev_dim_product_bundle: { from: () => `${S}.vw_ev_dim_product_bundle`, ttl: 3600 },
  vw_ev_grupo_de_produto: { from: () => `${S}.vw_carga_ev_grupo_de_produto`, ttl: 3600 },
  vw_gc_dim_product: { from: () => `${S}.gc_dim_product`, ttl: 3600 },
  vw_gc_dim_stock: { from: () => `${S}.vw_carga_gc_dim_stock`, ttl: 900 },
};
export const KNOWN_DATASETS = [...Object.keys(DATASETS), 'vw_etl_load_status'];

const q = (c: string) => {
  if (!ID.test(c)) throw new Error(`Coluna inválida: ${c}`);
  return `"${c.toLowerCase()}"`;
};

function parseSelect(select: string[] | undefined): Sel[] {
  if (!select || !select.length) throw new Error('select obrigatório');
  return select.map((s) => {
    const m = /^(?:([a-z_][a-z0-9_]*):)?([a-z_][a-z0-9_]*)(?:\.(sum|count|min|max|avg)\(\))?$/i.exec(s.trim());
    if (!m) throw new Error(`select inválido: ${s}`);
    return { key: m[1] || m[2], col: m[2], fn: m[3]?.toLowerCase() as Sel['fn'] };
  });
}

// ---------- janela de tempo ----------
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const isDateTime = (v: string) => /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/.test(v);
const norm = (v: string) => {
  const s = v.replace(' ', 'T');
  return s.length === 16 ? s + ':00' : s;
};
const addMs = (iso: string, ms: number) => new Date(Date.parse(iso + 'Z') + ms).toISOString().slice(0, 19);
const addDays = (d: string, n: number) => addMs(d + 'T00:00:00', n * 864e5).slice(0, 10);

/** Converte os filtros de created_at_datetime numa janela [ini, fim) em hora local. */
function timeWindow(filters: Filter[]): { ini?: string; fim?: string } {
  let ini: string | undefined, fim: string | undefined;
  for (const f of filters) {
    if (f.column !== TIME_COL) continue;
    const v = String(f.value);
    if (!isDate(v) && !isDateTime(v)) throw new Error(`Data inválida em ${TIME_COL}: ${v}`);
    if (f.op === 'gte' || f.op === 'gt') ini = isDate(v) ? v + 'T00:00:00' : norm(v);
    // Como na API: "lte <dia>" cobre o dia inteiro.
    else if (f.op === 'lte') fim = isDate(v) ? addDays(v, 1) + 'T00:00:00' : addMs(norm(v), 1000);
    else if (f.op === 'lt') fim = isDate(v) ? v + 'T00:00:00' : norm(v);
    else throw new Error(`Operador ${f.op} não suportado em ${TIME_COL}`);
  }
  return { ini, fim };
}

// ---------- WHERE ----------
function where(filters: Filter[], params: unknown[]): string[] {
  const out: string[] = [];
  const p = (v: unknown) => {
    params.push(v);
    return `$${params.length}`;
  };
  for (const f of filters) {
    if (f.column === TIME_COL) continue;
    const c = q(f.column);
    const v = String(f.value);
    switch (f.op) {
      case 'eq': out.push(`${c} = ${p(v)}`); break;
      case 'neq': out.push(`${c} <> ${p(v)}`); break;
      case 'gt': out.push(`${c} > ${p(v)}`); break;
      case 'gte': out.push(`${c} >= ${p(v)}`); break;
      case 'lt': out.push(`${c} < ${p(v)}`); break;
      case 'lte': out.push(`${c} <= ${p(v)}`); break;
      case 'like': out.push(`${c} like ${p(v.replace(/\*/g, '%'))}`); break;
      case 'ilike': out.push(`${c} ilike ${p(v.replace(/\*/g, '%'))}`); break;
      case 'in': {
        const items = v.replace(/^\(|\)$/g, '').split(',').map((x) => x.trim().replace(/^"|"$/g, '')).filter((x) => x !== '');
        if (!items.length) { out.push('false'); break; }
        out.push(`${c} in (${items.map(p).join(',')})`);
        break;
      }
      case 'is': {
        const t = v.toLowerCase();
        if (t === 'null') out.push(`${c} is null`);
        else if (t === 'not.null') out.push(`${c} is not null`);
        else if (t === 'true' || t === 'false') out.push(`${c} is ${t}`);
        else throw new Error(`Valor inválido para is: ${v}`);
        break;
      }
      default:
        throw new Error(`Operador não suportado: ${f.op}`);
    }
  }
  return out;
}

// ---------- cache ----------
type Entry = { at: number; ttl: number; rows?: Row[]; p?: Promise<Row[]> };
const g = globalThis as unknown as { __qcache?: Map<string, Entry> };
const cache = (g.__qcache ??= new Map());
const MAX_ENTRIES = 600;

async function cached(key: string, ttl: number, fresh: boolean, run: () => Promise<Row[]>): Promise<Row[]> {
  const now = Date.now();
  const e = cache.get(key);
  if (e) {
    const age = (now - e.at) / 1000;
    if (e.p) return e.p; // já rodando: espera a mesma consulta
    if (e.rows && age < e.ttl && !(fresh && age > 20)) {
      cache.delete(key);
      cache.set(key, e); // LRU
      return e.rows;
    }
  }
  const entry: Entry = { at: now, ttl };
  entry.p = run()
    .then((rows) => {
      entry.rows = rows;
      entry.at = Date.now();
      return rows;
    })
    .catch((err) => {
      cache.delete(key);
      throw err;
    })
    .finally(() => {
      delete entry.p;
    });
  cache.set(key, entry);
  while (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
  return entry.p;
}

const todayBRT = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

/** Dados do dia corrente mudam a cada carga (de hora em hora): cache curto. Passado: 1 hora. */
const ttlFor = (fim?: string) => (!fim || fim.slice(0, 10) > addDays(todayBRT(), -2) ? 180 : 3600);

// ---------- ordenação e reagregação ----------
function sortRows(rows: Row[], order: string | undefined, sel: Sel[]) {
  if (!order) return rows;
  const keys = order.split(',').map((o) => {
    const [k0, dir = 'asc'] = o.trim().split('.');
    const k = sel.find((s) => s.key === k0 || s.col === k0)?.key || k0;
    return { k, desc: dir === 'desc' };
  });
  return rows.sort((a, b) => {
    for (const { k, desc } of keys) {
      const x = a[k], y = b[k];
      if (x === y) continue;
      // PostgREST: asc deixa nulos no fim; desc, no começo.
      if (x == null) return desc ? -1 : 1;
      if (y == null) return desc ? 1 : -1;
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
      if (c) return desc ? -c : c;
    }
    return 0;
  });
}

function reaggregate(rows: Row[], sel: Sel[]): Row[] {
  const dims = sel.filter((s) => !s.fn);
  const aggs = sel.filter((s) => s.fn);
  const G = new Map<string, Row>();
  for (const r of rows) {
    const k = JSON.stringify(dims.map((d) => r[d.key]));
    const o = G.get(k);
    if (!o) {
      const n: Row = {};
      for (const s of sel) n[s.key] = r[s.key];
      G.set(k, n);
      continue;
    }
    for (const a of aggs) {
      const x = o[a.key], y = r[a.key];
      if (y == null) continue;
      if (x == null) { o[a.key] = y; continue; }
      const lt = typeof x === 'number' && typeof y === 'number' ? y < x : String(y) < String(x);
      if (a.fn === 'sum' || a.fn === 'count') o[a.key] = Number(x) + Number(y);
      else if (a.fn === 'min') o[a.key] = lt ? y : x;
      else if (a.fn === 'max') o[a.key] = !lt && y !== x ? y : x;
    }
  }
  return [...G.values()];
}

// ---------- SQL ----------
function buildSql(args: QueryArgs, sel: Sel[], filters: Filter[], win: { ini?: string; fim?: string }, bucket: 'hora' | 'dia' | null) {
  const ds = DATASETS[args.dataset];
  const cols = new Set<string>([...sel.map((s) => s.col), ...filters.map((f) => f.column)].map((c) => c.toLowerCase()));
  const params: unknown[] = [];
  const conds = where(filters, params);
  if (win.ini) { params.push(win.ini.replace('T', ' ')); conds.push(`${q(TIME_COL)} >= $${params.length}`); }
  if (win.fim) { params.push(win.fim.replace('T', ' ')); conds.push(`${q(TIME_COL)} < $${params.length}`); }
  const hasAgg = sel.some((s) => s.fn);
  const parts = sel.map((s) => {
    if (!s.fn) return `${q(s.col)} as ${q(s.key)}`;
    const inner = s.fn === 'count' ? `count(${q(s.col)})` : `${s.fn}(${q(s.col)})`;
    return `${inner} as ${q(s.key)}`;
  });
  const dims = sel.filter((s) => !s.fn).map((s) => q(s.col));
  if (bucket) {
    const expr = `to_char(${q(TIME_COL)}, '${bucket === 'hora' ? 'YYYY-MM-DD"T"HH24' : 'YYYY-MM-DD'}')`;
    parts.push(`${expr} as "__h"`);
    if (hasAgg) dims.push(expr);
  }
  let sql = `select ${parts.join(', ')} from ${ds.from(cols)} t`;
  if (conds.length) sql += ` where ${conds.join(' and ')}`;
  if (hasAgg && dims.length) sql += ` group by ${dims.join(', ')}`;
  sql += ' limit 300001';
  return { sql, params };
}

async function etlStatus(fresh: boolean): Promise<Row[]> {
  // A API tinha um log de cargas (vw_etl_load_status). No Redshift, "até quando a base tem pedidos"
  // sai do horário do pedido mais recente de cada tabela.
  const sql = `
    select 'ev_fact_order_item' as dest_table, max(created_at_datetime) as window_end, max(etl_load_date) as finished_at
      from ${S}.ev_fact_order_item where created_at_datetime >= dateadd(day, -3, getdate())
    union all
    select 'gc_fact_order_item', max(created_at_datetime), max(etl_load_date)
      from ${S}.gc_fact_order_item where created_at_datetime >= dateadd(day, -3, getdate())`;
  const rows = await cached('etl', 60, fresh, () => query(sql));
  return rows.map((r) => ({ ...r, window_end: r.window_end ? String(r.window_end) + '-03:00' : null }));
}

const fmt = (total: number, rows: Row[], aviso = '') => `${total} grupo(s)${aviso}\n${JSON.stringify(rows)}`;

/** Executa uma chamada `query_dataset` e devolve o texto no formato da API. */
export async function queryDataset(args: QueryArgs, fresh = false): Promise<string> {
  const limit = Math.min(Math.max(1, Number(args.limit) || 100), 1000);
  const offset = Math.max(0, Number(args.offset) || 0);
  if (args.dataset === 'vw_etl_load_status') {
    const rows = sortRows(await etlStatus(fresh), 'window_end.desc', []);
    return fmt(rows.length, rows.slice(offset, offset + limit));
  }
  const ds = DATASETS[args.dataset];
  if (!ds) throw new Error(`View não mapeada no Redshift: ${args.dataset}`);
  const sel = parseSelect(args.select);
  const filters = (args.filters || []).map((f) => ({ column: String(f.column), op: String(f.op), value: String(f.value) }));
  const win = ds.time ? timeWindow(filters) : {};
  if (ds.time && (!win.ini || !win.fim)) throw new Error('Período obrigatório em created_at_datetime');

  const span = win.ini && win.fim ? Date.parse(win.fim + 'Z') - Date.parse(win.ini + 'Z') : Infinity;
  const noAvg = !sel.some((s) => s.fn === 'avg');
  const wholeDay = span === 864e5 && win.ini!.endsWith('T00:00:00');
  // Fatias pequenas e repetidas (uma chamada por hora ou por dia) viram uma consulta maior, fatiada aqui:
  //  - menos de 24 h (hora a hora): o dia inteiro, por hora;
  //  - um dia inteiro que já passou (dia a dia do mês, ano anterior): o mês inteiro, por dia.
  let bucket: 'hora' | 'dia' | null = null;
  if (ds.time && noAvg && span < 864e5) bucket = 'hora';
  else if (ds.time && noAvg && wholeDay && win.ini!.slice(0, 10) < todayBRT()) bucket = 'dia';
  let rows: Row[];
  let aviso = '';
  if (bucket) {
    let bwin: { ini: string; fim: string };
    if (bucket === 'hora') {
      const d = win.ini!.slice(0, 10);
      bwin = { ini: d + 'T00:00:00', fim: addDays(d, 1) + 'T00:00:00' };
    } else {
      const m0 = win.ini!.slice(0, 7) + '-01';
      const m1 = new Date(Date.UTC(+m0.slice(0, 4), +m0.slice(5, 7), 1)).toISOString().slice(0, 10);
      bwin = { ini: m0 + 'T00:00:00', fim: m1 + 'T00:00:00' };
    }
    const { sql, params } = buildSql(args, sel, filters, bwin, bucket);
    const all = await cached(JSON.stringify([sql, params]), ttlFor(bwin.fim.slice(0, 10)), fresh, () => query(sql, params));
    if (all.length > 300000) aviso = ' TRUNCADO';
    const a = win.ini!, b = win.fim!;
    const slice = all.filter((r) => {
      const h = String(r.__h);
      const start = h.length === 10 ? h + 'T00:00:00' : h + ':00:00';
      return start >= a && start < b;
    });
    rows = sel.some((s) => s.fn) ? reaggregate(slice, sel) : slice.map(({ __h, ...r }) => r);
  } else {
    const { sql, params } = buildSql(args, sel, filters, win, null);
    rows = await cached(JSON.stringify([sql, params]), ds.ttl ?? ttlFor(win.fim), fresh, () => query(sql, params));
    if (rows.length > 300000) aviso = ' TRUNCADO';
    rows = rows.slice();
  }
  const dims = sel.filter((s) => !s.fn).map((s) => `${s.key}.asc`).join(',');
  sortRows(rows, args.order || dims || undefined, sel);
  return fmt(rows.length, rows.slice(offset, offset + limit), aviso);
}
