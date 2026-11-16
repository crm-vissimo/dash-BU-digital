/* Código original do painel (Super One Page). */
(function () {
/* Período, botões, formatos e desenhos do Super One Page. */
const SOP = (window.SOP = window.SOP || {});
SOP.IDS = ['ev_kpi', 'ev_tv', 'ev_yoy', 'ev_tv_yoy', 'ev_ped', 'ev_serie', 'ev_sku', 'ev_kit', 'canais_real', 'canais_plan', 'canais_gc_real', 'canais_gc_plan', 'plano_cat', 'planos_dir','itev_kpi', 'itev_yoy', 'itev_sku', 'itev_kit', 'itev_ped', 'itev_serie', 'cl_serie', 'gc_kpi', 'gc_yoy', 'gce', 'gce_sku', 'gce_kit', 'cl_ped', 'cl_ord', 'm_ev', 'm_cl', 'm_itev', 'm_gc', 'm_cf', 'm_itgc', 'cf_ord', 'cf_serie', 'itgc', 'itgc_sku'];
SOP.FC = { '0 - 30': '#2f6fd6', '30 - 50': '#2e9a58', '50 - 100': '#c3c7ce', 'Acima de 100': '#4d535e', 'Outros': '#e0b22d' };
/* Plano de Vendas M-1 de cada mês: achado nas pastas do Drive (planos_dir); esta lista só vale enquanto a busca não volta. */
SOP.PLANOS = { '2026-10': '1JcYd-hi0CbZjB3BntL8n-VPH1ZVQZEtn4Prc50XB5cA', '2026-11': '1Gq9dh7KfKH2OXOH3wtwjsbD66J0n_In4BAYtv6nD2nM' };
SOP.plano = (mes) => { const d = dash.data('planos_dir'); if (d && d.status === 'ok') { const r = d.data.find((x) => x.mes === mes); if (r) return r.id; } return SOP.PLANOS[mes] || SOP.PLANOS['2026-11']; };
SOP.today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
SOP.range = (per) => {
  const t = SOP.today();
  const add = (s, n) => new Date(Date.parse(s + 'T00:00:00Z') + n * 864e5).toISOString().slice(0, 10);
  const ly = (s) => { const r = (+s.slice(0, 4) - 1) + s.slice(4); return r.endsWith('02-29') ? r.slice(0, 8) + '28' : r; };
  const ont = add(t, -1);
  const fim = per === 'hoje' ? t : ont;
  let ini = per === 'hoje' || per === 'ontem' ? fim : fim.slice(0, 8) + '01';
  let fimP = fim;
  if (per === 'lm') { const m1 = t.slice(0, 8) + '01'; fimP = add(m1, -1); ini = fimP.slice(0, 8) + '01'; }
  return { periodo: per, ini, fim: fimP, fim1: add(fimP, 1), ini_yoy: ly(ini), fim_yoy: ly(fimP), pago_in: per === 'hoje' ? '(0,1)' : '(1)', plano_id: SOP.plano(fimP.slice(0, 7)) };
};
{
  const cur = dash.params().periodo;
  dash.setParams(SOP.range(['hoje', 'ontem', 'mtd', 'lm'].includes(cur) ? cur : 'mtd'));
}
SOP.F = (v, f) => {
  if (v == null || (typeof v === 'number' && !isFinite(v))) return 'sem dado';
  const nf = (d) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  switch (f) {
    case 'brlc': { const a = Math.abs(v); return a >= 1e6 ? 'R$ ' + nf(2).format(v / 1e6) + ' mi' : a >= 1e3 ? 'R$ ' + nf(1).format(v / 1e3) + ' mil' : 'R$ ' + nf(0).format(v); }
    case 'brl': return 'R$ ' + nf(0).format(v);
    case 'brl2': return 'R$ ' + nf(2).format(v);
    case 'int': return nf(0).format(v);
    case 'pct': case 'apct': return nf(1).format(v * 100) + '%';
    case 'delta': return (v > 0 ? '+' : '') + nf(1).format(v * 100) + '%';
    case 'x': return nf(2).format(v) + '×';
    case 'nps': return nf(0).format(v);
    case 'k': return nf(1).format(v / 1000);
    case 'gap': return (v > 0 ? '+' : v < 0 ? '−' : '') + 'R$ ' + nf(0).format(Math.abs(v));
    default: return String(v);
  }
};
SOP.match = (rows, spec) => {
  if (!spec) return rows;
  const conds = spec.split('&').map((p) => p.split('=').map((s) => decodeURIComponent(s)));
  return rows.filter((r) => conds.every(([k, v]) => String(r[k]) === v));
};
SOP.d = (s) => s ? s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(0, 4) : '';

document.querySelectorAll('.sop-seg button').forEach((b) => b.addEventListener('click', () => dash.setParams(SOP.range(b.dataset.p))));
document.querySelectorAll('#sop-refresh').forEach((b) => b.addEventListener('click', () => { SOP.busy = true; SOP.IDS.forEach((id) => dash.refresh(id)); }));

dash.onData(() => {
  { const pp = dash.params(); if (pp.fim) { const want = SOP.plano(String(pp.fim).slice(0, 7)); if (want && want !== pp.plano_id) dash.setParams(Object.assign({}, pp, { plano_id: want })); } }
  const per = dash.params().periodo;
  document.querySelectorAll('.sop-seg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === per)));
  document.querySelectorAll('th[data-mtd]').forEach((th) => { th.hidden = per !== 'mtd' && per !== 'lm'; });
  const busy = SOP.IDS.some((id) => { const d = dash.data(id); return d.status === 'loading' || d.refreshing; });
  if (busy) SOP.busy = true; else if (SOP.busy !== false) { SOP.busy = false; SOP.stamp = new Date(); }
});

dash.draw('upd', (el) => {
  el.textContent = SOP.stamp && !SOP.busy ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(SOP.stamp) : 'carregando…';
});

dash.draw('per', (el) => {
  const d = dash.data('ev_ped');
  if (d.status !== 'ok' || !d.data[0]) { el.textContent = '—'; return; }
  const r = d.data[0];
  el.textContent = r.ini === r.fim ? SOP.d(r.ini) : SOP.d(r.ini) + ' a ' + SOP.d(r.fim);
});

dash.draw('v', (el) => {
  const d = dash.data(el.getAttribute('data-source'));
  el.classList.remove('is-ok', 'is-warn', 'is-bad', 'sop-nd');
  if (d.status !== 'ok') { el.textContent = '—'; el.classList.toggle('dash-skeleton', d.status === 'loading'); return; }
  el.classList.remove('dash-skeleton');
  const row = SOP.match(d.data, el.getAttribute('data-where'))[0];
  const v = row ? row[el.getAttribute('data-field')] : null;
  el.textContent = SOP.F(v, el.dataset.fmt);
  if (v == null) { el.classList.add('sop-nd'); return; }
  if (el.dataset.tone === 'ating') el.classList.add(v >= 1 ? 'is-ok' : v >= 0.9 ? 'is-warn' : 'is-bad');
  if (el.dataset.tone === 'delta') el.classList.add(v >= 0 ? 'is-ok' : 'is-bad');
});

dash.draw('tb', (tb) => {
  const table = tb.closest('table'); if (!table) return;
  const d = dash.data(table.getAttribute('data-source'));
  const cols = tb.dataset.cols.split(',').map((c) => c.split(':'));
  const keys = (table.getAttribute('data-row-key') || '').split(',');
  const per = dash.params().periodo;
  tb.replaceChildren();
  const msg = (t) => { const tr = document.createElement('tr'), td = document.createElement('td'); td.colSpan = cols.length; td.className = 'sop-muted'; td.textContent = t; tr.append(td); tb.append(tr); };
  if (d.status !== 'ok') { msg(d.status === 'loading' ? 'Carregando…' : d.status === 'error' ? 'Não carregou.' : '—'); return; }
  let rows = SOP.match(d.data.slice(), tb.dataset.filter);
  if (tb.dataset.top) rows = rows.sort((a, b) => (b.rec || 0) - (a.rec || 0)).slice(0, +tb.dataset.top);
  if (!rows.length) { msg('Sem dado no período.'); return; }
  const top = table.classList.contains('sop-top');
  const wr = rows.filter((r) => r.cm2_pct != null); const avg = wr.reduce((a, r) => a + (r.rec || 0), 0) ? wr.reduce((a, r) => a + r.cm2_pct * (r.rec || 0), 0) / wr.reduce((a, r) => a + (r.rec || 0), 0) : null;
  rows.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-key', keys.length === 1 ? String(r[keys[0]]) : keys.map((k) => encodeURIComponent(String(r[k]))).join(','));
    if (r.plano === 'Total' || r.nivel === 'total') tr.className = 'is-total'; else if (r.nivel === 'grupo') tr.className = 'is-grp';
    cols.forEach(([k, f]) => {
      const td = document.createElement('td');
      const v = r[k];
      if (k === 'churn' && per !== 'mtd' && per !== 'lm') td.hidden = true;
      if (f === 'faixa') { const sw = document.createElement('span'); sw.className = 'sop-sw'; sw.style.background = SOP.FC[v] || 'var(--cds-chart-muted)'; td.append(sw, document.createTextNode(String(v))); }
      else if (f === 'name') { td.className = 'sop-name'; if (top) { const w = document.createElement('span'); w.className = 'sop-nm'; const b = document.createElement('span'); b.className = 'sop-rank'; b.textContent = String(idx + 1); const tx = document.createElement('span'); tx.className = 'sop-tx'; tx.textContent = v || 'sem nome na base'; tx.title = v || ''; w.append(b, tx); td.append(w); } else td.textContent = v || 'sem nome na base'; }
      else if (top && (k === 'cm2_pct' || k === 'cm2pos_pct') && v != null) { const p = document.createElement('span'); p.className = 'sop-cm' + (v < (k === 'cm2pos_pct' ? 0.05 : 0.15) ? ' is-lo' : ' is-hi'); p.textContent = SOP.F(v, 'pct'); td.append(p); }
      else if (f === 't') { td.textContent = v == null ? 'sem dado' : String(v); if (r.nivel === 'canal') td.className = 'is-sub'; }
      else if (f === 'brlbar' || f === 'pctbar' || f === 'pctplan') {
        const mx = Math.max(...rows.map((x) => +x[k] || 0)) || 1;
        const w = document.createElement('span'); w.className = 'sop-cellbar';
        const bar = document.createElement('i'); bar.style.width = Math.max(2, Math.round(((+v || 0) / mx) * 70)) + 'px'; if (f === 'pctplan') bar.className = 'is-plan';
        w.append(document.createTextNode(SOP.F(v, f === 'brlbar' ? 'brl' : 'pct')), bar); td.append(w);
      }
      else {
        td.textContent = SOP.F(v, f);
        if (v == null) td.classList.add('sop-muted');
        else if (k === 'ating' || f === 'apct') td.classList.add(v >= 1 ? 'is-ok' : v >= 0.9 ? 'is-warn' : 'is-bad');
        else if (f === 'gap') td.classList.add(v >= 0 ? 'is-ok' : 'is-bad');
      }
      tr.append(td);
    });
    tb.append(tr);
  });
});

dash.draw('serie', (el) => {
  const d = dash.data(el.getAttribute('data-source'));
  el.replaceChildren();
  const note = (t) => { const p = document.createElement('p'); p.className = 'sop-muted'; p.textContent = t; el.append(p); };
  if (d.status !== 'ok') { if (d.status === 'error') note('Não carregou.'); else if (d.status === 'loading') el.classList.add('dash-skeleton'); return; }
  el.classList.remove('dash-skeleton');
  const rows = d.data;
  if (!rows.length) { note('Sem dado no período.'); return; }
  const gran = rows[0].gran;
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const lab = (t) => gran === 'hora' ? t.slice(11) + 'h' : gran === 'dia' ? String(+t.slice(8, 10)) : MES[+t.slice(5, 7) - 1];
  const W = Math.max(320, el.clientWidth || 700), H = 280, m = { t: 22, r: 10, b: 24, l: 86 };
  const x = d3.scaleBand().domain(rows.map((r) => r.t)).range([m.l, W - m.r]).padding(0.2);
  const ymax = d3.max(rows, (r) => Math.max(r.rec || 0, r.meta || 0, r.rec_ly || 0)) || 1;
  const y = d3.scaleLinear().domain([0, ymax * 1.08]).nice().range([H - m.b, m.t]);
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', el.getAttribute('aria-label') || 'Receita no período');
  const yt = y.ticks(5);
  svg.append('g').selectAll('line').data(yt).join('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', (v) => y(v)).attr('y2', (v) => y(v)).style('stroke', 'var(--cds-chart-grid, var(--color-border-line))');
  svg.append('g').selectAll('text').data(yt).join('text').attr('x', m.l - 6).attr('y', (v) => y(v) + 4).attr('text-anchor', 'end').text((v) => SOP.F(v, 'brlc'));
  const step = Math.max(1, Math.ceil(rows.length / Math.max(2, Math.floor((W - m.l) / 26))));
  svg.append('g').selectAll('text').data(rows.filter((_, i) => i % step === 0)).join('text').attr('x', (r) => x(r.t) + x.bandwidth() / 2).attr('y', H - 6).attr('text-anchor', 'middle').text((r) => lab(r.t));
  const tip = SOP.tip(el);
  const col = (r) => r.ating == null ? 'var(--brand)' : r.ating >= 1 ? 'var(--color-ok)' : 'var(--color-bad)';
  const txt = (r) => (gran === 'hora' ? lab(r.t) : SOP.d(r.t)) + ' · Real ' + SOP.F(r.rec, 'brl') + (r.meta != null ? ' · Meta ' + SOP.F(r.meta, 'brl') + (r.ating != null ? ' (' + SOP.F(r.ating, 'pct') + ')' : '') : '') + (r.rec_ly != null ? ' · Ano anterior ' + SOP.F(r.rec_ly, 'brl') : '');
  const real = rows.filter((r) => r.rec != null);
  svg.append('g').selectAll('rect').data(real).join('rect').attr('x', (r) => x(r.t)).attr('width', x.bandwidth()).attr('y', (r) => y(r.rec)).attr('height', (r) => y(0) - y(r.rec)).attr('rx', 2)
    .style('fill', col).on('mousemove', (ev, r) => tip(ev, txt(r))).on('mouseleave', () => tip(null));
  if (x.bandwidth() >= 16) svg.append('g').selectAll('text').data(real.filter((r) => r.ating != null)).join('text').attr('x', (r) => x(r.t) + x.bandwidth() / 2).attr('y', (r) => Math.min(y(r.rec), r.meta != null ? y(r.meta) : y(r.rec)) - 5).attr('text-anchor', 'middle')
    .style('font-size', '10px').style('font-weight', 600).style('fill', col).text((r) => Math.round(r.ating * 100) + '%');
  svg.append('g').selectAll('line').data(rows.filter((r) => r.meta != null)).join('line').attr('x1', (r) => x(r.t) - 1).attr('x2', (r) => x(r.t) + x.bandwidth() + 1).attr('y1', (r) => y(r.meta)).attr('y2', (r) => y(r.meta))
    .style('stroke', 'var(--color-fg)').style('stroke-width', 2.5).on('mousemove', (ev, r) => tip(ev, txt(r))).on('mouseleave', () => tip(null));
  const lyr = rows.filter((r) => r.rec_ly != null);
  if (lyr.length) svg.append('path').attr('d', d3.line().x((r) => x(r.t) + x.bandwidth() / 2).y((r) => y(r.rec_ly))(lyr)).style('fill', 'none').style('stroke', 'var(--brand)').style('stroke-opacity', 0.5).style('stroke-width', 2);
});

/* share de receita por faixa: plano contra realizado */
dash.draw('share', (el) => {
  const d = dash.data(el.getAttribute('data-source'));
  el.replaceChildren();
  if (d.status !== 'ok') { if (d.status === 'error') SOP.note(el, 'Não carregou.'); return; }
  const rows = d.data; if (!rows.length) { SOP.note(el, 'Sem dado no período.'); return; }
  const bars = [['Plano', 'share_meta'], ['Realizado', 'share']].filter(([, k]) => rows.some((r) => r[k] != null));
  const W = Math.max(320, el.clientWidth || 600), lw = 90, bh = 46, gap = 22, H = bars.length * (bh + gap) + 6;
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Share de receita por faixa, plano contra realizado');
  const tip = SOP.tip(el);
  bars.forEach(([name, k], i) => {
    const y0 = i * (bh + gap) + 6; let x0 = lw;
    svg.append('text').attr('x', lw - 12).attr('y', y0 + bh / 2 + 4).attr('text-anchor', 'end').style('font-size', '13px').style('fill', 'var(--color-fg)').text(name);
    rows.forEach((r) => {
      const v = +r[k] || 0, w = v * (W - lw - 4);
      svg.append('rect').attr('x', x0).attr('y', y0).attr('width', Math.max(0, w - 2)).attr('height', bh).style('fill', SOP.FC[r.faixa] || 'var(--cds-chart-muted)')
        .on('mousemove', (ev) => tip(ev, r.faixa + ' · ' + name + ' ' + SOP.F(v, 'pct') + ' · ' + SOP.F(k === 'share' ? r.receita : r.meta, 'brl'))).on('mouseleave', () => tip(null));
      if (w > 34) svg.append('text').attr('x', x0 + w / 2 - 1).attr('y', y0 + bh / 2 + 5).attr('text-anchor', 'middle').style('font-size', '13px').style('font-weight', 600).style('fill', ['50 - 100', 'Outros'].includes(r.faixa) ? '#1b1b1b' : '#fff').text(Math.round(v * 100) + '%');
      x0 += w;
    });
  });
  if (!bars.some(([n]) => n === 'Plano')) SOP.note(el, 'Plano: sem dado (Plano de Vendas do mês não mapeado ou período fora de um mês).');
});

dash.draw('pir', (el) => {
  const d = dash.data(el.getAttribute('data-source'));
  el.replaceChildren();
  const note = (t) => { const p = document.createElement('p'); p.className = 'sop-muted'; p.textContent = t; el.append(p); };
  if (d.status !== 'ok') { if (d.status === 'error') note('Não carregou.'); return; }
  const rows = d.data.slice().reverse();
  if (!rows.length) { note('Sem dado no período.'); return; }
  const W = Math.max(300, el.clientWidth || 480), rh = 30, H = rows.length * rh + 8, lw = 96, vw = 180;
  const avail = W - lw - vw - 10, cx = lw + avail / 2;
  const mx = d3.max(rows, (r) => Math.max(r.receita || 0, r.meta || 0)) || 1;
  const s = d3.scaleLinear().domain([0, mx]).range([0, avail]);
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', el.getAttribute('aria-label') || 'Pirâmide por faixa');
  const g = svg.selectAll('g').data(rows).join('g').attr('transform', (_, i) => `translate(0,${i * rh + 4})`);
  g.append('text').attr('x', 0).attr('y', rh / 2 + 1).text((r) => r.faixa);
  g.filter((r) => r.receita != null).append('rect').attr('x', (r) => cx - s(r.receita) / 2).attr('width', (r) => Math.max(1, s(r.receita))).attr('y', 3).attr('height', rh - 8).attr('rx', 3).style('fill', (r) => SOP.FC[r.faixa] || 'var(--cds-chart-muted)');
  g.filter((r) => r.meta != null).append('rect').attr('x', (r) => cx - s(r.meta) / 2).attr('width', (r) => Math.max(1, s(r.meta))).attr('y', 1).attr('height', rh - 4).attr('rx', 3).style('fill', (r) => (r.receita == null ? 'var(--cds-chart-muted)' : 'none')).style('fill-opacity', (r) => (r.receita == null ? 0.5 : 1)).style('stroke', 'var(--color-fg)').style('stroke-width', 1).style('stroke-dasharray', '3 2');
  g.append('text').attr('x', W - vw + 6).attr('y', rh / 2 + 1).text((r) => r.receita != null ? SOP.F(r.receita, 'brlc') + (r.meta != null ? ' / ' + SOP.F(r.meta, 'brlc') : '') : 'meta ' + SOP.F(r.meta, 'brlc'));
});

SOP.BU = { ev: ['E-commerce Evino', 'var(--ev)'], cl: ['Clube Evino', 'var(--ev)'], itev: ['Itaú Shop Evino', 'var(--ev)'], gc: ['E-commerce Grand Cru', 'var(--gc)'], cf: ['Confraria', 'var(--gc)'], itgc: ['Itaú Shop Grand Cru', 'var(--gc)'] };
SOP.note = (el, t) => { const p = document.createElement('p'); p.className = 'sop-muted'; p.textContent = t; el.append(p); };
SOP.tip = (el) => { const tip = document.createElement('div'); tip.className = 'sop-tip'; tip.hidden = true; el.append(tip); return (ev, text) => { if (ev == null) { tip.hidden = true; return; } tip.textContent = text; tip.hidden = false; const bx = el.getBoundingClientRect(), tw = tip.offsetWidth; tip.style.left = Math.min(Math.max(0, ev.clientX - bx.left - tw / 2), bx.width - tw) + 'px'; tip.style.top = Math.max(0, ev.clientY - bx.top - 40) + 'px'; }; };
SOP.both = () => { const a = dash.data('k_ev'), b = dash.data('k_gc'); const st = a.status !== 'ok' ? a.status : b.status; return { status: st, rows: st === 'ok' ? a.data.concat(b.data) : [] }; };

/* barra de atingimento: receita proporcional à meta (escala até o maior dos dois), marco nos 100% */
dash.draw('meter', (el) => {
  const d = dash.data(el.getAttribute('data-source'));
  el.replaceChildren();
  if (d.status !== 'ok') { if (d.status === 'error') SOP.note(el, 'Não carregou.'); return; }
  const row = SOP.match(d.data, el.getAttribute('data-where'))[0];
  const v = row ? row[el.getAttribute('data-field')] : null;
  if (v == null) { SOP.note(el, 'Atingimento: sem dado (sem meta no período).'); return; }
  const W = Math.max(240, el.clientWidth || 400), H = 40, top = Math.max(1, v);
  const x = d3.scaleLinear().domain([0, top]).range([0, W - 80]);
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Atingimento ' + SOP.F(v, 'pct'));
  svg.append('rect').attr('x', 0).attr('y', 7).attr('width', Math.max(2, x(Math.max(0, v)))).attr('height', 16).attr('rx', 3).style('fill', 'var(--brand)');
  svg.append('line').attr('x1', x(1)).attr('x2', x(1)).attr('y1', 3).attr('y2', 27).style('stroke', 'var(--color-fg)').style('stroke-width', 2);
  svg.append('text').attr('x', x(1)).attr('y', 38).attr('text-anchor', 'middle').text('meta');
  svg.append('text').attr('x', W - 72).attr('y', 20).style('font-size', '15px').style('font-weight', 600).style('fill', 'var(--color-fg)').text(SOP.F(v, 'pct'));
});

/* receita de cada BU contra a meta */
dash.draw('bus', (el) => {
  const d = SOP.both(); el.replaceChildren();
  if (d.status !== 'ok') { if (d.status === 'error') SOP.note(el, 'Não carregou.'); return; }
  const rows = ['ev', 'cl', 'itev', 'gc', 'cf', 'itgc'].map((b) => d.rows.find((r) => r.bu === b)).filter(Boolean);
  const W = Math.max(300, el.clientWidth || 520), rh = 30, lw = 140, vw = 170, H = rows.length * rh + 6;
  const mx = d3.max(rows, (r) => Math.max(r.rec || 0, r.meta || 0)) || 1;
  const x = d3.scaleLinear().domain([0, mx]).range([0, W - lw - vw]);
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Receita de cada BU contra a meta');
  const tip = SOP.tip(el);
  const g = svg.selectAll('g').data(rows).join('g').attr('transform', (_, i) => `translate(0,${i * rh + 3})`);
  g.append('text').attr('x', 0).attr('y', rh / 2 + 1).style('fill', 'var(--color-fg)').text((r) => SOP.BU[r.bu][0]);
  g.append('rect').attr('x', lw).attr('y', 6).attr('height', rh - 14).attr('rx', 3).attr('width', (r) => Math.max(2, x(r.rec || 0))).style('fill', (r) => SOP.BU[r.bu][1])
    .on('mousemove', (ev, r) => tip(ev, SOP.BU[r.bu][0] + ' · ' + SOP.F(r.rec, 'brl') + ' · meta ' + SOP.F(r.meta, 'brl'))).on('mouseleave', () => tip(null));
  g.filter((r) => r.meta != null).append('line').attr('x1', (r) => lw + x(r.meta)).attr('x2', (r) => lw + x(r.meta)).attr('y1', 2).attr('y2', rh - 4).style('stroke', 'var(--color-fg)').style('stroke-width', 2);
  g.append('text').attr('x', W - vw + 8).attr('y', rh / 2 + 1).style('fill', 'var(--color-fg)').text((r) => SOP.F(r.rec, 'brlc') + (r.ating != null ? ' · ' + SOP.F(r.ating, 'pct') : ''));
});

/* participação de cada BU na receita (rosca) */
dash.draw('mix', (el) => {
  const d = SOP.both(); el.replaceChildren();
  if (d.status !== 'ok') { if (d.status === 'error') SOP.note(el, 'Não carregou.'); return; }
  const OP = { ev: 1, cl: 0.7, itev: 0.45, gc: 1, cf: 0.7, itgc: 0.45 };
  const rows = ['ev', 'cl', 'itev', 'gc', 'cf', 'itgc'].map((b) => d.rows.find((r) => r.bu === b)).filter((r) => r && r.rec > 0);
  const tot = d3.sum(rows, (r) => r.rec) || 1;
  const W = Math.max(420, el.clientWidth || 520), H = 180, R = 78, cx = R + 10;
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Participação de cada BU na receita do grupo');
  const tip = SOP.tip(el);
  const arcs = d3.pie().sort(null).value((r) => r.rec)(rows);
  svg.append('g').attr('transform', `translate(${cx},${H / 2})`).selectAll('path').data(arcs).join('path').attr('d', d3.arc().innerRadius(R * 0.58).outerRadius(R).padAngle(0.01))
    .style('fill', (a) => SOP.BU[a.data.bu][1]).style('fill-opacity', (a) => OP[a.data.bu])
    .on('mousemove', (ev, a) => tip(ev, SOP.BU[a.data.bu][0] + ' · ' + SOP.F(a.data.rec / tot, 'pct'))).on('mouseleave', () => tip(null));
  svg.append('text').attr('x', cx).attr('y', H / 2 + 5).attr('text-anchor', 'middle').style('font-size', '14px').style('fill', 'var(--color-fg)').text(SOP.F(tot, 'brlc'));
  const lg = svg.append('g').attr('transform', `translate(${cx + R + 24},${H / 2 - rows.length * 11})`).selectAll('g').data(rows).join('g').attr('transform', (_, i) => `translate(0,${i * 22})`);
  lg.append('rect').attr('width', 10).attr('height', 10).attr('y', -9).attr('rx', 2).style('fill', (r) => SOP.BU[r.bu][1]).style('fill-opacity', (r) => OP[r.bu]);
  lg.append('text').attr('x', 16).style('fill', 'var(--color-fg)').text((r) => SOP.BU[r.bu][0] + ' · ' + SOP.F(r.rec / tot, 'pct'));
});

/* acumulado contra meta acumulada */
dash.draw('acum', (el) => {
  const d = dash.data(el.getAttribute('data-source')); el.replaceChildren();
  if (d.status !== 'ok') { if (d.status === 'error') SOP.note(el, 'Não carregou.'); return; }
  const rows = d.data; if (!rows.length) { SOP.note(el, 'Sem dado no período.'); return; }
  let a = 0, b = 0; const pts = rows.map((r) => { a += r.rec || 0; b += r.meta || 0; return { t: r.t, real: r.rec != null ? a : null, meta: r.meta != null ? b : null }; });
  const gran = rows[0].gran, MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const lab = (t) => gran === 'hora' ? t.slice(11) + 'h' : gran === 'dia' ? t.slice(8, 10) + '/' + t.slice(5, 7) : MES[+t.slice(5, 7) - 1];
  const W = Math.max(300, el.clientWidth || 520), H = 230, m = { t: 12, r: 100, b: 24, l: 86 };
  const x = d3.scalePoint().domain(pts.map((p) => p.t)).range([m.l, W - m.r]).padding(0.3);
  const y = d3.scaleLinear().domain([0, d3.max(pts, (p) => Math.max(p.real || 0, p.meta || 0)) || 1]).nice().range([H - m.b, m.t]);
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', el.getAttribute('aria-label') || 'Acumulado');
  svg.append('g').selectAll('line').data(y.ticks(4)).join('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', (v) => y(v)).attr('y2', (v) => y(v)).style('stroke', 'var(--cds-chart-grid, var(--color-border-line))');
  svg.append('g').selectAll('text').data(y.ticks(4)).join('text').attr('x', m.l - 6).attr('y', (v) => y(v) + 4).attr('text-anchor', 'end').text((v) => SOP.F(v, 'brlc'));
  const step = Math.max(1, Math.ceil(pts.length / Math.max(2, Math.floor((W - m.l - m.r) / 44))));
  svg.append('g').selectAll('text').data(pts.filter((_, i) => i % step === 0)).join('text').attr('x', (p) => x(p.t)).attr('y', H - 6).attr('text-anchor', 'middle').text((p) => lab(p.t));
  const rp = pts.filter((p) => p.real != null);
  svg.append('path').attr('d', d3.area().x((p) => x(p.t)).y0(y(0)).y1((p) => y(p.real))(rp)).style('fill', 'var(--brand)').style('fill-opacity', 0.12);
  svg.append('path').attr('d', d3.line().x((p) => x(p.t)).y((p) => y(p.real))(rp)).style('fill', 'none').style('stroke', 'var(--brand)').style('stroke-width', 2.5);
  const mp = pts.filter((p) => p.meta != null);
  if (mp.length) svg.append('path').attr('d', d3.line().x((p) => x(p.t)).y((p) => y(p.meta))(mp)).style('fill', 'none').style('stroke', 'var(--color-fg-muted)').style('stroke-width', 1.5).style('stroke-dasharray', '5 4');
  const last = rp[rp.length - 1] || pts[0];
  svg.append('circle').attr('cx', x(last.t)).attr('cy', y(last.real)).attr('r', 4).style('fill', 'var(--brand)');
  svg.append('text').attr('x', x(last.t) + 8).attr('y', y(last.real) + 4).style('fill', 'var(--color-fg)').style('font-weight', 600).text(SOP.F(last.real, 'brlc'));
  if (last.meta != null) svg.append('text').attr('x', x(last.t) + 8).attr('y', y(last.meta) + (Math.abs(y(last.meta) - y(last.real)) < 14 ? 16 : 4)).text('meta ' + SOP.F(last.meta, 'brlc'));
});

/* receita por plano contra a meta */
dash.draw('hbar', (el) => {
  const d = dash.data(el.getAttribute('data-source')); el.replaceChildren();
  if (d.status !== 'ok') { if (d.status === 'error') SOP.note(el, 'Não carregou.'); return; }
  const rows = SOP.match(d.data.slice(), el.dataset.filter).filter((r) => r.plano !== 'Total' && (r.rec || r.meta)).sort((a, b) => (b.rec || 0) - (a.rec || 0));
  if (!rows.length) { SOP.note(el, 'Sem dado no período.'); return; }
  const W = Math.max(300, el.clientWidth || 520), rh = 28, lw = 130, vw = 170, H = rows.length * rh + 6;
  const x = d3.scaleLinear().domain([0, d3.max(rows, (r) => Math.max(r.rec || 0, r.meta || 0)) || 1]).range([0, W - lw - vw]);
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', el.getAttribute('aria-label') || 'Receita por plano');
  const tip = SOP.tip(el);
  const g = svg.selectAll('g').data(rows).join('g').attr('transform', (_, i) => `translate(0,${i * rh + 3})`);
  g.append('text').attr('x', 0).attr('y', rh / 2 + 1).style('fill', 'var(--color-fg)').text((r) => r.plano);
  g.append('rect').attr('x', lw).attr('y', 5).attr('height', rh - 12).attr('rx', 3).attr('width', (r) => Math.max(2, x(r.rec || 0))).style('fill', 'var(--brand)')
    .on('mousemove', (ev, r) => tip(ev, r.plano + ' · ' + SOP.F(r.rec, 'brl') + (r.meta != null ? ' · meta ' + SOP.F(r.meta, 'brl') : ''))).on('mouseleave', () => tip(null));
  g.filter((r) => r.meta != null).append('line').attr('x1', (r) => lw + x(r.meta)).attr('x2', (r) => lw + x(r.meta)).attr('y1', 1).attr('y2', rh - 3).style('stroke', 'var(--color-fg)').style('stroke-width', 2);
  g.append('text').attr('x', W - vw + 8).attr('y', rh / 2 + 1).style('fill', 'var(--color-fg)').text((r) => SOP.F(r.rec, 'brlc') + (r.ating != null ? ' · ' + SOP.F(r.ating, 'pct') : ''));
});

/* promotores, neutros e detratores */
dash.draw('npsbar', (el) => {
  const d = dash.data(el.getAttribute('data-source')); el.replaceChildren();
  if (d.status !== 'ok') return;
  const r = SOP.match(d.data, el.getAttribute('data-where'))[0];
  if (!r || !r.respostas) { SOP.note(el, 'Sem respostas no período.'); return; }
  const parts = [['Promotores', r.promotores, 'var(--color-ok)'], ['Neutros', 1 - r.promotores - r.detratores, 'var(--cds-chart-muted, var(--color-border-line))'], ['Detratores', r.detratores, 'var(--color-bad)']];
  const W = Math.max(260, el.clientWidth || 400), H = 42;
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Promotores, neutros e detratores');
  let x0 = 0;
  parts.forEach(([n, v, c]) => { const w = Math.max(0, v) * W; svg.append('rect').attr('x', x0).attr('y', 4).attr('width', w).attr('height', 16).style('fill', c); if (w > 70) svg.append('text').attr('x', x0 + 4).attr('y', 36).text(n + ' ' + SOP.F(v, 'pct')); x0 += w; });
});

/* barras empilhadas por plano, período a período */
SOP.CFO = ['experiência', 'reserva +', 'reserva especial', 'grand reserva', 'grand selection'];
SOP.CFC = ['#e2aab7', '#c25b78', '#8e2448', '#5c1530', '#2e0b18'];
SOP.PLO = (pl) => { const t = String(pl).toLowerCase(); if (SOP.CFO.includes(t)) return SOP.CFO.indexOf(t); return /\bgo\b/.test(t) ? 0 : /fresh/.test(t) ? 3 : /black/.test(t) ? 2 : /red/.test(t) ? 1 : 9; };
SOP.PLC = (pl) => { const t = String(pl).toLowerCase(); if (SOP.CFO.includes(t)) return SOP.CFC[SOP.CFO.indexOf(t)]; return /fresh/.test(t) ? '#3fa37a' : /black/.test(t) ? '#2b2b2e' : /red/.test(t) ? '#c8102e' : /\bgo\b/.test(t) ? '#f08a24' : '#9a9aa0'; };
dash.draw('stack', (el) => {
  const d = dash.data(el.getAttribute('data-source')); el.replaceChildren();
  if (d.status !== 'ok') { if (d.status === 'error') SOP.note(el, 'Não carregou.'); return; }
  const f = el.getAttribute('data-field'), fmt = f === 'rec' ? 'brlc' : 'int';
  const rows = SOP.match(d.data.slice(), el.dataset.filter);
  if (!rows.length) { SOP.note(el, 'Sem dado no período.'); return; }
  const gran = rows[0].gran;
  const ts = [...new Set(rows.map((r) => r.t))].sort();
  const tot = new Map(); rows.forEach((r) => tot.set(r.plano, (tot.get(r.plano) || 0) + (+r[f] || 0)));
  const planos = [...tot.keys()].sort((a, b) => SOP.PLO(a) - SOP.PLO(b) || a.localeCompare(b));
  const W = Math.max(320, el.clientWidth || 600), H = 260, m = { t: 18, r: 8, b: 44, l: 70 };
  const x = d3.scaleBand().domain(ts).range([m.l, W - m.r]).padding(0.22);
  const sums = new Map(ts.map((t) => [t, rows.filter((r) => r.t === t).reduce((a, r) => a + (+r[f] || 0), 0)]));
  const y = d3.scaleLinear().domain([0, (d3.max([...sums.values()]) || 1) * 1.1]).nice().range([H - m.b, m.t]);
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', el.getAttribute('aria-label') || 'Por plano');
  const tip = SOP.tip(el);
  svg.append('g').selectAll('line').data(y.ticks(4)).join('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', (v) => y(v)).attr('y2', (v) => y(v)).style('stroke', 'var(--cds-chart-grid, var(--color-border-line))');
  svg.append('g').selectAll('text').data(y.ticks(4)).join('text').attr('x', m.l - 6).attr('y', (v) => y(v) + 4).attr('text-anchor', 'end').text((v) => SOP.F(v, fmt));
  const lab = (t) => gran === 'hora' ? t.slice(11, 13) + 'h' : t.slice(8, 10) + '/' + t.slice(5, 7);
  const step = Math.max(1, Math.ceil(ts.length / Math.max(2, Math.floor((W - m.l) / 40))));
  svg.append('g').selectAll('text').data(ts.filter((_, i) => i % step === 0)).join('text').attr('x', (t) => x(t) + x.bandwidth() / 2).attr('y', H - m.b + 14).attr('text-anchor', 'middle').text(lab);
  ts.forEach((t) => {
    let acc = 0;
    planos.forEach((pl) => {
      const r = rows.find((z) => z.t === t && z.plano === pl); const v = r ? +r[f] || 0 : 0; if (!v) return;
      svg.append('rect').attr('x', x(t)).attr('width', x.bandwidth()).attr('y', y(acc + v)).attr('height', y(acc) - y(acc + v)).style('fill', SOP.PLC(pl)).style('stroke', 'var(--color-panel)').style('stroke-width', 0.5)
        .on('mousemove', (ev) => tip(ev, lab(t) + ' · ' + pl + ' · ' + SOP.F(v, fmt === 'brlc' ? 'brl' : 'int'))).on('mouseleave', () => tip(null));
      acc += v;
    });
    if (x.bandwidth() >= 18) svg.append('text').attr('x', x(t) + x.bandwidth() / 2).attr('y', y(acc) - 4).attr('text-anchor', 'middle').style('font-size', '10px').style('fill', 'var(--color-fg)').text(fmt === 'brlc' ? SOP.F(acc, 'brlc').replace('R$ ', '') : SOP.F(acc, 'int'));
  });
  const lg = svg.append('g').attr('transform', `translate(${m.l},${H - 14})`);
  let lx = 0; planos.forEach((pl) => { const g = lg.append('g').attr('transform', `translate(${lx},0)`); g.append('rect').attr('width', 10).attr('height', 10).attr('y', -9).attr('rx', 2).style('fill', SOP.PLC(pl)); const tx = g.append('text').attr('x', 14).style('fill', 'var(--color-fg)').text(pl.replace('Evino Clube ', '')); lx += 24 + pl.replace('Evino Clube ', '').length * 6.5; });
});

/* margem e PMV no tempo: CM2 %, CM2 pós-comissão (eixo da esquerda) e PMV (eixo da direita) */
dash.draw('linhas', (el) => {
  const d = dash.data(el.getAttribute('data-source'));
  el.replaceChildren();
  if (d.status !== 'ok') { if (d.status === 'error') SOP.note(el, 'Não carregou.'); else if (d.status === 'loading') el.classList.add('dash-skeleton'); return; }
  el.classList.remove('dash-skeleton');
  const all = d.data; const rows = all.filter((r) => r.rec != null && r.rec > 0);
  if (!rows.length) { SOP.note(el, 'Sem dado no período.'); return; }
  const gran = all[0].gran;
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const lab = (t) => gran === 'hora' ? t.slice(11) + 'h' : gran === 'dia' ? String(+t.slice(8, 10)) : MES[+t.slice(5, 7) - 1];
  const W = Math.max(320, el.clientWidth || 700), H = 240, m = { t: 22, r: 62, b: 24, l: 86 };
  const x = d3.scaleBand().domain(all.map((r) => r.t)).range([m.l, W - m.r]).padding(0.2);
  const cx = (r) => x(r.t) + x.bandwidth() / 2;
  const pmx = d3.max(rows, (r) => Math.max(r.cm2_pct || 0, 0)) || 0.3, pmn = Math.min(0, d3.min(rows, (r) => r.cm2pos_pct == null ? 0 : r.cm2pos_pct));
  const y = d3.scaleLinear().domain([pmn, pmx * 1.18]).nice().range([H - m.b, m.t]);
  const vmx = d3.max(rows, (r) => r.pmv || 0) || 1;
  const y2 = d3.scaleLinear().domain([0, vmx * 1.18]).nice().range([H - m.b, m.t]);
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', el.getAttribute('aria-label') || 'Margem e PMV no período');
  const yt = y.ticks(5);
  svg.append('g').selectAll('line').data(yt).join('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', (v) => y(v)).attr('y2', (v) => y(v)).style('stroke', 'var(--cds-chart-grid, var(--color-border-line))');
  svg.append('g').selectAll('text').data(yt).join('text').attr('x', m.l - 6).attr('y', (v) => y(v) + 4).attr('text-anchor', 'end').text((v) => SOP.F(v, 'pct'));
  svg.append('g').selectAll('text').data(y2.ticks(5)).join('text').attr('x', W - m.r + 6).attr('y', (v) => y2(v) + 4).attr('text-anchor', 'start').text((v) => 'R$ ' + Math.round(v));
  const step = Math.max(1, Math.ceil(all.length / Math.max(2, Math.floor((W - m.l - m.r) / 26))));
  svg.append('g').selectAll('text').data(all.filter((_, i) => i % step === 0)).join('text').attr('x', cx).attr('y', H - 6).attr('text-anchor', 'middle').text((r) => lab(r.t));
  const S = [
    { k: 'cm2_pct', y, col: 'var(--ev)', dash: null, f: (v) => SOP.F(v, 'pct'), dy: -8 },
    { k: 'cm2pos_pct', y, col: 'var(--ev)', dash: '5 4', f: (v) => SOP.F(v, 'pct'), dy: 15 },
    { k: 'pmv', y: y2, col: 'var(--color-fg-muted)', dash: null, f: (v) => SOP.F(v, 'brl2').replace('R$ ', ''), dy: -8 },
  ];
  const lbl = x.bandwidth() >= 30;
  const used = new Map();
  const free = (r, yy) => { const u = used.get(r.t) || []; if (yy < m.t + 4 || yy > H - m.b - 2 || u.some((v) => Math.abs(v - yy) < 12)) return false; u.push(yy); used.set(r.t, u); return true; };
  S.forEach((s) => {
    const pts = rows.filter((r) => r[s.k] != null);
    svg.append('path').attr('d', d3.line().x(cx).y((r) => s.y(r[s.k]))(pts)).style('fill', 'none').style('stroke', s.col).style('stroke-width', 2).style('stroke-dasharray', s.dash);
    svg.append('g').selectAll('circle').data(pts).join('circle').attr('cx', cx).attr('cy', (r) => s.y(r[s.k])).attr('r', 3).style('fill', s.col);
    if (lbl) svg.append('g').selectAll('text').data(pts.filter((r) => free(r, s.y(r[s.k]) + s.dy))).join('text').attr('x', cx).attr('y', (r) => s.y(r[s.k]) + s.dy).attr('text-anchor', 'middle').style('font-size', '10px').style('font-weight', 600).style('fill', s.col).text((r) => s.f(r[s.k]));
  });
  const tip = SOP.tip(el);
  svg.append('g').selectAll('rect').data(rows).join('rect').attr('x', (r) => x(r.t)).attr('width', x.bandwidth()).attr('y', m.t).attr('height', H - m.b - m.t).style('fill', 'transparent')
    .on('mousemove', (ev, r) => tip(ev, (gran === 'hora' ? lab(r.t) : gran === 'dia' ? SOP.d(r.t) : lab(r.t)) + ' · CM2 ' + SOP.F(r.cm2_pct, 'pct') + ' · pós-comissão ' + SOP.F(r.cm2pos_pct, 'pct') + ' · PMV ' + SOP.F(r.pmv, 'brl2'))).on('mouseleave', () => tip(null));
});

})();
