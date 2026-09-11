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
        const landing = document.querySelector('.ev-landing');
        header.classList.toggle(
            'is-scrolled',
            window.scrollY > 24 ||
            (landing && landing.scrollTop > 24) ||
            document.body.classList.contains('ev-chapter-active')
        );
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

    function initChapterRouter() {
        const views = Array.from(document.querySelectorAll('[data-chapter-view]'));
        const links = Array.from(document.querySelectorAll('[data-nav-link][href^="#"]'));
        const homeLinks = Array.from(document.querySelectorAll('.ev-wordmark[href="#top"]'));
        const status = document.querySelector('[data-chapter-status]');
        if (!views.length) return;

        const chapterOrder = ['top', 'overview', 'programme', 'attend', 'venue', 'community'];
        const chapterLabels = {
            top: 'Event home',
            overview: 'Overview',
            programme: 'Programme',
            attend: 'Attend',
            venue: 'Venue',
            community: 'Community'
        };
        const anchorToChapter = {
            top: 'top',
            overview: 'overview',
            theme: 'overview',
            about: 'overview',
            who: 'overview',
            programme: 'programme',
            'key-dates': 'programme',
            schedule: 'programme',
            attend: 'attend',
            registration: 'attend',
            abstracts: 'attend',
            venue: 'venue',
            host: 'venue',
            travel: 'venue',
            location: 'venue',
            community: 'community',
            organisers: 'community',
            loc: 'community',
            soc: 'community',
            sponsors: 'community',
            conduct: 'community',
            contact: 'community'
        };
        const viewByChapter = new Map(views.map((view) => [view.dataset.chapter, view]));
        let activeChapter = null;
        let transitionTimer = null;
        let focusTimer = null;

        document.documentElement.classList.add('ev-chapters-ready');

        function anchorFromLocation() {
            return decodeURIComponent(window.location.hash.slice(1)) || 'top';
        }

        function chapterForAnchor(anchor) {
            return anchorToChapter[anchor] || 'top';
        }

        function setNavigationState(chapter) {
            links.forEach((link) => {
                const anchor = link.getAttribute('href').slice(1);
                if (chapterForAnchor(anchor) === chapter) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }

        function scrollToAnchor(view, anchor, smooth) {
            view.scrollTop = 0;
            if (anchor === chapterForAnchor(anchor) || anchor === 'top') return;

            const target = document.getElementById(anchor);
            if (!target || !view.contains(target)) return;
            const navHeight = header ? header.getBoundingClientRect().height : 76;
            const top = Math.max(0, target.offsetTop - view.offsetTop - navHeight - 24);
            view.scrollTo({
                top: top,
                behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto'
            });
        }

        function finishTransition(oldView) {
            document.querySelectorAll('[data-chapter-view].is-exiting').forEach((view) => {
                if (view.classList.contains('is-active')) return;
                view.classList.remove('is-exiting');
                view.hidden = true;
            });
            document.body.classList.remove('ev-is-transitioning');
        }

        function activate(anchor, options) {
            const settings = Object.assign({
                history: 'push',
                focus: true,
                animate: true
            }, options);
            const chapter = chapterForAnchor(anchor);
            const nextView = viewByChapter.get(chapter);
            if (!nextView) return;

            const oldView = activeChapter ? viewByChapter.get(activeChapter) : null;
            const chapterChanged = activeChapter !== chapter;
            const oldIndex = chapterOrder.indexOf(activeChapter);
            const nextIndex = chapterOrder.indexOf(chapter);

            window.clearTimeout(transitionTimer);
            window.clearTimeout(focusTimer);

            if (chapterChanged) {
                document.body.dataset.chapterDirection = nextIndex < oldIndex ? 'backward' : 'forward';
                if (oldView) {
                    oldView.classList.remove('is-active');
                    oldView.classList.add('is-exiting');
                    oldView.setAttribute('aria-hidden', 'true');
                    oldView.inert = true;
                }

                nextView.hidden = false;
                nextView.inert = false;
                nextView.setAttribute('aria-hidden', 'false');
                nextView.classList.remove('is-exiting');
                nextView.classList.add('is-entering');
                void nextView.offsetWidth;
                nextView.classList.remove('is-entering');
                nextView.classList.add('is-active');

                if (settings.animate && !reduceMotion.matches) {
                    document.body.classList.add('ev-is-transitioning');
                    transitionTimer = window.setTimeout(() => finishTransition(oldView), 720);
                } else {
                    finishTransition(oldView);
                }
            }

            activeChapter = chapter;
            document.body.dataset.activeChapter = chapter;
            document.body.classList.toggle('ev-chapter-active', chapter !== 'top');
            setNavigationState(chapter);
            setHeaderState();
            scrollToAnchor(nextView, anchor, !chapterChanged);

            const hash = '#' + anchor;
            if (settings.history === 'replace') {
                window.history.replaceState({ chapter, anchor }, '', hash);
            } else if (settings.history === 'push' && window.location.hash !== hash) {
                window.history.pushState({ chapter, anchor }, '', hash);
            }

            if (chapterChanged && settings.focus) {
                const heading = nextView.querySelector('h1, h2');
                if (heading) {
                    heading.tabIndex = -1;
                    focusTimer = window.setTimeout(() => {
                        heading.focus({ preventScroll: true });
                    }, reduceMotion.matches ? 0 : 460);
                }
            }

            if (status && chapterChanged) {
                status.textContent = 'Showing ' + chapterLabels[chapter];
            }
        }

        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const anchor = link.getAttribute('href').slice(1);
                activate(anchor);
                if (mobileMenu && !mobileMenu.hidden) {
                    closeMobileMenu({ restoreFocus: false });
                }
            });
        });

        homeLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                activate('top');
            });
        });

        window.addEventListener('popstate', () => {
            activate(anchorFromLocation(), {
                history: 'none',
                focus: false
            });
        });

        window.addEventListener('hashchange', () => {
            const anchor = anchorFromLocation();
            activate(anchor, { history: 'none', focus: false });
        });

        views.forEach((view) => {
            view.hidden = true;
            view.inert = true;
            view.setAttribute('aria-hidden', 'true');
        });

        activate(anchorFromLocation(), {
            history: 'replace',
            focus: false,
            animate: false
        });
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

    function initHeroCardStack() {
        document.querySelectorAll('[data-hero-card-stack]').forEach((stack) => {
            const visual = stack.closest('.ev-hero__visual');
            const captions = visual ? visual.querySelectorAll('[data-hero-caption]') : [];
            const labelDefault = stack.dataset.labelDefault || 'Show the alternate hero image';
            const labelSwapped = stack.dataset.labelSwapped || 'Show the primary hero image';

            stack.addEventListener('click', () => {
                const isSwapped = stack.classList.toggle('is-swapped');
                stack.setAttribute('aria-pressed', String(isSwapped));
                stack.setAttribute('aria-label', isSwapped ? labelSwapped : labelDefault);
                captions.forEach((caption) => {
                    caption.hidden = caption.dataset.heroCaption !== (isSwapped ? 'back' : 'front');
                });
            });
        });
    }

    async function initMotion() {
        if (reduceMotion.matches) return;

        try {
            motionApi = await import('https://cdn.jsdelivr.net/npm/motion@13.2.0/+esm');
        } catch (error) {
            console.warn('Motion enhancement unavailable; using static experience.', error);
            return;
        }

        const { animate } = motionApi;
        const heroContent = document.querySelector('[data-hero-content]');

        if (heroContent) {
            const items = Array.from(heroContent.children);
            animate(
                items,
                { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0)'] },
                { duration: 0.7, delay: motionApi.stagger(0.08), easing: [0.22, 1, 0.36, 1] }
            );
        }
    }

    function init() {
        setHeaderState();
        window.addEventListener('scroll', setHeaderState, { passive: true });
        initMobileMenu();
        initChapterRouter();
        const landing = document.querySelector('.ev-landing');
        if (landing) landing.addEventListener('scroll', setHeaderState, { passive: true });
        initMoreMenu();
        initTabs();
        initOrbit();
        initHeroCardStack();
        initMotion();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
