<template>
  <article
    class="group flex flex-col overflow-hidden rounded-card border border-border bg-background transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-cyan/60 hover:shadow-card"
  >
    <button
      type="button"
      class="relative block aspect-video w-full overflow-hidden border-b border-border bg-surface-elevated text-left"
      :aria-label="`View details for ${project.title}`"
      @click="$emit('inspect', project)"
    >
      <img
        v-if="project.images && project.images.length"
        :src="project.images[0]"
        :alt="`${project.title} preview`"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <span class="absolute left-3 top-3 rounded-tag border border-border bg-background/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground backdrop-blur">
        {{ indexLabel }}
      </span>
    </button>

    <div class="flex flex-1 flex-col p-4">
      <h3 class="text-base font-semibold tracking-tight">{{ project.title }}</h3>
      <p class="mt-1.5 line-clamp-3 text-sm leading-6 text-muted-foreground">{{ project.description }}</p>

      <div class="mt-3 flex flex-wrap gap-1.5">
        <TechTag v-for="tech in project.technologies.slice(0, 5)" :key="tech" size="sm">{{ tech }}</TechTag>
      </div>

      <div class="mt-4 flex items-center gap-2 pt-1">
        <button
          type="button"
          class="inline-flex h-9 flex-1 items-center justify-center rounded-tag border border-border bg-surface-warm px-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-surface-elevated"
          @click="$emit('inspect', project)"
        >
          View Details
        </button>
        <a
          v-if="project.link && project.link !== '#'"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Visit ${project.title}`"
          class="inline-flex h-9 w-9 items-center justify-center rounded-tag border border-border text-muted-foreground transition-colors hover:border-accent-cyan hover:text-accent-cyan"
          @click.stop
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import TechTag from './TechTag.vue';

const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, default: 0 }
});

defineEmits(['inspect']);

const indexLabel = computed(() => String(props.index + 1).padStart(2, '0'));
</script>
