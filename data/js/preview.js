/**
 * Designer — local preview loader for header/footer partials.
 * Serve the project root with Live Server and open preview.html.
 */
(function () {
    var base = document.documentElement.dataset.previewBase || '';

    var REGIONS = [
        { url: base + 'header/header.html', target: 'site-header' },
        { url: base + 'data/footer/footer.html', target: 'site-footer', bootFooter: true }
    ];

    function resolveUrl(relativePath) {
        return new URL(relativePath, window.location.href).href;
    }

    function stripComments(html) {
        return html.replace(/<!--[\s\S]*?-->/g, '');
    }

    function showRegionError(target, url, err) {
        var el = document.getElementById(target);
        if (!el) return;
        el.innerHTML =
            '<p style="padding:1rem;font-family:sans-serif;color:#b00020;">' +
            'Preview could not load <code>' + url + '</code>: ' + err.message +
            '. Use Live Server on the project root folder.</p>';
    }

    function loadFooterScript() {
        return new Promise(function (resolve, reject) {
            if (typeof window.bootFooter === 'function') {
                resolve();
                return;
            }
            var s = document.createElement('script');
            s.src = resolveUrl('data/js/footer.js');
            s.onload = resolve;
            s.onerror = function () {
                reject(new Error('Could not load data/js/footer.js'));
            };
            document.body.appendChild(s);
        });
    }

    function loadRegion(region) {
        var url = region.url;
        var target = region.target;

        return fetch(resolveUrl(url))
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function (html) {
                var el = document.getElementById(target);
                if (el) el.innerHTML = stripComments(html);

                if (region.bootFooter) {
                    return loadFooterScript().then(function () {
                        if (typeof window.bootFooter === 'function') {
                            window.bootFooter();
                        }
                    });
                }
            })
            .catch(function (err) {
                console.warn('[preview] Failed to load', url, err);
                showRegionError(target, url, err);
            });
    }

    function initMobileMenuPreview() {
        document.body.addEventListener('click', function (e) {
            var trigger = e.target.closest('[mobile-menu]');
            if (!trigger) return;
            var menu = document.querySelector('mobile-menu');
            if (!menu) return;
            var choice = trigger.getAttribute('mobile-menu');
            menu.setAttribute('status', choice);
            var hamburger = document.querySelector('.hamburger');
            if (!hamburger) return;
            if (choice === 'show') hamburger.classList.add('active');
            if (choice === 'hide') hamburger.classList.remove('active');
        });
    }

    function initExpertHelpPreview() {
        document.body.addEventListener('click', function (e) {
            var trigger = e.target.closest('.expert-help-trigger');
            if (trigger) {
                e.preventDefault();
                e.stopPropagation();
                var help = trigger.closest('.expert-help');
                if (!help) return;
                var isOpen = help.classList.toggle('is-open');
                trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                return;
            }
            if (!e.target.closest('.expert-help-menu')) {
                document.querySelectorAll('.expert-help.is-open').forEach(function (el) {
                    el.classList.remove('is-open');
                });
                document.querySelectorAll('.expert-help-trigger').forEach(function (el) {
                    el.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    function initTopBannerCarouselPreview() {
        document.querySelectorAll('.topBanner-carousel').forEach(function (carousel) {
            var slides = carousel.querySelectorAll('.topBanner-promo');
            var current = 0;
            var total = slides.length;
            if (total < 2) return;

            function showSlide(index) {
                current = (index + total) % total;
                slides.forEach(function (slide, i) {
                    var active = i === current;
                    slide.classList.toggle('is-active', active);
                    slide.setAttribute('aria-hidden', active ? 'false' : 'true');
                });
            }

            var prevBtn = carousel.querySelector('.topBanner-carousel-btn--prev');
            var nextBtn = carousel.querySelector('.topBanner-carousel-btn--next');
            if (prevBtn) prevBtn.addEventListener('click', function () { showSlide(current - 1); });
            if (nextBtn) nextBtn.addEventListener('click', function () { showSlide(current + 1); });
            showSlide(0);
        });
    }

    function init() {
        REGIONS.reduce(function (chain, region) {
            return chain.then(function () {
                return loadRegion(region);
            });
        }, Promise.resolve()).then(initMobileMenuPreview).then(initExpertHelpPreview).then(initTopBannerCarouselPreview);
    }

    init();
})();
