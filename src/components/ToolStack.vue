<template>
  <div>
    <div class="mb-8 flex justify-center">
      <div class="no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface/60 p-1" role="tablist" aria-label="Filter tools">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          role="tab"
          :aria-selected="active === tab"
          class="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors"
          :class="active === tab ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          @click="active = tab"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <TransitionGroup tag="ul" name="tool" class="relative mx-auto flex max-w-[53rem] flex-wrap justify-center gap-3">
      <li
        v-for="tool in visible"
        :key="tool.name"
        v-spotlight
        class="card group/tool flex w-[calc(50%-0.375rem)] flex-col items-center px-3 py-6 text-center sm:w-40"
        :style="{ '--brand': tool.color }"
      >
        <svg v-if="tool.path" viewBox="0 0 24 24" class="tool-logo h-9 w-9" aria-hidden="true">
          <path v-if="tool.stroke" :d="tool.path" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          <path v-else :d="tool.path" fill="currentColor" />
        </svg>
        <span v-else class="grid h-9 w-9 place-items-center rounded-lg border border-line text-sm font-bold">{{ tool.name[0] }}</span>
        <p class="mt-4 text-sm font-semibold">{{ tool.name }}</p>
        <p class="text-xs text-muted-foreground">{{ tool.category }}</p>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  siHtml5,
  siCss,
  siJavascript,
  siTypescript,
  siVuedotjs,
  siReact,
  siPhp,
  siLaravel,
  siNodedotjs,
  siMysql,
  siTailwindcss,
  siUikit,
  siGit,
  siClaude
} from 'simple-icons';

const props = defineProps({
  groups: { type: Array, required: true } // [{ category, items: [name] }]
});

// Brand logos (Simple Icons, CC0) keyed by the names used in the skills data.
const logos = {
  HTML: siHtml5,
  CSS: siCss,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  'Vue.js': siVuedotjs,
  React: siReact,
  PHP: siPhp,
  Laravel: siLaravel,
  'Node.js': siNodedotjs,
  MySQL: siMysql,
  'Tailwind CSS': siTailwindcss,
  UIKit: siUikit,
  Git: siGit,
  Claude: siClaude,
  // OpenAI's logo isn't in Simple Icons; a neutral chat glyph (Heroicons, MIT) in OpenAI green stands in.
  ChatGPT: {
    hex: '10A37F',
    path: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z',
    stroke: true
  }
};

const tools = computed(() =>
  props.groups.flatMap((group) =>
    group.items.map((name) => ({
      name,
      category: group.category,
      path: logos[name]?.path,
      stroke: !!logos[name]?.stroke,
      color: logos[name] ? `#${logos[name].hex}` : 'currentColor'
    }))
  )
);

const tabs = computed(() => ['All', ...props.groups.map((g) => g.category)]);
const active = ref('All');
const visible = computed(() =>
  active.value === 'All' ? tools.value : tools.value.filter((t) => t.category === active.value)
);
</script>

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.tool-logo {
  color: rgb(var(--muted-foreground));
  transition:
    color 0.3s ease,
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.group\/tool:hover .tool-logo {
  color: var(--brand);
  transform: scale(1.12);
}

.tool-move,
.tool-enter-active,
.tool-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.tool-enter-from,
.tool-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.tool-leave-active {
  position: absolute;
}
</style>
