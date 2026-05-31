<template>
  <div class="min-h-screen bg-background text-foreground font-sans">
    <!-- Resume Modal -->
    <Transition name="modal">
      <div v-if="showResumeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        @click="showResumeModal = false">
        <div class="w-full max-w-5xl h-[90vh] rounded-card border border-border bg-background overflow-hidden shadow-card animate-scale-in"
          @click.stop>
          <div class="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h3 class="text-lg font-bold">Resume</h3>
              <p class="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">Jan Marco Nicolas</p>
            </div>
            <div class="flex items-center gap-2">
              <a :href="resumePdfUrl" download="Jan_Marco_Nicolas_Resume.pdf"
                class="px-4 py-2 text-xs font-medium bg-foreground text-background transition-opacity hover:opacity-90">
                Download
              </a>
              <button @click="showResumeModal = false"
                class="w-9 h-9 rounded-card flex items-center justify-center text-muted-foreground hover:bg-surface-elevated transition-colors">
                <span class="text-xl leading-none">&times;</span>
              </button>
            </div>
          </div>
          <div class="h-[calc(90vh-73px)] bg-surface-elevated">
            <iframe :src="resumePdfUrl" class="w-full h-full" frameborder="0" type="application/pdf"></iframe>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Project Modal -->
    <Transition name="modal">
      <div v-if="showProjectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        @click="showProjectModal = false">
        <div class="w-full max-w-2xl rounded-card border border-border bg-background overflow-hidden shadow-card animate-scale-in"
          @click.stop>
          <div class="p-7 space-y-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2 block">Project</span>
                <h3 class="text-2xl font-bold tracking-tight">{{ selectedProject?.title }}</h3>
              </div>
              <button @click="showProjectModal = false"
                class="w-9 h-9 rounded-card flex items-center justify-center text-muted-foreground hover:bg-surface-elevated transition-colors -mt-1">
                <span class="text-xl leading-none">&times;</span>
              </button>
            </div>
            <p class="text-[15px] leading-relaxed text-muted-foreground">{{ selectedProject?.description }}</p>

            <div v-if="selectedProject?.images" class="space-y-3">
              <h4 class="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Gallery</h4>
              <div class="relative group/gallery">
                <div ref="galleryContainer" class="flex gap-3 overflow-x-auto pb-3 snap-x no-scrollbar">
                  <div v-for="(img, index) in selectedProject.images" :key="index"
                    class="flex-shrink-0 w-72 aspect-video rounded-card overflow-hidden border border-border bg-surface-elevated snap-center cursor-zoom-in"
                    @click="openFullscreenImage(img)">
                    <img :src="img" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      alt="Project preview" />
                  </div>
                </div>
                <button @click="scrollLeft"
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-card items-center justify-center z-20 hidden md:flex opacity-0 group-hover/gallery:opacity-100 transition-opacity border border-border bg-background text-foreground shadow-card">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button @click="scrollRight"
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-card items-center justify-center z-20 hidden md:flex opacity-0 group-hover/gallery:opacity-100 transition-opacity border border-border bg-background text-foreground shadow-card">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h4 class="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">Tech Stack</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="tech in selectedProject?.technologies" :key="tech"
                  class="font-mono text-xs px-2.5 py-1 rounded-md bg-surface-elevated">{{ tech }}</span>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <a v-if="selectedProject?.link && selectedProject.link !== '#'" :href="selectedProject.link" target="_blank"
                class="flex-1 py-2.5 px-5 text-center text-xs font-medium bg-foreground text-background transition-opacity hover:opacity-90">
                Visit Project
              </a>
              <button @click="showProjectModal = false"
                class="px-5 py-2.5 text-xs font-medium border border-border hover:bg-surface-elevated transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Certificate Modal -->
    <Transition name="modal">
      <div v-if="showCertificateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
        @click="showCertificateModal = false">
        <div class="w-full max-w-4xl rounded-card border border-border bg-background overflow-hidden shadow-card animate-scale-in"
          @click.stop>
          <div class="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h3 class="text-lg font-bold">{{ selectedCertificate?.title }}</h3>
              <p class="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                {{ selectedCertificate?.organization }}</p>
            </div>
            <button @click="showCertificateModal = false"
              class="w-9 h-9 rounded-card flex items-center justify-center text-muted-foreground hover:bg-surface-elevated transition-colors">
              <span class="text-xl leading-none">&times;</span>
            </button>
          </div>
          <div class="p-6">
            <img :src="selectedCertificate?.image" :alt="selectedCertificate?.title"
              class="w-full h-auto rounded-card border border-border" />
            <a v-if="selectedCertificate?.verifyLink" :href="selectedCertificate?.verifyLink" target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-accent-blue text-white transition-opacity hover:opacity-90">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verify Credential
            </a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Fullscreen Image Modal -->
    <Transition name="modal">
      <div v-if="showFullscreenModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 backdrop-blur-2xl bg-black/90"
        @click="showFullscreenModal = false">
        <button @click="showFullscreenModal = false"
          class="absolute top-6 right-6 w-11 h-11 rounded-card flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors z-10 text-white">
          <span class="text-2xl leading-none">&times;</span>
        </button>
        <div class="w-full h-full flex items-center justify-center" @click.stop>
          <img :src="selectedFullscreenImage" class="max-w-full max-h-full object-contain rounded-card animate-scale-in" />
        </div>
      </div>
    </Transition>

    <!-- Page -->
    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Hero -->
      <header class="mb-8">
        <div class="flex items-start gap-4 md:gap-6">
          <img 
            :src="profileImageUrl" 
            alt="Jan Marco Nicolas" 
            class="rounded-lg w-32 h-32 md:w-40 md:h-40 object-cover flex-shrink-0 border border-border"
            draggable="false"
          />
          <div class="flex-1 min-w-0">
            <!-- Name row with theme toggle -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 min-w-0">
                <h1 class="text-lg md:text-2xl font-bold truncate">{{ profile.name }}</h1>
                <svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-[#1d9bf0]" aria-label="Verified user">
                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="currentColor"></path>
                </svg>
              </div>
              <!-- Theme toggle (inline like bryllim) -->
              <button @click="darkMode = !darkMode"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none min-h-0 min-w-0 shrink-0"
                :class="darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'"
                :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                <div class="absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out"
                  :class="darkMode ? 'translate-x-5' : 'translate-x-0'">
                  <svg v-if="!darkMode" class="h-3 w-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="h-3 w-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </div>
              </button>
            </div>

            <!-- Location with pin icon -->
            <p class="text-xs md:text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
              <svg class="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">{{ profile.location }}</span>
            </p>

            <!-- Title -->
            <p class="text-[10px] md:text-base mt-1.5 md:mt-2">{{ profile.title }}</p>

            <!-- Action buttons -->
            <div class="flex flex-wrap gap-2 mt-3 md:mt-4 items-center">
              <button @click="openResumeModal"
                class="inline-flex h-10 items-center rounded-card bg-foreground px-4 text-xs font-medium text-background transition-all duration-200 hover:bg-foreground/90 hover:-translate-y-0.5 gap-1.5 whitespace-nowrap min-h-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-left">View Resume</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <a v-if="emailLink" :href="emailLink.url"
                class="inline-flex h-10 items-center rounded-card shadow-[0_1px_2px_rgba(0,0,0,0.03),0_1px_1px_rgba(0,0,0,0.04)] bg-background px-4 text-xs font-medium transition-all duration-200 hover:bg-surface-elevated hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] gap-1.5 whitespace-nowrap min-h-0 border border-border">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-left">Send Email</span>
              </a>
              <SocialLinks :links="socialLinks" />
            </div>
          </div>
        </div>
      </header>

      <!-- Two-column grid -->
      <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-8 md:gap-10 items-start">
        <!-- LEFT: narrative -->
        <div class="space-y-10">
          <!-- About -->
          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2 class="text-lg font-bold shrink-0">About</h2>
              <div class="h-px w-12 bg-border"></div>
            </div>
            <p class="text-[15px] leading-relaxed text-muted-foreground">{{ profile.bio }}</p>
          </section>

          <!-- Experience -->
          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2 class="text-lg font-bold shrink-0">Experience</h2>
              <div class="h-px w-12 bg-border"></div>
            </div>
            <div>
              <div v-for="(exp, index) in experience" :key="exp.id"
                class="relative pl-6 pb-5 last:pb-0">
                <!-- Connecting lines -->
                <div v-if="index !== 0" class="absolute left-0 top-0 h-1.5 w-px bg-border"></div>
                <div v-if="index !== experience.length - 1" class="absolute left-0 top-[18px] bottom-0 w-px bg-border"></div>
                <div class="absolute -left-1.5 top-1.5 w-3 h-3 border"
                  :class="index === 0 ? 'bg-foreground border-foreground' : 'bg-background border-border'">
                </div>
                <div class="flex flex-col gap-0.5">
                  <h3 class="font-semibold text-sm md:text-base leading-tight">{{ exp.position }}</h3>
                  <div class="flex items-center justify-between text-xs md:text-sm text-muted-foreground gap-2">
                    <span>{{ exp.company }}</span>
                    <span class="font-mono text-[10px] md:text-xs shrink-0">{{ exp.duration }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2 class="text-lg font-bold shrink-0">Education</h2>
              <div class="h-px w-12 bg-border"></div>
            </div>
            <div>
              <div v-for="(edu, index) in education" :key="edu.id"
                class="relative pl-6 pb-5 last:pb-0">
                <!-- Connecting lines -->
                <div v-if="index !== 0" class="absolute left-0 top-0 h-1.5 w-px bg-border"></div>
                <div v-if="index !== education.length - 1" class="absolute left-0 top-[18px] bottom-0 w-px bg-border"></div>
                <div class="absolute -left-1.5 top-1.5 w-3 h-3 border"
                  :class="index === 0 ? 'bg-foreground border-foreground' : 'bg-background border-border'">
                </div>
                <div class="flex flex-col gap-0.5">
                  <h3 class="font-semibold text-sm md:text-base leading-tight">{{ edu.degree }}</h3>
                  <div class="flex items-center justify-between text-xs md:text-sm text-muted-foreground gap-2">
                    <span>{{ edu.school }}</span>
                    <span class="font-mono text-[10px] md:text-xs shrink-0">{{ edu.year }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Tech Stack -->
          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2 class="text-lg font-bold shrink-0">Tech Stack</h2>
              <div class="h-px w-12 bg-border"></div>
            </div>
            <div class="space-y-4">
              <div v-for="skillGroup in skills" :key="skillGroup.category">
                <div class="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2.5">
                  {{ skillGroup.category }}</div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="skill in skillGroup.items" :key="skill"
                    class="text-sm px-2.5 py-1 rounded-md bg-surface-elevated">{{ skill }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Projects -->
          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2 class="text-lg font-bold shrink-0">Projects</h2>
              <div class="h-px w-12 bg-border"></div>
            </div>
            <div class="border-t border-border">
              <div v-for="(project, index) in projects" :key="project.id"
                class="group flex items-start justify-between gap-4 py-4 border-b border-border rounded-md cursor-pointer transition-colors hover:bg-surface-elevated"
                @click="openProjectModal(project)">
                <div class="min-w-0">
                  <div class="flex items-baseline gap-2 mb-1">
                    <span class="font-mono text-[11px] text-muted-foreground shrink-0">{{ String(index + 1).padStart(2, '0') }}</span>
                    <h3 class="font-semibold">{{ project.title }}</h3>
                  </div>
                  <p class="text-sm text-muted-foreground line-clamp-2 mb-2">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="tech in project.technologies.slice(0, 4)" :key="tech"
                      class="font-mono text-[11px] px-1.5 py-0.5 rounded-md bg-surface-elevated text-muted-foreground">{{ tech }}</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT: cards -->
        <div class="space-y-10">
          <!-- Access Card (terminal) -->
          <div class="relative rounded-card overflow-hidden border border-border bg-foreground text-background shadow-card">
            <div class="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-transparent to-accent-blue/30 opacity-70"></div>
            <div class="relative p-6 font-mono">
              <div class="flex items-center justify-between mb-7">
                <span class="text-[11px] uppercase tracking-[0.25em] opacity-60">Access Card</span>
                <span class="flex items-center gap-1.5 text-[11px] opacity-80">
                  <span class="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse"></span>
                  ACTIVE
                </span>
              </div>
              <div class="font-sans font-bold text-2xl leading-tight mb-1">{{ profile.name }}</div>
              <div class="text-[11px] uppercase tracking-[0.3em] opacity-60 mb-6">Developer</div>
              <div class="flex items-center gap-2 text-sm">
                <span class="opacity-50">&gt;_</span>
                <span class="opacity-90">available_for_work</span>
                <span class="inline-block w-2 h-4 bg-current animate-pulse"></span>
              </div>
              <img src="/QR%20RESUME/portfolio-qr.png" alt="Portfolio QR"
                class="absolute bottom-6 right-6 w-12 h-12 rounded-sm object-contain z-10 opacity-40"
                :class="darkMode ? 'mix-blend-multiply' : 'invert mix-blend-screen'" />
            </div>
          </div>

          <!-- Awards & Honors -->
          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2 class="text-lg font-bold shrink-0">Awards</h2>
              <div class="h-px w-12 bg-border"></div>
            </div>
            <div class="border-t border-border">
              <div v-for="a in awards" :key="a.id"
                class="flex items-start justify-between gap-3 py-3 border-b border-border rounded-md transition-colors"
                :class="a.image ? 'cursor-pointer hover:bg-surface-elevated' : ''"
                @click="a.image ? openCertificateModal(a) : null">
                <div class="min-w-0">
                  <h3 class="text-sm font-medium">{{ a.title }}</h3>
                  <p class="text-xs text-muted-foreground">{{ a.organization }}</p>
                </div>
                <span class="font-mono text-[11px] text-muted-foreground shrink-0 mt-0.5">{{ a.year }}</span>
              </div>
            </div>
          </section>

          <!-- Certifications -->
          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2 class="text-lg font-bold shrink-0">Certifications</h2>
              <div class="h-px w-12 bg-border"></div>
            </div>
            <div class="space-y-3">
              <div v-for="c in certifications" :key="c.id"
                class="rounded-card border border-border shadow-card p-4 cursor-pointer transition-colors hover:border-muted-foreground"
                @click="openCertificateModal(c)">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Certificate</span>
                  <span class="inline-flex items-center gap-1 font-mono text-[11px] px-1.5 py-0.5 rounded-md bg-accent-blue/10 text-accent-blue">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Verified
                  </span>
                </div>
                <h3 class="text-sm font-semibold leading-snug">{{ c.title }}</h3>
                <p class="text-xs text-muted-foreground mt-0.5">{{ c.organization }} · {{ c.year }}</p>
              </div>
            </div>
          </section>

          <!-- Beyond Work -->
          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2 class="text-lg font-bold shrink-0">Beyond Work</h2>
              <div class="h-px w-12 bg-border"></div>
            </div>
            <h3 class="font-semibold mb-2">{{ hobbies.title }}</h3>
            <p class="text-[15px] leading-relaxed text-muted-foreground">{{ hobbies.description }}</p>
          </section>
        </div>
      </div>

      <!-- Projects (full width) -->
      <!-- Contact (inverted) -->
      <section class="mt-12">
        <div class="relative rounded-card overflow-hidden bg-foreground text-background p-8 md:p-12">
          <div class="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-transparent to-accent-blue/20"></div>
          <div class="relative max-w-md">
            <div class="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60 mb-4">&gt;_ contact</div>
            <h2 class="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Let's build something together</h2>
            <p class="text-[15px] leading-relaxed opacity-70 mb-8">
              Have a project in mind or just want to connect? My inbox is always open.
            </p>
            <a v-if="emailLink" :href="emailLink.url"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-background text-foreground transition-opacity hover:opacity-90">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in touch
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="mt-12 pt-6 border-t border-border flex items-center justify-between">
        <p class="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">© 2026 Jan Marco Nicolas</p>
        <p class="font-mono text-[11px] text-muted-foreground">&gt;_ built with vue</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import SocialLinks from './components/SocialLinks.vue';
import profileImageUrl from './assets/profile/Profile-sharp.png';

const darkMode = ref(false);

watch(
  darkMode,
  (val) => {
    const root = document.documentElement;
    if (val) root.classList.add('dark');
    else root.classList.remove('dark');
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
  { category: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Vue.js', 'React', 'Pinia', 'Canvas API'] },
  { category: 'Backend', items: ['PHP', 'Laravel', 'Laravel Sanctum', 'Node.js', 'RESTful API'] },
  { category: 'Database', items: ['MySQL'] },
  { category: 'Tools', items: ['Git', 'Vite', 'Tailwind CSS', 'Axios', 'UIKit'] }
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
    description: 'A premium, modern portfolio website featuring a dynamic Bento Grid layout, interactive animations, seasonal effects, and a beautiful gradient background with floating particles. Built with Vue.js 3 and Tailwind CSS, showcasing advanced front-end development skills.',
    technologies: ['Vue JS', 'Tailwind CSS', 'JavaScript', 'Canvas API'],
    link: 'https://jmncls.vercel.app/',
    images: [
      '/project-portfolio/1.png'
    ]
  }
]);
</script>

<style scoped>
:deep(.modal-enter-active),
:deep(.modal-leave-active) {
  transition: all 0.3s ease;
}

:deep(.modal-enter-from),
:deep(.modal-leave-to) {
  opacity: 0;
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

:deep(.animate-scale-in) {
  animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:focus {
  outline: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
