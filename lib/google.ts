/** Google Sheets e Drive com a conta de serviço (GOOGLE_SERVICE_ACCOUNT_JSON em base64). */
import { JWT } from 'google-auth-library';

let client: JWT | null = null;
function auth(): JWT {
  if (client) return client;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '';
  const txt = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  const sa = JSON.parse(txt);
  client = new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.readonly'],
  });
  return client;
}

async function get(url: string) {
  const { token } = await auth().getAccessToken();
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Google ${r.status}: ${JSON.stringify(body.error || body).slice(0, 300)}`);
  return body;
}

// cache curto: as planilhas mudam pouco ao longo do dia
const cache = new Map<string, { at: number; v: unknown }>();
async function cached<T>(key: string, ttl: number, fresh: boolean, run: () => Promise<T>): Promise<T> {
  const e = cache.get(key);
  if (e && Date.now() - e.at < ttl * 1000 && !fresh) return e.v as T;
  const v = await run();
  cache.set(key, { at: Date.now(), v });
  return v;
}

const ID = /^[A-Za-z0-9_-]{20,80}$/;

export function getValues(args: { spreadsheetId: string; range: string }, fresh = false) {
  if (!ID.test(args.spreadsheetId)) throw new Error('spreadsheetId inválido');
  return cached(`v|${args.spreadsheetId}|${args.range}`, 300, fresh, () =>
    get(`https://sheets.googleapis.com/v4/spreadsheets/${args.spreadsheetId}/values/${encodeURIComponent(args.range)}?valueRenderOption=FORMATTED_VALUE`),
  );
}

export function getSpreadsheet(args: { spreadsheetId: string }, fresh = false) {
  if (!ID.test(args.spreadsheetId)) throw new Error('spreadsheetId inválido');
  return cached(`s|${args.spreadsheetId}`, 3600, fresh, () =>
    get(`https://sheets.googleapis.com/v4/spreadsheets/${args.spreadsheetId}?fields=properties.title`),
  );
}

/** Busca no Drive. Aceita a sintaxe do conector (parentId = '…', title contains '…') e traduz para a API v3. */
export function searchFiles(args: { query: string; pageSize?: number }, fresh = false) {
  const qv3 =
    '(' +
    String(args.query || '')
      .replace(/parentId\s*=\s*'([^']+)'/g, "'$1' in parents")
      .replace(/\btitle\s+contains\b/g, 'name contains') +
    ') and trashed = false';
  const n = Math.min(Number(args.pageSize) || 100, 200);
  return cached(`d|${qv3}|${n}`, 900, fresh, async () => {
    const u = new URL('https://www.googleapis.com/drive/v3/files');
    u.searchParams.set('q', qv3);
    u.searchParams.set('pageSize', String(n));
    u.searchParams.set('fields', 'files(id,name,modifiedTime,trashed)');
    u.searchParams.set('supportsAllDrives', 'true');
    u.searchParams.set('includeItemsFromAllDrives', 'true');
    const body = await get(u.toString());
    return { files: (body.files || []).map((f: { id: string; name: string; modifiedTime: string; trashed: boolean }) => ({ id: f.id, title: f.name, modifiedTime: f.modifiedTime, trashed: f.trashed })) };
  });
}
