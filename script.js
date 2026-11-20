(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function safe(fn) { try { return fn(); } catch (e) { return null; } }

  // Theme toggle
  var saved = safe(function () { return localStorage.getItem('theme'); });
  if (saved) root.setAttribute('data-theme', saved);
  document.getElementById('themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    safe(function () { localStorage.setItem('theme', next); });
  });

  // Mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Count-up stats
  function runCount(el) {
    var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  } else { counters.forEach(runCount); }

  // Chat demo typing
  var body = document.getElementById('chatBody');
  var script = [
    { who: 'user', text: 'Can you help me plan a 3-day trip to Kyoto?' },
    { who: 'ai', text: 'Of course! Day 1: Fushimi Inari at sunrise, then Gion for dinner. Day 2: Arashiyama bamboo grove and Tenryu-ji. Day 3: Kinkaku-ji and a tea ceremony. Want a budget or food tips next?' }
  ];
  function addMsg(m, animate, done) {
    var d = document.createElement('div');
    d.className = 'msg ' + m.who;
    body.appendChild(d);
    if (!animate) { d.textContent = m.text; return done && done(); }
    d.classList.add('caret');
    var i = 0;
    (function tick() {
      d.textContent = m.text.slice(0, ++i);
      if (i < m.text.length) setTimeout(tick, m.who === 'ai' ? 18 : 28);
      else { d.classList.remove('caret'); setTimeout(done, 700); }
    })();
  }
  function play(n) {
    if (n >= script.length) return;
    addMsg(script[n], true, function () { play(n + 1); });
  }
  if (reduce) { script.forEach(function (m) { addMsg(m, false); }); }
  else if ('IntersectionObserver' in window) {
    var started = false;
    new IntersectionObserver(function (en, ob) {
      if (en[0].isIntersecting && !started) { started = true; ob.disconnect(); play(0); }
    }, { threshold: 0.3 }).observe(document.querySelector('.chat'));
  } else { play(0); }

  // Pricing toggle
  var prices = document.querySelectorAll('.price b');
  document.querySelectorAll('.billing button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.billing button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var key = b.dataset.period === 'yearly' ? 'y' : 'm';
      prices.forEach(function (p) { p.textContent = '$' + p.dataset[key]; });
    });
  });

  // FAQ accordion
  document.querySelectorAll('.qa button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var qa = btn.closest('.qa');
      var open = qa.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });
})();
