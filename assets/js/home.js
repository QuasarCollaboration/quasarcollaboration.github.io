/* Home page interactions: research constellation + live schedule feed. */
(function () {
    'use strict';

    var THEMES = [
        { slug: 'fundamental-cosmology-dark-universe', name: 'Fundamental Cosmology & The Dark Universe', short: 'Cosmology', c: '#818cf8', x: 90, y: 90,
          tags: ['Dark Energy', 'Hubble Tension', 'Testing Gravity'],
          blurb: 'Mapping the expansion of the universe to solve the mysteries of dark energy, dark matter, and the Hubble Tension.' },
        { slug: 'galaxy-evolution-formation', name: 'Galaxy Evolution & Formation', short: 'Galaxies', c: '#c084fc', x: 250, y: 60,
          tags: ['Galaxy Evolution', 'IFS', 'Stellar Populations'],
          blurb: 'Investigating how galaxies grow and transform over cosmic time, from the first clumpy seeds to today’s diverse morphologies.' },
        { slug: 'active-galactic-nuclei', name: 'Active Galactic Nuclei', short: 'AGN', c: '#f472b6', x: 430, y: 85,
          tags: ['AGN', 'Quasar Feedback', 'Radio Galaxies'],
          blurb: 'Examining the life cycles of supermassive black holes and how the energy they release can “quench” star formation in their host galaxies.' },
        { slug: 'multi-wavelength-survey-science-data-analytics', name: 'Multi-Wavelength Survey Science & Data Analytics', short: 'Surveys & Data', c: '#38bdf8', x: 540, y: 170,
          tags: ['Big Data', 'Machine Learning', 'ASKAP'],
          blurb: 'Processing and analysing massive datasets from radio to X-ray to build a high-resolution history of the baryonic universe.' },
        { slug: 'dense-stellar-systems-high-energy-astrophysics', name: 'Dense Stellar Systems & High-Energy Astrophysics', short: 'Dense Systems', c: '#fb923c', x: 440, y: 270,
          tags: ['Black Holes', 'Gravitational Waves', 'N-Body Sims'],
          blurb: 'Using high-performance simulations to model the interactions of stars in clusters and the formation of the universe’s most exotic compact objects.' },
        { slug: 'stellar-astrophysics-space-weather', name: 'Stellar Astrophysics & Space Weather', short: 'Stars & Space Weather', c: '#facc15', x: 300, y: 195,
          tags: ['Asteroseismology', 'Space Weather', 'Stellar Magnetism'],
          blurb: 'Investigating the “internal quakes” and magnetic activity of stars to understand how they influence the planetary systems around them.' },
        { slug: 'exoplanetary-science-habitability', name: 'Exoplanetary Science & Habitability', short: 'Exoplanets', c: '#34d399', x: 150, y: 215,
          tags: ['Exoplanets', 'Astrobiology', 'Habitability'],
          blurb: 'Detecting new worlds beyond our solar system and assessing their potential for life by studying their orbits and atmospheres.' },
        { slug: 'solar-system-orbital-dynamics', name: 'Solar System & Orbital Dynamics', short: 'Solar System', c: '#2dd4bf', x: 300, y: 335,
          tags: ['Asteroids', 'Dynamics', 'Comets'],
          blurb: 'Modelling the origins and stability of planetary systems, including the evolution of small bodies like asteroids and comets.' },
        { slug: 'cultural-indigenous-astronomy', name: 'Cultural & Indigenous Astronomy', short: 'Indigenous Astronomy', c: '#fda4af', x: 85, y: 335,
          tags: ['Indigenous Astronomy', 'Science Education'],
          blurb: 'Integrating First Nations celestial knowledge into modern astrophysics research and science education frameworks.' }
    ];
    // Constellation edges (indices into THEMES)
    var EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [5, 6], [6, 0], [5, 7], [7, 8], [8, 6]];

    var NS = 'http://www.w3.org/2000/svg';
    function el(name, attrs, parent) {
        var n = document.createElementNS(NS, name);
        for (var k in attrs) n.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(n);
        return n;
    }
    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function initConstellation() {
        var root = document.getElementById('rc-map');
        var detail = document.getElementById('rc-detail');
        if (!root || !detail) return;

        var base = root.getAttribute('data-base') || '';
        var svg = el('svg', { viewBox: '0 0 640 400', role: 'group', 'aria-label': 'Research themes constellation' }, root);

        // Deterministic background stars
        var seed = 7;
        function rand() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
        for (var i = 0; i < 70; i++) {
            el('circle', { cx: rand() * 640, cy: rand() * 400, r: 0.4 + rand() * 1.1, fill: '#c7d2fe', opacity: 0.15 + rand() * 0.4 }, svg);
        }

        var links = EDGES.map(function (e) {
            var a = THEMES[e[0]], b = THEMES[e[1]];
            return el('line', { class: 'rc-link', x1: a.x, y1: a.y, x2: b.x, y2: b.y }, svg);
        });

        var current = -1, timer = null;
        function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

        var nodes = THEMES.map(function (t, i) {
            var g = el('g', { class: 'rc-node', tabindex: 0, role: 'button', 'aria-label': t.name, style: '--c:' + t.c }, svg);
            el('circle', { class: 'rc-halo', cx: t.x, cy: t.y, r: 16 }, g);
            el('circle', { class: 'rc-ring', cx: t.x, cy: t.y, r: 10 }, g);
            el('circle', { class: 'rc-core', cx: t.x, cy: t.y, r: 4.5 }, g);
            var left = t.x > 320;
            var txt = el('text', { class: 'rc-label', x: t.x + (left ? -16 : 16), y: t.y + 4, 'text-anchor': left ? 'end' : 'start' }, g);
            txt.textContent = t.short;
            g.addEventListener('click', function () { select(i, true); });
            g.addEventListener('mouseenter', function () { select(i, true); });
            g.addEventListener('keydown', function (ev) {
                if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(i, true); }
            });
            return g;
        });

        function select(i, user) {
            if (user) stopAuto();
            if (i === current) return;
            current = i;
            var t = THEMES[i];
            nodes.forEach(function (n, k) { n.classList.toggle('is-active', k === i); });
            EDGES.forEach(function (e, k) { links[k].classList.toggle('is-lit', e[0] === i || e[1] === i); });
            detail.style.setProperty('--c', t.c);
            detail.innerHTML =
                '<div class="rc-detail-inner">' +
                '<div class="rc-count">Theme ' + (i + 1) + ' of ' + THEMES.length + '</div>' +
                '<h4 class="rc-title">' + esc(t.name) + '</h4>' +
                '<p class="rc-blurb">' + esc(t.blurb) + '</p>' +
                '<div class="rc-tags">' + t.tags.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' +
                '<div class="rc-actions">' +
                '<a class="home-btn" href="' + base + 'pages/research/' + t.slug + '.html">Explore theme &rarr;</a>' +
                '<a class="home-btn home-btn--ghost" href="' + base + 'pages/research.html">All themes</a>' +
                '</div></div>';
        }

        select(0, false);
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduce) {
            timer = setInterval(function () {
                if (!document.hidden) select((current + 1) % THEMES.length, false);
            }, 5500);
        }
    }

    /* Schedule: read the real schedule page so there is a single source of truth. */
    var MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

    function initSchedule() {
        var list = document.getElementById('sched-list');
        if (!list) return;
        var base = list.getAttribute('data-base') || '';
        var openEl = document.getElementById('sched-open');

        function fail() {
            list.innerHTML = '<p style="color:var(--text-secondary);padding:1rem">See the full programme on the <a style="color:var(--accent-primary);font-weight:600" href="' + base + 'pages/schedule.html">schedule page</a>.</p>';
        }

        fetch(base + 'pages/schedule.html').then(function (r) {
            if (!r.ok) throw new Error('schedule fetch failed');
            return r.text();
        }).then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var cards = Array.prototype.slice.call(doc.querySelectorAll('.schedule-year-panel > .glass-panel'));
            var cutoff = new Date(); cutoff.setHours(0, 0, 0, 0);
            var events = [], slots = [], open = 0;

            cards.forEach(function (c) {
                var h3 = c.querySelector('h3');
                var dateBox = c.children[0];
                if (!h3 || !dateBox) return;
                var spans = dateBox.querySelectorAll('span');
                if (spans.length < 3) return;
                var d = new Date(+spans[2].textContent, MONTHS[spans[1].textContent.trim().toLowerCase().slice(0, 3)], +spans[0].textContent);
                if (isNaN(d) || d < cutoff) return;
                var title = h3.textContent.trim();
                if (/slot available/i.test(title)) { open++; slots.push(d); return; }
                var badges = c.querySelectorAll('.flex-wrap span');
                var spk = c.querySelector('.schedule-speaker');
                events.push({
                    d: d, title: title,
                    kind: badges[0] ? badges[0].textContent.trim() : '',
                    where: badges[1] ? badges[1].textContent.trim() : '',
                    who: spk ? spk.textContent.trim() : ''
                });
            });

            events.sort(function (a, b) { return a.d - b.d; });
            slots.sort(function (a, b) { return a - b; });
            if (openEl) openEl.textContent = open;
            if (!events.length && !slots.length) {
                list.innerHTML = '<p style="color:var(--text-secondary);padding:1rem">No talks are booked just yet — check back soon or claim a slot.</p>';
                return;
            }
            var rows = events.slice(0, 4).map(function (e, i) {
                var mon = e.d.toLocaleString('en-AU', { month: 'short' });
                return '<a class="sched-item' + (i === 0 ? ' is-next' : '') + '" href="' + base + 'pages/schedule.html">' +
                    '<div class="sched-date"><b>' + e.d.getDate() + '</b><small>' + mon + '</small></div>' +
                    '<div><div class="sched-meta">' + esc(e.kind) + (e.where ? ' · ' + esc(e.where) : '') +
                    (i === 0 ? '<span class="sched-next-pill">NEXT</span>' : '') + '</div>' +
                    '<div class="sched-title">' + esc(e.title) + '</div>' +
                    (e.who ? '<div class="sched-who">' + esc(e.who) + '</div>' : '') + '</div></a>';
            });
            slots.slice(0, 4 - rows.length).forEach(function (d) {
                rows.push('<a class="sched-item is-open" href="' + base + 'pages/contact.html">' +
                    '<div class="sched-date"><b>' + d.getDate() + '</b><small>' + d.toLocaleString('en-AU', { month: 'short' }) + '</small></div>' +
                    '<div><div class="sched-meta">Open slot</div><div class="sched-title">Your talk could be here</div>' +
                    '<div class="sched-who">Get in touch to claim this date</div></div></a>');
            });
            list.innerHTML = rows.join('');
        }).catch(fail);
    }

    function init() { initConstellation(); initSchedule(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
