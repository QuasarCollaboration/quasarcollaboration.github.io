(function () {
    var activeCategory = 'all';

    function initSearch() {
        var input = document.getElementById('resource-search');
        var clearBtn = document.getElementById('resource-search-clear');
        var status = document.getElementById('resource-search-status');
        var categoryButtons = document.querySelectorAll('.resources-toc-btn[data-category]');
        var sections = document.querySelectorAll('.js-resource-section');

        if (!sections.length) {
            return;
        }

        function setActiveCategoryButton(category) {
            categoryButtons.forEach(function (btn) {
                var isActive = btn.getAttribute('data-category') === category;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        }

        function applyFilters() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var visibleCount = 0;

            sections.forEach(function (section) {
                var category = section.getAttribute('data-resource-category');
                var categoryMatch = activeCategory === 'all' || category === activeCategory;

                if (!categoryMatch) {
                    section.hidden = true;
                    return;
                }

                var sectionVisibleEntries = 0;
                section.querySelectorAll('.js-resource-entry').forEach(function (entry) {
                    var haystack = (entry.getAttribute('data-search') || entry.textContent || '').toLowerCase();
                    var searchMatch = !query || haystack.indexOf(query) !== -1;
                    entry.hidden = !searchMatch;
                    if (searchMatch) {
                        sectionVisibleEntries += 1;
                    }
                });

                section.hidden = sectionVisibleEntries === 0;
                visibleCount += sectionVisibleEntries;
            });

            if (status) {
                if (visibleCount === 0) {
                    status.textContent = query || activeCategory !== 'all'
                        ? 'No resources match your filters.'
                        : '';
                } else if (query || activeCategory !== 'all') {
                    status.textContent = visibleCount + ' resource' + (visibleCount === 1 ? '' : 's') + ' shown';
                } else {
                    status.textContent = '';
                }
            }

            updateClearButton();
        }

        function updateClearButton() {
            if (!clearBtn || !input) {
                return;
            }
            clearBtn.classList.toggle('is-visible', input.value.trim().length > 0);
        }

        function setCategory(category) {
            if (category !== 'all' && category !== 'seminars' && category !== 'workshops') {
                return;
            }
            activeCategory = category;
            setActiveCategoryButton(category);
            applyFilters();
        }

        window.resourcesSetCategory = setCategory;

        categoryButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                setCategory(btn.getAttribute('data-category'));
            });
        });

        if (input) {
            input.addEventListener('input', applyFilters);
        }

        if (clearBtn && input) {
            clearBtn.addEventListener('click', function () {
                input.value = '';
                input.focus();
                applyFilters();
            });
        }

        setActiveCategoryButton(activeCategory);
        applyFilters();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
