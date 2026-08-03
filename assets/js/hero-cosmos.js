// Hero Cosmos: builds a gently twinkling starfield for the homepage hero,
// plus a curated set of "spark stars" that pulse in sync. Finding and
// clicking every spark star opens a hidden page (first light).
// No-ops safely if the hero markup isn't present (i.e. on any other page).
(function () {
    'use strict';

    const hero = document.getElementById('hero');
    const cosmos = document.getElementById('hero-cosmos');
    const starfield = document.getElementById('hero-starfield');
    if (!hero || !cosmos || !starfield) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preset spark stars — slightly inset from the edges, uneven L/R placement,
    // with the lower pair sitting farther down the panel (still above the CTA).
    const SPARK_STARS = [
        { x: 16, y: 15, size: 5.4 }, // upper-left
        { x: 84, y: 20, size: 5.1 }, // upper-right (offset lower than left)
        { x: 11, y: 36, size: 5.0 }, // mid-left
        { x: 89, y: 31, size: 5.5 }, // mid-right (offset higher than left)
        { x: 18, y: 64, size: 5.3 }, // lower-left
        { x: 78, y: 68, size: 5.2 }  // lower-right (farther down, inset more)
    ];

    const HIDDEN_PAGE_URL = 'pages/first-light.html';
    const BACKGROUND_STAR_COUNT = 140;
    // Hit target = star radius + a few px of padding (not a large magnet).
    const CLICK_PADDING_PX = 5;

    const sparkStars = [];

    function randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    function tooCloseToSpark(x, y) {
        return SPARK_STARS.some((spark) => {
            return Math.hypot(x - spark.x, y - spark.y) < 4.5;
        });
    }

    function createStar(options) {
        const star = document.createElement('span');
        star.className = options.className;
        star.style.setProperty('--x', options.x.toFixed(2) + '%');
        star.style.setProperty('--y', options.y.toFixed(2) + '%');
        star.style.setProperty('--size', options.size.toFixed(2) + 'px');
        star.style.setProperty('--base-opacity', options.baseOpacity.toFixed(2));
        star.style.setProperty('--peak-opacity', options.peakOpacity.toFixed(2));
        if (options.duration != null) {
            star.style.setProperty('--duration', options.duration.toFixed(2) + 's');
        }
        if (options.delay != null) {
            star.style.setProperty('--delay', options.delay.toFixed(2) + 's');
        }
        star.dataset.x = String(options.x);
        star.dataset.y = String(options.y);
        star.dataset.size = String(options.size);
        if (options.index != null) {
            star.dataset.sparkIndex = String(options.index);
        }
        return star;
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < BACKGROUND_STAR_COUNT; i++) {
        let x;
        let y;
        let attempts = 0;
        do {
            x = randomBetween(0, 100);
            y = randomBetween(0, 100);
            attempts += 1;
        } while (tooCloseToSpark(x, y) && attempts < 12);

        const size = randomBetween(1.3, 3.0);
        const baseOpacity = randomBetween(0.12, 0.4);
        fragment.appendChild(createStar({
            className: 'hero-star',
            x: x,
            y: y,
            size: size,
            baseOpacity: baseOpacity,
            peakOpacity: Math.min(0.7, baseOpacity + randomBetween(0.15, 0.3)),
            duration: randomBetween(4, 9),
            delay: randomBetween(0, 8)
        }));
    }

    SPARK_STARS.forEach((preset, index) => {
        const star = createStar({
            className: 'hero-star hero-star--spark',
            x: preset.x,
            y: preset.y,
            size: preset.size,
            baseOpacity: 0.88,
            peakOpacity: 1,
            index: index
        });
        fragment.appendChild(star);
        sparkStars.push(star);
    });

    starfield.appendChild(fragment);

    // ---- Easter egg: click every spark star → open the hidden page ----
    const foundSet = new Set();
    let eggActive = false;

    function starClientPosition(star) {
        const rect = star.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function clickRadiusFor(star) {
        const size = parseFloat(star.dataset.size) || 4;
        return size / 2 + CLICK_PADDING_PX;
    }

    function findNearestSparkStar(clientX, clientY) {
        let best = null;
        let bestDist = Infinity;
        for (let i = 0; i < sparkStars.length; i++) {
            const star = sparkStars[i];
            const pos = starClientPosition(star);
            const dist = Math.hypot(clientX - pos.x, clientY - pos.y);
            const maxDist = clickRadiusFor(star);
            if (dist <= maxDist && dist < bestDist) {
                bestDist = dist;
                best = star;
            }
        }
        return best;
    }

    function updateSparkCursor(clientX, clientY) {
        starfield.style.cursor = findNearestSparkStar(clientX, clientY) ? 'pointer' : 'default';
    }

    function triggerEasterEgg() {
        if (eggActive) return;
        eggActive = true;
        // Brief beat so the last picked star can light before navigation.
        const delayMs = prefersReducedMotion ? 120 : 420;
        setTimeout(function () {
            window.location.href = HIDDEN_PAGE_URL;
        }, delayMs);
    }

    starfield.addEventListener('mousemove', function (event) {
        updateSparkCursor(event.clientX, event.clientY);
    });

    starfield.addEventListener('mouseleave', function () {
        starfield.style.cursor = 'default';
    });

    starfield.addEventListener('click', function (event) {
        if (eggActive) return;

        const star = findNearestSparkStar(event.clientX, event.clientY);
        if (!star || foundSet.has(star)) return;

        foundSet.add(star);
        star.classList.add('is-picked');

        if (foundSet.size >= sparkStars.length) {
            triggerEasterEgg();
        }
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
