// Copia o d3 do node_modules para public/dash, de onde a página o carrega.
import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('public/dash', { recursive: true });
copyFileSync('node_modules/d3/dist/d3.min.js', 'public/dash/d3.min.js');
