(function () {
    function openFromHash() {
        var hash = window.location.hash.slice(1);
        if (!hash) {
            return;
        }
        var target = document.getElementById(hash);
        if (target && target.tagName === 'DETAILS') {
            target.open = true;
            var section = target.closest('.js-resource-section');
            if (section && window.resourcesSetCategory) {
                var category = section.getAttribute('data-resource-category');
                if (category) {
                    window.resourcesSetCategory(category);
                }
            }
            window.requestAnimationFrame(function () {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', openFromHash);
    } else {
        openFromHash();
    }

    window.addEventListener('hashchange', openFromHash);
})();
