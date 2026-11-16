# Super One Page · BU Digital

Versão em código (Next.js, para a Vercel) do dashboard "Super One Page · BU Digital" que vivia como
artefato no claude.ai. Mostra receita, metas e KPIs das seis BUs digitais: e-commerce Evino, Clube Evino,
Itaú Shop Evino, e-commerce Grand Cru, Confraria e Itaú Shop Grand Cru.

## Como funciona

```
navegador                                  servidor (Next.js na Vercel, região iad1 = us-east-1)
public/dash/page.html   (layout original)
public/dash/draw.js     (gráficos, d3)     /api/dataset ── roda os loaders de public/dash/data.js
public/dash/data.js     (só os cálculos)        │           ├─ query_dataset → Redshift (lib/query.ts)
public/dash/runtime.js  (API dash)  ◄───────────┘           └─ get_values / search_files → Google
```

- **`data.js` e `draw.js` são o código do artefato.** Há uma correção: o gráfico hora a hora por marca
  usava uma variável inexistente e quebrava em Hoje/Ontem.
- **As fontes rodam no servidor** (`lib/engine.ts`). Cada uma das 41 fontes é um pedido a `/api/dataset`,
  e o resultado final fica no **cache de dados da Vercel**, compartilhado por todos os acessos.
  Validade: 5 min para períodos recentes e 1 h para o passado. Quando vence, quem abre recebe o último
  resultado na hora, e a renovação roda em segundo plano.
- **`lib/query.ts`** traduz `query_dataset` (formato PostgREST da API "Dados Víssimo") para SQL no Redshift:

  | View da API | Redshift (`REDSHIFT_SCHEMA`, padrão `dora_red_aggregations`) |
  |---|---|
  | `vw_ev_fact_order_item` | `ev_fact_order_item` |
  | `vw_gc_fact_order_item` | `gc_fact_order_item` + `vw_gc_assinatura_plano` (plano por `recurrency_id`) |
  | `vw_ev_dim_product` | `ev_dim_product` |
  | `vw_ev_dim_product_bundle` | `vw_ev_dim_product_bundle` |
  | `vw_ev_grupo_de_produto` | `vw_carga_ev_grupo_de_produto` |
  | `vw_gc_dim_product` | `gc_dim_product` |
  | `vw_gc_dim_stock` | `vw_carga_gc_dim_stock` |
  | `vw_etl_load_status` | horário do pedido mais recente de cada tabela de pedidos |

  As chamadas hora a hora ou dia a dia do código original viram uma consulta só (o dia por hora, o mês
  por dia), fatiada no servidor.
- **Tempos medidos localmente:** sem cache, MTD leva cerca de 9 s e Hoje cerca de 15 s. Com cache, abre em menos de 1 s.
- **Sem login:** quem tiver o link vê o painel. Para restringir, use a Deployment Protection da Vercel.
- `REDSHIFT_LOG=1` registra no log o tempo de cada SQL (fila do pool e banco).

## Rodar local

```bash
npm install
cp .env.example .env.local   # preencha
npm run dev
```

## Subir na Vercel

1. Suba a pasta para um repositório GitHub e importe na Vercel (framework: Next.js; nada a configurar no build).
2. Em **Settings → Environment Variables**, cadastre as variáveis de `.env.example`
   (`REDSHIFT_*`, `GOOGLE_SERVICE_ACCOUNT_JSON`).
3. Compartilhe como **Leitor** com a conta de serviço (o `client_email` do JSON) a planilha
   Grand Cru | Monitoramento de Canais (`1Q15kLEU8dTi8da_kbkijBsZ1eMLjOrJF5rn_m7Emj3c`).
   A Diarização BU Digital, a de Canais da Evino e as pastas do Plano de Vendas já funcionam.
4. O Redshift precisa aceitar conexões vindas da Vercel (IPs dinâmicos): confira o security group.

## Mudar alguma coisa

- Layout e textos: `public/dash/page.html`
- Regras e cálculos: `public/dash/data.js` (o servidor também executa este arquivo; republique após mudar)
- Gráficos: `public/dash/draw.js`
- De onde vem cada fonte (view, filtros, planilha): `public/dash/datasets.json`
- Ao mudar arquivos em `public/dash`, aumente `V` em `public/dash/runtime.js` para furar o cache do navegador.
