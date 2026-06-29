<template>
  <div
    class="relative grid grid-cols-[18px_minmax(0,1fr)] gap-3"
    :class="last
      ? ''
      : 'before:absolute before:bottom-[-45px] before:left-[8.5px] before:top-[33px] before:w-px before:bg-border before:content-[\'\']'"
  >
    <div
      class="relative z-10 mt-[26px] grid h-3.5 w-3.5 place-items-center justify-self-center rounded-full border-2 transition-colors"
      :class="present
        ? 'border-accent-mint bg-surface-warm shadow-[0_0_0_4px_rgb(var(--surface-warm)),0_0_12px_rgb(var(--accent-mint)_/_0.35)]'
        : 'border-border bg-surface-warm shadow-[0_0_0_4px_rgb(var(--surface-warm))]'"
    >
      <span
        class="h-1.5 w-1.5 rounded-full"
        :class="present ? 'bg-accent-mint' : 'bg-muted-foreground/40'"
      ></span>
    </div>
    <div class="min-w-0 rounded-card border border-border bg-background p-3.5 transition-colors hover:border-accent-cyan/40">
      <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <h3 class="font-semibold leading-tight">{{ position }}</h3>
        <span class="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{{ duration }}</span>
      </div>
      <p class="mt-1 text-sm text-muted-foreground">{{ company }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  position: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  present: { type: Boolean, default: false },
  last: { type: Boolean, default: false }
});
</script>
