<template>
  <div class="min-h-screen overflow-x-clip bg-background text-foreground">
    <!-- Resume modal -->
    <BaseModal
      :open="showResumeModal"
      eyebrow="Résumé"
      :title="profile.name"
      panel-class="max-w-5xl h-[90vh]"
      body-class="h-[calc(90vh-77px)] bg-background"
      @close="showResumeModal = false"
    >
      <template #header-actions>
        <a :href="resumePdfUrl" download="Jan_Marco_Nicolas_Resume.pdf"
          class="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-80">
          Download PDF
        </a>
      </template>
      <iframe :src="resumePdfUrl" class="h-full w-full" frameborder="0" type="application/pdf" title="Résumé"></iframe>
    </BaseModal>

    <!-- Project modal -->
    <BaseModal
      :open="showProjectModal"
      :eyebrow="selectedProject?.category"
      :title="selectedProject?.title"
      panel-class="max-w-3xl"
      @close="showProjectModal = false"
    >
      <div class="space-y-7">
        <p class="max-w-prose text-[17px] leading-relaxed text-muted-foreground">{{ selectedProject?.description }}</p>

        <div v-if="selectedProject?.images" class="space-y-3">
          <div class="flex items-baseline justify-between">
            <h4 class="text-sm font-semibold">Screens</h4>
            <span class="text-sm tabular-nums text-muted-foreground">{{ selectedProject.images.length }} {{ selectedProject.images.length === 1 ? 'image' : 'images' }}</span>
          </div>
          <div class="group/gallery relative">
            <div ref="galleryContainer" class="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-1">
              <button v-for="(img, index) in selectedProject.images" :key="index"
                class="aspect-video w-72 flex-shrink-0 cursor-zoom-in snap-center overflow-hidden rounded-xl border border-line bg-surface"
                :aria-label="`Open screen ${index + 1} full size`"
                @click="openFullscreenImage(img)">
                <img :src="img" class="h-full w-full object-cover object-top" :alt="`${selectedProject.title} screen ${index + 1}`" />
              </button>
            </div>
            <template v-if="selectedProject.images.length > 2">
              <button @click="scrollLeft"
                class="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-foreground text-background opacity-0 transition-opacity group-hover/gallery:opacity-100 md:grid"
                aria-label="Scroll gallery left">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button @click="scrollRight"
                class="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-foreground text-background opacity-0 transition-opacity group-hover/gallery:opacity-100 md:grid"
                aria-label="Scroll gallery right">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </template>
          </div>
        </div>

        <div>
          <h4 class="mb-3 text-sm font-semibold">Built with</h4>
          <div class="flex flex-wrap gap-2">
            <TechTag v-for="tech in selectedProject?.technologies" :key="tech">{{ tech }}</TechTag>
          </div>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <a v-if="selectedProject?.link && selectedProject.link !== '#'" :href="selectedProject.link" target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-opacity hover:opacity-80">
            Visit live site
          </a>
          <button @click="showProjectModal = false"
            class="inline-flex h-11 items-center justify-center rounded-full border border-line px-6 text-[15px] font-medium transition-colors hover:border-foreground">
            Close
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Certificate modal -->
    <BaseModal
      :open="showCertificateModal"
      :eyebrow="selectedCertificate?.organization"
      :title="selectedCertificate?.title"
      panel-class="max-w-4xl"
      @close="showCertificateModal = false"
    >
      <img :src="selectedCertificate?.image" :alt="selectedCertificate?.title"
        class="h-auto w-full rounded-xl border border-line bg-background" />
      <a v-if="selectedCertificate?.verifyLink" :href="selectedCertificate?.verifyLink" target="_blank"
        rel="noopener noreferrer"
        class="mt-5 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-opacity hover:opacity-80">
        Verify credential
      </a>
    </BaseModal>

    <!-- Fullscreen image viewer -->
    <Transition name="modal">
      <div v-if="showFullscreenModal"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 md:p-12"
        role="dialog" aria-modal="true"
        @click="showFullscreenModal = false">
        <button @click="showFullscreenModal = false"
          class="absolute right-6 top-6 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-black transition-opacity hover:opacity-80"
          aria-label="Close full-size image">
          <span class="text-2xl leading-none">&times;</span>
        </button>
        <div class="flex h-full w-full items-center justify-center" @click.stop>
          <img :src="selectedFullscreenImage" alt="" class="max-h-full max-w-full rounded-xl object-contain animate-scale-in" />
        </div>
      </div>
    </Transition>

    <!-- Top bar -->
    <header
      class="sticky top-0 z-30 border-b transition-colors"
      :class="scrolled ? 'border-line bg-background/80 backdrop-blur-lg' : 'border-transparent'"
    >
      <div class="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8">
        <nav class="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex" aria-label="Sections">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" class="transition-colors hover:text-foreground">{{ link.label }}</a>
        </nav>
        <span class="md:hidden"></span>
        <a href="#top"
          class="grid h-11 w-11 place-items-center rounded-[14px] border border-line bg-background text-sm font-bold shadow-[0_4px_14px_rgb(0_0_0/0.08)] transition-transform hover:scale-105"
          :aria-label="`${profile.name}, back to top`">
          JM
        </a>
        <div class="flex items-center justify-end gap-2">
          <button type="button" @click="openResumeModal"
            class="hidden h-9 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
            Résumé
          </button>
          <button type="button" @click="darkMode = !darkMode"
            class="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            :aria-label="darkMode ? 'Switch to light mode' : 'Switch to dark mode'">
            <svg v-if="darkMode" class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
            </svg>
            <svg v-else class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main id="top" class="mx-auto max-w-6xl px-5 sm:px-8">
      <!-- Hero -->
      <section class="relative isolate flex min-h-[calc(100svh-4rem)] flex-col items-center pb-36 pt-6 text-center sm:pb-48 sm:pt-10" aria-labelledby="hero-title">
        <p class="enter text-xl font-semibold text-foreground/80 sm:text-2xl">Hey, I'm Marco</p>
        <h1 id="hero-title" class="enter mt-1 text-5xl font-bold leading-[1.05] sm:text-7xl" style="--d: 80ms">Full-Stack Developer</h1>

        <img
          :src="profileImageUrl"
          :alt="`Portrait of ${profile.name}`"
          class="enter mt-8 h-40 w-40 rounded-full bg-surface object-cover object-top grayscale shadow-[0_24px_60px_rgb(0_0_0/0.18)] sm:h-60 sm:w-60"
          style="--d: 160ms"
          draggable="false"
        />

        <p class="enter mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-10 sm:text-lg" style="--d: 240ms">
          {{ profile.bio }}
        </p>

        <div class="enter mt-8 flex flex-wrap items-center justify-center gap-3" style="--d: 320ms">
          <a href="#contact"
            class="btn-shine inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[15px] font-semibold text-background transition-transform hover:-translate-y-0.5">
            Start a project
          </a>
          <a href="#work"
            class="inline-flex h-12 items-center rounded-full border border-line bg-background px-6 text-[15px] font-semibold transition-all hover:-translate-y-0.5 hover:border-foreground/40">
            See my work
          </a>
        </div>

        <p class="enter mt-6 inline-flex max-w-xs items-start gap-2 text-sm text-muted-foreground sm:max-w-none sm:items-center" style="--d: 400ms">
          <span class="relative mt-1.5 flex h-2 w-2 shrink-0 sm:mt-0" aria-hidden="true">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-40"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-foreground"></span>
          </span>
          Taking one new project now. Based in {{ profile.location }}.
        </p>

        <div class="watermark pointer-events-none absolute bottom-0 left-1/2 -z-10 w-screen -translate-x-1/2 select-none overflow-hidden text-center" aria-hidden="true">
          <span class="block translate-y-[16%]">Marco</span>
        </div>
      </section>

      <dl class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div v-for="(item, i) in trustStrip" :key="item.label" v-reveal="i * 80" v-spotlight
          class="card flex flex-col p-5 sm:p-6">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background shadow-md">
            <BaseIcon :name="item.icon" class="h-5 w-5" />
          </span>
          <dd class="mt-6 text-2xl font-bold sm:text-4xl">{{ item.value }}</dd>
          <dt class="mt-1 text-sm leading-snug text-muted-foreground">{{ item.label }}</dt>
        </div>
      </dl>

      <BaseSection id="work" title="Selected work" description="Client and product builds, from a live booking platform to an online store.">
        <div class="grid gap-6 md:grid-cols-2">
          <ProjectCard
            v-for="(project, i) in projects"
            :key="project.id"
            v-reveal="i * 90"
            :project="project"
            @inspect="openProjectModal"
          />
        </div>
      </BaseSection>

      <BaseSection id="experience" title="Experience and education" description="Shipping production web software full time since 2024.">
        <div class="grid gap-5 md:grid-cols-2">
          <div v-for="(group, i) in timelineGroups" :key="group.title" v-reveal="i * 90" v-spotlight class="card p-6 sm:p-7">
            <div class="mb-7 flex items-center gap-3">
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background shadow-md">
                <BaseIcon :name="group.icon" class="h-5 w-5" />
              </span>
              <div>
                <h3 class="font-bold">{{ group.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ group.caption }}</p>
              </div>
            </div>
            <TimelineItem
              v-for="(entry, j) in group.items"
              :key="entry.id"
              :title="entry.title"
              :subtitle="entry.subtitle"
              :meta="entry.meta"
              :current="group.title === 'Work' && j === 0"
            />
          </div>
        </div>
      </BaseSection>

      <BaseSection id="credentials" title="Credentials" description="Select an item with a certificate to view it.">
        <div class="grid gap-5 md:grid-cols-2">
          <div v-for="(group, i) in credentialGroups" :key="group.title" v-reveal="i * 90" v-spotlight class="card p-4 sm:p-5">
            <div class="mb-3 flex items-center gap-3 px-2 pt-1">
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background shadow-md">
                <BaseIcon :name="group.icon" class="h-5 w-5" />
              </span>
              <div>
                <h3 class="font-bold">{{ group.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ group.items.length }} {{ group.unit }}</p>
              </div>
            </div>
            <ul class="space-y-1">
              <li v-for="item in group.items" :key="item.id">
                <component
                  :is="item.image ? 'button' : 'div'"
                  :type="item.image ? 'button' : undefined"
                  class="group/row flex w-full items-center justify-between gap-4 rounded-2xl px-3 py-3 text-left transition-colors"
                  :class="item.image ? 'hover:bg-surface' : ''"
                  @click="item.image ? openCertificateModal(item) : null"
                >
                  <span class="min-w-0">
                    <span class="block font-semibold">{{ item.title }}</span>
                    <span class="block truncate text-sm text-muted-foreground">{{ item.organization }} · {{ item.year }}</span>
                  </span>
                  <span v-if="item.image"
                    class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-background transition-all group-hover/row:border-foreground group-hover/row:bg-foreground group-hover/row:text-background">
                    <BaseIcon name="chevronRight" class="h-3.5 w-3.5" />
                  </span>
                </component>
              </li>
            </ul>
          </div>
        </div>
      </BaseSection>

      <BaseSection title="Tools" description="What I build with day to day. Hover a tool to see it in color.">
        <ToolStack :groups="skills" />
      </BaseSection>

      <!-- Contact -->
      <section id="contact" v-reveal v-spotlight class="card contact-dots my-12 flex flex-col items-center overflow-hidden px-6 py-16 text-center sm:my-20 sm:px-12 sm:py-20"
        aria-labelledby="contact-title">
        <h2 id="contact-title" class="max-w-2xl text-balance text-4xl font-bold sm:text-6xl">Have a project in mind? Let's talk.</h2>
        <p class="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Tell me what you need, who it's for and when you'd like to launch. I'll reply within 24 hours with next steps, and an honest answer if I'm not the right fit.
        </p>
        <a :href="emailLink.url"
          class="btn-shine mt-9 inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[15px] font-semibold text-background transition-transform hover:-translate-y-0.5">
          Email me about your project
        </a>
        <a :href="emailLink.url" class="mt-2 py-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline">
          {{ emailAddress }}
        </a>
        <SocialLinks class="mt-8 justify-center" :links="socialLinks" />
      </section>
    </main>

    <footer class="mx-auto flex max-w-6xl flex-col items-center gap-2 border-t border-line px-5 pb-24 pt-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-8 sm:pb-8">
      <p>© 2026 {{ profile.name }}</p>
      <div class="flex items-center gap-6">
        <button type="button" class="py-2 transition-colors hover:text-foreground" @click="openResumeModal">Résumé (PDF)</button>
        <a v-for="link in socialLinks" :key="link.id" :href="link.url" target="_blank" rel="noopener noreferrer"
          class="py-2 transition-colors hover:text-foreground">{{ link.label }}</a>
      </div>
    </footer>

    <ChatWidget
      :profile="profile"
      :avatar="profileImageUrl"
      :skills="skills"
      :projects="projects"
      :experience="experience"
      :education="education"
      :awards="awards"
      :certifications="certifications"
      :social-links="socialLinks"
      :email="emailLink.url"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import SocialLinks from './components/SocialLinks.vue';
import BaseSection from './components/BaseSection.vue';
import BaseModal from './components/BaseModal.vue';
import TechTag from './components/TechTag.vue';
import ProjectCard from './components/ProjectCard.vue';
import TimelineItem from './components/TimelineItem.vue';
import ChatWidget from './components/ChatWidget.vue';
import BaseIcon from './components/BaseIcon.vue';
import ToolStack from './components/ToolStack.vue';
import profileImageUrl from './assets/profile/Profile-sharp.png';

// Light-first: stored choice wins; else honor an OS dark preference.
const getInitialDark = () => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

const darkMode = ref(getInitialDark());

watch(
  darkMode,
  (val) => {
    const root = document.documentElement;
    root.classList.toggle('dark', val);
    try {
      localStorage.setItem('theme', val ? 'dark' : 'light');
    } catch {
      /* no-op */
    }
  },
  { immediate: true }
);

const showResumeModal = ref(false);
const showProjectModal = ref(false);
const showCertificateModal = ref(false);
const selectedProject = ref(null);
const selectedCertificate = ref(null);
const showFullscreenModal = ref(false);
const selectedFullscreenImage = ref('');
const resumePdfUrl = ref('/resume/JMTN-Resume.pdf');
const galleryContainer = ref(null);

const profile = ref({
  name: 'Jan Marco Nicolas',
  preferredName: 'Marco',
  location: 'Biñan City, Laguna, Philippines',
  title: 'Full-Stack Developer',
  bio: 'I design, build and launch web apps for small businesses and startups in the Philippines and overseas: booking systems, online stores and dashboards, from the database to the last pixel. One developer, no hand-offs, clear updates every week.'
});

const openResumeModal = () => {
  showResumeModal.value = true;
};

const openProjectModal = (project) => {
  selectedProject.value = project;
  showProjectModal.value = true;
};

const openCertificateModal = (achievement) => {
  selectedCertificate.value = achievement;
  showCertificateModal.value = true;
};

const openFullscreenImage = (img) => {
  selectedFullscreenImage.value = img;
  showFullscreenModal.value = true;
};

const scrollRight = () => {
  if (galleryContainer.value) {
    const itemWidth = 288 + 12;
    galleryContainer.value.scrollBy({ left: itemWidth, behavior: 'smooth' });
  }
};

const scrollLeft = () => {
  if (galleryContainer.value) {
    const itemWidth = 288 + 12;
    galleryContainer.value.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  }
};

const socialLinks = ref([
  { id: 1, icon: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/jan-marco-nicolas-a3996a206' },
  { id: 4, icon: 'github', label: 'GitHub', url: 'https://github.com/jmnicolass' },
]);

const education = ref([
  { id: 1, degree: 'Bachelor of Science in Information Technology', school: 'Polytechnic University of the Philippines - Biñan Campus', year: '2024' },
  { id: 2, degree: 'Technical Vocational Livelihood - Programming', school: 'AMA University - Biñan Campus', year: '2019' }
]);

const experience = ref([
  { id: 1, position: 'Associate Software Engineer', company: 'Qstrike Innovations Phils., OPC', duration: 'July 2024 - Present' },
  { id: 2, position: 'Software Engineer Intern', company: 'Qstrike Innovations Phils., OPC', duration: 'March 2024 - June 2024' }
]);

const achievements = ref([
  { id: 1, title: 'Titanium Skills Award Q1', organization: 'Qstrike Innovations Phils., OPC', year: 'April 2026', image: '/certificates/Titanium-Skils-Award-Q1-2026.jpg' },
  { id: 2, title: 'Titanium Skills Award Q4', organization: 'Qstrike Innovations Phils., OPC', year: 'December 2025', image: '/certificates/Titanium-Skils-Award-Q4.jpg' },
  { id: 3, title: 'Titanium Skills Award Q1', organization: 'Qstrike Innovations Phils., OPC', year: 'April 2025', image: '/certificates/Titanium-Skils-Award-Q1.jpg' },
  { id: 4, title: 'Best in Capstone', organization: 'Polytechnic University of the Philippines - Biñan Campus', year: '2024', image: null },
  { id: 5, title: 'Cum Laude', organization: 'Polytechnic University of the Philippines - Biñan Campus', year: '2024', image: null },
  { id: 6, title: 'Claude 101', organization: 'Anthropic', year: '2026', image: '/certificates/claude-101-certificate.png', verifyLink: 'https://verify.skilljar.com/c/m24jgs9hi7vu' },
  { id: 7, title: 'Claude Code 101', organization: 'Anthropic', year: '2026', image: '/certificates/claude-code-101-certificate.png', verifyLink: 'https://verify.skilljar.com/c/duyoposq4uxo' },
  { id: 8, title: 'Claude Code in Action', organization: 'Anthropic', year: '2026', image: '/certificates/claude-code-in-action-certificate.png', verifyLink: 'https://verify.skilljar.com/c/bwhcpee79543' },
  { id: 9, title: 'AI Foundations', organization: 'OpenAI', year: '2026', image: '/certificates/ai-foundations.png', verifyLink: 'https://academy.openai.com/public/certificate/ktijflw7fd' }
]);

const awards = computed(() => achievements.value.filter((a) => !a.verifyLink));
const certifications = computed(() => achievements.value.filter((a) => !!a.verifyLink));
const emailLink = computed(() => ({ url: 'mailto:jmncls08@gmail.com' }));
const emailAddress = computed(() => emailLink.value.url.replace(/^mailto:/, ''));

const skills = ref([
  { category: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Vue.js', 'React'] },
  { category: 'Backend', items: ['PHP', 'Laravel', 'Node.js'] },
  { category: 'Database', items: ['MySQL'] },
  { category: 'Tools', items: ['Tailwind CSS', 'UIKit', 'Git'] },
  { category: 'AI', items: ['Claude', 'ChatGPT'] }
]);

const projects = ref([
  {
    id: 1,
    title: 'JE Travel & Tours',
    category: 'Booking platform for a travel agency',
    description: 'A travel agency needed to take bookings online and stop juggling packages, promos and income by hand. I built their booking platform end to end: customizable travel packages, seasonal promotions, and an admin dashboard that tracks bookings and income in one place.',
    technologies: ['Vue JS', 'Laravel', 'MySQL', 'Tailwind CSS'],
    link: 'https://jetravelandtours.com',
    images: [
      '/project-JE-travel-and-tours/1.png'
    ]
  },
  {
    id: 2,
    title: 'JMOS',
    category: 'Online store',
    description: 'A full-stack online store with a premium, "industrial executive" look. I built the custom Laravel 11 API and the React + TypeScript storefront, with a focus on fast page loads and a polished shopping experience.',
    technologies: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Laravel 11 (PHP)', 'MySQL'],
    link: 'https://jmos.vercel.app/',
    images: [
      '/project-jmos/1.png'
    ]
  },
  {
    id: 3,
    title: 'WealthWarp',
    category: 'Personal finance app',
    description: 'A budgeting and expense tracker with secure user accounts (Laravel Sanctum), a REST API and a polished, animated dashboard. It shows I can build authenticated, data-heavy apps end to end.',
    technologies: ['Vue JS', 'Vite', 'Pinia', 'Tailwind CSS', 'Axios', 'Laravel 12 (PHP)', 'Laravel Sanctum', 'MySQL', 'RESTful API'],
    link: 'https://wealthwarp-tracker.vercel.app',
    images: [
      '/project-wealthwrap/1.png',
      '/project-wealthwrap/2.png',
      '/project-wealthwrap/3.png',
      '/project-wealthwrap/4.png',
      '/project-wealthwrap/5.png',
      '/project-wealthwrap/6.png',
      '/project-wealthwrap/7.png',
      '/project-wealthwrap/8.png'
    ]
  },
  {
    id: 4,
    title: 'CoreDesk',
    category: 'Native macOS app',
    description: 'A private, local-first workspace for developers on the Mac: tickets, work hours, notes, reminders, bookmarks and a Touch ID–protected vault for API keys. No account, no cloud and no tracking; everything stays on your machine, with encrypted backups and instant full-text search.',
    technologies: ['Swift 6', 'SwiftUI', 'SQLite (GRDB)', 'Keychain', 'Touch ID', 'CryptoKit'],
    link: '#',
    images: [
      '/project-coredesk/1.png',
      '/project-coredesk/2.png',
      '/project-coredesk/3.png',
      '/project-coredesk/4.png',
      '/project-coredesk/5.png',
      '/project-coredesk/6.png',
      '/project-coredesk/7.png',
      '/project-coredesk/8.png'
    ]
  }
]);

const trustStrip = computed(() => [
  { icon: 'clock', label: 'Years building production software', value: '2+' },
  { icon: 'cap', label: 'BS Information Technology', value: 'Cum Laude' },
  { icon: 'trophy', label: 'Titanium Skills Awards at Qstrike', value: String(awards.value.filter((a) => a.title.startsWith('Titanium')).length) },
  { icon: 'badge', label: 'AI certifications from Anthropic and OpenAI', value: String(certifications.value.length) }
]);

const timelineGroups = computed(() => [
  {
    title: 'Work',
    icon: 'briefcase',
    caption: 'Qstrike Innovations',
    items: experience.value.map((e) => ({ id: e.id, title: e.position, subtitle: e.company, meta: e.duration }))
  },
  {
    title: 'Education',
    icon: 'cap',
    caption: 'Degrees and training',
    items: education.value.map((e) => ({ id: e.id, title: e.degree, subtitle: e.school, meta: e.year }))
  }
]);

const credentialGroups = computed(() => [
  { title: 'Awards', icon: 'trophy', unit: 'awards', items: awards.value },
  { title: 'Certifications', icon: 'badge', unit: 'verified certificates', items: certifications.value }
]);


const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Contact', href: '#contact' }
];

// Hairline under the top bar once the page scrolls.
const scrolled = ref(false);
const onScroll = () => {
  scrolled.value = window.scrollY > 8;
};
onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Fullscreen viewer transition (BaseModal owns the shared modal animation). */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .animate-scale-in {
    transition: none;
    animation: none;
  }
}
</style>
