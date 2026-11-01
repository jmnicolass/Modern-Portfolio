<template>
  <div>
    <!-- Dim the page behind the sheet on phones -->
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden" aria-hidden="true" @click="open = false"></div>
    </Transition>

    <Transition name="chat">
      <section
        v-if="open"
        class="fixed inset-x-0 bottom-0 z-50 flex h-[85svh] flex-col overflow-hidden rounded-t-3xl border border-line bg-background shadow-[0_-12px_40px_rgb(0_0_0/0.25)] sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[34rem] sm:max-h-[calc(100svh-8rem)] sm:w-[23rem] sm:rounded-3xl sm:shadow-[0_24px_64px_rgb(0_0_0/0.25)]"
        role="dialog"
        aria-modal="false"
        aria-label="Chat with Marco's assistant"
        @keydown.esc="open = false"
      >
        <!-- Grab handle (phones) -->
        <div class="flex justify-center pt-2 sm:hidden" aria-hidden="true">
          <span class="h-1 w-10 rounded-full bg-line"></span>
        </div>

        <header class="flex items-center gap-3 border-b border-line px-4 py-3">
          <span class="relative shrink-0">
            <img :src="avatar" alt="" class="h-10 w-10 rounded-full bg-surface object-cover object-top grayscale" />
            <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500"></span>
          </span>
          <div class="min-w-0 flex-1 leading-tight">
            <p class="truncate font-semibold">{{ name }}'s assistant</p>
            <p class="truncate text-xs text-muted-foreground">Online · replies instantly</p>
          </div>
          <button
            type="button"
            class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Close chat"
            @click="open = false"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div ref="scroller" class="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
          <div v-for="(msg, i) in messages" :key="i" class="msg flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[85%]">
              <div
                class="whitespace-pre-line px-3.5 py-2.5 text-[15px] leading-relaxed"
                :class="msg.role === 'user'
                  ? 'rounded-2xl rounded-br-md bg-foreground text-background'
                  : 'rounded-2xl rounded-bl-md bg-surface text-foreground'"
              >{{ msg.text }}</div>
              <div v-if="msg.links && msg.links.length" class="mt-2 flex flex-wrap gap-1.5">
                <a
                  v-for="link in msg.links"
                  :key="link.url + link.label"
                  :href="link.url"
                  :target="isExternal(link.url) ? '_blank' : undefined"
                  :rel="isExternal(link.url) ? 'noopener noreferrer' : undefined"
                  class="inline-flex items-center gap-1 rounded-full border border-line bg-background px-3 py-1.5 text-xs font-semibold transition-colors hover:border-foreground"
                  @click="onLink(link.url)"
                >
                  {{ link.label }}
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M17 7H8M17 7v9" /></svg>
                </a>
              </div>
            </div>
          </div>

          <div v-if="typing" class="flex justify-start" aria-label="Assistant is typing">
            <div class="flex items-center gap-1 rounded-2xl rounded-bl-md bg-surface px-4 py-3.5">
              <span class="dot"></span><span class="dot" style="animation-delay: 0.15s"></span><span class="dot" style="animation-delay: 0.3s"></span>
            </div>
          </div>
        </div>

        <div class="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2">
          <button
            v-for="q in quickReplies"
            :key="q"
            type="button"
            class="shrink-0 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:opacity-50"
            :disabled="typing"
            @click="send(q)"
          >
            {{ q }}
          </button>
        </div>

        <form class="px-4 pb-4 pt-1" @submit.prevent="send(draft)">
          <div class="flex items-center gap-2 rounded-full border border-line bg-surface/60 py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-foreground/40">
            <input
              ref="input"
              v-model="draft"
              type="text"
              enterkeyhint="send"
              placeholder="Ask about services, projects, timelines…"
              aria-label="Type your question"
              class="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80 disabled:opacity-30"
              :disabled="!draft.trim() || typing"
              aria-label="Send message"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0-6 6m6-6 6 6" /></svg>
            </button>
          </div>
        </form>
      </section>
    </Transition>

    <button
      type="button"
      class="fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-foreground text-background shadow-[0_12px_32px_rgb(0_0_0/0.25)] transition-transform hover:scale-105 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      :class="open ? 'max-sm:hidden' : ''"
      :aria-label="open ? 'Close chat' : 'Chat with Marco\'s assistant'"
      :aria-expanded="open"
      @click="toggle"
    >
      <svg v-if="!open" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5m-9 6 1.5-3A8.5 8.5 0 1 1 20 12a8.5 8.5 0 0 1-13.5 6.9L4 20z" />
      </svg>
      <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';

const props = defineProps({
  profile: { type: Object, required: true },
  avatar: { type: String, default: '' },
  skills: { type: Array, default: () => [] },
  projects: { type: Array, default: () => [] },
  experience: { type: Array, default: () => [] },
  education: { type: Array, default: () => [] },
  awards: { type: Array, default: () => [] },
  certifications: { type: Array, default: () => [] },
  socialLinks: { type: Array, default: () => [] },
  email: { type: String, default: '' }
});

const name = props.profile.preferredName || (props.profile.name || '').split(' ')[0] || 'Marco';
const quickReplies = ['Services', 'Projects', 'Pricing', 'Timeline', 'Tech stack', 'Start a project'];

const open = ref(false);
const draft = ref('');
const typing = ref(false);
const scroller = ref(null);
const input = ref(null);

const messages = ref([
  {
    role: 'bot',
    text: `Hi! I'm ${name}'s assistant. I can tell you what ${name} builds, show past projects, or help you start one. What are you working on?`,
    links: []
  }
]);

const emailAddress = () => props.email.replace(/^mailto:/, '');
const isExternal = (url) => /^https?:/.test(url);
const contactLinks = () => [
  { label: 'Start a project', url: '#contact' },
  ...(props.email ? [{ label: 'Email', url: props.email }] : []),
  ...props.socialLinks.map((s) => ({ label: s.label, url: s.url }))
];
const liveLink = (p) => (p.link && p.link !== '#' ? [{ label: `Open ${p.title}`, url: p.link }] : []);

// Whole-word / whole-phrase matching, so "hi" doesn't fire on "this" or "his".
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matcher = (q) => (...terms) => terms.some((t) => new RegExp(`(^|[^a-z0-9])${escape(t)}($|[^a-z0-9])`).test(q));

// Rule-based replies built only from the portfolio's own data.
const buildReply = (raw) => {
  const q = raw.toLowerCase().trim();
  const has = matcher(q);

  if (/^(hi|hello|hey|yo|good (morning|afternoon|evening))\b[\s!.?]*$/.test(q)) {
    return { text: `Hey! 👋 Are you planning a new website or app? I can walk you through what ${name} builds.` };
  }

  if (has('thank', 'thanks', 'thx', 'appreciate it')) {
    return { text: "You're welcome! Anything else you'd like to know?" };
  }

  if (has('start a project', 'hire', 'hiring', 'contact', 'email', 'reach', 'get in touch', 'talk', 'call', 'meeting')) {
    return {
      text: `Great! Send ${name} a short note at ${emailAddress()} with what you need, who it's for and when you'd like to launch. You'll get a reply within 24 hours.`,
      links: contactLinks()
    };
  }

  if (has('price', 'pricing', 'cost', 'costs', 'rate', 'rates', 'budget', 'quote', 'how much', 'fee', 'fees')) {
    return {
      text: `Every project is quoted on its scope, so there's no fixed price list. Tell ${name} what you need and you'll get a clear quote with your plan, in pesos or dollars.`,
      links: [{ label: 'Start a project', url: '#contact' }]
    };
  }

  if (has('timeline', 'how long', 'weeks', 'deadline', 'available', 'availability', 'when can', 'start date', 'free', 'capacity')) {
    return {
      text: `${name} is taking one new project now, so yours gets full attention. Timelines depend on scope; you'll get one with your plan after a short chat.`,
      links: [{ label: 'Start a project', url: '#contact' }]
    };
  }

  const project = props.projects.find((p) =>
    p.title.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && w !== 'tours').some((w) => has(w))
  );
  if (project) {
    return {
      text: `${project.title}${project.category ? ` (${project.category})` : ''}\n\nIn ${name}'s words: “${project.description}”\n\nBuilt with ${project.technologies.join(', ')}.`,
      links: [...liveLink(project), { label: 'See all work', url: '#work' }]
    };
  }

  if (has('service', 'services', 'offer', 'build', 'make', 'help', 'website', 'web app', 'app', 'booking', 'store', 'shop', 'ecommerce', 'e-commerce', 'dashboard')) {
    return {
      text: `${name} designs, builds and launches custom web apps for small businesses and startups:\n\n• Booking and management systems\n• Online stores\n• Admin dashboards and custom web apps\n\nOne developer from database to design, with clear updates every week.`,
      links: [{ label: 'See work', url: '#work' }, { label: 'Start a project', url: '#contact' }]
    };
  }

  if (has('project', 'projects', 'portfolio', 'work', 'examples', 'clients', 'client')) {
    const lines = props.projects.map((p) => `• ${p.title}: ${p.category || ''}`);
    return {
      text: `Here's some of ${name}'s work:\n\n${lines.join('\n')}\n\nAsk about any of them by name.`,
      links: [...props.projects.flatMap(liveLink), { label: 'See all work', url: '#work' }]
    };
  }

  if (has('tech', 'tech stack', 'stack', 'skills', 'skill', 'language', 'languages', 'framework', 'tools', 'vue', 'react', 'laravel', 'php', 'ai', 'claude', 'chatgpt')) {
    const lines = props.skills.map((g) => `• ${g.category}: ${g.items.join(', ')}`);
    return { text: `${name}'s tech stack:\n\n${lines.join('\n')}` };
  }

  if (has('experience', 'job', 'jobs', 'career', 'company', 'employed', 'qstrike', 'background')) {
    const lines = props.experience.map((e) => `• ${e.position}, ${e.company} (${e.duration})`);
    return { text: `Work experience:\n\n${lines.join('\n')}`, links: [{ label: 'See experience', url: '#experience' }] };
  }

  if (has('education', 'school', 'study', 'degree', 'university', 'college')) {
    const lines = props.education.map((e) => `• ${e.degree}, ${e.school} (${e.year})`);
    return { text: `Education:\n\n${lines.join('\n')}` };
  }

  if (has('award', 'awards', 'achievement', 'achievements', 'cum laude', 'titanium')) {
    const lines = props.awards.map((a) => `• ${a.title}, ${a.organization} (${a.year})`);
    return { text: `Awards:\n\n${lines.join('\n')}`, links: [{ label: 'See credentials', url: '#credentials' }] };
  }

  if (has('cert', 'certs', 'certificate', 'certificates', 'certification', 'certifications', 'credential', 'credentials', 'course', 'courses')) {
    const lines = props.certifications.map((c) => `• ${c.title}, ${c.organization} (${c.year})`);
    const links = props.certifications.filter((c) => c.verifyLink).map((c) => ({ label: `Verify ${c.title}`, url: c.verifyLink }));
    return { text: `Certifications:\n\n${lines.join('\n')}`, links };
  }

  if (has('resume', 'résumé', 'cv')) {
    return { text: 'You can view and download the résumé from the "Résumé" button in the top bar or the footer.' };
  }

  if (has('location', 'where', 'based', 'country', 'timezone', 'time zone', 'philippines', 'overseas', 'abroad')) {
    return { text: `${name} is based in ${props.profile.location} and works with clients in the Philippines and worldwide.` };
  }

  if (has('who', 'yourself', 'bio', 'about you', 'about marco', 'marco', 'jan')) {
    return { text: `${props.profile.name} is a ${props.profile.title.toLowerCase()} based in ${props.profile.location}.\n\nIn ${name}'s words: “${props.profile.bio}”` };
  }

  return {
    text: `I'm not sure about that one. Try asking about services, projects, pricing or timelines, or reach ${name} directly.`,
    links: contactLinks().slice(0, 2)
  };
};

const scrollToBottom = async () => {
  await nextTick();
  if (scroller.value) scroller.value.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' });
};

const send = (text) => {
  const content = (text || '').trim();
  if (!content || typing.value) return;
  messages.value.push({ role: 'user', text: content, links: [] });
  draft.value = '';
  typing.value = true;
  scrollToBottom();
  const reply = buildReply(content);
  const delay = Math.min(1200, 450 + reply.text.length * 4);
  window.setTimeout(() => {
    typing.value = false;
    messages.value.push({ role: 'bot', text: reply.text, links: reply.links || [] });
    scrollToBottom();
  }, delay);
};

// In-page links (#contact, #work…) close the sheet so the section is visible.
const onLink = (url) => {
  if (url.startsWith('#')) open.value = false;
};

const toggle = () => {
  open.value = !open.value;
};

watch(open, async (isOpen) => {
  if (!isOpen) return;
  scrollToBottom();
  // Focus the field on desktop only; on phones it would pop the keyboard over the sheet.
  if (window.matchMedia('(hover: hover)').matches) {
    await nextTick();
    input.value?.focus();
  }
});
</script>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(24px);
}

@media (min-width: 640px) {
  .chat-enter-from,
  .chat-leave-to {
    transform: translateY(12px) scale(0.97);
    transform-origin: bottom right;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.msg {
  animation: msg-in 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: rgb(var(--muted-foreground));
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (prefers-reduced-motion: reduce) {
  .chat-enter-active,
  .chat-leave-active,
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }

  .msg,
  .dot {
    animation: none;
  }
}
</style>
