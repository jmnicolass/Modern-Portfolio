<template>
  <span
    class="inline-flex items-center rounded-tag border border-border bg-background font-mono text-muted-foreground transition-colors"
    :class="sizeClass"
  >
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: { type: String, default: 'md' } // 'sm' | 'md'
});

const sizeClass = computed(() =>
  props.size === 'sm'
    ? 'px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]'
    : 'px-2.5 py-1 text-xs'
);
</script>
