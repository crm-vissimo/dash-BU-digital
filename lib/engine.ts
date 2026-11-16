/**
 * Roda no servidor as fontes do painel: lê public/dash/datasets.json (de onde vem cada fonte) e
 * executa os "loaders" de public/dash/data.js (o código original) com as ferramentas de lib/tools.ts.
 * O navegador só recebe o resultado final de cada fonte.
 */
import fs from 'node:fs';
import path from 'node:path';
import { runTool } from './tools';

type Loader = { fn: (ctx: { answer: unknown; args: unknown; call: (t: string, a: unknown) => Promise<unknown> }) => unknown };
type DS = { title: string; tool: string; args: unknown };

let loaders: Record<string, Loader> | null = null;
let datasets: Record<string, DS> | null = null;

function init() {
  if (loaders && datasets) return;
  const dir = path.join(process.cwd(), 'public', 'dash');
  datasets = JSON.parse(fs.readFileSync(path.join(dir, 'datasets.json'), 'utf8'));
  const code = fs.readFileSync(path.join(dir, 'data.js'), 'utf8');
  const L: Record<string, Loader> = {};
  // data.js só declara loaders e cálculos; os cálculos continuam no navegador.
  const dash = {
    loader: (id: string, def: Loader) => { L[id] = def; },
    calc: () => {},
    data: () => ({ status: 'loading', data: [] }),
    params: () => ({}),
    onData: () => {},
    draw: () => {},
    setParams: () => {},
    refresh: () => {},
  };
  new Function('dash', 'window', code)(dash, {});
  loaders = L;
}

export function datasetIds(): string[] {
  init();
  return Object.keys(datasets!);
}

/** Nomes dos parâmetros ({{nome}}) que a fonte usa. */
export function usedParams(id: string): string[] {
  init();
  const ds = datasets![id];
  if (!ds) return [];
  return [...new Set([...JSON.stringify(ds.args).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))];
}

const SAFE = /^[0-9A-Za-z_\-(),.:]{1,80}$/;

function subst(v: unknown, p: Record<string, string>): unknown {
  if (typeof v === 'string') return v.replace(/\{\{(\w+)\}\}/g, (m, k) => (p[k] == null ? m : p[k]));
  if (Array.isArray(v)) return v.map((x) => subst(x, p));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, subst(x, p)]));
  return v;
}

function rowsFromText(a: unknown) {
  if (Array.isArray(a)) return a;
  const t = typeof a === 'string' ? a : JSON.stringify(a);
  const m = /(^|\n)\s*(\[\s*[\{\]])/.exec(t);
  return m ? JSON.parse(t.slice(m.index + m[1].length)) : a;
}

export type Result = { data: unknown; columns: string[]; cut: boolean };

export async function runDataset(id: string, params: Record<string, string>, fresh = false): Promise<Result> {
  init();
  const ds = datasets![id];
  if (!ds) throw new Error(`Fonte desconhecida: ${id}`);
  const p: Record<string, string> = {};
  for (const k of usedParams(id)) {
    const v = params[k];
    if (v == null || !SAFE.test(String(v))) throw new Error(`Parâmetro inválido: ${k}`);
    p[k] = String(v);
  }
  const args = subst(ds.args, p);
  const call = (t: string, a: unknown) => runTool(t, a as Record<string, unknown>, fresh);
  const L = loaders![id];
  let res: unknown;
  if (!L) res = rowsFromText(await call(ds.tool, args));
  else {
    const needs = /\banswer\b/.test(String(L.fn));
    const answer = needs ? await call(ds.tool, args) : undefined;
    res = await L.fn({ answer, args, call });
  }
  if (Array.isArray(res)) return { data: res, columns: res[0] ? Object.keys(res[0]) : [], cut: false };
  const r = res as { rows?: unknown[]; columns?: string[]; cut?: boolean };
  if (r && Array.isArray(r.rows)) return { data: r.rows, columns: r.columns || [], cut: !!r.cut };
  return { data: res, columns: [], cut: false };
}
