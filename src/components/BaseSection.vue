<template>
  <section
    v-reveal
    :aria-labelledby="headingId"
    class="codex-panel rounded-card border border-border bg-surface-warm p-4 sm:p-5"
  >
    <div class="flex items-end justify-between gap-3">
      <div class="min-w-0">
        <p v-if="index" class="mb-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {{ index }}<template v-if="eyebrow"> / {{ eyebrow }}</template>
        </p>
        <h2 :id="headingId" class="text-lg font-semibold tracking-normal">{{ title }}</h2>
      </div>
      <div v-if="$slots.action" class="shrink-0">
        <slot name="action" />
      </div>
    </div>
    <div class="mt-4">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  index: { type: String, default: '' }, // e.g. "01"
  eyebrow: { type: String, default: '' } // mono label; defaults to title
});

const headingId = computed(
  () => 'section-' + props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
);
</script>
