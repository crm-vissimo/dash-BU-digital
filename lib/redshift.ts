import { Pool, types } from 'pg';

// Números do Redshift chegam como texto no driver: converte para número.
types.setTypeParser(1700, (v) => (v == null ? null : Number(v))); // numeric
types.setTypeParser(20, (v) => (v == null ? null : Number(v))); // int8
types.setTypeParser(701, (v) => (v == null ? null : Number(v))); // float8
// Datas ficam como texto, no horário em que estão na base (Brasília), no formato ISO sem fuso.
types.setTypeParser(1114, (v) => (v == null ? null : v.replace(' ', 'T'))); // timestamp
types.setTypeParser(1082, (v) => v); // date

const g = globalThis as unknown as { __rsPool?: Pool };

export function pool(): Pool {
  if (!g.__rsPool) {
    g.__rsPool = new Pool({
      host: process.env.REDSHIFT_HOST,
      port: Number(process.env.REDSHIFT_PORT || 5439),
      database: process.env.REDSHIFT_DATABASE,
      user: process.env.REDSHIFT_USER,
      password: process.env.REDSHIFT_PASSWORD,
      ssl: { rejectUnauthorized: false },
      max: Number(process.env.REDSHIFT_POOL_MAX || 12),
      idleTimeoutMillis: 60_000,
      // 0 = espera na fila do pool sem estourar (o painel dispara muitas consultas de uma vez)
      connectionTimeoutMillis: 0,
      statement_timeout: 120_000,
    });
  }
  return g.__rsPool;
}

export const SCHEMA = process.env.REDSHIFT_SCHEMA || 'dora_red_aggregations';

export async function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const t0 = Date.now();
  const client = await pool().connect();
  const t1 = Date.now();
  try {
    const r = await client.query(sql, params);
    if (process.env.REDSHIFT_LOG === '1')
      console.log(`[sql] fila ${t1 - t0}ms · banco ${Date.now() - t1}ms · ${r.rows.length} linhas · ${sql.replace(/\s+/g, ' ').slice(0, 160)} ${JSON.stringify(params).slice(0, 120)}`);
    return r.rows as T[];
  } finally {
    client.release();
  }
}
