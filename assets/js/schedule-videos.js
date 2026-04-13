document.addEventListener('DOMContentLoaded', () => {
    const videoToggles = document.querySelectorAll('.js-video-toggle');

    videoToggles.forEach((button) => {
        button.addEventListener('click', () => {
            const containerId = button.getAttribute('aria-controls');
            const container = containerId ? document.getElementById(containerId) : null;
            if (!container) {
                return;
            }

            const currentlyExpanded = button.getAttribute('aria-expanded') === 'true';
            const shouldExpand = !currentlyExpanded;

            button.setAttribute('aria-expanded', String(shouldExpand));
            container.classList.toggle('hidden', !shouldExpand);

            const label = button.querySelector('.js-video-toggle-label');
            if (label) {
                label.textContent = shouldExpand ? 'Hide Recording' : 'Watch Recording';
            }

            if (!shouldExpand) {
                return;
            }

            const embedSlot = container.querySelector('.js-video-embed');
            const videoId = button.dataset.videoId;
            const videoTitle = button.dataset.videoTitle || 'YouTube recording';

            if (!embedSlot || !videoId || embedSlot.querySelector('iframe')) {
                return;
            }

            const iframe = document.createElement('iframe');
            iframe.className = 'h-full w-full';
            iframe.width = '560';
            iframe.height = '315';
            iframe.src = `https://www.youtube.com/embed/${videoId}?si=A4aYRxhzF4Ux7VEi`;
            iframe.title = videoTitle;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';

            embedSlot.appendChild(iframe);
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
});
