/**
 * Uma fonte do painel, já calculada no servidor, para um conjunto de parâmetros (período).
 * O resultado fica no cache de dados do Next/Vercel, compartilhado entre todos os acessos e
 * instâncias: depois da primeira vez, a resposta sai do cache e é renovada em segundo plano.
 */
import { NextResponse } from 'next/server';
import { revalidateTag, unstable_cache } from 'next/cache';
import { runDataset, usedParams, datasetIds } from '@/lib/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;
export const preferredRegion = 'iad1'; // mesma região do Redshift (us-east-1)

const today = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const id = String(body?.id || '');
  if (!datasetIds().includes(id)) return NextResponse.json({ ok: false, error: 'fonte desconhecida' }, { status: 400 });
  const params: Record<string, string> = {};
  for (const k of usedParams(id)) if (body?.params?.[k] != null) params[k] = String(body.params[k]);
  const key = JSON.stringify(params);
  // Período que chega até ontem ou hoje: renova a cada 5 min (a base carrega de hora em hora). Passado: 1 h.
  const fim = String(params.fim || params.fim_yoy || '');
  const d = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
  const recent = !fim || fim >= d || fim >= today();
  const tag = `ds:${id}:${key}`;
  const cached = unstable_cache(() => runDataset(id, params), ['ds', id, key], { revalidate: recent ? 300 : 3600, tags: [tag] });
  try {
    if (body?.fresh) revalidateTag(tag);
    const r = body?.fresh ? await runDataset(id, params, true) : await cached();
    return NextResponse.json({ ok: true, ...r });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[dataset]', id, msg);
    return NextResponse.json({ ok: false, error: msg.slice(0, 500) });
  }
}
