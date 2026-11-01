<template>
  <section :aria-labelledby="headingId" class="py-16 sm:py-24">
    <div v-reveal class="mx-auto mb-10 max-w-2xl text-center">
      <h2 :id="headingId" class="text-4xl font-bold sm:text-5xl">{{ title }}</h2>
      <p v-if="description" class="mt-3 text-lg text-muted-foreground">{{ description }}</p>
    </div>
    <slot />
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' }
});

const headingId = computed(
  () => 'section-' + props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
);
</script>
