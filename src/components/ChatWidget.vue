<template>
  <div class="fixed bottom-5 right-5 z-40 flex flex-col items-end sm:bottom-6 sm:right-6">
    <Transition name="chat">
      <div
        v-if="open"
        class="mb-3 flex h-[30rem] max-h-[calc(100vh-8rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-card border border-border bg-surface-warm shadow-card"
        role="dialog"
        aria-label="Portfolio assistant"
      >
        <div class="flex items-center justify-between gap-3 border-b border-border bg-surface-elevated/70 px-4 py-3">
          <div class="flex items-center gap-2.5">
            <span class="grid h-8 w-8 place-items-center rounded-tag bg-foreground text-background">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5m-9 6 1.5-3A8.5 8.5 0 1 1 20 12a8.5 8.5 0 0 1-13.5 6.9L4 20z" />
              </svg>
            </span>
            <div class="leading-tight">
              <p class="text-sm font-semibold">Portfolio Assistant</p>
              <p class="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <span class="h-1.5 w-1.5 rounded-full bg-accent-mint shadow-[0_0_8px_2px_rgb(var(--accent-mint)_/_0.8)]"></span>
                Online
              </p>
            </div>
          </div>
          <button
            type="button"
            class="grid h-8 w-8 place-items-center rounded-tag border border-border text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            aria-label="Close chat"
            @click="open = false"
          >
            <span class="text-lg leading-none">&times;</span>
          </button>
        </div>

        <div ref="scroller" class="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <div v-for="(msg, i) in messages" :key="i" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[85%]">
              <div
                class="whitespace-pre-line rounded-card px-3 py-2 text-sm leading-6"
                :class="msg.role === 'user'
                  ? 'bg-foreground text-background'
                  : 'border border-border bg-background text-foreground'"
              >{{ msg.text }}</div>
              <div v-if="msg.links && msg.links.length" class="mt-1.5 flex flex-wrap gap-1.5">
                <a
                  v-for="link in msg.links"
                  :key="link.url"
                  :href="link.url"
                  :target="link.url.startsWith('mailto:') ? '_self' : '_blank'"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 rounded-tag border border-border bg-surface-elevated px-2.5 py-1 font-mono text-[11px] text-accent-cyan transition-colors hover:border-accent-cyan"
                >
                  {{ link.label }}
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 border-t border-border px-3 pt-3">
          <button
            v-for="q in quickReplies"
            :key="q"
            type="button"
            class="rounded-tag border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-accent-cyan hover:text-foreground"
            @click="send(q)"
          >
            {{ q }}
          </button>
        </div>

        <form class="flex items-center gap-2 p-3" @submit.prevent="send(draft)">
          <input
            v-model="draft"
            type="text"
            placeholder="Ask about projects, skills…"
            aria-label="Type your question"
            class="h-10 min-w-0 flex-1 rounded-tag border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent-cyan"
          />
          <button
            type="submit"
            class="grid h-10 w-10 shrink-0 place-items-center rounded-tag bg-foreground text-background transition-colors hover:bg-accent-mint disabled:opacity-40"
            :disabled="!draft.trim()"
            aria-label="Send message"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>
    </Transition>

    <button
      type="button"
      class="group grid h-14 w-14 place-items-center rounded-full bg-foreground text-background shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-mint"
      :aria-label="open ? 'Close chat assistant' : 'Open chat assistant'"
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
import { ref, nextTick } from 'vue';

const props = defineProps({
  profile: { type: Object, required: true },
  skills: { type: Array, default: () => [] },
  projects: { type: Array, default: () => [] },
  experience: { type: Array, default: () => [] },
  education: { type: Array, default: () => [] },
  awards: { type: Array, default: () => [] },
  certifications: { type: Array, default: () => [] },
  hobbies: { type: Object, default: () => ({}) },
  socialLinks: { type: Array, default: () => [] },
  email: { type: String, default: '' }
});

const open = ref(false);
const draft = ref('');
const scroller = ref(null);
const quickReplies = ['Projects', 'Skills', 'Experience', 'Education', 'Contact', 'Resume'];

const firstName = (props.profile.name || '').split(' ')[0] || 'this developer';

const messages = ref([
  {
    role: 'bot',
    text: `Hi! I'm ${firstName}'s portfolio assistant. Ask me about his projects, skills, experience, education, awards, certifications, or how to get in touch.`,
    links: []
  }
]);

const emailAddress = () => props.email.replace(/^mailto:/, '');

// Rule-based reply built ONLY from the portfolio's existing data.
const buildReply = (raw) => {
  const q = raw.toLowerCase();
  const has = (...words) => words.some((w) => q.includes(w));

  if (has('hi', 'hello', 'hey', 'yo ', 'good morning', 'good evening')) {
    return { text: `Hey! 👋 I can tell you about ${firstName}'s work. What would you like to know?` };
  }

  if (has('thank', 'thx', 'appreciate')) {
    return { text: "You're welcome! Anything else you'd like to know?" };
  }

  if (has('who', 'about', 'yourself', 'tell me about', 'bio')) {
    return { text: `${props.profile.name} — ${props.profile.title}.\n\n${props.profile.bio}` };
  }

  if (has('location', 'where', 'based', 'live', 'from')) {
    return { text: `${firstName} is based in ${props.profile.location}.` };
  }

  if (has('skill', 'tech', 'stack', 'language', 'framework', 'tool', 'know how')) {
    const lines = props.skills.map((g) => `• ${g.category}: ${g.items.join(', ')}`);
    return { text: `Here's the tech stack:\n\n${lines.join('\n')}` };
  }

  if (has('project', 'portfolio', 'work', 'built', 'app', 'website')) {
    const links = props.projects
      .filter((p) => p.link && p.link !== '#')
      .map((p) => ({ label: p.title, url: p.link }));
    const names = props.projects.map((p) => p.title).join(', ');
    return {
      text: `${firstName} has ${props.projects.length} featured projects: ${names}. Tap one to visit it live:`,
      links
    };
  }

  if (has('experience', 'job', 'role', 'career', 'company', 'employ')) {
    const lines = props.experience.map((e) => `• ${e.position} — ${e.company} (${e.duration})`);
    return { text: `Work experience:\n\n${lines.join('\n')}` };
  }

  if (has('education', 'school', 'study', 'degree', 'university', 'college')) {
    const lines = props.education.map((e) => `• ${e.degree} — ${e.school} (${e.year})`);
    return { text: `Education:\n\n${lines.join('\n')}` };
  }

  if (has('award', 'achievement', 'recognition', 'honor', 'cum laude')) {
    const lines = props.awards.map((a) => `• ${a.title} — ${a.organization} (${a.year})`);
    return { text: `Awards:\n\n${lines.join('\n')}` };
  }

  if (has('cert', 'credential', 'claude', 'anthropic', 'course')) {
    const lines = props.certifications.map((c) => `• ${c.title} — ${c.organization} (${c.year})`);
    const links = props.certifications
      .filter((c) => c.verifyLink)
      .map((c) => ({ label: `Verify ${c.title}`, url: c.verifyLink }));
    return { text: `Certifications:\n\n${lines.join('\n')}`, links };
  }

  if (has('contact', 'email', 'reach', 'hire', 'connect', 'message', 'get in touch', 'available')) {
    const links = [];
    if (props.email) links.push({ label: 'Email', url: props.email });
    props.socialLinks.forEach((s) => links.push({ label: s.label, url: s.url }));
    return {
      text: `${firstName} is open to new opportunities! Reach out at ${emailAddress()} or via these links:`,
      links
    };
  }

  if (has('resume', 'cv', 'download')) {
    return { text: 'You can open and download the résumé using the "View Resume" button near the top of the page.' };
  }

  if (has('hobby', 'hobbies', 'free time', 'fun', 'interest', 'outside')) {
    return { text: props.hobbies.description || 'No hobbies listed.' };
  }

  return {
    text: `I'm not sure about that one. I can help with ${firstName}'s projects, skills, experience, education, awards, certifications, or contact details — try one of the buttons below.`
  };
};

const scrollToBottom = async () => {
  await nextTick();
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
};

const send = (text) => {
  const content = (text || '').trim();
  if (!content) return;
  messages.value.push({ role: 'user', text: content, links: [] });
  draft.value = '';
  const reply = buildReply(content);
  messages.value.push({ role: 'bot', text: reply.text, links: reply.links || [] });
  scrollToBottom();
};

const toggle = () => {
  open.value = !open.value;
  if (open.value) scrollToBottom();
};
</script>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
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
  .chat-leave-active {
    transition: none;
  }
}
</style>
