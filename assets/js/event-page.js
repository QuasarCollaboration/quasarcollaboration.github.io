/**
 * Interaction controller for the ASA ASM / HWSA 2027 conference mini-site.
 * Core navigation and accessibility work without third-party libraries.
 * Motion is loaded as an optional progressive enhancement.
 */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector('[data-event-nav]');
    const menuButton = document.querySelector('[data-nav-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const moreMenu = document.querySelector('.ev-more');
    let motionApi = null;
    let lastFocused = null;

    function setHeaderState() {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 24);
    }

    function getFocusable(container) {
        if (!container) return [];
        return Array.from(
            container.querySelectorAll(
                'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
            )
        ).filter((element) => !element.hasAttribute('hidden'));
    }

    async function openMobileMenu() {
        if (!header || !menuButton || !mobileMenu) return;
        lastFocused = document.activeElement;
        mobileMenu.hidden = false;
        menuButton.setAttribute('aria-expanded', 'true');
        menuButton.querySelector('.sr-only').textContent = 'Close navigation';
        header.classList.add('is-menu-open');
        document.body.classList.add('ev-menu-open');

        if (motionApi && !reduceMotion.matches) {
            await motionApi.animate(
                mobileMenu,
                { opacity: [0, 1], transform: ['translateY(-10px)', 'translateY(0)'] },
                { duration: 0.22, easing: [0.22, 1, 0.36, 1] }
            ).finished;
        }

        const firstLink = getFocusable(mobileMenu)[0];
        if (firstLink) firstLink.focus();
    }

    async function closeMobileMenu(options) {
        if (!header || !menuButton || !mobileMenu || mobileMenu.hidden) return;
        const restoreFocus = !options || options.restoreFocus !== false;

        if (motionApi && !reduceMotion.matches) {
            await motionApi.animate(
                mobileMenu,
                { opacity: [1, 0], transform: ['translateY(0)', 'translateY(-8px)'] },
                { duration: 0.16, easing: 'ease-in' }
            ).finished;
        }

        mobileMenu.hidden = true;
        mobileMenu.style.removeProperty('opacity');
        mobileMenu.style.removeProperty('transform');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.querySelector('.sr-only').textContent = 'Open navigation';
        header.classList.remove('is-menu-open');
        document.body.classList.remove('ev-menu-open');
        if (restoreFocus && lastFocused instanceof HTMLElement) lastFocused.focus();
    }

    function initMobileMenu() {
        if (!menuButton || !mobileMenu) return;

        menuButton.addEventListener('click', () => {
            if (mobileMenu.hidden) {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        });

        mobileMenu.addEventListener('click', (event) => {
            if (event.target.closest('a')) closeMobileMenu({ restoreFocus: false });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (moreMenu && moreMenu.open) moreMenu.open = false;
                closeMobileMenu();
                return;
            }

            if (event.key !== 'Tab' || mobileMenu.hidden) return;
            const focusable = getFocusable(mobileMenu);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        document.addEventListener('pointerdown', (event) => {
            if (!mobileMenu.hidden && !header.contains(event.target)) closeMobileMenu();
            if (moreMenu && moreMenu.open && !moreMenu.contains(event.target)) {
                moreMenu.open = false;
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1080 && !mobileMenu.hidden) {
                closeMobileMenu({ restoreFocus: false });
            }
        });
    }

    function initScrollSpy() {
        const links = Array.from(document.querySelectorAll('[data-nav-link][href^="#"]'));
        if (!links.length || !('IntersectionObserver' in window)) return;

        const byTarget = new Map();
        links.forEach((link) => {
            const id = link.getAttribute('href').slice(1);
            if (!byTarget.has(id)) byTarget.set(id, []);
            byTarget.get(id).push(link);
        });

        const sections = Array.from(byTarget.keys())
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        function activate(id) {
            links.forEach((link) => link.removeAttribute('aria-current'));
            (byTarget.get(id) || []).forEach((link) => {
                link.setAttribute('aria-current', 'location');
            });
            if (moreMenu) {
                moreMenu.classList.toggle(
                    'has-current',
                    Boolean(moreMenu.querySelector('[aria-current="location"]'))
                );
            }
        }

        const visible = new Map();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visible.set(entry.target.id, entry.boundingClientRect.top);
                    } else {
                        visible.delete(entry.target.id);
                    }
                });

                const current = Array.from(visible.entries()).sort((a, b) => {
                    return Math.abs(a[1]) - Math.abs(b[1]);
                })[0];
                if (current) activate(current[0]);
            },
            { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.15, 0.5] }
        );

        sections.forEach((section) => observer.observe(section));
    }

    function initMoreMenu() {
        if (!moreMenu) return;
        moreMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                moreMenu.open = false;
            });
        });
    }

    function initTabs() {
        document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
            const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
            if (!tabs.length) return;

            function selectTab(tab, moveFocus) {
                tabs.forEach((item) => {
                    const panel = document.getElementById(item.getAttribute('aria-controls'));
                    const selected = item === tab;
                    item.classList.toggle('is-active', selected);
                    item.setAttribute('aria-selected', String(selected));
                    item.tabIndex = selected ? 0 : -1;
                    if (panel) panel.hidden = !selected;
                });
                if (moveFocus) tab.focus();
            }

            tabs.forEach((tab) => {
                tab.addEventListener('click', () => selectTab(tab, false));
                tab.addEventListener('keydown', (event) => {
                    const index = tabs.indexOf(tab);
                    let nextIndex = null;
                    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
                    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
                    if (event.key === 'Home') nextIndex = 0;
                    if (event.key === 'End') nextIndex = tabs.length - 1;
                    if (nextIndex === null) return;
                    event.preventDefault();
                    selectTab(tabs[nextIndex], true);
                });
            });

            const selected = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
            selectTab(selected, false);
        });
    }

    function initOrbit() {
        const orbit = document.querySelector('.ev-orbit');
        if (orbit && !reduceMotion.matches) orbit.classList.add('ev-orbit-live');
    }

    async function initMotion() {
        if (reduceMotion.matches) return;

        try {
            motionApi = await import('https://cdn.jsdelivr.net/npm/motion@13.2.0/+esm');
        } catch (error) {
            console.warn('Motion enhancement unavailable; using static experience.', error);
            return;
        }

        const { animate, inView, scroll } = motionApi;
        const heroContent = document.querySelector('[data-hero-content]');
        const heroMedia = document.querySelector('[data-hero-media]');
        const hero = document.querySelector('.ev-hero');

        if (heroContent) {
            const items = Array.from(heroContent.children);
            animate(
                items,
                { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0)'] },
                { duration: 0.7, delay: motionApi.stagger(0.08), easing: [0.22, 1, 0.36, 1] }
            );
        }

        document.querySelectorAll('.ev-content > section').forEach((section) => {
            inView(
                section,
                () => {
                    animate(
                        section,
                        { opacity: [0, 1], transform: ['translateY(22px)', 'translateY(0)'] },
                        { duration: 0.65, easing: [0.22, 1, 0.36, 1] }
                    );
                },
                { amount: 0.12 }
            );
        });

        if (heroMedia && hero) {
            scroll(
                (progress) => {
                    heroMedia.style.transform =
                        'translate3d(0,' + (progress * 2.5).toFixed(2) + '%,0)';
                },
                { target: hero, offset: ['start start', 'end start'] }
            );
        }
    }

    function init() {
        setHeaderState();
        window.addEventListener('scroll', setHeaderState, { passive: true });
        initMobileMenu();
        initScrollSpy();
        initMoreMenu();
        initTabs();
        initOrbit();
        initMotion();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
