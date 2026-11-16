/* Código original do painel (Super One Page). */
(function () {
/* Loaders e cálculos do Super One Page. const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; }; é trocado pelos auxiliares de leitura no build. */

/* ---------- e-commerce Evino: em Hoje, boleto condition ---------- */
['ev_kpi', 'ev_tv'].forEach((id) => dash.loader(id, {
  description: 'Linhas agregadas por meio de pagamento (todas as páginas), com as datas do período. Em Hoje (is_paid 0 ou 1): valores e quantidades de boleto não pago × 0,65 e de PIX não pago × 0,75; nos demais períodos, só pedidos pagos, sem fator.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const BC = (args.filters || []).some((f) => f.column === 'is_paid' && String(f.value) === '(0,1)'); const FT = (pm, paid) => (!BC || +paid === 1 ? 1 : /boleto/i.test(pm || '') ? 0.65 : /pix/i.test(pm || '') ? 0.75 : 1);
    const p = await PAGES(R(answer), args);
    const ini = DT(args, ['gte']) || null, fim = DT(args, ['lte']) || null;
    const M = ['rec', 'frete', 'cm2', 'cogs', 'qtd', 'desc', 'bruto'];
    const cols = ['ini', 'fim', 'fator'].concat((args.select || []).map((s) => s.split(':')[0].split('.')[0]));
    return { columns: cols, cut: p.cut, rows: p.rows.map((r) => { const f = FT(r.payment_method, r.is_paid); const o = Object.assign({ ini, fim, fator: f }, r); M.forEach((k) => { if (k in o) o[k] = N(o[k]) * f; }); return o; }) };
  },
}));

/* ---------- vendas agregadas: linhas como vieram, com o período ---------- */
['ev_yoy', 'ev_tv_yoy', 'itev_kpi', 'itev_yoy', 'gc_kpi', 'gc_yoy'].forEach((id) => dash.loader(id, {
  description: 'Linhas agregadas do query_dataset (todas as páginas), cada uma com as datas do período.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const p = await PAGES(R(answer), args);
    const ini = DT(args, ['gte']) || null, fim = DT(args, ['lte', 'lt']) || null;
    const cols = ['ini', 'fim'].concat((args.select || []).map((s) => s.split(':')[0].split('.')[0]));
    return { columns: cols, rows: p.rows.map((r) => Object.assign({ ini, fim }, r)), cut: p.cut };
  },
}));

/* ---------- pedidos Evino: pedidos distintos no Magento ---------- */
dash.loader('ev_ped', {
  description: 'Pedidos distintos: uma contagem por dia (o query_dataset agrupa por pedido e informa quantos grupos existem), menos os pedidos com cupom de televendas (TV…). Em Hoje, lê os pedidos com meio de pagamento e status e pesa boleto não pago × 0,65 e PIX não pago × 0,75. Acima de 62 dias a contagem passa do limite da base e fica vazia (sem dado); se a contagem falhar, o período continua e só os pedidos ficam sem dado.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const BC = (args.filters || []).some((f) => f.column === 'is_paid' && String(f.value) === '(0,1)');
    const ini = DT(args, ['gte']), fim = DT(args, ['lte']);
    const span = Math.round((new Date(fim) - new Date(ini)) / 864e5) + 1;
    const out = (n) => ({ columns: ['ini', 'fim', 'pedidos'], rows: [{ ini, fim, pedidos: n }] });
    if (span > 62) return out(null);
    try {
    const withF = (fs, d) => args.filters.map((f) => f.op === 'gte' && f.value === ini ? Object.assign({}, f, { value: d }) : f.op === 'lte' && f.value === fim ? Object.assign({}, f, { value: d }) : f).concat(fs);
    const cnt = (a) => { const t = T(a); if (/TRUNCADO|INCOMPLETO/.test(t)) return null; const m = /([\d.]+)\s*grupo\(s\)/.exec(t); if (m) return +m[1].replace(/\./g, ''); return R(a).length ? null : 0; };
    const tv = [{ column: 'voucher_code', op: 'ilike', value: 'TV*' }];
    if (BC) {
      const base = { dataset: args.dataset, select: ['order_increment_id', 'payment_method', 'is_paid', 'n:sku.count()'], order: 'order_increment_id.asc', limit: 1000 };
      const W = (rows) => { const seen = new Map(); rows.forEach((r) => { const f = +r.is_paid === 1 ? 1 : /boleto/i.test(r.payment_method || '') ? 0.65 : /pix/i.test(r.payment_method || '') ? 0.75 : 1; seen.set(r.order_increment_id, Math.max(seen.get(r.order_increment_id) || 0, f)); }); return [...seen.values()].reduce((x, y) => x + y, 0); };
      const all = await PAGES(R(await call('query_dataset', Object.assign({}, base, { filters: withF([], ini) }))), Object.assign({}, base, { filters: withF([], ini) }), 20000);
      const tvr = await PAGES(R(await call('query_dataset', Object.assign({}, base, { filters: withF(tv, ini) }))), Object.assign({}, base, { filters: withF(tv, ini) }), 5000);
      return out(all.cut ? null : W(all.rows) - W(tvr.rows));
    }
    const days = []; for (let d = new Date(ini + 'T00:00:00Z'); d <= new Date(fim + 'T00:00:00Z'); d = new Date(d.getTime() + 864e5)) days.push(d.toISOString().slice(0, 10));
    const res = await POOL(days.map((d) => async () => { const [a, b] = await Promise.all([call('query_dataset', Object.assign({}, args, { filters: withF([], d) })), call('query_dataset', Object.assign({}, args, { filters: withF(tv, d) }))]); const x = cnt(a), y = cnt(b); return x == null || y == null ? null : x - y; }), 6);
    return out(res.some((x) => x == null) ? null : res.reduce((x, y) => x + y, 0));
    } catch (e) { return out(null); }
  },
});

/* ---------- pedidos Grand Cru: pedidos distintos, mês a mês em janelas longas ---------- */
['cl_ped', 'itev_ped'].forEach((id) => dash.loader(id, {
  description: 'Pedidos distintos: o query_dataset agrupa por pedido e informa quantos grupos existem; em janela de mais de 31 dias conta mês a mês. Se a contagem for interrompida, o valor fica vazio (sem dado).',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const ini = DT(args, ['gte']), fim = DT(args, ['lte']);
    const cnt = (a) => { const t = T(a); if (/TRUNCADO|INCOMPLETO/.test(t)) return null; const m = /([\d.]+)\s*grupo\(s\)/.exec(t); if (m) return +m[1].replace(/\./g, ''); return R(a).length ? null : 0; };
    let n;
    const d0 = new Date(ini + 'T00:00:00Z'), d1 = new Date(fim + 'T00:00:00Z');
    if ((d1 - d0) / 864e5 <= 31) n = cnt(answer);
    else {
      const parts = []; let c = new Date(d0);
      while (c <= d1) { const e = new Date(Date.UTC(c.getUTCFullYear(), c.getUTCMonth() + 1, 0)); const a = c.toISOString().slice(0, 10), b = (e < d1 ? e : d1).toISOString().slice(0, 10); parts.push([a, b]); c = new Date(Date.UTC(c.getUTCFullYear(), c.getUTCMonth() + 1, 1)); }
      const res = await POOL(parts.map(([a, b]) => () => call('query_dataset', Object.assign({}, args, { filters: args.filters.map((f) => f.op === 'gte' && f.value === ini ? Object.assign({}, f, { value: a }) : f.op === 'lte' && f.value === fim ? Object.assign({}, f, { value: b }) : f) })).then(cnt)), 4);
      n = res.some((x) => x == null) ? null : res.reduce((s, x) => s + x, 0);
    }
    return { columns: ['ini', 'fim', 'pedidos'], rows: [{ ini, fim, pedidos: n }] };
  },
}));

/* ---------- receita no tempo: hora a hora (um dia), dia a dia (até 62 dias) ou mês a mês ---------- */
['ev_serie', 'gc_serie', 'cl_serie', 'cf_serie'].forEach((id) => dash.loader(id, {
  description: 'Um dia: uma chamada por hora já passada; até 62 dias: uma chamada por dia, e o mês inteiro do ano anterior dia a dia (mesma data, um ano antes); mais que isso: a soma por mês (partition_field) que a própria consulta devolve. Receita = price_to_pay + frete; em Hoje no e-commerce Evino, boleto não pago × 0,65 e PIX não pago × 0,75.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const ini = DT(args, ['gte']), fim = DT(args, ['lte']);
    const base = args.filters.filter((f) => !(f.column === 'created_at_datetime'));
    const BC = (args.filters || []).some((f) => f.column === 'is_paid' && String(f.value) === '(0,1)'); const FT = (pm, paid) => (!BC || +paid === 1 ? 1 : /boleto/i.test(pm || '') ? 0.65 : /pix/i.test(pm || '') ? 0.75 : 1);
    const sel = (BC ? ['payment_method', 'is_paid'] : []).concat(args.select.filter((s) => s !== 'partition_field'));
    const one = (fs) => call('query_dataset', Object.assign({}, args, { filters: base.concat(fs), select: sel, limit: 100 })).then((a) => R(a).reduce((o, r) => { const f = FT(r.payment_method, r.is_paid); o.rec += N(r.rec) * f; o.frete += N(r.frete) * f; return o; }, { rec: 0, frete: 0 }));
    const p2 = (x) => String(x).padStart(2, '0');
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const hourNow = +new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false }).format(new Date()) % 24;
    const days = Math.round((new Date(fim) - new Date(ini)) / 864e5) + 1;
    if (ini === fim) {
      const last = ini === today ? hourNow : 23;
      const hs = Array.from({ length: last + 1 }, (_, h) => h);
      const res = await POOL(hs.map((h) => () => one([{ column: 'created_at_datetime', op: 'gte', value: ini + 'T' + p2(h) + ':00:00' }, h < 23 ? { column: 'created_at_datetime', op: 'lt', value: ini + 'T' + p2(h + 1) + ':00:00' } : { column: 'created_at_datetime', op: 'lte', value: ini + 'T23:59:59' }])), 6);
      return { columns: ['gran', 't', 'rec'], rows: res.map((r, i) => ({ gran: 'hora', t: ini + 'T' + p2(i), rec: N(r.rec) + N(r.frete) })) };
    }
    if (days <= 62) {
      const ds = []; for (let d = new Date(ini + 'T00:00:00Z'); d <= new Date(fim + 'T00:00:00Z'); d = new Date(d.getTime() + 864e5)) ds.push(d.toISOString().slice(0, 10));
      const full = ds.slice(); if (ini.slice(8) === '01') { const e = new Date(Date.UTC(+fim.slice(0, 4), +fim.slice(5, 7), 0)); for (let d = new Date(new Date(fim + 'T00:00:00Z').getTime() + 864e5); d <= e; d = new Date(d.getTime() + 864e5)) full.push(d.toISOString().slice(0, 10)); }
      const ly = (d) => { const r = (+d.slice(0, 4) - 1) + d.slice(4); return r.endsWith('02-29') ? r.slice(0, 8) + '28' : r; };
      const day = (d) => [{ column: 'created_at_datetime', op: 'gte', value: d }, { column: 'created_at_datetime', op: 'lte', value: d }];
      const [res, resLy] = await Promise.all([POOL(ds.map((d) => () => one(day(d))), 6), POOL(full.map((d) => () => one(day(ly(d)))), 6)]);
      return { columns: ['gran', 't', 'rec', 'rec_ly'], rows: full.map((d, i) => ({ gran: 'dia', t: d, rec: i < ds.length ? N(res[i].rec) + N(res[i].frete) : null, rec_ly: N(resLy[i].rec) + N(resLy[i].frete) })) };
    }
    const rows = R(answer).map((r) => ({ gran: 'mes', t: String(r.partition_field).slice(0, 4) + '-' + String(r.partition_field).slice(4, 6), rec: N(r.rec) + N(r.frete) }));
    return { columns: ['gran', 't', 'rec'], rows: rows.sort((a, b) => a.t.localeCompare(b.t)) };
  },
}));

/* ---------- curva por hora: mesmo dia da semana nas 6 semanas anteriores ---------- */
['ev_curva', 'gc_curva'].forEach((id) => dash.loader(id, {
  description: 'Só em Hoje e Ontem, e só no e-commerce Evino e no e-commerce Grand Cru: para cada um dos 6 mesmos dias da semana anteriores, os pedidos do dia (uma consulta por dia, todas as páginas, um grupo por pedido com a hora do pedido) somados por hora; participação de cada hora = receita da hora (price_to_pay + frete) ÷ receita do dia; a curva é a média dessas participações. Um dia que não responder fica de fora da média. Calculada uma vez por dia de referência: o botão Atualizar não a refaz.',
  fn: async ({ args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const ini = DT(args, ['gte']), fim = DT(args, ['lte']);
    if (ini !== fim) return { columns: ['h', 'share', 'dias'], rows: [] };
    const base = args.filters.filter((f) => f.column !== 'created_at_datetime');
    const days = [1, 2, 3, 4, 5, 6].map((k) => new Date(Date.parse(fim + 'T00:00:00Z') - k * 7 * 864e5).toISOString().slice(0, 10));
    const one = async (d) => { const a = Object.assign({}, args, { select: ['order_increment_id', 'ts:created_at_datetime.min()', 'rec:price_to_pay.sum()', 'frete:item_shipping_amount.sum()'], order: 'order_increment_id.asc', limit: 1000, filters: base.concat([{ column: 'created_at_datetime', op: 'gte', value: d }, { column: 'created_at_datetime', op: 'lte', value: d }]) }); const p = await PAGES(R(await call('query_dataset', a)), a, 20000); if (p.cut) return null; const v = Array(24).fill(0); p.rows.forEach((r) => { const h = +String(r.ts || '').slice(11, 13); if (h >= 0 && h < 24) v[h] += N(r.rec) + N(r.frete); }); return v; };
    const res = await POOL(days.map((d) => () => one(d).catch(() => null)), 3);
    const sh = Array.from({ length: 24 }, () => []); let n = 0;
    res.forEach((v) => { if (!v) return; const t = v.reduce((a, x) => a + x, 0); if (!t) return; n++; v.forEach((x, h) => sh[h].push(x / t)); });
    return { columns: ['h', 'share', 'dias'], rows: sh.map((a, h) => ({ h, share: a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0, dias: n })) };
  },
}));


/* ---------- Itaú Shop Evino no tempo: receita, CM2 e itens ---------- */
dash.loader('itev_serie', {
  description: 'Um dia: uma chamada por hora já passada; até 62 dias: uma chamada por dia, mais os dias que faltam no mês (vazios, para a meta), e o mês inteiro do ano anterior dia a dia (mesma data, um ano antes); mais que isso: a soma por mês (partition_field). Receita = price_to_pay + frete; CM2 % = Σ CM2 ÷ receita; CM2 pós-comissão = CM2 − 10 p.p.; PMV = receita ÷ itens.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const ini = DT(args, ['gte']), fim = DT(args, ['lte']);
    const base = args.filters.filter((f) => f.column !== 'created_at_datetime');
    const sel = args.select.filter((s) => s !== 'partition_field');
    const one = (fs) => call('query_dataset', Object.assign({}, args, { filters: base.concat(fs), select: sel, limit: 10 })).then((a) => R(a).reduce((o, r) => { o.rec += N(r.rec) + N(r.frete); o.cm2 += N(r.cm2); o.qtd += N(r.qtd); return o; }, { rec: 0, cm2: 0, qtd: 0 }));
    const mk = (gran, t, o) => ({ gran, t, rec: o ? o.rec : null, cm2_pct: o && o.rec ? o.cm2 / o.rec : null, cm2pos_pct: o && o.rec ? o.cm2 / o.rec - 0.10 : null, pmv: o && o.qtd ? o.rec / o.qtd : null, qtd: o ? o.qtd : null });
    const cols = ['gran', 't', 'rec', 'cm2_pct', 'cm2pos_pct', 'pmv', 'qtd'];
    const p2 = (x) => String(x).padStart(2, '0');
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const hourNow = +new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false }).format(new Date()) % 24;
    const days = Math.round((new Date(fim) - new Date(ini)) / 864e5) + 1;
    if (ini === fim) {
      const last = ini === today ? hourNow : 23;
      const hs = Array.from({ length: last + 1 }, (_, h) => h);
      const res = await POOL(hs.map((h) => () => one([{ column: 'created_at_datetime', op: 'gte', value: ini + 'T' + p2(h) + ':00:00' }, h < 23 ? { column: 'created_at_datetime', op: 'lt', value: ini + 'T' + p2(h + 1) + ':00:00' } : { column: 'created_at_datetime', op: 'lte', value: ini + 'T23:59:59' }])), 6);
      return { columns: cols, rows: res.map((o, i) => mk('hora', ini + 'T' + p2(i), o)) };
    }
    if (days <= 62) {
      const ds = []; for (let d = new Date(ini + 'T00:00:00Z'); d <= new Date(fim + 'T00:00:00Z'); d = new Date(d.getTime() + 864e5)) ds.push(d.toISOString().slice(0, 10));
      const full = ds.slice(); if (ini.slice(8) === '01') { const e = new Date(Date.UTC(+fim.slice(0, 4), +fim.slice(5, 7), 0)); for (let d = new Date(new Date(fim + 'T00:00:00Z').getTime() + 864e5); d <= e; d = new Date(d.getTime() + 864e5)) full.push(d.toISOString().slice(0, 10)); }
      const ly = (d) => { const r = (+d.slice(0, 4) - 1) + d.slice(4); return r.endsWith('02-29') ? r.slice(0, 8) + '28' : r; };
      const day = (d) => [{ column: 'created_at_datetime', op: 'gte', value: d }, { column: 'created_at_datetime', op: 'lte', value: d }];
      const [res, resLy] = await Promise.all([POOL(ds.map((d) => () => one(day(d))), 6), POOL(full.map((d) => () => one(day(ly(d)))), 6)]);
      return { columns: cols.concat(['rec_ly']), rows: full.map((d, i) => Object.assign(mk('dia', d, i < ds.length ? res[i] : null), { rec_ly: resLy[i].rec })) };
    }
    const M = new Map(); R(answer).forEach((r) => { const t = String(r.partition_field).slice(0, 4) + '-' + String(r.partition_field).slice(4, 6); const o = M.get(t) || { rec: 0, cm2: 0, qtd: 0 }; o.rec += N(r.rec) + N(r.frete); o.cm2 += N(r.cm2); o.qtd += N(r.qtd); M.set(t, o); });
    return { columns: cols, rows: [...M.keys()].sort().map((t) => mk('mes', t, M.get(t))) };
  },
});

/* ---------- E-commerce Grand Cru: Ecomm GC + Concierge, com o cupom Itaú ---------- */
dash.loader('gce', {
  description: 'Duas pernas, dia a dia, todas as páginas: Ecomm GC (business_sales_channel = Ecomm GC) e Concierge (Shipping from CD com seller_code 9980081926 ou 9980089565), pedidos pagos. Por pedido: receita Magento = Σ (price_to_pay + frete); pedido Itaú = qualquer regra de cupom com "Itaú"/"Itau". Receita faturada = Σ receita Magento; parte do Itaú = R$ 200 × pedidos Itaú; receita total = faturada + parte do Itaú; com cupom Itaú = receita Magento dos pedidos Itaú + parte do Itaú; sem cupom Itaú = receita Magento dos demais; peso = com cupom ÷ total. Clientes = fk_customer distintos (sem cliente, o pedido conta como um). Uma linha por dia (por hora em Hoje e Ontem), os dias que faltam no mês (vazios, para a meta), a receita total do mesmo dia do ano anterior e uma linha de total do período.',
  fn: async ({ args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const ini = DT(args, ['gte']), fim = DT(args, ['lte']);
    const A = args.filters.filter((f) => f.column !== 'created_at_datetime');
    const B = A.filter((f) => f.column !== 'business_sales_channel').concat([{ column: 'business_sales_channel', op: 'eq', value: 'Shipping from CD' }, { column: 'seller_code', op: 'in', value: '(9980081926,9980089565)' }]);
    const VAL = 200;
    const day = (d) => [{ column: 'created_at_datetime', op: 'gte', value: d }, { column: 'created_at_datetime', op: 'lte', value: d }];
    const get = async (d) => { const out = []; for (const F of [A, B]) { const a = Object.assign({}, args, { filters: F.concat(day(d)) }); const p = await PAGES(R(await call('query_dataset', a)), a, 20000); if (p.cut) throw new Error('Pedidos do dia ' + d + ' passaram do limite de páginas.'); p.rows.forEach((r) => out.push(Object.assign({ leg: F === B ? 'conc' : 'ecomm' }, r))); } return out; };
    const orders = (rows) => { const O = new Map(); rows.forEach((r) => { const k = String(r.order_increment_id); const o = O.get(k) || { k, cli: r.fk_customer == null ? 'p' + k : String(r.fk_customer), ts: String(r.ts || ''), itau: false, conc: r.leg === 'conc', rec: 0, vol: 0, desc: 0, bruto: 0 }; if (/ita[uú]/i.test(String(r.coupon_rule_name || '').trim())) o.itau = true; o.rec += N(r.rec) + N(r.frete); if (+r.is_bottle === 1) o.vol += N(r.qtd); o.desc += N(r.desc); o.bruto += N(r.bruto); if (r.ts && String(r.ts) < o.ts) o.ts = String(r.ts); O.set(k, o); }); return [...O.values()]; };
    const agg = (os) => { const it = os.filter((o) => o.itau), no = os.filter((o) => !o.itau); const S = (a, f) => a.reduce((x, o) => x + o[f], 0); const fat = S(os, 'rec'), parte = VAL * it.length, tot = fat + parte, com = S(it, 'rec') + parte; return { rec: tot, rec_fat: fat, itau_parte: parte, itau_cli: S(it, 'rec'), com, sem: S(no, 'rec'), peso: tot ? com / tot : null, conc: S(os.filter((o) => o.conc), 'rec'), pedidos: os.length, ped_itau: it.length, ped_sem: no.length, clientes: new Set(os.map((o) => o.cli)).size, vol: S(os, 'vol'), desc: S(os, 'desc'), bruto: S(os, 'bruto') }; };
    const ds = []; for (let d = new Date(ini + 'T00:00:00Z'); d <= new Date(fim + 'T00:00:00Z'); d = new Date(d.getTime() + 864e5)) ds.push(d.toISOString().slice(0, 10));
    if (ds.length > 62) return { columns: ['gran', 't', 'rec'], rows: [] };
    const full = ds.slice(); if (ds.length > 1 && ini.slice(8) === '01') { const e = new Date(Date.UTC(+fim.slice(0, 4), +fim.slice(5, 7), 0)); for (let d = new Date(new Date(fim + 'T00:00:00Z').getTime() + 864e5); d <= e; d = new Date(d.getTime() + 864e5)) full.push(d.toISOString().slice(0, 10)); }
    const ly = (d) => { const r = (+d.slice(0, 4) - 1) + d.slice(4); return r.endsWith('02-29') ? r.slice(0, 8) + '28' : r; };
    const [cur, prev] = await Promise.all([POOL(ds.map((d) => () => get(d).then(orders)), 4), POOL(full.map((d) => () => get(ly(d)).then(orders)), 4)]);
    const all = cur.flat();
    const rows = [];
    if (ds.length === 1) {
      const p2 = (x) => String(x).padStart(2, '0');
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      const last = ini === today ? +new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false }).format(new Date()) % 24 : 23;
      for (let h = 0; h <= last; h++) { const t = ini + 'T' + p2(h); rows.push(Object.assign({ gran: 'hora', t }, agg(all.filter((o) => o.ts.slice(0, 13) === t)), { rec_ly: null })); }
    } else full.forEach((d, i) => rows.push(i < ds.length ? Object.assign({ gran: 'dia', t: d }, agg(cur[i]), { rec_ly: agg(prev[i]).rec }) : { gran: 'dia', t: d, rec: null, rec_ly: agg(prev[i]).rec }));
    const lyp = prev.slice(0, ds.length).reduce((x, os) => x + agg(os).rec, 0);
    rows.push(Object.assign({ gran: 'total', t: ini + '/' + fim, ini, fim }, agg(all), { rec_ly: lyp }));
    return { columns: Object.keys(rows[rows.length - 1]), rows };
  },
});

dash.loader('itgc', {
  description: 'Dia a dia, todas as páginas: pedidos pagos da loja GrandCru com itau_payment. Por pedido: desconto, garrafas, produtos (price_to_pay) e frete somados por SKU, crédito de loja = máximo do pedido. Cupom pelo desconto do pedido: R$ 70 (±0,50) reembolso Itaú R$ 38,50; R$ 45 (±0,50) reembolso R$ 13,50; outro valor = sem cupom. Receita faturada = produtos + frete + crédito; receita total = faturada + reembolso. Uma linha por dia (por hora em Hoje e Ontem), os dias que faltam no mês (vazios, para a meta), a receita total do mesmo dia do ano anterior, uma linha de total e uma linha por grupo de cupom.',
  fn: async ({ args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const ini = DT(args, ['gte']), fim = DT(args, ['lte']);
    const A = args.filters.filter((f) => f.column !== 'created_at_datetime');
    const day = (d) => [{ column: 'created_at_datetime', op: 'gte', value: d }, { column: 'created_at_datetime', op: 'lte', value: d }];
    const get = async (d) => { const a = Object.assign({}, args, { filters: A.concat(day(d)) }); const p = await PAGES(R(await call('query_dataset', a)), a, 30000); if (p.cut) throw new Error('Pedidos do dia ' + d + ' passaram do limite de páginas.'); return p.rows; };
    const orders = (rows) => { const O = new Map(); rows.forEach((r) => { const k = String(r.order_increment_id); const o = O.get(k) || { k, cli: r.fk_customer == null ? 'p' + k : String(r.fk_customer), ts: String(r.ts || ''), d: 0, q: 0, p: 0, f: 0, sc: 0 }; o.d += N(r.d); o.q += N(r.q); o.p += N(r.p); o.f += N(r.f); o.sc = Math.max(o.sc, N(r.sc)); if (r.ts && String(r.ts) < o.ts) o.ts = String(r.ts); O.set(k, o); }); return [...O.values()].map((o) => Object.assign(o, { g: Math.abs(o.d - 70) < 0.5 ? 'c70' : Math.abs(o.d - 45) < 0.5 ? 'c45' : 'sem', fat: o.p + o.f + o.sc })); };
    const RB = { c70: 38.5, c45: 13.5, sem: 0 };
    const agg = (os) => { const S = (a, f) => a.reduce((x, o) => x + o[f], 0); const fat = S(os, 'fat'), reemb = os.reduce((x, o) => x + RB[o.g], 0), q = S(os, 'q'); return { rec: fat + reemb, rec_fat: fat, reemb, pedidos: os.length, vol: q, prod: S(os, 'p') + S(os, 'sc'), frete: S(os, 'f'), ped_c70: os.filter((o) => o.g === 'c70').length, ped_c45: os.filter((o) => o.g === 'c45').length, ped_sem: os.filter((o) => o.g === 'sem').length, ultima: os.reduce((m, o) => (o.ts > m ? o.ts : m), '') || null }; };
    const ds = []; for (let d = new Date(ini + 'T00:00:00Z'); d <= new Date(fim + 'T00:00:00Z'); d = new Date(d.getTime() + 864e5)) ds.push(d.toISOString().slice(0, 10));
    if (ds.length > 62) return { columns: ['gran', 't', 'rec'], rows: [] };
    const full = ds.slice(); if (ds.length > 1 && ini.slice(8) === '01') { const e = new Date(Date.UTC(+fim.slice(0, 4), +fim.slice(5, 7), 0)); for (let d = new Date(new Date(fim + 'T00:00:00Z').getTime() + 864e5); d <= e; d = new Date(d.getTime() + 864e5)) full.push(d.toISOString().slice(0, 10)); }
    const ly = (d) => { const r = (+d.slice(0, 4) - 1) + d.slice(4); return r.endsWith('02-29') ? r.slice(0, 8) + '28' : r; };
    const [cur, prev] = await Promise.all([POOL(ds.map((d) => () => get(d).then(orders)), 4), POOL(full.map((d) => () => get(ly(d)).then(orders)), 4)]);
    const all = cur.flat();
    const rows = [];
    if (ds.length === 1) {
      const p2 = (x) => String(x).padStart(2, '0');
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      const last = ini === today ? +new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false }).format(new Date()) % 24 : 23;
      for (let h = 0; h <= last; h++) { const t = ini + 'T' + p2(h); rows.push(Object.assign({ gran: 'hora', t }, agg(all.filter((o) => o.ts.slice(0, 13) === t)), { rec_ly: null })); }
    } else full.forEach((d, i) => rows.push(i < ds.length ? Object.assign({ gran: 'dia', t: d }, agg(cur[i]), { rec_ly: agg(prev[i]).rec }) : { gran: 'dia', t: d, rec: null, rec_ly: agg(prev[i]).rec }));
    const tot = agg(all);
    const lyp = prev.slice(0, ds.length).reduce((x, os) => x + agg(os).rec, 0);
    rows.push(Object.assign({ gran: 'total', t: ini + '/' + fim, ini, fim }, tot, { rec_ly: lyp, clientes: new Set(all.map((o) => o.cli)).size }));
    [['c70', 'Cupom R$ 70', 'reembolso R$ 38,50 por pedido'], ['c45', 'Cupom R$ 45', 'reembolso R$ 13,50 por pedido'], ['sem', 'Sem cupom', 'pagos com Itaú Shop, sem cupom']].forEach(([g, nome, sub]) => {
      const a = agg(all.filter((o) => o.g === g));
      rows.push({ gran: 'grupo', t: g, grupo: nome, sub, pedidos: a.pedidos, rec_fat: a.rec_fat, reemb: g === 'sem' ? null : a.reemb, rec: a.rec, share: tot.rec ? a.rec / tot.rec : null, ticket: a.pedidos ? a.rec_fat / a.pedidos : null, nivel: null });
    });
    rows.push({ gran: 'grupo', t: 'total', grupo: 'Receita do canal', sub: 'pedidos + reembolso', pedidos: tot.pedidos, rec_fat: tot.rec_fat, reemb: tot.reemb, rec: tot.rec, share: tot.rec ? 1 : null, ticket: tot.pedidos ? tot.rec / tot.pedidos : null, nivel: 'total' });
    return { columns: [...new Set(rows.flatMap((r) => Object.keys(r)))], rows };
  },
});

dash.loader('itgc_sku', {
  description: 'Todas as páginas por SKU; os 12 de maior receita (price_to_pay + frete, sem o reembolso do Itaú, que é do pedido), com o nome de vw_gc_dim_product. Volume = garrafas (item_amount); PMV = receita ÷ garrafas; desconto total = preço de lista (original_price) − valor pago (price_to_pay), e % = desconto ÷ preço de lista.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const p = await PAGES(R(answer), args);
    const S = new Map();
    p.rows.forEach((r) => { if (r.sku == null) return; const k = String(r.sku); const o = S.get(k) || { sku: k, rec: 0, ptp: 0, qtd: 0, lista: 0 }; o.rec += N(r.rec) + N(r.frete); o.ptp += N(r.rec); o.qtd += N(r.qtd); o.lista += N(r.lista); S.set(k, o); });
    const top = [...S.values()].sort((x, y) => y.rec - x.rec).slice(0, 12);
    const d = top.length ? R(await call('query_dataset', { dataset: 'vw_gc_dim_product', select: ['sku', 'product_name'], filters: [{ column: 'sku', op: 'in', value: '(' + top.map((o) => o.sku).join(',') + ')' }], limit: 1000 })) : [];
    const nom = new Map(d.map((x) => [String(x.sku), x.product_name]));
    return { columns: ['sku', 'nome', 'rec', 'qtd', 'pmv', 'desc', 'desc_pct'], cut: p.cut, rows: top.map((o) => ({ sku: o.sku, nome: nom.get(o.sku) || null, rec: o.rec, qtd: o.qtd, pmv: o.qtd ? o.rec / o.qtd : null, desc: o.lista ? o.lista - o.ptp : null, desc_pct: o.lista ? (o.lista - o.ptp) / o.lista : null })) };
  },
});

['gce_sku', 'gce_kit'].forEach((id) => dash.loader(id, {
  description: 'Ecomm GC (a consulta) mais Concierge (Shipping from CD com seller_code 9980081926 ou 9980089565), todas as páginas, somados por SKU (ou kit); os 12 de maior receita (price_to_pay + frete), com o nome de vw_gc_dim_product; nos SKUs, o estoque vendável do e-commerce (sellable_quantity_ecomm) da foto mais recente de vw_gc_dim_stock.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const key = args.select.includes('bundle_sku') ? 'bundle_sku' : 'sku';
    const B = args.filters.filter((f) => f.column !== 'business_sales_channel').concat([{ column: 'business_sales_channel', op: 'eq', value: 'Shipping from CD' }, { column: 'seller_code', op: 'in', value: '(9980081926,9980089565)' }]);
    const b = Object.assign({}, args, { filters: B });
    const [pa, pb] = await Promise.all([PAGES(R(answer), args), call('query_dataset', b).then((x) => PAGES(R(x), b))]);
    const S = new Map();
    pa.rows.concat(pb.rows).forEach((r) => { if (r[key] == null) return; const k = String(r[key]); const o = S.get(k) || { sku: k, rec: 0, qtd: 0 }; o.rec += N(r.rec) + N(r.frete); o.qtd += N(r.qtd); S.set(k, o); });
    const top = [...S.values()].sort((x, y) => y.rec - x.rec).slice(0, 12);
    const d = top.length ? R(await call('query_dataset', { dataset: 'vw_gc_dim_product', select: ['sku', 'product_name'], filters: [{ column: 'sku', op: 'in', value: '(' + top.map((o) => o.sku).join(',') + ')' }], limit: 1000 })) : [];
    const nom = new Map(d.map((x) => [String(x.sku), x.product_name]));
    const est = new Map();
    if (key === 'sku' && top.length) R(await call('query_dataset', { dataset: 'vw_gc_dim_stock', select: ['sku', 'sellable_quantity_ecomm', 'data_carga'], filters: [{ column: 'sku', op: 'in', value: '(' + top.map((o) => o.sku).join(',') + ')' }], limit: 1000 })).forEach((x) => { const k = String(x.sku), o = est.get(k); if (!o || String(x.data_carga) > o.d) est.set(k, { d: String(x.data_carga), q: x.sellable_quantity_ecomm == null ? null : +x.sellable_quantity_ecomm }); });
    return { columns: ['sku', 'nome', 'rec', 'qtd', 'estoque', 'estoque_data'], cut: pa.cut || pb.cut, rows: top.map((o) => Object.assign(o, { nome: nom.get(o.sku) || null, estoque: est.has(o.sku) ? est.get(o.sku).q : null, estoque_data: est.has(o.sku) ? est.get(o.sku).d : null })) };
  },
}));

/* ---------- Clube Evino: pedidos por plano, dia a dia (ou hora a hora) ---------- */
['cl_ord', 'cf_ord'].forEach((id) => dash.loader(id, {
  description: 'Clube Evino ou Confraria. Uma consulta por dia (todas as páginas), por pedido × plano × status × garrafa; soma por dia (ou por hora, quando o período é um dia) × plano × tipo: novo = compra da assinatura (status signature_created), base = os demais. Pedidos = pedidos distintos; garrafas = itens das linhas de garrafa; rec_mes = receita em valor mensal: na compra da assinatura, plano anual ÷ 12 e semestral ÷ 6; as caixas já são mensais e ficam inteiras. Na Confraria, os planos de crédito (Grand 200/250/500) saem, Reserva soma em Reserva + e Experiência + soma em Experiência; pedidos sem plano ficam de fora. Compra da assinatura do dia que ainda não tem plano na base (o plano chega na carga da noite): o plano sai do SKU do kit da assinatura (evino-clube-go-…, con-reserva-mais-…), numa consulta extra só desses pedidos.',
  fn: async ({ args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const ini = DT(args, ['gte']), fim = DT(args, ['lte']);
    const days = []; for (let d = new Date(ini + 'T00:00:00Z'); d <= new Date(fim + 'T00:00:00Z'); d = new Date(d.getTime() + 864e5)) days.push(d.toISOString().slice(0, 10));
    const CF = (args.filters || []).some((f) => f.column === 'consolidated_store' && f.value === 'Confraria');
    const PL = (c) => { c = String(c || '').toLowerCase(); const g = /^con-grand-?(\d+)/.exec(c); return /^evino-clube-go/.test(c) ? 'Evino Clube Go' : /^evino-clube-red/.test(c) ? 'Evino Clube Red' : /^evino-clube-black/.test(c) ? 'Evino Clube Black' : /^evino-clube-fresh/.test(c) ? 'Evino Clube Fresh' : /^con-reserva-?mais/.test(c) ? 'Reserva +' : /^con-reserva-?especial/.test(c) ? 'Reserva Especial' : /^con-grand-?reserva/.test(c) ? 'Grand Reserva' : /^con-grand-?selection/.test(c) ? 'Grand Selection' : g ? 'Grand ' + g[1] : /^con-experiencia-?mais/.test(c) ? 'Experiencia +' : /^con-experiencia/.test(c) ? 'Experiencia' : /^con-reserva/.test(c) ? 'Reserva' : null; };
    const PER = (c) => { c = String(c || '').toLowerCase(); return /anual/.test(c) ? 'ANUAL' : /semestral/.test(c) ? 'SEMESTRAL' : /mensal/.test(c) ? 'MENSAL' : null; };
    const one = async (d) => {
      const fs = args.filters.map((f) => f.op === 'gte' && f.value === ini ? Object.assign({}, f, { value: d }) : f.op === 'lte' && f.value === fim ? Object.assign({}, f, { value: d }) : f);
      const a = Object.assign({}, args, { filters: fs }); const rows = (await PAGES(R(await call('query_dataset', a)), a, 20000)).rows;
      if (rows.some((r) => !r.assinatura_plano && r.status === 'signature_created')) {
        const b = { dataset: args.dataset, filters: fs.concat([{ column: 'status', op: 'eq', value: 'signature_created' }, { column: 'assinatura_plano', op: 'is', value: 'null' }]), select: ['order_increment_id', 'sku', 'bundle_sku', 'n:item_amount.sum()'], order: 'order_increment_id.asc', limit: 1000 };
        const m = new Map(); try { (await PAGES(R(await call('query_dataset', b)), b, 5000)).rows.forEach((x) => { const c = PL(x.sku) ? x.sku : PL(x.bundle_sku) ? x.bundle_sku : null; if (c && !m.has(String(x.order_increment_id))) m.set(String(x.order_increment_id), c); }); } catch (e) { /* sem o plano, fica Sem plano */ }
        rows.forEach((r) => { if (!r.assinatura_plano && r.status === 'signature_created') { const c = m.get(String(r.order_increment_id)); if (c) { r.assinatura_plano = PL(c); r.assinatura_periodicidade = r.assinatura_periodicidade || PER(c); } } });
      }
      return rows;
    };
    const rows = (await POOL(days.map((d) => () => one(d)), 6)).flat();
    const hora = ini === fim;
    const G = new Map();
    rows.forEach((r) => {
      const t = hora ? String(r.ts).slice(0, 13) : String(r.ts).slice(0, 10);
      const tipo = r.status === 'signature_created' ? 'novo' : 'base';
      if (CF && !r.assinatura_plano) return;
      let plano = r.assinatura_plano || 'Sem plano';
      if (/^grand \d+$/i.test(plano)) return;
      if (/^reserva$/i.test(plano)) plano = 'Reserva +'; else if (/^experi/i.test(plano)) plano = 'Experiência';
      const k = t + '|' + plano + '|' + tipo;
      const o = G.get(k) || { gran: hora ? 'hora' : 'dia', t, plano, tipo, rec: 0, rec_mes: 0, garrafas: 0, ids: new Set() };
      const per = String(r.assinatura_periodicidade || '').toUpperCase(); const meses = tipo !== 'novo' ? 1 : per === 'ANUAL' ? 12 : per === 'SEMESTRAL' ? 6 : 1;
      o.rec += N(r.rec) + N(r.frete); o.rec_mes += (N(r.rec) + N(r.frete)) / meses; if (+r.is_bottle === 1) o.garrafas += N(r.qtd); o.ids.add(r.order_increment_id); G.set(k, o);
    });
    return { columns: ['gran', 't', 'plano', 'tipo', 'rec', 'rec_mes', 'pedidos', 'garrafas'], rows: [...G.values()].map((o) => ({ gran: o.gran, t: o.t, plano: o.plano, tipo: o.tipo, rec: o.rec, rec_mes: o.rec_mes, pedidos: o.ids.size, garrafas: o.garrafas })).sort((a, b) => a.t.localeCompare(b.t)) };
  },
}));

/* ---------- SKUs Evino com faixa e nome ---------- */
dash.loader('ev_sku', {
  description: 'Todas as páginas de SKU × garrafa × meio de pagamento, somadas por SKU (em Hoje, boleto não pago × 0,65 e PIX não pago × 0,75); faixa de preço (categoria de vw_ev_grupo_de_produto) e nome (vw_ev_dim_product) em lotes de 200 SKUs. Garrafas = quantidade das linhas de garrafa.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const BC = (args.filters || []).some((f) => f.column === 'is_paid' && String(f.value) === '(0,1)'); const FT = (pm, paid) => (!BC || +paid === 1 ? 1 : /boleto/i.test(pm || '') ? 0.65 : /pix/i.test(pm || '') ? 0.75 : 1);
    const p = await PAGES(R(answer), args);
    const S = new Map();
    p.rows.forEach((r) => { const f = FT(r.payment_method, r.is_paid); const o = S.get(r.sku) || { sku: r.sku, rec: 0, garrafas: 0, ptp: 0, cm2: 0 }; o.rec += (N(r.rec) + N(r.frete)) * f; o.ptp += N(r.rec) * f; o.cm2 += N(r.cm2) * f; if (+r.is_bottle === 1) o.garrafas += N(r.qtd) * f; S.set(r.sku, o); });
    const skus = [...S.keys()].filter(Boolean); const L = []; for (let i = 0; i < skus.length; i += 200) L.push('(' + skus.slice(i, i + 200).join(',') + ')');
    const cat = new Map(), nom = new Map();
    await POOL(L.map((l) => async () => {
      const [g, d] = await Promise.all([call('query_dataset', { dataset: 'vw_ev_grupo_de_produto', select: ['sku', 'categoria'], filters: [{ column: 'sku', op: 'in', value: l }], limit: 1000 }).then(R), call('query_dataset', { dataset: 'vw_ev_dim_product', select: ['sku', 'name'], filters: [{ column: 'sku', op: 'in', value: l }], limit: 1000 }).then(R)]);
      g.forEach((x) => cat.set(String(x.sku), x.categoria)); d.forEach((x) => nom.set(String(x.sku), x.name));
    }), 4);
    const ini = DT(args, ['gte']), fim = DT(args, ['lte']);
    return { columns: ['ini', 'fim', 'sku', 'nome', 'faixa', 'rec', 'garrafas', 'cm2_pct'], cut: p.cut, rows: [...S.values()].map((o) => ({ ini, fim, sku: o.sku, nome: nom.get(String(o.sku)) || null, faixa: cat.get(String(o.sku)) || null, rec: o.rec, garrafas: o.garrafas, cm2_pct: o.ptp ? o.cm2 / o.ptp : null })) };
  },
});

/* ---------- SKUs Itaú Shop Evino ---------- */
dash.loader('itev_sku', {
  description: 'Todas as páginas de SKU × status × avulso/kit, sem os status new, payment_review e canceled, somadas por SKU; os 12 de maior receita (com frete) com o nome de vw_ev_dim_product. CM2 % = Σ CM2 ÷ receita com frete; % avulso = itens vendidos fora de kit ÷ itens.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const p = await PAGES(R(answer), args);
    const S = new Map();
    p.rows.filter((r) => !['new', 'payment_review', 'canceled'].includes(r.state)).forEach((r) => { const o = S.get(r.sku) || { sku: r.sku, rec: 0, frete: 0, qtd: 0, single: 0, cm2: 0 }; o.rec += N(r.rec) + N(r.frete); o.frete += N(r.frete); o.qtd += N(r.qtd); if (+r.is_bundle_product === 0) o.single += N(r.qtd); o.cm2 += N(r.cm2); S.set(r.sku, o); });
    const top = [...S.values()].sort((a, b) => b.rec - a.rec).slice(0, 12);
    const d = top.length ? R(await call('query_dataset', { dataset: 'vw_ev_dim_product', select: ['sku', 'name'], filters: [{ column: 'sku', op: 'in', value: '(' + top.map((o) => o.sku).join(',') + ')' }], limit: 1000 })) : [];
    const nom = new Map(d.map((x) => [String(x.sku), x.name]));
    return { columns: ['sku', 'nome', 'rec', 'frete', 'qtd', 'single_pct', 'cm2_pct', 'cm2pos_pct'], cut: p.cut, rows: top.map((o) => ({ sku: o.sku, nome: nom.get(String(o.sku)) || null, rec: o.rec, frete: o.frete, qtd: o.qtd, single_pct: o.qtd ? o.single / o.qtd : null, cm2_pct: o.rec ? o.cm2 / o.rec : null, cm2pos_pct: o.rec ? o.cm2 / o.rec - 0.10 : null })) };
  },
});

/* ---------- kits Evino (e-commerce e Itaú) ---------- */
['ev_kit', 'itev_kit'].forEach((id) => dash.loader(id, {
  description: 'Os 12 kits de maior receita (com frete; no e-commerce Evino em Hoje, boleto não pago × 0,65 e PIX não pago × 0,75) entre os que a consulta ordenou, sem a linha de itens fora de kit (e, no Itaú Shop, sem os status new, payment_review e canceled), com CM2 % (e-commerce: Σ CM2 ÷ Σ price_to_pay; Itaú Shop: Σ CM2 ÷ receita com frete, e CM2 pós-comissão = CM2 − 10 p.p.), PMV = receita ÷ itens, kits = itens ÷ garrafas por kit, e nome e garrafas por kit de vw_ev_dim_product_bundle.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const BC = (args.filters || []).some((f) => f.column === 'is_paid' && String(f.value) === '(0,1)'); const FT = (pm, paid) => (!BC || +paid === 1 ? 1 : /boleto/i.test(pm || '') ? 0.65 : /pix/i.test(pm || '') ? 0.75 : 1);
    const K = new Map(); R(answer).filter((r) => r.fk_bundle_product != null && r.fk_bundle_product !== '' && !['new', 'payment_review', 'canceled'].includes(r.state)).forEach((r) => { const f = FT(r.payment_method, r.is_paid); const k = String(r.fk_bundle_product); const o = K.get(k) || { kit: k, rec: 0, qtd: 0, ptp: 0, cm2: 0 }; o.rec += (N(r.rec) + N(r.frete)) * f; o.qtd += N(r.qtd) * f; o.ptp += N(r.rec) * f; o.cm2 += N(r.cm2) * f; K.set(k, o); });
    const top = [...K.values()].sort((a, b) => b.rec - a.rec).slice(0, 12);
    const d = top.length ? R(await call('query_dataset', { dataset: 'vw_ev_dim_product_bundle', select: ['sku', 'name', 'number_bottles'], filters: [{ column: 'sku', op: 'in', value: '(' + top.map((o) => o.kit).join(',') + ')' }], limit: 1000 })) : [];
    const nom = new Map(d.map((x) => [String(x.sku), x]));
    const IT = (args.filters || []).some((f) => f.column === 'order_increment_id' && /^BRI/.test(String(f.value)));
    return { columns: ['kit', 'nome', 'rec', 'qtd', 'kits', 'pmv', 'cm2_pct', 'cm2pos_pct'], rows: top.map((o) => { const b = nom.get(o.kit) || {}; const nb = +b.number_bottles || 0; const c = IT ? (o.rec ? o.cm2 / o.rec : null) : (o.ptp ? o.cm2 / o.ptp : null); return { kit: o.kit, nome: b.name || null, rec: o.rec, qtd: o.qtd, kits: nb ? o.qtd / nb : null, pmv: o.qtd ? o.rec / o.qtd : null, cm2_pct: c, cm2pos_pct: c == null ? null : c - 0.10 }; }) };
  },
}));

/* ---------- SKUs e kits Grand Cru (e-commerce e Itaú) ---------- */
['gc_sku', 'gc_kit'].forEach((id) => dash.loader(id, {
  description: 'Todas as páginas por canal × SKU (ou kit), os 12 de maior receita (com frete) de cada canal, com o nome de vw_gc_dim_product.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const p = await PAGES(R(answer), args);
    const key = args.select.includes('bundle_sku') ? 'bundle_sku' : 'sku';
    const S = new Map();
    p.rows.forEach((r) => { if (r[key] == null) return; const k = r.sales_channel + '|' + r[key]; const o = S.get(k) || { canal: r.sales_channel, sku: String(r[key]), rec: 0, qtd: 0 }; o.rec += N(r.rec) + N(r.frete); o.qtd += N(r.qtd); S.set(k, o); });
    const top = []; [...new Set([...S.values()].map((o) => o.canal))].forEach((c) => top.push(...[...S.values()].filter((o) => o.canal === c).sort((a, b) => b.rec - a.rec).slice(0, 12)));
    const skus = [...new Set(top.map((o) => o.sku))];
    const d = skus.length ? R(await call('query_dataset', { dataset: 'vw_gc_dim_product', select: ['sku', 'product_name'], filters: [{ column: 'sku', op: 'in', value: '(' + skus.join(',') + ')' }], limit: 1000 })) : [];
    const nom = new Map(d.map((x) => [String(x.sku), x.product_name]));
    return { columns: ['canal', 'sku', 'nome', 'rec', 'qtd'], cut: p.cut, rows: top.map((o) => Object.assign(o, { nome: nom.get(o.sku) || null })) };
  },
}));

/* ---------- planilhas ---------- */
['m_ev', 'm_cl', 'm_itev', 'm_gc', 'm_cf', 'm_itgc'].forEach((id) => dash.loader(id, {
  description: 'Aba de meta diária em linhas: data (dd/mm/aaaa vira aaaa-mm-dd) e uma coluna por cabeçalho (linha 2, ou linha 1 onde a 2 está vazia); números pt-BR viram números e percentuais viram fração.',
  fn: ({ answer }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    let t = answer; if (typeof t === 'string') t = JSON.parse(t); if (t && Array.isArray(t.content)) t = JSON.parse(T(t)); if (t && t.error) throw new Error(JSON.stringify(t.error).slice(0, 300));
    const v = (t && t.values) || []; const h1 = v[0] || [], h2 = v[1] || [];
    const n = Math.max(h1.length, h2.length, ...v.map((r) => r.length));
    const keys = Array.from({ length: n }, (_, i) => i === 0 ? 'data' : String(h2[i] || h1[i] || 'col' + i).trim());
    const num = (s) => { const x = String(s == null ? '' : s).trim(); if (!x || /#/.test(x)) return null; const pc = /%$/.test(x); const y = +x.replace(/%|R\$|\s/g, '').replace(/\./g, '').replace(',', '.'); return isFinite(y) ? (pc ? y / 100 : y) : null; };
    const rows = v.slice(3).map((r) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(r[0] || '').trim()); if (!m) return null; const o = { data: m[3] + '-' + m[2] + '-' + m[1] }; for (let i = 1; i < n; i++) if (keys[i] && !(keys[i] in o)) o[keys[i]] = num(r[i]); return o; }).filter(Boolean);
    return { columns: [...new Set(keys)], rows };
  },
}));
['canais_real', 'canais_plan', 'canais_gc_real', 'canais_gc_plan'].forEach((id) => dash.loader(id, {
  description: 'Aba Receita | Real ou Receita | Plan em linhas de dia × canal (coluna B é a data, D o total, E em diante os canais na ordem do cabeçalho; a planilha do Grand Cru tem outra ordem: Outros, Itaú, AppPush, Email, SMS, Facebook, Criteo/Programmatic, Shopping, SEM_NonBranded, SEM_Branded, Afiliados, Bing, DemandGen, WhatsApp); números pt-BR viram números.',
  fn: ({ answer, args }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    let t = answer; if (typeof t === 'string') t = JSON.parse(t); if (t && Array.isArray(t.content)) t = JSON.parse(T(t)); if (t && t.error) throw new Error(JSON.stringify(t.error).slice(0, 300));
    const CH = args && args.spreadsheetId === '1Q15kLEU8dTi8da_kbkijBsZ1eMLjOrJF5rn_m7Emj3c' ? ['Outros', 'Itaú', 'AppPush', 'Email', 'SMS', 'Facebook', 'Criteo', 'Shopping', 'SEM_NonBranded', 'SEM_Branded', 'Afiliados', 'Bing', 'DemandGen', 'WhatsApp'] : ['Outros', 'AppPush', 'Email', 'SMS', 'WebPush', 'Display', 'Mailer', 'Facebook', 'Criteo', 'Shopping', 'SEM_NonBranded', 'SEM_Branded', 'Afiliados', 'Bing', 'DemandGen', 'Tiktok', 'WhatsApp'];
    const num = (s) => { const y = +String(s == null ? '' : s).replace(/R\$|\s/g, '').replace(/\./g, '').replace(',', '.'); return isFinite(y) ? y : 0; };
    const rows = [];
    ((t && t.values) || []).forEach((r) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(r[1] || '').trim()); if (!m) return; const data = m[3] + '-' + m[2] + '-' + m[1]; CH.forEach((c, i) => rows.push({ data, canal: c, rec: num(r[4 + i]) })); });
    return { columns: ['data', 'canal', 'rec'], rows };
  },
}));
dash.loader('base_status', {
  description: 'A carga mais recente de cada base de pedidos (Evino e Grand Cru): até quando os pedidos estão na base (window_end).',
  fn: ({ answer }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    const rows = R(answer); const M = new Map();
    rows.forEach((r) => { const k = String(r.dest_table); const t = String(r.window_end || ''); if (!M.has(k) || t > M.get(k)) M.set(k, t); });
    return { columns: ['base', 'ate'], rows: [...M.entries()].map(([k, t]) => ({ base: /^ev_/.test(k) ? 'Evino' : 'Grand Cru', ate: t })) };
  },
});

dash.loader('planos_dir', {
  description: 'Um Plano de Vendas por mês: só títulos no padrão "NN. M-1 Plano de Vendas Mmm AA" (sem sufixo como _2 ou _V_…); se houver mais de um do mesmo mês, fica o editado por último. O mês sai da abreviação e do ano no fim do título.',
  fn: ({ answer }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    let t = answer; if (typeof t === 'string') t = JSON.parse(t); if (t && Array.isArray(t.content)) t = JSON.parse(T(t)); if (t && t.content && !Array.isArray(t.content)) t = t.content; if (t && t.error) throw new Error(JSON.stringify(t.error).slice(0, 300));
    const MES = { jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06', jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12' };
    const M = new Map();
    ((t && t.files) || []).forEach((f) => { if (f.trashed) return; const m = /^\d{1,2}\.\s*M-1 Plano de Vendas\s+(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s*(\d{2})\s*$/i.exec(String(f.title || '').trim()); if (!m) return; const mes = '20' + m[2] + '-' + MES[m[1].toLowerCase()]; const o = M.get(mes); if (!o || String(f.modifiedTime) > o.modificado) M.set(mes, { mes, id: f.id, titulo: f.title, modificado: String(f.modifiedTime || '') }); });
    return { columns: ['mes', 'id', 'titulo', 'modificado'], rows: [...M.values()].sort((a, b) => a.mes.localeCompare(b.mes)) };
  },
});

dash.loader('plano_cat', {
  description: 'Aba Acompanhamento Categorias em linhas de grupo: faixa (coluna B), grupo (D), garrafas do plano final (F) e receita target (H); números pt-BR viram números. O mês do plano sai do título da planilha (ex.: "Plano de Vendas Nov26"), lido numa segunda chamada.',
  fn: async ({ answer, args, call }) => {
    const T = (a) => a == null ? '' : typeof a === 'string' ? a : Array.isArray(a) ? a.map(T).join('\n') : Array.isArray(a.content) ? a.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : a.result != null ? T(a.result) : JSON.stringify(a);
    const R = (a) => { if (Array.isArray(a) && a.every((x) => x && typeof x === 'object' && !('type' in x && 'text' in x))) return a; const t = T(a); if (/^\s*(ERRO|Erro|Error)/.test(t)) throw new Error(t.slice(0, 400)); const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t); if (!m) throw new Error('Resposta sem linhas: ' + t.slice(0, 300)); return JSON.parse(t.slice(m.index + m[1].length)); };
    const N = (x) => { const v = +x; return isFinite(v) ? v : 0; };
    const DT = (a, ops) => ((a.filters || []).find((f) => ops.includes(f.op) && /^\d{4}-\d{2}-\d{2}$/.test(String(f.value))) || {}).value;
    const POOL = async (tasks, k) => { const out = new Array(tasks.length); let i = 0; await Promise.all(Array.from({ length: Math.min(k, tasks.length) }, async () => { while (i < tasks.length) { const j = i++; out[j] = await tasks[j](); } })); return out; };
    const PAGES = async (first, a, max) => { const out = first.slice(); let last = first, off = 0; const lim = a.limit || 1000; while (last.length === lim && off + lim < (max || 20000)) { off += lim; last = R(await call('query_dataset', Object.assign({}, a, { offset: off }))); out.push(...last); } return { rows: out, cut: last.length === lim }; };
    let t = answer; if (typeof t === 'string') t = JSON.parse(t); if (t && Array.isArray(t.content)) t = JSON.parse(T(t)); if (t && t.error) throw new Error(JSON.stringify(t.error).slice(0, 300));
    let meta = await call('get_spreadsheet', { spreadsheetId: args.spreadsheetId, fields: ['properties.title'] }); if (typeof meta === 'string') meta = JSON.parse(meta); if (meta && Array.isArray(meta.content)) meta = JSON.parse(T(meta));
    if (meta && meta.content && !Array.isArray(meta.content)) meta = meta.content;
    const title = String((meta && meta.properties && meta.properties.title) || '');
    const MES = { jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06', jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12' };
    const m = /(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)[a-z]*\s*(\d{2,4})\s*$/i.exec(title.trim());
    const mes = m ? (m[2].length === 2 ? '20' + m[2] : m[2]) + '-' + MES[m[1].toLowerCase()] : null;
    const num = (s) => { const y = +String(s == null ? '' : s).replace(/R\$|\s/g, '').replace(/\./g, '').replace(',', '.'); return isFinite(y) ? y : 0; };
    return { columns: ['mes', 'faixa', 'grupo', 'garrafas_plano', 'receita_plano'], rows: ((t && t.values) || []).filter((r) => r[1] && r[3] && /\d/.test(String(r[7] || ''))).map((r) => ({ mes, faixa: String(r[1]).trim(), grupo: String(r[3]).trim(), garrafas_plano: num(r[5]), receita_plano: num(r[7]) })) };
  },
});

/* ================= cálculos ================= */
dash.calc('k_ev', {
  title: 'KPIs Evino (e-commerce e Itaú Shop)',
  description: 'E-commerce: pedidos BR2… sem SAC, Vivino e televendas (Hoje: solid com boleto não pago a 65% e PIX não pago a 75%; demais: pagos); Itaú Shop: BRI… sem new, payment_review e canceled (todos tratados como pagos), CM2 % = Σ CM2 ÷ receita com frete, CM2 pós-comissão = CM2 − 10 p.p. (comissão de 10%), volume = todos os itens, PMV = receita ÷ itens, ticket = receita ÷ pedidos distintos, volume avulso = itens fora de kit ÷ itens. Receita = price_to_pay + frete; meta = soma da meta diária no período; em Hoje, a meta vai só até a hora atual (soma da meta hora a hora da série do canal, meta do dia × curva das 6 semanas; a hora corrente entra pela fração de minutos já passados) e a do dia inteiro fica em meta_dia.',
  inputs: ['ev_kpi', 'ev_tv', 'ev_yoy', 'ev_tv_yoy', 'ev_ped', 'm_ev', 'itev_kpi', 'itev_yoy', 'm_itev', 'itev_ped', 's_ev', 's_itev'],
  fn: (ev_kpi, ev_tv, ev_yoy, ev_tv_yoy, ev_ped, m_ev, itev_kpi, itev_yoy, m_itev, itev_ped, s_ev, s_itev) => {
    const HM = (o, sr) => { const h = (sr || []).filter((r) => r.gran === 'hora'); if (o && h.length && h.some((r) => r.meta != null)) { const now = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()).replace(' ', 'T'); const m = h.reduce((a, r) => a + (+r.meta || 0) * (r.t === now.slice(0, 13) ? (+now.slice(14, 16) || 0) / 60 : 1), 0); o.meta_dia = o.meta; o.meta = m || null; o.ating = m && o.rec != null ? o.rec / m : null; } return o; };
    const p = ev_ped[0]; if (!p) return [];
    const S = (rows, k, f) => rows.filter(f || (() => true)).reduce((a, r) => a + (+r[k] || 0), 0);
    const inP = (r) => r.data >= p.ini && r.data <= p.fim;
    const ok = (r) => r.payment_method !== 'sac' && r.marketplace_provider !== 'vivino';
    const bt = (r) => +r.is_bottle === 1;
    const k = ev_kpi.filter(ok), y = ev_yoy.filter(ok);
    const ptp = S(k, 'rec') - S(ev_tv, 'rec'), rec = ptp + S(k, 'frete') - S(ev_tv, 'frete');
    const vol = S(k, 'qtd', bt) - S(ev_tv, 'qtd', bt), cm2 = S(k, 'cm2') - S(ev_tv, 'cm2'), cogs = S(k, 'cogs') - S(ev_tv, 'cogs');
    const desc = S(k, 'desc') - S(ev_tv, 'desc'), bruto = S(k, 'bruto') - S(ev_tv, 'bruto');
    const yo = S(y, 'rec') + S(y, 'frete') - S(ev_tv_yoy, 'rec') - S(ev_tv_yoy, 'frete');
    const meta = S(m_ev.filter(inP), 'ecommEV_rev_plan');
    const ev = { bu: 'ev', rec, meta: meta || null, ating: meta ? rec / meta : null, rec_yoy: yo || null, yoy: yo ? rec / yo - 1 : null, pedidos: p.pedidos || null, ticket: p.pedidos ? rec / p.pedidos : null, vol, pm: vol ? rec / vol : null, cm2, cm2_pct: ptp ? cm2 / ptp : null, cogs_med: vol ? cogs / vol : null, markup: cogs ? rec / cogs : null, cogs_pct: rec ? cogs / rec : null, desc_pct: bruto ? desc / bruto : null, cm2_plan: null, cm2pos_plan: null };
    const okI = (r) => !['new', 'payment_review', 'canceled'].includes(r.state);
    const ik = itev_kpi.filter(okI), iy = itev_yoy.filter(okI);
    const iptp = S(ik, 'rec'), irec = iptp + S(ik, 'frete'), ivol = S(ik, 'qtd'), isg = S(ik, 'qtd', (r) => +r.is_bundle_product === 0), icm2 = S(ik, 'cm2'), icogs = S(ik, 'cogs'); const iped = itev_ped[0] ? itev_ped[0].pedidos : null;
    const iyo = S(iy, 'rec') + S(iy, 'frete');
    const mi = m_itev.filter(inP), imeta = S(mi, 'ItauShopEV_rev_plan');
    const w = (key) => { const d = mi.filter((r) => r[key] != null && r.ItauShopEV_rev_plan); const t = S(d, 'ItauShopEV_rev_plan'); return t ? d.reduce((a, r) => a + r[key] * r.ItauShopEV_rev_plan, 0) / t : null; };
    const it = { bu: 'itev', rec: irec, meta: imeta || null, ating: imeta ? irec / imeta : null, rec_yoy: iyo || null, yoy: iyo ? irec / iyo - 1 : null, pedidos: iped || null, ticket: iped ? irec / iped : null, vol: ivol, single_pct: ivol ? isg / ivol : null, pm: ivol ? irec / ivol : null, cm2: icm2, cm2_pct: irec ? icm2 / irec : null, cm2pos_pct: irec ? icm2 / irec - 0.10 : null, cogs_med: ivol ? icogs / ivol : null, markup: icogs ? irec / icogs : null, desc_pct: null, cm2_plan: w('ItauShopEV_cm2_plan'), cm2pos_plan: w('ItauShopEV_cm2poscomissao_plan') };
    return [HM(ev, s_ev), HM(it, s_itev)];
  },
});

dash.calc('k_gc', {
  title: 'KPIs das lojas Grand Cru, Itaú GC, Clube e Confraria',
  description: 'Itaú Shop Grand Cru: pedidos itau_payment da loja GrandCru (ver itgc), receita total = faturada + reembolso Itaú do cupom. E-commerce Grand Cru: Ecomm GC + Concierge com o cupom Itaú (ver gce), receita total = faturada + R$ 200 por pedido Itaú; ticket e preço médio sobre a receita total. Confraria: só assinatura de vinho (com plano, sem os planos de crédito Grand 200/250/500), sem a compra da assinatura; meta rev_vinho_plan, meta de pedidos active_vinho_plan, pedidos = pedidos distintos de cf_ord (base). Demais: itens pagos (is_flash_paid) por canal; no Clube Evino, sem a compra da assinatura (status signature_created); receita = price_to_pay + frete (sem crédito de loja); garrafas = itens das linhas de garrafa; meta = soma da meta diária no período; em Hoje, a meta vai só até a hora atual (soma da meta hora a hora da série do canal; a hora corrente entra pela fração de minutos já passados) e a do dia inteiro fica em meta_dia.',
  inputs: ['gc_kpi', 'gc_yoy', 'gce', 'cl_ped', 'cf_ord', 'ev_ped', 'm_gc', 'm_itgc', 'm_cl', 'm_cf', 'itgc', 's_gc', 's_cl', 's_cf', 's_itgc'],
  fn: (gc_kpi, gc_yoy, gce, cl_ped, cf_ord, ev_ped, m_gc, m_itgc, m_cl, m_cf, itgc, s_gc, s_cl, s_cf, s_itgc) => {
    const HM = (o, sr) => { const h = (sr || []).filter((r) => r.gran === 'hora'); if (o && h.length && h.some((r) => r.meta != null)) { const now = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()).replace(' ', 'T'); const m = h.reduce((a, r) => a + (+r.meta || 0) * (r.t === now.slice(0, 13) ? (+now.slice(14, 16) || 0) / 60 : 1), 0); o.meta_dia = o.meta; o.meta = m || null; o.ating = m && o.rec != null ? o.rec / m : null; } return o; };
    const p = ev_ped[0]; if (!p) return [];
    const S = (rows, k, f) => rows.filter(f || (() => true)).reduce((a, r) => a + (+r[k] || 0), 0);
    const inP = (r) => r.data >= p.ini && r.data <= p.fim;
    const BU = [
      { bu: 'gc', ch: 'GrandCru - E-commerce', ped: null, m: m_gc, mk: 'ecommGC_rGC_plan', mp: 'ecommGC_orders_plan' },
      { bu: 'itgc', ch: 'Itaú - E-commerce', ped: null, m: m_itgc, mk: 'ItauShopGC_rev_plan', mp: 'ItauShopGC_orders_plan' },
      { bu: 'cl', ch: 'Clube Evino - E-commerce', ped: cl_ped, m: m_cl, mk: 'ClubeEvino_rev_plan', mp: 'ClubeEvino_orders_plan' },
      { bu: 'cf', ch: 'Confraria - E-commerce', ped: [{ pedidos: cf_ord.filter((r) => r.tipo === 'base').reduce((a, r) => a + r.pedidos, 0) }], m: m_cf, mk: 'rev_vinho_plan', mp: 'active_vinho_plan' },
    ];
    const gt = gce.find((r) => r.gran === 'total');
    const SR = { gc: s_gc, cl: s_cl, cf: s_cf, itgc: s_itgc };
    return BU.map((b) => HM((() => {
      if (b.bu === 'gc' || b.bu === 'itgc') {
        const g = b.bu === 'gc' ? gt : itgc.find((r) => r.gran === 'total');
        const mm = b.m.filter(inP), meta = S(mm, b.mk), mped = S(mm, b.mp);
        if (!g) return { bu: b.bu, rec: null, meta: meta || null };
        const rec = g.rec, yo = g.rec_ly;
        return Object.assign({}, g, { bu: b.bu, meta: meta || null, ating: meta ? rec / meta : null, rec_yoy: yo || null, yoy: yo ? rec / yo - 1 : null, meta_pedidos: mped || null, ticket: g.pedidos ? rec / g.pedidos : null, pm: g.vol ? rec / g.vol : null, desc_pct: g.bruto ? g.desc / g.bruto : null });
      }
      const sig = (r) => (b.bu === 'cl' && r.status === 'signature_created') || (b.bu === 'cf' && (r.status === 'signature_created' || !r.assinatura_plano || /^grand \d+$/i.test(String(r.assinatura_plano))));
      const k = gc_kpi.filter((r) => r.sales_channel === b.ch && !sig(r));
      const ptp = S(k, 'rec'), rec = ptp + S(k, 'frete'), vol = S(k, 'qtd', (r) => +r.is_bottle === 1);
      const yy = gc_yoy.filter((r) => r.sales_channel === b.ch && !sig(r)); const yo = S(yy, 'rec') + S(yy, 'frete');
      const mm = b.m.filter(inP), meta = S(mm, b.mk), mped = S(mm, b.mp);
      const ped = b.ped && b.ped[0] ? b.ped[0].pedidos : null;
      return { bu: b.bu, rec, meta: meta || null, ating: meta ? rec / meta : null, rec_yoy: yo || null, yoy: yo ? rec / yo - 1 : null, pedidos: ped, meta_pedidos: mped || null, ticket: ped ? rec / ped : null, vol, pm: vol ? rec / vol : null, desc_pct: S(k, 'bruto') ? S(k, 'desc') / S(k, 'bruto') : null };
    })(), SR[b.bu]));
  },
});

dash.calc('grupo', {
  title: 'Visão consolidada do grupo',
  description: 'Marca Evino = e-commerce Evino + Clube Evino + Itaú Shop Evino; marca Grand Cru = e-commerce Grand Cru + Confraria + Itaú Shop Grand Cru; total = as duas. Somas de receita, meta e receita do ano anterior.',
  inputs: ['k_ev', 'k_gc'],
  fn: (k_ev, k_gc) => {
    const all = k_ev.concat(k_gc); if (all.length < 6) return [];
    const mk = (marca, bus) => { const r = all.filter((x) => bus.includes(x.bu)); const s = (f) => r.reduce((a, x) => a + (+x[f] || 0), 0); const rec = s('rec'), meta = s('meta'), yo = s('rec_yoy'); return { marca, rec, meta: meta || null, ating: meta ? rec / meta : null, rec_yoy: yo || null, yoy: yo ? rec / yo - 1 : null }; };
    return [mk('Evino', ['ev', 'cl', 'itev']), mk('Grand Cru', ['gc', 'cf', 'itgc']), mk('Grupo', ['ev', 'cl', 'itev', 'gc', 'cf', 'itgc'])];
  },
});

dash.calc('s_ev', {
  title: 'Receita no tempo: e-commerce Evino',
  description: 'Receita por hora, dia ou mês contra a meta. Dia e mês: meta diária da planilha (somada no mês). Hora: meta do dia × participação média daquela hora nos mesmos dias da semana das 6 semanas anteriores.',
  inputs: ['ev_serie', 'm_ev', 'ev_curva'],
  fn: (ev_serie, m_ev, ev_curva) => ev_serie.map((r) => {
    const dia = (d) => m_ev.filter((x) => x.data === d).reduce((a, x) => a + (+x.ecommEV_rev_plan || 0), 0);
    let m;
    if (r.gran === 'hora') { const c = ev_curva.find((x) => x.h === +r.t.slice(11, 13)); m = c && c.dias ? dia(r.t.slice(0, 10)) * c.share : null; }
    else m = r.gran === 'dia' ? dia(r.t) : m_ev.filter((x) => x.data.slice(0, 7) === r.t).reduce((a, x) => a + (+x.ecommEV_rev_plan || 0), 0);
    return { gran: r.gran, t: r.t, rec: r.rec, meta: m || null, ating: m && r.rec != null ? r.rec / m : null, rec_ly: r.rec_ly == null ? null : r.rec_ly };
  }),
});
dash.calc('s_gc', {
  title: 'Receita no tempo: e-commerce Grand Cru',
  description: 'Receita total (Ecomm GC + Concierge, com R$ 200 por pedido do cupom Itaú) por hora ou dia contra a meta. Dia e mês: meta diária da planilha (somada no mês). Hora: meta do dia × participação média daquela hora nos mesmos dias da semana das 6 semanas anteriores.',
  inputs: ['gce', 'm_gc', 'gc_curva'],
  fn: (gce, m_gc, gc_curva) => gce.filter((r) => r.gran !== 'total').map((r) => {
    const dia = (d) => m_gc.filter((x) => x.data === d).reduce((a, x) => a + (+x.ecommGC_rGC_plan || 0), 0);
    let m;
    if (r.gran === 'hora') { const c = gc_curva.find((x) => x.h === +r.t.slice(11, 13)); m = c && c.dias ? dia(r.t.slice(0, 10)) * c.share : null; }
    else m = r.gran === 'dia' ? dia(r.t) : m_gc.filter((x) => x.data.slice(0, 7) === r.t).reduce((a, x) => a + (+x.ecommGC_rGC_plan || 0), 0);
    return { gran: r.gran, t: r.t, rec: r.rec, meta: m || null, ating: m && r.rec != null ? r.rec / m : null, rec_ly: r.rec_ly == null ? null : r.rec_ly };
  }),
});

dash.calc('gce_dia', {
  title: 'E-commerce Grand Cru: abertura do cupom Itaú',
  description: 'As mesmas métricas do cupom Itaú por dia (ou hora), só os períodos com venda, e a linha de total do período.',
  inputs: ['gce'],
  fn: (gce) => gce.filter((r) => r.rec != null && (r.gran === 'total' || r.pedidos)).map((r) => Object.assign({}, r, { dia: r.gran === 'total' ? 'Total' : r.gran === 'hora' ? r.t.slice(11) + 'h' : r.t.slice(8, 10) + '/' + r.t.slice(5, 7), nivel: r.gran === 'total' ? 'total' : null })),
});

dash.calc('s_cl', {
  title: 'Receita no tempo: Clube Evino',
  description: 'Receita da loja Clube Evino sem a compra da assinatura, por hora, dia ou mês, contra a meta ClubeEvino_rev_plan da aba db_forecast_clubeEvino. Dia e mês: meta diária (somada no mês). Hora a hora: sem meta (só o e-commerce Evino e o e-commerce Grand Cru têm meta por hora).',
  inputs: ['cl_serie', 'm_cl'],
  fn: (cl_serie, m_cl) => cl_serie.map((r) => {
    const dia = (d) => m_cl.filter((x) => x.data === d).reduce((a, x) => a + (+x.ClubeEvino_rev_plan || 0), 0);
    let m;
    if (r.gran === 'hora') m = null;
    else m = r.gran === 'dia' ? dia(r.t) : m_cl.filter((x) => x.data.slice(0, 7) === r.t).reduce((a, x) => a + (+x.ClubeEvino_rev_plan || 0), 0);
    return { gran: r.gran, t: r.t, rec: r.rec, meta: m || null, ating: m && r.rec != null ? r.rec / m : null, rec_ly: r.rec_ly == null ? null : r.rec_ly };
  }),
});

dash.calc('s_cf', {
  title: 'Receita no tempo: Confraria',
  description: 'Receita da Confraria (assinatura de vinho, sem os planos de crédito e sem a compra da assinatura) por hora ou dia contra a meta rev_vinho_plan da aba db_forecast_Confraria. Hora a hora: sem meta (só o e-commerce Evino e o e-commerce Grand Cru têm meta por hora).',
  inputs: ['cf_serie', 'm_cf'],
  fn: (cf_serie, m_cf) => cf_serie.map((r) => {
    const dia = (d) => m_cf.filter((x) => x.data === d).reduce((a, x) => a + (+x.rev_vinho_plan || 0), 0);
    let m;
    if (r.gran === 'hora') m = null;
    else m = r.gran === 'dia' ? dia(r.t) : m_cf.filter((x) => x.data.slice(0, 7) === r.t).reduce((a, x) => a + (+x.rev_vinho_plan || 0), 0);
    return { gran: r.gran, t: r.t, rec: r.rec, meta: m || null, ating: m && r.rec != null ? r.rec / m : null, rec_ly: r.rec_ly == null ? null : r.rec_ly };
  }),
});

dash.calc('cf_tab', {
  title: 'Confraria por plano: base e novos',
  description: 'Por plano, na ordem Experiência, Reserva +, Reserva Especial, Grand Reserva, Grand Selection, e tipo (base = caixas e demais pedidos; novo = compra da assinatura): receita, pedidos, ticket médio e PMV em valor mensal (na compra da assinatura, anual ÷ 12 e semestral ÷ 6). Metas da aba db_forecast_Confraria por plano (Experiência = experiencia + experienciamais; Reserva + = reservamais + reserva): na base, receita rev_<plano>_plan e pedidos active_<plano>_plan (total: rev_vinho_plan e active_vinho_plan); nos novos, new_<plano>_plan e receita mensal rev_new_<plano>_plan (total: new_vinho_plan e rev_new_confra_plan), comparada à receita mensalizada (anual ÷ 12, semestral ÷ 6).',
  inputs: ['cf_ord', 'm_cf', 'ev_ped'],
  fn: (cf_ord, m_cf, ev_ped) => {
    const p = ev_ped[0]; if (!p) return [];
    const mm = m_cf.filter((r) => r.data >= p.ini && r.data <= p.fim);
    const sm = (k) => mm.reduce((s, r) => s + (+r[k] || 0), 0);
    const ORD = ['Experiência', 'Reserva +', 'Reserva Especial', 'Grand Reserva', 'Grand Selection'];
    const out = [];
    ['base', 'novo'].forEach((tipo) => {
      const rows = cf_ord.filter((r) => r.tipo === tipo);
      const K = { 'Experiência': ['experiencia', 'experienciamais'], 'Reserva +': ['reservamais', 'reserva'], 'Reserva Especial': ['reservaespecial'], 'Grand Reserva': ['grandreserva'], 'Grand Selection': ['grandselection'] };
      const pk = (plano, pre) => (K[plano] || []).reduce((a, k) => a + sm(pre + k + '_plan'), 0);
      const mk = (plano, rs, tot) => {
        const rec = rs.reduce((a, r) => a + r.rec, 0), recm = rs.reduce((a, r) => a + (r.rec_mes == null ? r.rec : r.rec_mes), 0), ped = rs.reduce((a, r) => a + r.pedidos, 0), gar = rs.reduce((a, r) => a + r.garrafas, 0);
        const meta = tipo === 'base' ? (tot ? sm('rev_vinho_plan') : pk(plano, 'rev_')) : 0;
        const mped = tipo === 'base' ? (tot ? sm('active_vinho_plan') : pk(plano, 'active_')) : (tot ? sm('new_vinho_plan') : pk(plano, 'new_'));
        const mrm = tipo === 'novo' ? (tot ? sm('rev_new_confra_plan') : pk(plano, 'rev_new_')) : 0;
        return { tipo, plano, rec, rec_mes: recm, meta: meta || null, ating: meta ? rec / meta : null, meta_rec_mes: mrm || null, ating_rec_mes: mrm ? recm / mrm : null, pedidos: ped, meta_pedidos: mped || null, ating_pedidos: mped ? ped / mped : null, ticket: ped ? recm / ped : null, pmv: gar ? recm / gar : null };
      };
      const pos = (pl) => { const i = ORD.indexOf(pl); return i < 0 ? 9 : i; };
      [...new Set(rows.map((r) => r.plano))].sort((a, b) => pos(a) - pos(b) || a.localeCompare(b)).forEach((pl) => out.push(mk(pl, rows.filter((r) => r.plano === pl), false)));
      out.push(mk('Total', rows, true));
    });
    return out;
  },
});

dash.calc('s_itgc', {
  title: 'Receita no tempo: Itaú Shop Grand Cru',
  description: 'Receita total (faturada + reembolso Itaú) por hora ou dia contra a meta ItauShopGC_rev_plan da aba db_forecast_ItauShopGC; Hora a hora: sem meta (só o e-commerce Evino e o e-commerce Grand Cru têm meta por hora).',
  inputs: ['itgc', 'm_itgc'],
  fn: (itgc, m_itgc) => itgc.filter((r) => r.gran === 'dia' || r.gran === 'hora').map((r) => {
    const dia = (d) => m_itgc.filter((x) => x.data === d).reduce((a, x) => a + (+x.ItauShopGC_rev_plan || 0), 0);
    let m;
    if (r.gran === 'hora') m = null;
    else m = dia(r.t);
    return { gran: r.gran, t: r.t, rec: r.rec, meta: m || null, ating: m && r.rec != null ? r.rec / m : null, rec_ly: r.rec_ly == null ? null : r.rec_ly };
  }),
});

dash.calc('itgc_res', {
  title: 'Itaú Shop Grand Cru: resumo por cupom',
  description: 'Linhas de grupo de cupom (R$ 70, R$ 45, sem cupom) e o total do canal, de itgc.',
  inputs: ['itgc'],
  fn: (itgc) => itgc.filter((r) => r.gran === 'grupo'),
});

dash.calc('s_g_ev', {
  title: 'Receita no tempo: marca Evino (e-commerce, Clube e Itaú Shop)',
  description: 'Soma por hora ou dia da receita, da meta e do ano anterior das séries de cada BU da marca Evino (e-commerce, Clube e Itaú Shop); atingimento = receita ÷ meta. Hora ou dia vazio em todas as BUs fica vazio. Hora a hora (Hoje e Ontem), sem Clube Evino e Confraria.',
  inputs: ['s_ev',  's_cl',  's_itev'],
  fn: (s_ev, s_cl, s_itev) => {
    const M = new Map();
    [s_ev, s_cl, s_itev].forEach((rows) => rows.forEach((r) => { if (r.gran === 'hora' && rows === s_cl /* corrigido: s_cf não existe neste cálculo */) return; const o = M.get(r.t) || { gran: r.gran, t: r.t, rec: null, meta: 0, rec_ly: null }; if (r.rec != null) o.rec = (o.rec || 0) + r.rec; o.meta += +r.meta || 0; if (r.rec_ly != null) o.rec_ly = (o.rec_ly || 0) + r.rec_ly; M.set(r.t, o); }));
    return [...M.values()].sort((a, b) => a.t.localeCompare(b.t)).map((o) => Object.assign(o, { meta: o.meta || null, ating: o.meta && o.rec != null ? o.rec / o.meta : null }));
  },
});

dash.calc('s_g_gc', {
  title: 'Receita no tempo: marca Grand Cru (e-commerce, Confraria e Itaú Shop)',
  description: 'Soma por hora ou dia da receita, da meta e do ano anterior das séries de cada BU da marca Grand Cru (e-commerce, Confraria e Itaú Shop); atingimento = receita ÷ meta. Hora ou dia vazio em todas as BUs fica vazio. Hora a hora (Hoje e Ontem), sem Clube Evino e Confraria.',
  inputs: ['s_gc',  's_cf',  's_itgc'],
  fn: (s_gc, s_cf, s_itgc) => {
    const M = new Map();
    [s_gc, s_cf, s_itgc].forEach((rows) => rows.forEach((r) => { if (r.gran === 'hora' && rows === s_cf /* corrigido: s_cl não existe neste cálculo */) return; const o = M.get(r.t) || { gran: r.gran, t: r.t, rec: null, meta: 0, rec_ly: null }; if (r.rec != null) o.rec = (o.rec || 0) + r.rec; o.meta += +r.meta || 0; if (r.rec_ly != null) o.rec_ly = (o.rec_ly || 0) + r.rec_ly; M.set(r.t, o); }));
    return [...M.values()].sort((a, b) => a.t.localeCompare(b.t)).map((o) => Object.assign(o, { meta: o.meta || null, ating: o.meta && o.rec != null ? o.rec / o.meta : null }));
  },
});

dash.calc('s_g_all', {
  title: 'Receita no tempo: grupo (as seis BUs)',
  description: 'Soma por hora ou dia da receita, da meta e do ano anterior das séries de cada BU da grupo (as seis BUs); atingimento = receita ÷ meta. Hora ou dia vazio em todas as BUs fica vazio. Hora a hora (Hoje e Ontem), sem Clube Evino e Confraria.',
  inputs: ['s_ev',  's_cl',  's_itev',  's_gc',  's_cf',  's_itgc'],
  fn: (s_ev, s_cl, s_itev, s_gc, s_cf, s_itgc) => {
    const M = new Map();
    [s_ev, s_cl, s_itev, s_gc, s_cf, s_itgc].forEach((rows) => rows.forEach((r) => { if (r.gran === 'hora' && (rows === s_cl || rows === s_cf)) return; const o = M.get(r.t) || { gran: r.gran, t: r.t, rec: null, meta: 0, rec_ly: null }; if (r.rec != null) o.rec = (o.rec || 0) + r.rec; o.meta += +r.meta || 0; if (r.rec_ly != null) o.rec_ly = (o.rec_ly || 0) + r.rec_ly; M.set(r.t, o); }));
    return [...M.values()].sort((a, b) => a.t.localeCompare(b.t)).map((o) => Object.assign(o, { meta: o.meta || null, ating: o.meta && o.rec != null ? o.rec / o.meta : null }));
  },
});

dash.calc('s_itev', {
  title: 'Receita no tempo: Itaú Shop Evino',
  description: 'Receita, CM2 %, CM2 pós-comissão e PMV por hora, dia ou mês contra a meta da aba db_forecast_ItauShopEvino. Dia e mês: meta diária (somada no mês). Hora a hora: sem meta (só o e-commerce Evino e o e-commerce Grand Cru têm meta por hora).',
  inputs: ['itev_serie', 'm_itev'],
  fn: (itev_serie, m_itev) => itev_serie.map((r) => {
    const dia = (d) => m_itev.filter((x) => x.data === d).reduce((a, x) => a + (+x.ItauShopEV_rev_plan || 0), 0);
    let m;
    if (r.gran === 'hora') m = null;
    else m = r.gran === 'dia' ? dia(r.t) : m_itev.filter((x) => x.data.slice(0, 7) === r.t).reduce((a, x) => a + (+x.ItauShopEV_rev_plan || 0), 0);
    return Object.assign({}, r, { meta: m || null, ating: m && r.rec != null ? r.rec / m : null, rec_ly: r.rec_ly == null ? null : r.rec_ly });
  }),
});

dash.calc('pir_ev', {
  title: 'Pirâmide de faixas: e-commerce Evino',
  description: 'Receita e garrafas por faixa (cluster de vw_ev_grupo_de_produto) contra o Plano de Vendas do mês × (meta de receita do período ÷ meta do mês); sem meta quando o período sai de um mês ou quando a planilha do plano não é do mês do período.',
  inputs: ['ev_sku', 'plano_cat', 'm_ev', 'ev_ped'],
  fn: (ev_sku, plano_cat, m_ev, ev_ped) => {
    const p = ev_ped[0]; if (!p) return [];
    const ORD = ['0 - 30', '30 - 50', '50 - 100', 'Acima de 100', 'Outros'];
    const nf = (c) => ORD.slice(0, 4).find((o) => o.toLowerCase() === String(c || '').trim().toLowerCase()) || 'Outros';
    const mes = p.fim.slice(0, 7), mesmo = p.ini.slice(0, 7) === mes;
    const mm = m_ev.filter((r) => r.data.slice(0, 7) === mes).reduce((a, r) => a + (+r.ecommEV_rev_plan || 0), 0);
    const mp = m_ev.filter((r) => r.data >= p.ini && r.data <= p.fim).reduce((a, r) => a + (+r.ecommEV_rev_plan || 0), 0);
    const fat = mesmo && mm && plano_cat.length && plano_cat[0].mes === mes ? mp / mm : null;
    const R = {}, V = {}, PR = {};
    ev_sku.forEach((r) => { const f = nf(r.faixa); R[f] = (R[f] || 0) + r.rec; V[f] = (V[f] || 0) + r.garrafas; });
    plano_cat.forEach((r) => { const f = nf(r.faixa); PR[f] = (PR[f] || 0) + r.receita_plano; });
    const tr = ORD.reduce((a, f) => a + (R[f] || 0), 0), tp = ORD.reduce((a, f) => a + (PR[f] || 0), 0);
    let acc = 0, accp = 0;
    return ORD.map((f) => { acc += R[f] || 0; accp += fat == null ? 0 : (PR[f] || 0) * fat; const meta = fat == null ? null : (PR[f] || 0) * fat; return { faixa: f, receita: R[f] || 0, meta, ating: meta ? (R[f] || 0) / meta : null, share: tr ? (R[f] || 0) / tr : null, share_meta: fat != null && tp ? (PR[f] || 0) / tp : null, acum: acc, acum_meta: fat == null ? null : accp, garrafas: V[f] || 0 }; });
  },
});

dash.calc('canais_ev', {
  title: 'Monitoramento de canais: e-commerce Evino',
  description: 'Receita last click do período por canal (planilha Monitoramento de Canais, aba Receita | Real) contra a meta last click por canal da mesma planilha (aba Receita | Plan), agrupada em Growth, CRM e Outros: atingimento = real ÷ meta; gap = real − meta.',
  inputs: ['canais_real', 'canais_plan', 'ev_ped'],
  fn: (canais_real, canais_plan, ev_ped) => {
    const p = ev_ped[0]; if (!p) return [];
    const G = [['Growth', ['Facebook', 'Criteo', 'Shopping', 'SEM_NonBranded', 'SEM_Branded', 'Afiliados', 'Bing', 'DemandGen', 'Display', 'Tiktok']], ['CRM', ['AppPush', 'Email', 'SMS', 'WebPush', 'WhatsApp', 'Mailer']], ['Outros', ['Outros']]];
    const r = canais_real.filter((x) => x.data >= p.ini && x.data <= p.fim), m = canais_plan.filter((x) => x.data >= p.ini && x.data <= p.fim);
    const real = (c) => r.filter((x) => x.canal === c).reduce((a, x) => a + x.rec, 0), meta = (c) => m.filter((x) => x.canal === c).reduce((a, x) => a + x.rec, 0);
    const row = (canal, nivel, re, me) => ({ canal, nivel, real: re, meta: me || null, ating: me ? re / me : null, gap: me ? re - me : null });
    const out = []; let tr = 0, tm = 0;
    G.forEach(([g, cs]) => {
      const re = cs.reduce((a, c) => a + real(c), 0), me = cs.reduce((a, c) => a + meta(c), 0); tr += re; tm += me;
      out.push(row(g, 'grupo', re, me));
      if (cs.length > 1) cs.filter((c) => real(c) || meta(c)).forEach((c) => out.push(row(c, 'canal', real(c), meta(c))));
    });
    out.push(row('Total', 'total', tr, tm));
    return out;
  },
});

dash.calc('canais_gc', {
  title: 'Monitoramento de canais: e-commerce Grand Cru',
  description: 'Receita last click do período por canal (planilha Grand Cru | Monitoramento de Canais, aba Receita | Real) contra a meta last click por canal da mesma planilha (aba Receita | Plan), agrupada em Growth, CRM e Outros: atingimento = real ÷ meta; gap = real − meta. Abaixo do total last click, o que fica fora dele até a receita total do capítulo: Concierge (receita faturada da perna Shipping from CD), parte do Itaú (R$ 200 por pedido com cupom Itaú) e UTM sourcing não localizado = receita total − last click − Concierge − parte do Itaú; a última linha é a receita total do capítulo. Share = receita da linha ÷ receita total.',
  inputs: ['canais_gc_real', 'canais_gc_plan', 'ev_ped', 'gce', 'm_gc'],
  fn: (canais_real, canais_plan, ev_ped, gce, m_gc) => {
    const p = ev_ped[0]; if (!p) return [];
    const G = [['Growth', ['Facebook', 'Criteo', 'Shopping', 'SEM_NonBranded', 'SEM_Branded', 'Afiliados', 'Bing', 'DemandGen']], ['CRM', ['AppPush', 'Email', 'SMS', 'WhatsApp']], ['Outros', ['Outros', 'Itaú']]];
    const r = canais_real.filter((x) => x.data >= p.ini && x.data <= p.fim), m = canais_plan.filter((x) => x.data >= p.ini && x.data <= p.fim);
    const real = (c) => r.filter((x) => x.canal === c).reduce((a, x) => a + x.rec, 0), meta = (c) => m.filter((x) => x.canal === c).reduce((a, x) => a + x.rec, 0);
    const row = (canal, nivel, re, me) => ({ canal, nivel, real: re, meta: me || null, ating: me ? re / me : null, gap: me ? re - me : null });
    const out = []; let tr = 0, tm = 0;
    G.forEach(([g, cs]) => {
      const re = cs.reduce((a, c) => a + real(c), 0), me = cs.reduce((a, c) => a + meta(c), 0); tr += re; tm += me;
      out.push(row(g, 'grupo', re, me));
      if (cs.length > 1) cs.filter((c) => real(c) || meta(c)).forEach((c) => out.push(row(c, 'canal', real(c), meta(c))));
    });
    out.push(row('Total last click', 'total', tr, tm));
    const gt = gce.find((x) => x.gran === 'total');
    if (gt) {
      const conc = gt.conc || 0, it = gt.itau_parte || 0, nl = gt.rec - tr - conc - it;
      out.push({ canal: 'Fora do last click', nivel: 'grupo', real: gt.rec - tr, meta: null, ating: null, gap: null });
      out.push({ canal: 'UTM sourcing não localizado', nivel: 'canal', real: nl, meta: null, ating: null, gap: null });
      out.push({ canal: 'Concierge', nivel: 'canal', real: conc, meta: null, ating: null, gap: null });
      out.push({ canal: 'Parte do Itaú (cupom R$ 400)', nivel: 'canal', real: it, meta: null, ating: null, gap: null });
      const mt = m_gc.filter((x) => x.data >= p.ini && x.data <= p.fim).reduce((a, x) => a + (+x.ecommGC_rGC_plan || 0), 0);
      out.push({ canal: 'Receita total', nivel: 'total', real: gt.rec, meta: mt || null, ating: mt ? gt.rec / mt : null, gap: mt ? gt.rec - mt : null });
    }
    const base = gt ? gt.rec : tr;
    return out.map((o) => Object.assign(o, { share: base ? o.real / base : null }));
  },
});

dash.calc('cl_tab', {
  title: 'Clube Evino por plano: base e novos',
  description: 'Por plano, na ordem Go, Red, Black, Fresh, e tipo (base = caixas e demais pedidos; novo = compra da assinatura): receita, pedidos, ticket médio e PMV em valor mensal (receita mensalizada ÷ pedidos e ÷ garrafas; na compra da assinatura, plano anual ÷ 12 e semestral ÷ 6) e metas da aba db_forecast_clubeEvino (receita e pedidos por plano na base; novas assinaturas por plano nos novos).',
  inputs: ['cl_ord', 'm_cl', 'ev_ped'],
  fn: (cl_ord, m_cl, ev_ped) => {
    const p = ev_ped[0]; if (!p) return [];
    const mm = m_cl.filter((r) => r.data >= p.ini && r.data <= p.fim);
    const sm = (ks) => ks.reduce((a, k) => a + mm.reduce((s, r) => s + (+r[k] || 0), 0), 0);
    const key = (pl) => { const t = String(pl || '').toLowerCase(); return /fresh/.test(t) ? 'fresh' : /black/.test(t) ? 'black' : /red/.test(t) ? 'red' : /\bgo\b/.test(t) ? 'go' : null; };
    const NV = { go: ['clubeEV_new_go4_plan', 'clubeEV_new_go6_plan'], red: ['clubeEV_new_red2_plan'], black: ['clubeEV_new_black2_plan'], fresh: ['clubeEV_new_fresh_plan'] };
    const out = [];
    ['base', 'novo'].forEach((tipo) => {
      const rows = cl_ord.filter((r) => r.tipo === tipo);
      const planos = [...new Set(rows.map((r) => r.plano))];
      const mk = (plano, rs, k) => {
        const rec = rs.reduce((a, r) => a + r.rec, 0), recm = rs.reduce((a, r) => a + (r.rec_mes == null ? r.rec : r.rec_mes), 0), ped = rs.reduce((a, r) => a + r.pedidos, 0), gar = rs.reduce((a, r) => a + r.garrafas, 0);
        const meta = tipo === 'base' ? (k === 'Total' ? sm(['ClubeEvino_rev_plan']) : k ? sm(['clubeEV_rev_' + k + '_plan']) : 0) : 0;
        const mped = tipo === 'base' ? (k === 'Total' ? sm(['ClubeEvino_orders_plan']) : k ? sm(['clubeEV_orders_' + k + '_plan']) : 0) : (k === 'Total' ? sm(['ClubeEvino_new_plan']) : k ? sm(NV[k]) : 0);
        return { tipo, plano, rec, meta: meta || null, ating: meta ? rec / meta : null, pedidos: ped, meta_pedidos: mped || null, ating_pedidos: mped ? ped / mped : null, ticket: ped ? recm / ped : null, pmv: gar ? recm / gar : null };
      };
      const ORD = { go: 0, red: 1, black: 2, fresh: 3 };
      planos.map((pl) => mk(pl, rows.filter((r) => r.plano === pl), key(pl))).sort((a, b) => ((ORD[key(a.plano)] ?? 9) - (ORD[key(b.plano)] ?? 9)) || a.plano.localeCompare(b.plano)).forEach((r) => out.push(r));
      out.push(Object.assign(mk('Total', rows, 'Total'), { plano: 'Total' }));
    });
    return out;
  },
});

})();
