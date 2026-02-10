// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Toggle Handler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            root.classList.toggle('dark-mode');
            const isDark = root.classList.contains('dark-mode');

            // Save Preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
});
