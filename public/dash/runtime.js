/*
 * Runtime do painel: recria a API `dash` do dashboard original do claude.ai
 * (dash.data, dash.loader, dash.calc, dash.draw, dash.onData, dash.params…)
 * para que data.js e draw.js rodem sem mudanças. As fontes (loaders de data.js) rodam
 * no servidor (/api/dataset); aqui ficam os cálculos e os desenhos.
 */
(function () {
  'use strict';
  var V = '4';
  var S = { datasets: {}, params: { periodo: 'mtd' }, loaders: {}, calcs: {}, draws: {}, listeners: [], state: {}, memo: {}, ver: 0, t0: Date.now() };
  window.__dash = S; // para inspeção no console

  /* ---------- parâmetros ---------- */
  function used(args) {
    var out = [], re = /\{\{(\w+)\}\}/g, s = JSON.stringify(args), m;
    while ((m = re.exec(s))) if (out.indexOf(m[1]) < 0) out.push(m[1]);
    return out;
  }

  /* ---------- fontes (calculadas no servidor: /api/dataset) ---------- */
  function keyOf(id) {
    var u = used(S.datasets[id].args);
    return { missing: u.some(function (k) { return S.params[k] == null; }), key: JSON.stringify(u.map(function (k) { return S.params[k]; })) };
  }
  function ensure(id) {
    var k = keyOf(id), st = S.state[id];
    if (st && st.key === k.key) return st;
    if (k.missing) return { status: 'loading', data: [], columns: [] };
    load(id, k.key, false);
    return S.state[id];
  }
  function load(id, key, fresh) {
    var prev = S.state[id], token = {};
    var keep = fresh && prev && prev.status === 'ok' && prev.key === key;
    S.state[id] = { status: keep ? 'ok' : 'loading', data: keep ? prev.data : [], columns: keep ? prev.columns : [], refreshing: !!keep, key: key, token: token };
    changed();
    var p = {};
    used(S.datasets[id].args).forEach(function (k) { p[k] = S.params[k]; });
    fetch('/api/dataset', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: id, params: p, fresh: !!fresh }) })
      .then(function (r) { if (r.status === 401) { location.href = '/login'; throw new Error('sessão expirada'); } return r.json(); })
      .then(function (j) {
        if (S.state[id].token !== token) return;
        if (!j.ok) throw new Error(j.error || 'erro');
        S.state[id] = { status: 'ok', data: j.data, columns: j.columns || [], truncated: !!j.cut, refreshing: false, key: key, token: token };
        changed();
      })
      .catch(function (e) {
        if (S.state[id].token !== token) return;
        console.warn('[dash] ' + id + ':', e);
        S.state[id] = { status: 'error', data: [], columns: [], message: String((e && e.message) || e), refreshing: false, key: key, token: token };
        changed();
      });
  }

  /* ---------- cálculos ---------- */
  var computing = {};
  function calc(id) {
    var c = S.calcs[id], m = S.memo[id];
    if (m && m.ver === S.ver) return m.res;
    if (computing[id]) return { status: 'error', data: null, message: 'ciclo em ' + id };
    computing[id] = true;
    var res;
    try {
      var ins = c.inputs.map(function (i) { return dash.data(i); });
      var bad = ins.filter(function (x) { return x.status !== 'ok'; })[0];
      if (bad) res = { status: bad.status === 'loading' ? 'loading' : 'error', data: null, message: bad.message };
      else {
        var vals = ins.map(function (x, i) { return S.calcs[c.inputs[i]] ? x.data : Array.isArray(x.data) ? x.data : []; });
        var v = c.fn.apply(null, vals);
        res = { status: 'ok', data: v, columns: Array.isArray(v) && v[0] ? Object.keys(v[0]) : [], refreshing: ins.some(function (x) { return x.refreshing; }), truncated: false };
      }
    } catch (e) {
      console.error('[dash] cálculo ' + id + ':', e);
      res = { status: 'error', data: null, message: String((e && e.message) || e) };
    }
    computing[id] = false;
    S.memo[id] = { ver: S.ver, res: res };
    return res;
  }

  /* ---------- desenho ---------- */
  var raf = null;
  function changed() { S.ver++; if (!raf) raf = requestAnimationFrame(render); }
  function render() {
    raf = null;
    S.listeners.forEach(function (fn) { try { fn(); } catch (e) { console.error('[dash] onData:', e); } });
    Object.keys(S.draws).forEach(function (name) {
      document.querySelectorAll('[data-draw="' + name + '"]').forEach(function (el) {
        try { S.draws[name](el); } catch (e) { console.error('[dash] draw ' + name + ':', e); }
      });
    });
    document.querySelectorAll('[data-source]').forEach(function (el) {
      var ids = (el.getAttribute('data-source') || '').split(/\s+/).filter(Boolean);
      var r = ids.some(function (i) { var st = S.state[i]; return st && st.refreshing; });
      if (r) el.setAttribute('data-dash-source-state', 'refreshing'); else el.removeAttribute('data-dash-source-state');
    });
  }

  var dash = (window.dash = {
    data: function (id) {
      if (S.calcs[id]) return calc(id);
      if (S.datasets[id]) return ensure(id);
      return { status: 'missing', data: [], columns: [] };
    },
    loader: function (id, def) { S.loaders[id] = def; },
    calc: function (id, def) { S.calcs[id] = def; },
    draw: function (name, fn) { S.draws[name] = fn; changed(); },
    onData: function (fn) { S.listeners.push(fn); try { fn(); } catch (e) { console.error('[dash] onData:', e); } },
    params: function () { return Object.assign({}, S.params); },
    setParams: function (p) {
      var diff = Object.keys(p).some(function (k) { return S.params[k] !== p[k]; });
      if (!diff) return;
      S.params = Object.assign({}, S.params, p);
      changed();
    },
    resetParams: function () { S.params = { periodo: 'mtd' }; changed(); },
    refresh: function (id) {
      if (!S.datasets[id]) return;
      var k = keyOf(id);
      if (!k.missing) load(id, k.key, true);
    },
    setLink: function () {},
    colors: ['#e0182d', '#8e2448', '#2f6fd6', '#2e9a58', '#e0b22d', '#4d535e'],
  });

  var rz = null;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(changed, 150); });

  function script(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src + '?v=' + V;
      s.onload = res;
      s.onerror = function () { rej(new Error('não carregou ' + src)); };
      document.body.appendChild(s);
    });
  }

  Promise.all([
    fetch('/dash/datasets.json?v=' + V).then(function (r) { return r.json(); }),
    fetch('/dash/page.html?v=' + V).then(function (r) { return r.text(); }),
    window.d3 ? Promise.resolve() : script('/dash/d3.min.js'),
  ])
    .then(function (x) {
      S.datasets = x[0];
      document.getElementById('dash-root').innerHTML = x[1];
      return script('/dash/data.js').then(function () { return script('/dash/draw.js'); });
    })
    .then(changed)
    .catch(function (e) {
      document.getElementById('dash-root').textContent = 'Não foi possível abrir o painel: ' + e.message;
    });
})();
