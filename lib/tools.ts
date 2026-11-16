/**
 * As ferramentas que o código do painel chama (as mesmas dos conectores do artefato original):
 *   query_dataset  → Redshift (lib/query.ts)
 *   get_values, get_spreadsheet → Google Sheets
 *   search_files   → Google Drive
 */
import { queryDataset, KNOWN_DATASETS, type QueryArgs } from './query';
import { getValues, getSpreadsheet, searchFiles } from './google';

export async function runTool(tool: string, args: Record<string, unknown>, fresh = false): Promise<unknown> {
  const a = args || {};
  switch (tool) {
    case 'query_dataset':
      if (!KNOWN_DATASETS.includes(String(a.dataset))) throw new Error(`View não permitida: ${a.dataset}`);
      return queryDataset(a as unknown as QueryArgs, fresh);
    case 'get_values':
      return getValues(a as { spreadsheetId: string; range: string }, fresh);
    case 'get_spreadsheet':
      return getSpreadsheet(a as { spreadsheetId: string }, fresh);
    case 'search_files':
      return searchFiles(a as { query: string; pageSize?: number }, fresh);
    default:
      throw new Error(`Ferramenta não permitida: ${tool}`);
  }
}
