// assets/js/components.js

class LayoutHeader extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || './';
        const activePage = this.getAttribute('active-page') || 'home';

        // Helper function for active classes
        const getNavClass = (pageName) => {
            const baseClass = "nav-btn px-4 py-2 text-sm font-medium rounded-full transition-all text-center md:text-left ";
            if (activePage === pageName) {
                return baseClass + "active text-white bg-indigo-600 shadow-sm shadow-indigo-200";
            }
            return baseClass + "text-slate-700 hover:bg-indigo-50/50";
        };

        const closeMenu = (menu, button) => {
            if (!menu || !button) {
                return;
            }

            menu.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
        };

        const openMenu = (menu, button) => {
            if (!menu || !button) {
                return;
            }

            menu.classList.remove('hidden');
            button.setAttribute('aria-expanded', 'true');
        };

        this.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to content</a>
        <header class="site-header fixed inset-x-0 top-0 z-50 border-b border-indigo-100 glass-panel shadow-sm transition-all duration-300">
            <div class="container mx-auto px-6 py-4">
                <div class="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 md:gap-8">
                    <!-- Branding Section -->
                    <div class="flex items-center gap-6">
                        <a href="${basePath}index.html" class="flex items-center gap-4 group">
                            <img src="${basePath}assets/img/UQ Quasar - Official Logo.png" alt="QUASAR Logo"
                                class="h-[67px] w-auto object-contain transition-transform group-hover:scale-105" />
                            <div class="block">
                                <h1 class="text-xl font-display font-bold tracking-tight text-slate-800 leading-tight transition-colors">
                                    <span class="group-hover:text-indigo-700 transition-colors">QUASAR</span>
                                    COLLABORATION
                                </h1>
                                <p class="text-[10px] text-slate-800 uppercase tracking-widest font-semibold dark:text-white transition-colors">
                                    <span class="group-hover:text-indigo-700 transition-colors">Q</span>ueensland
                                    <span class="group-hover:text-indigo-700 transition-colors">U</span>niversities <span
                                        class="group-hover:text-indigo-700 transition-colors">A</span>stronomy & <span
                                        class="group-hover:text-indigo-700 transition-colors">S</span>p<span
                                        class="group-hover:text-indigo-700 transition-colors">a</span>ce <span
                                        class="group-hover:text-indigo-700 transition-colors">R</span>esearch
                                </p>
                            </div>
                        </a>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button id="mobile-menu-btn"
                        class="md:hidden nav-icon-btn p-2 text-slate-600 hover:text-indigo-600 transition-colors"
                        aria-label="Toggle navigation"
                        aria-controls="main-nav"
                        aria-expanded="false"
                        type="button">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>

                    <!-- Navigation -->
                    <nav id="main-nav"
                        class="hidden w-full md:block md:w-auto mt-4 md:mt-0 transition-all duration-300 ease-in-out origin-top"
                        aria-label="Main Navigation">
                        <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-1">
                            <a href="${basePath}index.html" class="${getNavClass('home')}"${activePage === 'home' ? ' aria-current="page"' : ''}>Home</a>
                            <a href="${basePath}pages/about.html" class="${getNavClass('about')}"${activePage === 'about' ? ' aria-current="page"' : ''}>About</a>
                            <a href="${basePath}pages/members.html" class="${getNavClass('members')}"${activePage === 'members' ? ' aria-current="page"' : ''}>Members</a>

                            <!-- Collaboration Dropdown -->
                            <div class="relative group text-center md:text-left">
                                <button id="collaboration-btn"
                                    class="nav-btn w-full md:w-auto px-4 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50/50 rounded-full transition-all flex items-center justify-center md:justify-start gap-1"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    aria-controls="collaboration-menu"
                                    type="button">
                                    Collaboration
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <!-- Dropdown Menu -->
                                <div id="collaboration-menu"
                                    class="hidden md:block md:absolute md:left-0 md:mt-1 w-full md:w-48 bg-indigo-50/30 md:bg-white dark:bg-gray-900 rounded-lg md:shadow-xl md:border md:border-indigo-50 dark:border-slate-700 md:opacity-0 md:invisible md:group-hover:opacity-100 md:group-hover:visible transition-all duration-200 transform z-50 overflow-hidden mb-2 md:mb-0">
                                    <div class="py-1 flex flex-col items-center md:items-stretch">
                                        <a href="${basePath}pages/research.html"
                                            class="block px-4 py-2 text-sm text-slate-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-full text-center md:text-left">Research Themes</a>
                                        <a href="${basePath}pages/schedule.html"
                                            class="block px-4 py-2 text-sm text-slate-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-full text-center md:text-left">Schedule</a>
                                        <a href="${basePath}pages/resources.html"
                                            class="block px-4 py-2 text-sm text-slate-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-full text-center md:text-left">Resources</a>
                                    </div>
                                </div>
                            </div>

                            <a href="${basePath}pages/news.html" class="${getNavClass('news')}"${activePage === 'news' ? ' aria-current="page"' : ''}>News</a>
                            <a href="${basePath}pages/contact.html" class="${getNavClass('contact')}"${activePage === 'contact' ? ' aria-current="page"' : ''}>Contact</a>

                            <!-- Theme Toggle Button (Slider Switch) -->
                            <button id="theme-toggle"
                                class="relative w-14 h-7 ml-5 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                aria-label="Toggle dark mode"
                                type="button">
                                <div class="absolute left-1 top-1 text-yellow-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div class="absolute right-1 top-1 text-slate-400 dark:text-indigo-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                                <div
                                    class="toggle-indicator absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out dark:translate-x-7">
                                </div>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
        `;

        const mainContent = document.querySelector('main');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }

        const header = this.querySelector('header');
        const updateHeaderState = () => {
            if (!header) {
                return;
            }

            document.documentElement.style.setProperty('--site-header-height', `${header.offsetHeight}px`);
            header.classList.toggle('is-scrolled', window.scrollY > 12);
        };

        updateHeaderState();
        window.addEventListener('scroll', updateHeaderState, { passive: true });
        window.addEventListener('resize', updateHeaderState);

        if (window.ResizeObserver && header) {
            const resizeObserver = new ResizeObserver(() => {
                document.documentElement.style.setProperty('--site-header-height', `${header.offsetHeight}px`);
            });
            resizeObserver.observe(header);
        }

        // Attach event listeners
        const mobileMenuBtn = this.querySelector('#mobile-menu-btn');
        const nav = this.querySelector('#main-nav');
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                if (nav.classList.contains('hidden')) {
                    openMenu(nav, mobileMenuBtn);
                } else {
                    closeMenu(nav, mobileMenuBtn);
                }
            });

            nav.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    closeMenu(nav, mobileMenuBtn);
                });
            });
        }

        const collaborationBtn = this.querySelector('#collaboration-btn');
        const menu = this.querySelector('#collaboration-menu');
        if (collaborationBtn && menu) {
            collaborationBtn.addEventListener('click', () => {
                if (menu.classList.contains('hidden')) {
                    openMenu(menu, collaborationBtn);
                } else {
                    closeMenu(menu, collaborationBtn);
                }
            });

            menu.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    closeMenu(menu, collaborationBtn);
                });
            });

            document.addEventListener('click', (event) => {
                if (!this.contains(event.target)) {
                    closeMenu(menu, collaborationBtn);
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    closeMenu(menu, collaborationBtn);
                    closeMenu(nav, mobileMenuBtn);
                }
            });
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                closeMenu(nav, mobileMenuBtn);
                closeMenu(menu, collaborationBtn);
            }
        });

        if (window.initializeThemeToggle) {
            window.initializeThemeToggle();
        } else {
            document.dispatchEvent(new Event('layout-header-connected'));
        }
    }
}

class LayoutFooter extends HTMLElement {
    connectedCallback() {
        const customClasses = this.getAttribute('custom-classes') || 'mt-auto';
        this.innerHTML = `
        <footer class="relative z-10 border-t border-indigo-100 glass-panel ${customClasses}">
            <div class="container mx-auto px-6 py-8">
                <div class="text-center text-slate-600 text-sm">
                    <p class="mb-2">&copy; 2026 QUASAR Collaboration. All rights reserved.</p>
                    <p>Queensland Universities Astronomy & Space Research</p>
                </div>
            </div>
        </footer>
        `;
    }
}

class NewsShare extends HTMLElement {
    connectedCallback() {
        const heading = this.getAttribute('heading') || 'Share this story';
        const intro = this.getAttribute('intro')
            || 'Send this to friends, family, and other QUASAR collaborators across your favourite platform.';

        const primaryBtn = 'inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full '
            + 'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 '
            + 'focus-visible:ring-offset-2';
        const platformBtn = 'inline-flex items-center justify-center w-10 h-10 rounded-full '
            + 'border border-slate-200 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50 '
            + 'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 '
            + 'focus-visible:ring-offset-2';

        const icon = {
            share: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
                + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
                + '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>'
                + '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>'
                + '<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
            copy: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
                + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
                + '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>'
                + '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
            twitter: '<svg class="w-5 h-5 text-slate-800" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
                + '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 '
                + '2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
            facebook: '<svg class="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
                + '<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797'
                + 'c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 '
                + '1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>',
            linkedin: '<svg class="w-5 h-5 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
                + '<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 '
                + '5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 '
                + '1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 '
                + '0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
            whatsapp: '<svg class="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
                + '<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 '
                + '11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 '
                + '6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 '
                + '3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 '
                + '0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124'
                + '-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 '
                + '1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059'
                + '-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372'
                + '-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 '
                + '0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 '
                + '1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29'
                + '.173-1.414z"/></svg>',
            reddit: '<svg class="w-5 h-5 text-[#FF4500]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
                + '<path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 '
                + '1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 '
                + '1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 '
                + '4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 '
                + '1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 '
                + '.14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 '
                + '13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 '
                + '0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 '
                + '0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 '
                + '.463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 '
                + '0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>',
            email: '<svg class="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
                + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
                + '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>'
                + '<polyline points="22,6 12,13 2,6"/></svg>'
        };

        this.innerHTML = `
        <section class="news-share mt-10 pt-8 border-t border-indigo-100" aria-label="${heading}">
            <h2 class="text-lg font-display font-bold text-slate-800 mb-2">${heading}</h2>
            <p class="text-sm text-slate-600 mb-5 max-w-2xl">${intro}</p>

            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <button type="button" data-share-native
                    class="hidden ${primaryBtn} bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                    aria-label="Open your device's share menu">
                    ${icon.share}
                    Share with my device
                </button>
                <button type="button" data-share-copy
                    class="${primaryBtn} border border-indigo-200 text-indigo-600 bg-slate-50 hover:bg-indigo-50"
                    aria-label="Copy link and summary to clipboard">
                    ${icon.copy}
                    Copy link
                </button>
            </div>

            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Or post directly to</p>
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                <a href="#" data-share-href-template="twitter" class="${platformBtn}"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Share on X (formerly Twitter)" title="Share on X">
                    ${icon.twitter}
                </a>
                <a href="#" data-share-href-template="facebook" class="${platformBtn}"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Share on Facebook" title="Share on Facebook">
                    ${icon.facebook}
                </a>
                <a href="#" data-share-href-template="linkedin" class="${platformBtn}"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Share on LinkedIn" title="Share on LinkedIn">
                    ${icon.linkedin}
                </a>
                <a href="#" data-share-href-template="whatsapp" class="${platformBtn}"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Send via WhatsApp" title="Send via WhatsApp">
                    ${icon.whatsapp}
                </a>
                <a href="#" data-share-href-template="reddit" class="${platformBtn}"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Share on Reddit" title="Share on Reddit">
                    ${icon.reddit}
                </a>
                <a href="#" data-share-href-template="email" class="${platformBtn}"
                    aria-label="Send via email" title="Send via email">
                    ${icon.email}
                </a>
            </div>

            <p data-share-feedback class="mt-4 text-sm font-medium text-indigo-600 hidden" role="status"
                aria-live="polite"></p>
        </section>
        `;
    }
}

customElements.define('layout-header', LayoutHeader);
customElements.define('layout-footer', LayoutFooter);
customElements.define('news-share', NewsShare);
