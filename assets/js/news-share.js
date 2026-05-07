(function () {
    function getShareMeta() {
        const canonical = document.querySelector('link[rel="canonical"]');
        const url = (canonical && canonical.href) ? canonical.href.trim() : window.location.href;
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const title = (ogTitle && ogTitle.content) ? ogTitle.content.trim() : document.title;
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const text = (ogDesc && ogDesc.content) ? ogDesc.content.trim() : '';
        return { url, title, text };
    }

    function init(root) {
        const nativeBtn = root.querySelector('[data-share-native]');
        const copyBtn = root.querySelector('[data-share-copy]');
        const feedback = root.querySelector('[data-share-feedback]');
        const { url, title, text } = getShareMeta();

        function showFeedback(message) {
            if (!feedback) {
                return;
            }
            feedback.textContent = message;
            feedback.classList.remove('hidden');
            window.clearTimeout(showFeedback._t);
            showFeedback._t = window.setTimeout(function () {
                feedback.classList.add('hidden');
            }, 2800);
        }

        if (nativeBtn) {
            if (navigator.share) {
                nativeBtn.classList.remove('hidden');
                nativeBtn.addEventListener('click', function () {
                    navigator.share({ title: title, text: text, url: url }).catch(function (err) {
                        if (err && err.name !== 'AbortError') {
                            showFeedback('Sharing was cancelled or is not available.');
                        }
                    });
                });
            } else {
                nativeBtn.remove();
            }
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                const bundle = text ? (title + '\n' + url + '\n\n' + text) : (title + '\n' + url);
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(bundle).then(function () {
                        showFeedback('Title, link, and summary copied. Paste anywhere to share.');
                    }).catch(function () {
                        fallbackCopy(bundle);
                    });
                } else {
                    fallbackCopy(bundle);
                }
            });
        }

        function fallbackCopy(str) {
            try {
                var ta = document.createElement('textarea');
                ta.value = str;
                ta.setAttribute('readonly', '');
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                showFeedback('Copied to clipboard.');
            } catch (e) {
                showFeedback('Copy blocked by your browser. Copy the link from the address bar.');
            }
        }

        root.querySelectorAll('[data-share-href-template]').forEach(function (el) {
            var tpl = el.getAttribute('data-share-href-template');
            if (tpl === 'twitter') {
                var tw = encodeURIComponent(title + (text ? ' — ' + text : '') + '\n' + url);
                el.href = 'https://twitter.com/intent/tweet?text=' + tw;
            } else if (tpl === 'linkedin') {
                el.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
            } else if (tpl === 'email') {
                var subj = encodeURIComponent(title);
                var body = encodeURIComponent(
                    title + '\n\n' + url + (text ? '\n\n' + text : '')
                );
                el.href = 'mailto:?subject=' + subj + '&body=' + body;
            }
        });
    }

    function run() {
        document.querySelectorAll('.news-share').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
