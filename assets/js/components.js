// assets/js/components.js

class LayoutHeader extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || './';
        const activePage = this.getAttribute('active-page') || 'home';

        // Helper function for active classes
        const getNavClass = (pageName) => {
            const baseClass = "px-4 py-2 text-sm font-medium rounded-lg transition-all text-center md:text-left ";
            if (activePage === pageName) {
                return baseClass + "text-white bg-indigo-600 shadow-sm shadow-indigo-200";
            }
            return baseClass + "text-slate-700 hover:bg-indigo-50/50";
        };

        this.innerHTML = `
        <header class="relative z-50 border-b border-indigo-100 glass-panel sticky top-0 backdrop-blur-xl shadow-sm transition-colors duration-300">
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
                        class="md:hidden p-2 text-slate-600 hover:text-indigo-600 focus:outline-none transition-colors"
                        aria-label="Toggle Navigation">
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
                            <a href="${basePath}index.html" class="${getNavClass('home')}">Home</a>
                            <a href="${basePath}pages/about.html" class="${getNavClass('about')}">About</a>
                            <a href="${basePath}pages/members.html" class="${getNavClass('members')}">Members</a>

                            <!-- Collaboration Dropdown -->
                            <div class="relative group text-center md:text-left">
                                <button id="collaboration-btn"
                                    class="w-full md:w-auto px-4 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50/50 rounded-lg transition-all flex items-center justify-center md:justify-start gap-1"
                                    aria-haspopup="true" aria-expanded="false">
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
                                    </div>
                                </div>
                            </div>

                            <a href="${basePath}pages/news.html" class="${getNavClass('news')}">News</a>
                            <a href="${basePath}pages/contact.html" class="${getNavClass('contact')}">Contact</a>

                            <!-- Theme Toggle Button (Slider Switch) -->
                            <button id="theme-toggle"
                                class="relative w-14 h-7 ml-5 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                aria-label="Toggle Dark Mode">
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

        // Attach event listeners
        const mobileMenuBtn = this.querySelector('#mobile-menu-btn');
        const nav = this.querySelector('#main-nav');
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                nav.classList.toggle('hidden');
            });
        }

        const collaborationBtn = this.querySelector('#collaboration-btn');
        const menu = this.querySelector('#collaboration-menu');
        if (collaborationBtn && menu) {
            collaborationBtn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
            });
        }

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

customElements.define('layout-header', LayoutHeader);
customElements.define('layout-footer', LayoutFooter);
