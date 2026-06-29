<template>
  <div class="rounded-card border border-border bg-background p-3 transition-colors hover:border-accent-cyan/50">
    <p class="font-mono text-xl font-semibold text-foreground">{{ value }}</p>
    <p class="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  value: { type: String, required: true },
  label: { type: String, required: true }
});
</script>
