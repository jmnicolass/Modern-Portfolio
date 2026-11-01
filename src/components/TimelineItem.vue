<template>
  <div class="tl-item relative pb-6 pl-8 last:pb-0">
    <span class="tl-rail absolute bottom-0 left-[7px] top-5 w-px bg-line" aria-hidden="true"></span>
    <span
      class="absolute left-0 top-1 grid h-[15px] w-[15px] place-items-center rounded-full border-2 border-foreground bg-background"
      aria-hidden="true"
    >
      <span v-if="current" class="h-[5px] w-[5px] rounded-full bg-foreground"></span>
    </span>
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
      <h4 class="font-semibold leading-snug">{{ title }}</h4>
      <span v-if="current" class="inline-flex items-center gap-1.5 rounded-full bg-foreground px-2 py-0.5 text-[11px] font-semibold text-background">
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-background"></span>
        Current
      </span>
    </div>
    <p class="mt-0.5 text-sm text-muted-foreground">{{ subtitle }}</p>
    <p class="mt-2 inline-flex rounded-md bg-surface px-2 py-0.5 text-xs font-medium tabular-nums">{{ meta }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  meta: { type: String, required: true },
  current: { type: Boolean, default: false }
});
</script>
