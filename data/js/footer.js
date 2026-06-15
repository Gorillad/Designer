/**
 * LogicXO catalog footer — auto year, newsletter feedback, back-to-top.
 */
const Footer = (() => {
    function initYear() {
        const yearEl = document.getElementById('footerYear');
        if (!yearEl || yearEl.dataset.footerBound) return;
        yearEl.dataset.footerBound = '1';
        yearEl.textContent = new Date().getFullYear();
    }

    function initNewsletter() {
        const form = document.getElementById('footerNewsletter');
        const input = document.getElementById('footerEmail');
        const msg = document.getElementById('footerNewsletterMsg');
        if (!form || !input || !msg || form.dataset.footerBound) return;

        form.dataset.footerBound = '1';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = input.value.trim();

            if (!emailPattern.test(value)) {
                msg.hidden = false;
                msg.textContent = 'Please enter a valid email address.';
                msg.classList.add('is-error');
                msg.classList.remove('is-success');
                input.focus();
                return;
            }

            msg.hidden = false;
            msg.textContent = 'Thanks! You are on the list.';
            msg.classList.add('is-success');
            msg.classList.remove('is-error');
            form.reset();
        });
    }

    function initBackToTop() {
        const btn = document.getElementById('footerBackToTop');
        if (!btn || btn.dataset.footerBound) return;
        btn.dataset.footerBound = '1';
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function load() {
        initYear();
        initNewsletter();
        initBackToTop();
    }

    return { load };
})();

function bootFooter() {
    if (document.getElementById('footerNewsletter') || document.getElementById('footerYear')) {
        Footer.load();
    }
}

window.bootFooter = bootFooter;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootFooter);
} else {
    bootFooter();
}
