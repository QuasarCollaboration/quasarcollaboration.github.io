(function () {
    function initScheduleTabs() {
        var buttons = document.querySelectorAll('.schedule-year-toc-btn[data-year]');
        var panels = document.querySelectorAll('.schedule-year-panel[data-year-panel]');

        if (!buttons.length || !panels.length) {
            return;
        }

        function setYear(year) {
            buttons.forEach(function (btn) {
                var isActive = btn.getAttribute('data-year') === year;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
            panels.forEach(function (panel) {
                panel.hidden = panel.getAttribute('data-year-panel') !== year;
            });
        }

        window.scheduleSetYear = setYear;

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                setYear(btn.getAttribute('data-year'));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScheduleTabs);
    } else {
        initScheduleTabs();
    }
})();
