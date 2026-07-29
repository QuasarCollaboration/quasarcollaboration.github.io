// Hero Cosmos: builds an individually-twinkling starfield for the homepage
// hero. Each star twinkles gently on its own schedule, and while the
// visitor's cursor is over the hero, a randomized handful of stars flare
// noticeably brighter every so often. Also drives a very light cursor-based
// parallax on the whole field. No-ops safely if the hero markup isn't
// present (i.e. on any other page).
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

        fragment.appendChild(star);
        stars.push(star);
    }
    starfield.appendChild(fragment);

    if (prefersReducedMotion) return;

    // While hovering, repeatedly light up a different random selection of
    // stars for a brief "twinkle flare" — never all of them at once.
    let flareTimer = null;
    const flareTimeouts = new Set();

    function flareRandomStars() {
        const count = Math.max(3, Math.round(stars.length * randomBetween(0.05, 0.09)));
        const pool = stars.slice();
        for (let i = 0; i < count && pool.length; i++) {
            const index = Math.floor(Math.random() * pool.length);
            const star = pool.splice(index, 1)[0];
            star.classList.add('is-flare');
            const holdTime = randomBetween(750, 1150);
            const timeoutId = setTimeout(() => {
                star.classList.remove('is-flare');
                flareTimeouts.delete(timeoutId);
            }, holdTime);
            flareTimeouts.add(timeoutId);
        }
    }

    function stopFlaring() {
        if (flareTimer) {
            clearInterval(flareTimer);
            flareTimer = null;
        }
        // Stop immediately rather than letting already-scheduled flares
        // linger and fade out on their own — hovering away should visibly
        // settle the starfield right away.
        flareTimeouts.forEach((id) => clearTimeout(id));
        flareTimeouts.clear();
        stars.forEach((star) => star.classList.remove('is-flare'));
    }

    hero.addEventListener('mouseenter', function () {
        stopFlaring();
        flareRandomStars();
        flareTimer = setInterval(flareRandomStars, 750);
    });

    hero.addEventListener('mouseleave', stopFlaring);

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
