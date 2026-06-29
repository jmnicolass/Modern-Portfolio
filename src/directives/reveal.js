// v-reveal: fade/translate elements into view on scroll.
// Respects prefers-reduced-motion (handled in CSS by neutralizing .reveal-init).
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default {
  mounted(el, binding) {
    if (prefersReducedMotion()) {
      el.classList.add('reveal-in');
      return;
    }

    el.classList.add('reveal-init');

    const delay = Number(binding.value) || 0;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('reveal-in');
          el.classList.remove('reveal-init');
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    el._revealObserver = observer;
  },
  unmounted(el) {
    if (el._revealObserver) {
      el._revealObserver.disconnect();
      delete el._revealObserver;
    }
  },
};
