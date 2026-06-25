(function () {
    function collapseWhitespace(str) {
        return (str || '').toString().replace(/\s+/g, ' ').trim();
    }

    function getShareMeta() {
        const canonical = document.querySelector('link[rel="canonical"]');
        const url = (canonical && canonical.href) ? canonical.href.trim() : window.location.href;
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const title = (ogTitle && ogTitle.content) ? ogTitle.content.trim() : document.title;
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const text = (ogDesc && ogDesc.content) ? ogDesc.content.trim() : '';
        const shareSentence = document.querySelector('meta[name="quasar:share-sentence"]');
        const catchy = (shareSentence && shareSentence.content)
            ? collapseWhitespace(shareSentence.content)
            : collapseWhitespace(title);
        return { url, title, text, catchy };
    }

    function init(root) {
        const nativeBtn = root.querySelector('[data-share-native]');
        const copyBtn = root.querySelector('[data-share-copy]');
        const feedback = root.querySelector('[data-share-feedback]');
        const { url, title, text, catchy } = getShareMeta();

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
                    navigator.share({ title: title, text: catchy, url: url }).catch(function (err) {
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
                const bundle = catchy + '\n\n' + url;
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
                var tw = encodeURIComponent(catchy + '\n' + url);
                el.href = 'https://twitter.com/intent/tweet?text=' + tw;
            } else if (tpl === 'facebook') {
                // `quote` is optional; some clients ignore it but it doesn't hurt.
                el.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)
                    + '&quote=' + encodeURIComponent(catchy);
            } else if (tpl === 'linkedin') {
                // LinkedIn often uses OG tags; `summary`/`title` can help prefill where supported.
                el.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url)
                    + '&title=' + encodeURIComponent(title)
                    + '&summary=' + encodeURIComponent(catchy);
            } else if (tpl === 'whatsapp') {
                var wa = encodeURIComponent(catchy + '\n' + url);
                el.href = 'https://api.whatsapp.com/send?text=' + wa;
            } else if (tpl === 'reddit') {
                el.href = 'https://www.reddit.com/submit?url=' + encodeURIComponent(url)
                    + '&title=' + encodeURIComponent(catchy);
            } else if (tpl === 'email') {
                var subj = encodeURIComponent(title);
                var body = encodeURIComponent(catchy + '\n\n' + url);
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
