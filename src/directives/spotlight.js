// v-spotlight: soft glow that follows the pointer inside a card (styles in main.css).
export default {
  mounted(el) {
    el.classList.add('spotlight');
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    };
    el.addEventListener('pointermove', move, { passive: true });
    el._spotlightMove = move;
  },
  unmounted(el) {
    el.removeEventListener('pointermove', el._spotlightMove);
    delete el._spotlightMove;
  },
};
