// v-tilt: small 3D tilt toward the pointer while hovering. Skipped for reduced motion and touch.
const MAX_DEG = 5;

export default {
  mounted(el) {
    const canTilt =
      window.matchMedia('(hover: hover)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canTilt) return;

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) translateY(-6px) rotateX(${(-y * MAX_DEG).toFixed(2)}deg) rotateY(${(x * MAX_DEG).toFixed(2)}deg)`;
    };
    const leave = () => {
      el.style.transform = '';
    };

    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    el._tilt = { move, leave };
  },
  unmounted(el) {
    if (!el._tilt) return;
    el.removeEventListener('pointermove', el._tilt.move);
    el.removeEventListener('pointerleave', el._tilt.leave);
    delete el._tilt;
  },
};
