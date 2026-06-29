<template>
  <div class="codex-shell min-h-screen bg-background text-foreground font-sans">
    <!-- Resume modal -->
    <BaseModal
      :open="showResumeModal"
      eyebrow="Resume"
      :title="profile.name"
      panel-class="max-w-5xl h-[90vh]"
      body-class="h-[calc(90vh-69px)] bg-background"
      @close="showResumeModal = false"
    >
      <template #header-actions>
        <a :href="resumePdfUrl" download="Jan_Marco_Nicolas_Resume.pdf"
          class="inline-flex h-9 items-center rounded-tag bg-foreground px-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-background transition-colors hover:bg-accent-mint">
          Download
        </a>
      </template>
      <iframe :src="resumePdfUrl" class="h-full w-full" frameborder="0" type="application/pdf"></iframe>
    </BaseModal>

    <!-- Project modal -->
    <BaseModal
      :open="showProjectModal"
      eyebrow="Project"
      :title="selectedProject?.title"
      panel-class="max-w-3xl"
      @close="showProjectModal = false"
    >
      <div class="space-y-6">
        <p class="text-[15px] leading-relaxed text-muted-foreground">{{ selectedProject?.description }}</p>

        <div v-if="selectedProject?.images" class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Gallery</h4>
            <span class="font-mono text-[11px] text-muted-foreground">{{ selectedProject.images.length }} {{ selectedProject.images.length === 1 ? 'image' : 'images' }}</span>
          </div>
          <div class="group/gallery relative">
            <div ref="galleryContainer" class="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-3">
              <button v-for="(img, index) in selectedProject.images" :key="index"
                class="aspect-video w-72 flex-shrink-0 cursor-zoom-in snap-center overflow-hidden rounded-card border border-border bg-surface-elevated transition-colors hover:border-accent-cyan"
                @click="openFullscreenImage(img)">
                <img :src="img" class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  alt="Project preview" />
              </button>
            </div>
            <button @click="scrollLeft"
              class="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-tag border border-border bg-background text-foreground opacity-0 shadow-card transition-opacity group-hover/gallery:opacity-100 md:flex"
              aria-label="Scroll gallery left">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button @click="scrollRight"
              class="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-tag border border-border bg-background text-foreground opacity-0 shadow-card transition-opacity group-hover/gallery:opacity-100 md:flex"
              aria-label="Scroll gallery right">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <h4 class="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Technologies</h4>
          <div class="flex flex-wrap gap-2">
            <TechTag v-for="tech in selectedProject?.technologies" :key="tech">{{ tech }}</TechTag>
          </div>
        </div>

        <div class="flex flex-col gap-3 pt-1 sm:flex-row">
          <a v-if="selectedProject?.link && selectedProject.link !== '#'" :href="selectedProject.link" target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-10 flex-1 items-center justify-center rounded-tag bg-foreground px-5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-background transition-colors hover:bg-accent-mint">
            Visit Project
          </a>
          <button @click="showProjectModal = false"
            class="inline-flex h-10 items-center justify-center rounded-tag border border-border px-5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-surface-elevated">
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
      overlay-class="bg-background/90"
      @close="showCertificateModal = false"
    >
      <img :src="selectedCertificate?.image" :alt="selectedCertificate?.title"
        class="h-auto w-full rounded-card border border-border bg-background" />
      <a v-if="selectedCertificate?.verifyLink" :href="selectedCertificate?.verifyLink" target="_blank"
        rel="noopener noreferrer"
        class="mt-5 inline-flex h-10 items-center gap-2 rounded-tag bg-accent-cyan px-5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Verify Credential
      </a>
    </BaseModal>

    <!-- Fullscreen image viewer -->
    <Transition name="modal">
      <div v-if="showFullscreenModal"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl md:p-12"
        role="dialog" aria-modal="true"
        @click="showFullscreenModal = false">
        <button @click="showFullscreenModal = false"
          class="absolute right-6 top-6 z-10 grid h-11 w-11 place-items-center rounded-tag border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close fullscreen image">
          <span class="text-2xl leading-none">&times;</span>
        </button>
        <div class="flex h-full w-full items-center justify-center" @click.stop>
          <img :src="selectedFullscreenImage" class="max-h-full max-w-full rounded-card object-contain animate-scale-in" />
        </div>
      </div>
    </Transition>

    <div class="relative mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <!-- Nav -->
      <nav class="codex-panel z-30 flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface-warm/85 px-3 py-3 backdrop-blur-xl md:px-4">
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex items-center gap-1.5" aria-hidden="true">
            <span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-[#28c840]"></span>
          </div>
          <div class="hidden h-5 w-px bg-border sm:block"></div>
          <p class="truncate font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Portfolio / {{ profile.name }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="hidden items-center gap-2 rounded-tag border border-border bg-background px-3 py-1.5 font-mono text-[11px] text-muted-foreground sm:inline-flex">
            <span class="h-2 w-2 rounded-full bg-accent-mint shadow-[0_0_0_3px_rgb(var(--accent-mint)_/_0.35),0_0_10px_2px_rgb(var(--accent-mint)_/_0.9)] animate-pulse"></span>
            Available
          </span>
          <button @click="darkMode = !darkMode"
            class="inline-flex h-9 items-center gap-2 rounded-tag border border-border bg-background px-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <svg v-if="!darkMode" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            {{ darkMode ? 'dark' : 'light' }}
          </button>
        </div>
      </nav>

      <!-- Hero -->
      <header class="codex-hero overflow-hidden rounded-card border border-border bg-surface-warm">
        <div class="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
          <div class="p-5 sm:p-7 lg:flex lg:flex-col lg:justify-center lg:p-8">
            <div class="mb-8 flex flex-wrap items-center gap-2">
              <span class="rounded-tag border border-accent-cyan/25 bg-accent-cyan/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-cyan">
                software engineer
              </span>
              <span class="rounded-tag border border-border bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground">
                based in {{ profile.location }}
              </span>
            </div>
            <div class="max-w-3xl">
              <p class="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">Introduction</p>
              <h1 class="text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
                {{ profile.name }}
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {{ profile.bio }}
              </p>
            </div>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <button @click="openResumeModal"
                class="inline-flex h-11 items-center gap-2 rounded-tag bg-foreground px-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-background transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-mint">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414A1 1 0 0 1 19 9.414V19a2 2 0 0 1-2 2z" />
                </svg>
                View Resume
              </button>
              <a v-if="emailLink" :href="emailLink.url"
                class="inline-flex h-11 items-center gap-2 rounded-tag border border-border bg-background px-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-cyan">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                </svg>
                Send Email
              </a>
              <SocialLinks :links="socialLinks" />
            </div>
          </div>

          <aside class="border-t border-border bg-surface-elevated/70 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div class="relative overflow-hidden rounded-card border border-border bg-background">
              <img
                :src="profileImageUrl"
                alt="Jan Marco Nicolas"
                class="aspect-square w-full object-cover"
                draggable="false"
              />
            </div>

            <div class="mt-7 grid grid-cols-3 gap-2">
              <StatCard v-for="stat in quickStats" :key="stat.label" :value="stat.value" :label="stat.label" />
            </div>

            <TerminalCard class="mt-5" />
          </aside>
        </div>
      </header>

      <!-- Main -->
      <main class="space-y-4 lg:space-y-6">
        <!-- Featured Projects (promoted) -->
        <BaseSection title="Featured Projects" index="01">
          <div class="grid gap-4 sm:grid-cols-2">
            <ProjectCard
              v-for="(project, index) in projects"
              :key="project.id"
              :project="project"
              :index="index"
              @inspect="openProjectModal"
            />
          </div>
        </BaseSection>

        <!-- Experience + Education -->
        <div class="grid gap-4 lg:gap-6 lg:grid-cols-2">
          <BaseSection title="Experience" index="02">
            <div class="space-y-3">
              <TimelineItem
                v-for="(exp, index) in experience"
                :key="exp.id"
                :position="exp.position"
                :company="exp.company"
                :duration="exp.duration"
                :present="index === 0"
                :last="index === experience.length - 1"
              />
            </div>
          </BaseSection>

          <BaseSection title="Education" index="03">
            <div class="space-y-2.5">
              <div v-for="edu in education" :key="edu.id"
                class="rounded-card border border-border bg-background p-3.5 transition-colors hover:border-accent-cyan/40">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="text-sm font-semibold leading-snug">{{ edu.degree }}</h3>
                  <span class="font-mono text-[11px] text-muted-foreground">{{ edu.year }}</span>
                </div>
                <p class="mt-2 text-xs leading-5 text-muted-foreground">{{ edu.school }}</p>
              </div>
            </div>
          </BaseSection>
        </div>

        <!-- Tech Stack -->
        <BaseSection title="Tech Stack" index="04">
          <div class="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="skillGroup in skills" :key="skillGroup.category">
              <p class="mb-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{{ skillGroup.category }}</p>
              <div class="flex flex-wrap gap-2">
                <TechTag v-for="skill in skillGroup.items" :key="skill">{{ skill }}</TechTag>
              </div>
            </div>
          </div>
        </BaseSection>

        <!-- Awards + Certifications -->
        <div class="grid gap-4 lg:gap-6 md:grid-cols-2">
          <BaseSection title="Awards" index="05">
            <div class="divide-y divide-border overflow-hidden rounded-card border border-border">
              <button v-for="a in awards" :key="a.id"
                class="flex w-full items-start justify-between gap-3 bg-background p-3 text-left transition-colors"
                :class="a.image ? 'cursor-pointer hover:bg-surface-elevated' : 'cursor-default'"
                @click="a.image ? openCertificateModal(a) : null">
                <span class="min-w-0">
                  <span class="block text-sm font-medium">{{ a.title }}</span>
                  <span class="block text-xs text-muted-foreground">{{ a.organization }}</span>
                </span>
                <span class="shrink-0 font-mono text-[11px] text-muted-foreground">{{ a.year }}</span>
              </button>
            </div>
          </BaseSection>

          <BaseSection title="Certifications" index="06">
            <div class="space-y-2.5">
              <button v-for="c in certifications" :key="c.id"
                class="w-full rounded-card border border-border bg-background p-3.5 text-left transition-colors hover:border-accent-cyan"
                @click="openCertificateModal(c)">
                <h3 class="text-sm font-semibold leading-snug">{{ c.title }}</h3>
                <p class="mt-1 text-xs text-muted-foreground">{{ c.organization }} / {{ c.year }}</p>
              </button>
            </div>
          </BaseSection>
        </div>

        <!-- Hobbies + QR -->
        <BaseSection :title="hobbies.title" index="07">
          <div class="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <p class="max-w-2xl text-[15px] leading-7 text-muted-foreground">{{ hobbies.description }}</p>
            <div class="rounded-card border border-border bg-background p-2.5">
              <img src="/QR%20RESUME/portfolio-qr.png" alt="Portfolio QR"
                class="h-20 w-20 rounded-sm object-contain"
                :class="darkMode ? 'invert' : ''" />
            </div>
          </div>
        </BaseSection>

        <!-- Contact -->
        <section v-reveal class="codex-contact rounded-card border border-border bg-foreground p-5 text-background sm:p-6">
          <div class="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">Let's build something precise.</h2>
              <p class="mt-2 max-w-2xl text-[15px] leading-7 opacity-70">
                Have a project in mind or just want to connect? My inbox is open.
              </p>
            </div>
            <a v-if="emailLink" :href="emailLink.url"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-tag bg-background px-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-foreground transition-opacity hover:opacity-90">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
              </svg>
              Get in touch
            </a>
          </div>
        </section>
      </main>

      <footer class="flex flex-col items-center justify-center gap-1.5 border-t border-border py-4 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">© 2026 Jan Marco Nicolas</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import SocialLinks from './components/SocialLinks.vue';
import BaseSection from './components/BaseSection.vue';
import BaseModal from './components/BaseModal.vue';
import TechTag from './components/TechTag.vue';
import ProjectCard from './components/ProjectCard.vue';
import TimelineItem from './components/TimelineItem.vue';
import StatCard from './components/StatCard.vue';
import TerminalCard from './components/TerminalCard.vue';
import profileImageUrl from './assets/profile/Profile-sharp.png';

// Dark-first: stored choice wins; else honor OS; default to dark.
const getInitialDark = () => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return false;
  } catch (e) {
    /* no-op */
  }
  return true;
};

const darkMode = ref(getInitialDark());

watch(
  darkMode,
  (val) => {
    const root = document.documentElement;
    root.classList.toggle('dark', val);
    try {
      localStorage.setItem('theme', val ? 'dark' : 'light');
    } catch (e) {
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
  location: 'Biñan City, Laguna, Philippines',
  title: 'Software Engineer',
  bio: 'Highly motivated and detail-oriented Software Engineer with a passion for crafting intuitive and responsive web interfaces. Eager to leverage expertise in Vue.js, React, and modern front-end technologies to develop innovative web applications and enhance user experiences. A quick learner and problem-solver, adept at collaborating with cross-functional teams to deliver high-quality, user-focused solutions.'
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
  { id: 4, icon: 'github', label: 'Github', url: 'https://github.com/jmnicolass' },
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
  { id: 8, title: 'Claude Code in Action', organization: 'Anthropic', year: '2026', image: '/certificates/claude-code-in-action-certificate.png', verifyLink: 'https://verify.skilljar.com/c/bwhcpee79543' }
]);

const awards = computed(() => achievements.value.filter((a) => !a.verifyLink));
const certifications = computed(() => achievements.value.filter((a) => !!a.verifyLink));
const emailLink = computed(() => ({ url: 'mailto:jmncls08@gmail.com' }));

const hobbies = ref({
  title: 'Life Outside Code',
  description: 'When I\'m not coding, I enjoy playing FPS games on mobile and PC. I also enjoy watching movies and series.'
});

const skills = ref([
  { category: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Vue.js', 'React'] },
  { category: 'Backend', items: ['PHP', 'Laravel', 'Node.js'] },
  { category: 'Database', items: ['MySQL'] },
  { category: 'Tools', items: ['Tailwind CSS', 'UIKit', 'Git'] }
]);

const projects = ref([
  {
    id: 1,
    title: 'Travel & Tours',
    description: 'This is a freelance capstone project for a travel and tours company, aimed at automating their booking system, creating customizable travel packages, offering seasonal promotions, and tracking both income and overall bookings.',
    technologies: ['Vue JS', 'Laravel', 'MySQL', 'Tailwind CSS'],
    link: 'https://jetravelandtours.com',
    images: [
      '/project-JE-travel-and-tours/1.png'
    ]
  },
  {
    id: 2,
    title: 'JMOS',
    description: 'A full-stack e-commerce application designed to deliver a high-end, "industrial executive" shopping experience. Built with a focus on performance and modern aesthetics, the platform features a custom-built Laravel API backend and a dynamic React frontend.',
    technologies: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Laravel 11 (PHP)', 'MySQL'],
    link: 'https://jmos.vercel.app/',
    images: [
      '/project-jmos/1.png'
    ]
  },
  {
    id: 3,
    title: 'WealthWarp',
    description: 'WealthWarp is a modern, premium personal finance management application designed to help users take control of their financial health. It features a sleek interface with "glassmorphic" design elements and smooth animations to provide a high-end user experience.',
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
    title: 'Modern Portfolio',
    description: 'A premium, developer-first portfolio for Jan Marco Nicolas, Software Engineer. Inspired by the clean, minimal aesthetic of OpenAI Codex, it features a dark-first theme with a light/dark toggle, a monospace typographic system, and a subtle terminal-style interface. The site showcases his featured projects, work experience, tech stack, education, awards, and certifications — with an interactive project gallery, embedded résumé viewer, and verifiable credentials. Built with Vue 3 and Tailwind CSS, using reusable components, scroll-reveal animations, and an accessible, responsive design.',
    technologies: ['Vue JS', 'Tailwind CSS', 'JavaScript', 'Canvas API'],
    link: 'https://jmncls.vercel.app/',
    images: [
      '/project-portfolio/Portfolio.png'
    ]
  }
]);

const quickStats = computed(() => [
  { label: 'projects', value: String(projects.value.length).padStart(2, '0') },
  { label: 'awards', value: String(awards.value.length).padStart(2, '0') },
  { label: 'certs', value: String(certifications.value.length).padStart(2, '0') }
]);
</script>

<style scoped>
.codex-shell {
  position: relative;
  isolation: isolate;
}

.codex-shell::before {
  position: fixed;
  inset: 0;
  z-index: -1;
  content: '';
  background-image:
    linear-gradient(rgb(var(--border) / 0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--border) / 0.28) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: linear-gradient(to bottom, black 0%, transparent 72%);
  pointer-events: none;
}

.codex-panel,
.codex-hero {
  box-shadow:
    inset 0 1px 0 rgb(var(--foreground) / 0.04),
    0 10px 32px rgb(0 0 0 / 0.12);
}

.codex-contact {
  background-image:
    linear-gradient(135deg, rgb(var(--accent-cyan) / 0.16), transparent 38%),
    linear-gradient(315deg, rgb(var(--accent-mint) / 0.18), transparent 42%);
}

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
  transition: all 0.3s ease;
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
