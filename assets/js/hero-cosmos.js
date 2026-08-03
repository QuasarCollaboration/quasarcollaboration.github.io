// Hero Cosmos: builds an individually-twinkling starfield for the homepage
// hero. Each star twinkles gently on its own schedule, and a randomized
// handful periodically sparkle into a brighter 4-point flare. Hovering the
// hero densifies the sparkles; a light cursor parallax drifts the field.
// No-ops safely if the hero markup isn't present (i.e. on any other page).
(function () {
    'use strict';

    const hero = document.getElementById('hero');
    const starfield = document.getElementById('hero-starfield');
    if (!hero || !starfield) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const STAR_COUNT = 150;
    const stars = [];

    function randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < STAR_COUNT; i++) {
        const star = document.createElement('span');
        star.className = 'hero-star';

        const size = randomBetween(1.4, 3.4);
        const baseOpacity = randomBetween(0.15, 0.45);
        const peakOpacity = Math.min(0.85, baseOpacity + randomBetween(0.2, 0.4));

        star.style.setProperty('--x', randomBetween(0, 100).toFixed(2) + '%');
        star.style.setProperty('--y', randomBetween(0, 100).toFixed(2) + '%');
        star.style.setProperty('--size', size.toFixed(2) + 'px');
        star.style.setProperty('--base-opacity', baseOpacity.toFixed(2));
        star.style.setProperty('--peak-opacity', peakOpacity.toFixed(2));
        star.style.setProperty('--duration', randomBetween(4, 9).toFixed(2) + 's');
        star.style.setProperty('--delay', randomBetween(0, 8).toFixed(2) + 's');
        star.dataset.size = String(size);

        fragment.appendChild(star);
        stars.push(star);
    }
    starfield.appendChild(fragment);

    // Ambient sparkles always run (including under prefers-reduced-motion).
    // Reduced motion only skips continuous twinkle + parallax; occasional
    // flares are opacity-led via CSS and remain gentle.
    let flareTimer = null;
    const flareTimeouts = new Set();
    let hovering = false;

    function sparkleCount() {
        if (prefersReducedMotion) {
            return Math.max(2, Math.round(stars.length * 0.03));
        }
        const fraction = hovering ? randomBetween(0.07, 0.11) : randomBetween(0.04, 0.07);
        return Math.max(4, Math.round(stars.length * fraction));
    }

    function sparkleIntervalMs() {
        if (prefersReducedMotion) return 1800;
        return hovering ? 650 : 1100;
    }

    function pickSparkleStars(count) {
        // Prefer slightly larger stars so the 4-point flare reads clearly.
        const ranked = stars.slice().sort((a, b) => {
            return (parseFloat(b.dataset.size) || 0) - (parseFloat(a.dataset.size) || 0);
        });
        const preferred = ranked.slice(0, Math.ceil(stars.length * 0.45));
        const pool = preferred.slice();
        const picked = [];
        for (let i = 0; i < count && pool.length; i++) {
            const index = Math.floor(Math.random() * pool.length);
            picked.push(pool.splice(index, 1)[0]);
        }
        return picked;
    }

    function flareRandomStars() {
        const chosen = pickSparkleStars(sparkleCount());
        chosen.forEach((star) => {
            if (star.classList.contains('is-flare')) return;
            star.classList.remove('is-flare');
            // Retrigger CSS animation if this star sparkled recently.
            void star.offsetWidth;
            star.classList.add('is-flare');
            const holdTime = prefersReducedMotion ? 900 : randomBetween(850, 1200);
            const timeoutId = setTimeout(() => {
                star.classList.remove('is-flare');
                flareTimeouts.delete(timeoutId);
            }, holdTime);
            flareTimeouts.add(timeoutId);
        });
    }

    function restartFlareLoop() {
        if (flareTimer) {
            clearInterval(flareTimer);
            flareTimer = null;
        }
        flareRandomStars();
        flareTimer = setInterval(flareRandomStars, sparkleIntervalMs());
    }

    restartFlareLoop();

    hero.addEventListener('mouseenter', function () {
        hovering = true;
        restartFlareLoop();
    });

    hero.addEventListener('mouseleave', function () {
        hovering = false;
        restartFlareLoop();
    });

    if (prefersReducedMotion) return;

    // Subtle cursor parallax for the whole starfield.
    const MAX_OFFSET = 16;
    let rafId = null;
    let pendingMx = 0;
    let pendingMy = 0;

    function applyOffset() {
        rafId = null;
        hero.style.setProperty('--mx', pendingMx.toFixed(2) + 'px');
        hero.style.setProperty('--my', pendingMy.toFixed(2) + 'px');
    }

    function scheduleUpdate(mx, my) {
        pendingMx = mx;
        pendingMy = my;
        if (rafId === null) {
            rafId = requestAnimationFrame(applyOffset);
        }
    }

    hero.addEventListener('mousemove', function (event) {
        const rect = hero.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        scheduleUpdate(relX * MAX_OFFSET * 2, relY * MAX_OFFSET * 2);
    });

    hero.addEventListener('mouseleave', function () {
        scheduleUpdate(0, 0);
    });
})();
