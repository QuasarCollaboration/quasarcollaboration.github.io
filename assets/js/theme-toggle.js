// Theme Toggle Logic
function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    if (themeToggleBtn && !themeToggleBtn.dataset.initialized) {
        themeToggleBtn.dataset.initialized = 'true';
        themeToggleBtn.addEventListener('click', () => {
            root.classList.toggle('dark-mode');
            const isDark = root.classList.contains('dark-mode');

            // Save Preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeThemeToggle);
document.addEventListener('layout-header-connected', initializeThemeToggle);
window.initializeThemeToggle = initializeThemeToggle;
