(function () {
    var iframeAllow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

    function loadRecording(button) {
        var container = button.closest('.js-youtube-facade');
        if (!container || container.classList.contains('is-loaded')) {
            return;
        }

        var videoId = container.getAttribute('data-youtube-id');
        var title = container.getAttribute('data-youtube-title') || 'YouTube video';
        if (!videoId) {
            return;
        }

        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1';
        iframe.title = title;
        iframe.allow = iframeAllow;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;

        container.replaceChildren(iframe);
        container.classList.add('is-loaded');
    }

    function initYouTubeFacades() {
        document.querySelectorAll('.js-youtube-facade').forEach(function (container) {
            var button = container.querySelector('.resource-recording-play');
            if (!button) {
                return;
            }
            button.addEventListener('click', function () {
                loadRecording(button);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initYouTubeFacades);
    } else {
        initYouTubeFacades();
    }
})();
