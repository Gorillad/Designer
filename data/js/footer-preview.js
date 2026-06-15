/**
 * Loads data/footer/footer.html and boots footer.js — used by footer-preview.html.
 */
(function () {
    var FOOTER_HTML = 'data/footer/footer.html';
    var FOOTER_JS = 'data/js/footer.js';

    function resolveUrl(relativePath) {
        return new URL(relativePath, window.location.href).href;
    }

    function stripComments(html) {
        return html.replace(/<!--[\s\S]*?-->/g, '');
    }

    function showError(message) {
        var mount = document.getElementById('footer-mount');
        if (!mount) return;
        mount.innerHTML =
            '<p style="padding:2rem;font-family:sans-serif;color:#b00020;">' +
            message +
            '</p>';
    }

    function loadFooterScript() {
        return new Promise(function (resolve, reject) {
            if (typeof window.bootFooter === 'function') {
                resolve();
                return;
            }
            var s = document.createElement('script');
            s.src = resolveUrl(FOOTER_JS);
            s.onload = resolve;
            s.onerror = function () {
                reject(new Error('Could not load ' + FOOTER_JS));
            };
            document.body.appendChild(s);
        });
    }

    fetch(resolveUrl(FOOTER_HTML))
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + FOOTER_HTML);
            return res.text();
        })
        .then(function (html) {
            var mount = document.getElementById('footer-mount');
            if (!mount) return;
            mount.innerHTML = stripComments(html);
            return loadFooterScript();
        })
        .then(function () {
            if (typeof window.bootFooter === 'function') {
                window.bootFooter();
            }
        })
        .catch(function (err) {
            showError(
                'Footer preview failed: ' + err.message +
                '. Right-click footer-preview.html → Open with Live Server (project root must be this folder).'
            );
            console.error('[footer-preview]', err);
        });
})();
