<template>
  <article v-spotlight v-tilt class="card group flex flex-col p-2 will-change-transform">
    <!-- Screenshot framed as a small browser window -->
    <button
      type="button"
      class="relative block w-full overflow-hidden rounded-[1.1rem] border border-line bg-surface text-left"
      :aria-label="`View details for ${project.title}`"
      @click="$emit('inspect', project)"
    >
      <span class="flex items-center gap-1.5 border-b border-line bg-background/80 px-3 py-2">
        <span class="h-2 w-2 rounded-full bg-line"></span>
        <span class="h-2 w-2 rounded-full bg-line"></span>
        <span class="h-2 w-2 rounded-full bg-line"></span>
        <span v-if="host" class="ml-2 truncate rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted-foreground">{{ host }}</span>
      </span>
      <span class="block aspect-[16/10] overflow-hidden">
        <img
          v-if="project.images && project.images.length"
          :src="project.images[0]"
          :alt="`${project.title} preview`"
          class="h-full w-full object-cover object-top grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
          loading="lazy"
        />
      </span>
      <span class="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-foreground text-background opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <BaseIcon name="expand" class="h-4 w-4" />
      </span>
      <span v-if="project.images && project.images.length > 1"
        class="absolute left-3 top-11 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
        {{ project.images.length }} screens
      </span>
    </button>

    <div class="flex flex-1 flex-col px-4 pb-4 pt-5">
      <span v-if="project.category" class="inline-flex w-fit items-center rounded-full border border-line bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        {{ project.category }}
      </span>
      <h3 class="mt-3 text-xl font-bold">{{ project.title }}</h3>
      <p class="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">{{ project.description }}</p>

      <div class="mt-4 flex flex-wrap gap-1.5">
        <span v-for="tech in project.technologies.slice(0, 4)" :key="tech"
          class="rounded-md bg-surface px-2 py-0.5 text-xs font-medium">{{ tech }}</span>
        <span v-if="project.technologies.length > 4" class="rounded-md px-1 py-0.5 text-xs text-muted-foreground">
          +{{ project.technologies.length - 4 }}
        </span>
      </div>

      <div class="mt-6 flex items-center gap-2 md:mt-auto md:pt-6">
        <button
          type="button"
          class="btn-shine inline-flex h-10 flex-1 items-center justify-center rounded-full bg-foreground px-4 text-sm font-semibold text-background"
          @click="$emit('inspect', project)"
        >
          View details
        </button>
        <a
          v-if="project.link && project.link !== '#'"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Open ${project.title} live site`"
          class="grid h-10 w-10 place-items-center rounded-full border border-line bg-background transition-all hover:rotate-45 hover:border-foreground"
        >
          <BaseIcon name="arrowUpRight" class="h-4 w-4" />
        </a>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import BaseIcon from './BaseIcon.vue';

const props = defineProps({
  project: { type: Object, required: true }
});

defineEmits(['inspect']);

const host = computed(() => {
  try {
    return new URL(props.project.link).host.replace(/^www\./, '');
  } catch {
    return '';
  }
});
</script>
