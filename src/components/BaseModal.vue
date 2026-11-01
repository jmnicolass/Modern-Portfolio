<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
      :class="overlayClass"
      role="dialog"
      aria-modal="true"
      @click="$emit('close')"
    >
      <div
        class="w-full overflow-hidden rounded-card border border-line bg-background shadow-[0_24px_80px_rgb(0_0_0/0.25)] animate-scale-in"
        :class="panelClass"
        @click.stop
      >
        <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-6">
          <div class="min-w-0">
            <p v-if="eyebrow" class="text-sm text-muted-foreground">{{ eyebrow }}</p>
            <h3 class="truncate text-xl font-semibold tracking-tight">{{ title }}</h3>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <slot name="header-actions" />
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-full border border-line text-foreground transition-colors hover:border-foreground"
              aria-label="Close dialog"
              @click="$emit('close')"
            >
              <span class="text-xl leading-none">&times;</span>
            </button>
          </div>
        </div>
        <div :class="bodyClass">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  panelClass: { type: String, default: 'max-w-3xl' },
  bodyClass: { type: String, default: 'p-5 md:p-6' },
  overlayClass: { type: String, default: 'bg-background/80' }
});

defineEmits(['close']);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .animate-scale-in {
    transition: none;
    animation: none;
  }
}
</style>
