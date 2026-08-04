/**
 * Shared UX for ASA ASM / HWSA event landing pages.
 * Features: mobile page index, .ics download, hero parallax, constellation trail, theme orbit.
 */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function downloadIcs(event) {
        const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//QUASAR Collaboration//Event Pages//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            'UID:' + (event.uid || (event.filename + '@quasarcollaboration.github.io')),
            'DTSTAMP:' + stamp,
            'DTSTART;VALUE=DATE:' + event.start,
            'DTEND;VALUE=DATE:' + event.end,
            'SUMMARY:' + escapeIcs(event.title),
            'DESCRIPTION:' + escapeIcs(event.description || ''),
            'LOCATION:' + escapeIcs(event.location || ''),
            'URL:' + escapeIcs(event.url || window.location.href),
            'END:VEVENT',
            'END:VCALENDAR',
        ];
        const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = event.filename || 'event.ics';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    function escapeIcs(value) {
        return String(value)
            .replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\n')
            .replace(/,/g, '\\,')
            .replace(/;/g, '\\;');
    }

    function initMobileIndex() {
        const nav = document.querySelector('.ev-nav');
        if (!nav) return;

        const list = nav.querySelector('ul');
        if (!list) return;

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'ev-nav-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'ev-page-index');
        toggle.innerHTML = '<span>On this page</span><span class="ev-nav-toggle-icon" aria-hidden="true"></span>';

        const panel = document.createElement('div');
        panel.id = 'ev-page-index';
        panel.className = 'ev-nav-panel';
        panel.hidden = true;

        const clone = list.cloneNode(true);
        clone.className = 'ev-nav-panel-list';
        panel.appendChild(clone);

        const bar = nav.querySelector('.container') || nav;
        list.classList.add('ev-nav-desktop');

        bar.insertBefore(toggle, list);
        bar.appendChild(panel);

        const close = () => {
            toggle.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
            document.body.classList.remove('ev-index-open');
        };

        toggle.addEventListener('click', () => {
            const open = toggle.getAttribute('aria-expanded') === 'true';
            if (open) {
                close();
            } else {
                toggle.setAttribute('aria-expanded', 'true');
                panel.hidden = false;
                document.body.classList.add('ev-index-open');
            }
        });

        panel.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', close);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }

    function initParallax() {
        if (reduceMotion) return;
        const hero = document.querySelector('.ev-hero');
        const layer = document.querySelector('.ev-parallax-layer');
        if (!hero || !layer) return;

        let ticking = false;
        const update = () => {
            const rect = hero.getBoundingClientRect();
            const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
            layer.style.transform = 'translate3d(0,' + (progress * 12).toFixed(2) + '%,0) scale(1.08)';
            ticking = false;
        };

        window.addEventListener(
            'scroll',
            () => {
                if (!ticking) {
                    ticking = true;
                    requestAnimationFrame(update);
                }
            },
            { passive: true }
        );
        update();
    }

    function initConstellation() {
        if (reduceMotion || !canHover) return;
        const hero = document.querySelector('.ev-hero');
        const canvas = document.querySelector('.ev-stars');
        if (!hero || !canvas) return;

        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let stars = [];
        let pointer = { x: -9999, y: -9999, active: false };
        let raf = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = hero.clientWidth;
            height = hero.clientHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            stars = Array.from({ length: Math.floor((width * height) / 18000) }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.4 + 0.4,
                a: Math.random() * 0.5 + 0.2,
                tw: Math.random() * Math.PI * 2,
                sp: Math.random() * 0.02 + 0.008,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            for (const s of stars) {
                s.tw += s.sp;
                const alpha = s.a * (0.65 + 0.35 * Math.sin(s.tw));
                ctx.beginPath();
                ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();

                if (pointer.active) {
                    const dx = s.x - pointer.x;
                    const dy = s.y - pointer.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(199,210,254,' + (0.22 * (1 - dist / 140)).toFixed(3) + ')';
                        ctx.lineWidth = 1;
                        ctx.moveTo(pointer.x, pointer.y);
                        ctx.lineTo(s.x, s.y);
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        };

        hero.addEventListener('pointermove', (e) => {
            const rect = hero.getBoundingClientRect();
            pointer.x = e.clientX - rect.left;
            pointer.y = e.clientY - rect.top;
            pointer.active = true;
        });
        hero.addEventListener('pointerleave', () => {
            pointer.active = false;
        });

        window.addEventListener('resize', resize);
        resize();
        raf = requestAnimationFrame(draw);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(raf);
            } else {
                raf = requestAnimationFrame(draw);
            }
        });
    }

    function initOrbit() {
        const orbit = document.querySelector('.ev-orbit');
        if (!orbit || reduceMotion) return;
        orbit.classList.add('ev-orbit-live');
    }

    function initCalendarButtons(config) {
        if (!config) return;
        document.querySelectorAll('[data-add-to-calendar]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                downloadIcs(config);
            });
        });
    }

    window.EventPage = {
        init(options) {
            options = options || {};
            initMobileIndex();
            initParallax();
            initConstellation();
            if (options.orbit) initOrbit();
            initCalendarButtons(options.calendar);
        },
    };
})();
