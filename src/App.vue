<template>
  <div
    class="min-h-screen flex flex-col md:flex-row md:h-screen md:overflow-hidden transition-colors duration-300 relative"
    :class="darkMode ? 'bg-transparent text-white' : 'bg-white text-black'">
    <SeasonalEffects :darkMode="darkMode" />
    <GradientBg :darkMode="darkMode" v-if="darkMode" />

    <Transition name="modal">
      <div v-if="showResumeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
        :class="darkMode ? 'bg-black/80' : 'bg-white/80'" @click="showResumeModal = false">
        <div class="w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl animate-scale-in"
          :class="darkMode ? 'bg-gray-900/95 border border-white/10' : 'bg-white'" @click.stop>
          <div class="flex items-center justify-between p-6 backdrop-blur-xl"
            :class="darkMode ? 'bg-black/20 border-b border-white/10' : 'bg-gray-50/50 border-b border-gray-200'">
            <div>
              <h3 class="text-2xl font-light tracking-tight" :class="darkMode ? 'text-white' : 'text-gray-900'">Resume
              </h3>
              <p class="text-xs opacity-50 mt-1">Jan Marco Nicolas</p>
            </div>
            <div class="flex items-center gap-3">
              <a :href="resumePdfUrl" download="Jan_Marco_Nicolas_Resume.pdf"
                class="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all hover:scale-105"
                :class="darkMode ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-gray-800'">
                Download
              </a>
              <button @click="showResumeModal = false"
                class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:rotate-90"
                :class="darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'">
                <span class="text-2xl opacity-60">×</span>
              </button>
            </div>
          </div>
          <div class="h-[calc(90vh-88px)]" :class="darkMode ? 'bg-gray-950' : 'bg-gray-50'">
            <iframe :src="resumePdfUrl" class="w-full h-full" frameborder="0" type="application/pdf"></iframe>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showProjectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
        :class="darkMode ? 'bg-black/80' : 'bg-white/80'" @click="showProjectModal = false">
        <div class="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-scale-in"
          :class="darkMode ? 'bg-gray-900/95 border border-white/10' : 'bg-white'" @click.stop>
          <div class="p-8 space-y-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <span class="text-xs uppercase tracking-[0.3em] opacity-40 mb-2 block">Project</span>
                <h3 class="text-3xl font-light tracking-tight" :class="darkMode ? 'text-white' : 'text-gray-900'">
                  {{ selectedProject?.title }}
                </h3>
              </div>
              <button @click="showProjectModal = false"
                class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:rotate-90 -mt-2"
                :class="darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'">
                <span class="text-2xl opacity-60">×</span>
              </button>
            </div>

            <div class="space-y-6">
              <div>
                <p class="text-base leading-relaxed" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">
                  {{ selectedProject?.description }}
                </p>
              </div>

              <div v-if="selectedProject?.images" class="space-y-4">
                <h4 class="text-xs uppercase tracking-[0.3em] opacity-40">Project Gallery</h4>
                <div class="relative group/gallery">
                  <div ref="galleryContainer" class="flex gap-4 overflow-x-auto pb-4 snap-x -mx-8 px-8 no-scrollbar">
                    <div v-for="(img, index) in selectedProject.images" :key="index"
                      class="flex-shrink-0 w-72 aspect-video rounded-2xl overflow-hidden border snap-center group/img cursor-zoom-in"
                      :class="darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'"
                      @click="openFullscreenImage(img)">
                      <img :src="img"
                        class="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                        alt="Project preview" />
                    </div>
                  </div>

                  <button @click="scrollLeft"
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center shadow-2xl z-20 hidden md:flex opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110 active:scale-95 translate-x-1"
                    :class="darkMode ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20' : 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-900 hover:bg-white'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button @click="scrollRight"
                    class="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center shadow-2xl z-20 hidden md:flex opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110 active:scale-95 -translate-x-1"
                    :class="darkMode ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20' : 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-900 hover:bg-white'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <h4 class="text-xs uppercase tracking-[0.3em] opacity-40 mb-3">Tech Stack</h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tech in selectedProject?.technologies" :key="tech"
                    class="px-3 py-1.5 text-xs rounded-full transition-all hover:scale-105"
                    :class="darkMode ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <a v-if="selectedProject?.link && selectedProject.link !== '#'" :href="selectedProject.link"
                target="_blank"
                class="flex-1 py-3 px-6 text-center font-medium rounded-full transition-all hover:scale-105"
                :class="darkMode ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-gray-800'">
                Visit Project →
              </a>
              <button @click="showProjectModal = false" class="px-6 py-3 font-medium rounded-full transition-all"
                :class="darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showCertificateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
        :class="darkMode ? 'bg-black/90' : 'bg-white/90'" @click="showCertificateModal = false">
        <div class="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-scale-in"
          :class="darkMode ? 'bg-gray-900/95 border border-white/10' : 'bg-white'" @click.stop>
          <div class="flex items-center justify-between p-6 backdrop-blur-xl"
            :class="darkMode ? 'bg-black/20 border-b border-white/10' : 'bg-gray-50/50 border-b border-gray-200'">
            <div>
              <h3 class="text-2xl font-light tracking-tight" :class="darkMode ? 'text-white' : 'text-gray-900'">{{
                selectedCertificate?.title }}</h3>
              <p class="text-xs opacity-50 mt-1">{{ selectedCertificate?.organization }}</p>
            </div>
            <button @click="showCertificateModal = false"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:rotate-90"
              :class="darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'">
              <span class="text-2xl opacity-60">×</span>
            </button>
          </div>
          <div class="p-8">
            <img :src="selectedCertificate?.image" :alt="selectedCertificate?.title"
              class="w-full h-auto rounded-2xl shadow-lg" />
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showFullscreenModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 backdrop-blur-2xl bg-black/90"
        @click="showFullscreenModal = false">
        <button @click="showFullscreenModal = false"
          class="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all hover:rotate-90 z-10 text-white">
          <span class="text-3xl font-light">×</span>
        </button>
        <div class="w-full h-full flex items-center justify-center" @click.stop>
          <img :src="selectedFullscreenImage"
            class="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scale-in" />
        </div>
      </div>
    </Transition>

    <aside
      class="w-full md:w-80 p-6 md:p-10 flex flex-col h-auto md:h-screen relative overflow-hidden transition-all duration-300 z-10 border-b md:border-b-0 md:border-r"
      :class="darkMode ? 'bg-black/20 backdrop-blur-xl border-white/5' : 'bg-white border-gray-100'">

      <div class="flex-1 flex flex-col items-center justify-center text-center space-y-8 md:space-y-12">
        <div class="relative group">
          <div class="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
            :class="darkMode ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl' : 'bg-gradient-to-r from-purple-100 to-pink-100 blur-xl'">
          </div>
          <div
            class="relative w-32 h-32 rounded-full overflow-hidden ring-1 ring-offset-4 transition-all duration-500 group-hover:scale-105"
            :class="darkMode ? 'ring-white/20 ring-offset-transparent' : 'ring-gray-200 ring-offset-white'">
            <img :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover" />
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-extralight tracking-tight leading-tight mb-3"
              :class="darkMode ? 'text-white' : 'text-gray-900'">
              {{ profile.name }}
            </h1>
            <p class="text-xs uppercase tracking-[0.3em] font-medium"
              :class="darkMode ? 'text-white/60' : 'text-gray-600'">
              {{ profile.title }}
            </p>
          </div>

          <p class="text-xs opacity-40">
            {{ profile.location }}
          </p>
        </div>

        <div class="hidden md:block max-w-xs">
          <p class="text-sm leading-relaxed opacity-70" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">
            {{ profile.bio }}
          </p>
        </div>

        <div class="flex gap-5">
          <a v-for="link in socialLinks" :key="link.id" :href="link.url" target="_blank"
            class="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1"
            :class="darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'">
            <span class="w-4 h-4 opacity-60 hover:opacity-100 transition-opacity">
              <svg v-if="link.icon === 'linkedin'" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <svg v-else-if="link.icon === 'mail'" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <svg v-else-if="link.icon === 'facebook'" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd" />
              </svg>
              <svg v-else-if="link.icon === 'github'" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd" />
              </svg>
            </span>
          </a>
        </div>

        <button @click="openResumeModal"
          class="px-6 py-3 rounded-full text-xs uppercase tracking-[0.3em] font-semibold transition-all hover:scale-105"
          :class="darkMode ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-gray-800'">
          View Resume
        </button>
      </div>
    </aside>


    <main class="flex-1 md:overflow-hidden flex flex-col transition-colors duration-300 relative"
      :class="darkMode ? 'bg-transparent' : 'bg-gray-50'">
      <button @click="darkMode = !darkMode"
        class="absolute top-3 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        :class="darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'"
        :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" fill="none" />
        </svg>
      </button>

      <div class="flex-1 h-full min-h-0 md:overflow-y-auto p-6 md:p-10">
        <div class="max-w-7xl mx-auto">

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)]">

            <div class="md:col-span-8 md:row-span-2 p-8 md:p-12 rounded-3xl transition-all duration-500 group"
              :class="darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-white shadow-sm hover:shadow-xl'">
              <div class="h-full flex flex-col justify-between">
                <div>
                  <span class="text-xs uppercase tracking-[0.3em] font-semibold opacity-40 mb-6 block">About</span>
                  <h2 class="text-4xl md:text-5xl font-light leading-tight mb-8 tracking-tight"
                    :class="darkMode ? 'text-white' : 'text-gray-900'">
                    Crafting digital experiences that matter
                  </h2>
                  <p class="text-base md:text-lg leading-relaxed mb-6 opacity-80"
                    :class="darkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ profile.bio }}
                  </p>
                </div>
                <button @click="openResumeModal"
                  class="self-start px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                  :class="darkMode ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-gray-800'">
                  View Full Resume →
                </button>
              </div>
            </div>

            <div class="md:col-span-4 p-6 rounded-3xl transition-all duration-500"
              :class="darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-xl'">
              <span class="text-xs uppercase tracking-[0.3em] font-semibold opacity-40 mb-4 block">Stats</span>
              <div class="space-y-6">
                <div>
                  <div class="text-4xl font-light mb-1" :class="darkMode ? 'text-white' : 'text-gray-900'">{{
                    experience.length }}+</div>
                  <div class="text-sm opacity-60">Years Experience</div>
                </div>
                <div>
                  <div class="text-4xl font-light mb-1" :class="darkMode ? 'text-white' : 'text-gray-900'">{{
                    projects.length }}</div>
                  <div class="text-sm opacity-60">Projects Delivered</div>
                </div>
                <div>
                  <div class="text-4xl font-light mb-1" :class="darkMode ? 'text-white' : 'text-gray-900'">{{
                    achievements.length }}</div>
                  <div class="text-sm opacity-60">Awards</div>
                </div>
              </div>
            </div>

            <div class="md:col-span-4 p-6 rounded-3xl transition-all duration-500"
              :class="darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:shadow-xl shadow-sm'">
              <span class="text-xs uppercase tracking-[0.3em] font-semibold opacity-40 mb-4 block">Experience</span>
              <div class="space-y-4">
                <div v-for="exp in experience" :key="exp.id" class="group/item">
                  <h3 class="font-medium mb-1 text-sm group-hover/item:translate-x-1 transition-transform"
                    :class="darkMode ? 'text-white' : 'text-gray-900'">{{ exp.position }}</h3>
                  <p class="text-xs opacity-60 mb-1">{{ exp.company }}</p>
                  <p class="text-xs opacity-40">{{ exp.duration }}</p>
                </div>
              </div>
            </div>

            <div v-for="project in projects" :key="project.id"
              class="md:col-span-4 p-6 rounded-3xl cursor-pointer transition-all duration-500 group/card hover:-translate-y-2"
              :class="darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:shadow-2xl shadow-sm'"
              @click="openProjectModal(project)">
              <div class="flex justify-between items-start mb-4">
                <span class="text-xs uppercase tracking-[0.3em] font-semibold opacity-40">Project</span>
                <span class="text-2xl opacity-0 group-hover/card:opacity-100 transition-opacity">→</span>
              </div>
              <h3 class="text-xl font-medium mb-3" :class="darkMode ? 'text-white' : 'text-gray-900'">{{ project.title
              }}</h3>
              <p class="text-sm opacity-70 mb-4 line-clamp-2" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span v-for="tech in project.technologies.slice(0, 2)" :key="tech"
                  class="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider"
                  :class="darkMode ? 'bg-white/10' : 'bg-gray-100'">
                  {{ tech }}
                </span>
                <span v-if="project.technologies.length > 2"
                  class="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider opacity-50"
                  :class="darkMode ? 'bg-white/10' : 'bg-gray-100'">
                  +{{ project.technologies.length - 2 }}
                </span>
              </div>
            </div>

            <div class="md:col-span-8 p-6 rounded-3xl transition-all duration-500"
              :class="darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:shadow-xl shadow-sm'">
              <span class="text-xs uppercase tracking-[0.3em] font-semibold opacity-40 mb-6 block">Tech Stack</span>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div v-for="skillGroup in skills" :key="skillGroup.category">
                  <h4 class="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wider">{{ skillGroup.category }}
                  </h4>
                  <div class="space-y-2">
                    <div v-for="skill in skillGroup.items" :key="skill"
                      class="text-sm opacity-80 hover:opacity-100 transition-opacity cursor-default">
                      {{ skill }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:col-span-4 md:row-span-2 p-6 rounded-3xl transition-all duration-500"
              :class="darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl'">
              <span class="text-xs uppercase tracking-[0.3em] font-semibold opacity-40 mb-6 block">Achievements</span>
              <div class="space-y-6">
                <div v-for="achievement in achievements" :key="achievement.id"
                  class="pb-6 border-b last:border-0 last:pb-0 transition-all hover:opacity-80"
                  :class="[darkMode ? 'border-white/10' : 'border-black/5', achievement.image ? 'cursor-pointer' : '']"
                  @click="achievement.image ? openCertificateModal(achievement) : null">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex-1">
                      <h3 class="font-medium text-sm mb-2" :class="darkMode ? 'text-white' : 'text-gray-900'">
                        {{ achievement.title }}
                      </h3>
                      <p class="text-xs opacity-60 mb-1">{{ achievement.organization }}</p>
                      <p class="text-xs opacity-40">{{ achievement.year }}</p>
                    </div>
                    <div v-if="achievement.image" class="flex-shrink-0">
                      <svg class="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:col-span-4 p-6 rounded-3xl transition-all duration-500"
              :class="darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:shadow-xl shadow-sm'">
              <span class="text-xs uppercase tracking-[0.3em] font-semibold opacity-40 mb-4 block">Education</span>
              <div class="space-y-4">
                <div v-for="edu in education" :key="edu.id">
                  <h3 class="font-medium text-sm mb-1" :class="darkMode ? 'text-white' : 'text-gray-900'">{{ edu.degree
                  }}</h3>
                  <p class="text-xs opacity-60 mb-1">{{ edu.school }}</p>
                  <p class="text-xs opacity-40">{{ edu.year }}</p>
                </div>
              </div>
            </div>

            <div class="md:col-span-4 p-6 rounded-3xl transition-all duration-500"
              :class="darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-xl'">
              <span class="text-xs uppercase tracking-[0.3em] font-semibold opacity-40 mb-4 block">{{ hobbies.title
              }}</span>
              <p class="text-sm leading-relaxed opacity-80" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">
                {{ hobbies.description }}
              </p>
            </div>

          </div>

          <footer class="mt-16 mb-8 text-center">
            <p class="text-xs opacity-30 uppercase tracking-widest">© 2025 Jan Marco Nicolas</p>
          </footer>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import profileImage from './assets/profile/Profile-optimized.jpg';
import SeasonalEffects from './components/SeasonalEffects.vue';
import GradientBg from './components/GradientBg.vue';

const darkMode = ref(true);
const showResumeModal = ref(false);
const showProjectModal = ref(false);
const showCertificateModal = ref(false);
const selectedProject = ref(null);
const selectedCertificate = ref(null);
const showFullscreenModal = ref(false);
const selectedFullscreenImage = ref('');
const resumePdfUrl = ref('/resume/Jan-Marco-Nicolas_Resume.pdf');
const profileImageUrl = profileImage;
const galleryContainer = ref(null);

const profile = ref({
  name: 'Jan Marco Nicolas',
  location: 'Biñan City, Laguna, Philippines',
  title: 'Software Engineer',
  bio: 'I’m a Software Engineer driven by curiosity and a desire to learn. I enjoy tackling new challenges and turning them into practical, user-focused solutions. Whether I’m helping build intuitive interfaces or learning how to optimize performance, I approach each project with a problem-solving mindset and an eagerness to grow. I’m excited to collaborate and help turn ideas into digital experiences that exceed expectations.'
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
    const itemWidth = 288 + 16;
    galleryContainer.value.scrollBy({ left: itemWidth, behavior: 'smooth' });
  }
};

const scrollLeft = () => {
  if (galleryContainer.value) {
    const itemWidth = 288 + 16;
    galleryContainer.value.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  }
};

const socialLinks = ref([
  { id: 1, icon: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/jan-marco-nicolas-a3996a206' },
  { id: 2, icon: 'mail', label: 'Email', url: 'mailto:jmncls08@gmail.com' },
  { id: 3, icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/jmnicolass' },
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
  { id: 1, title: 'Titanium Skills Award Q4', organization: 'Qstrike Innovations Phils., OPC', year: 'December 2025', image: null },
  { id: 2, title: 'Titanium Skills Award Q1', organization: 'Qstrike Innovations Phils., OPC', year: 'April 2025', image: '/certificates/Titanium-Skils-Award-Q1.jpg' },
  { id: 3, title: 'Best in Capstone', organization: 'Polytechnic University of the Philippines - Biñan Campus', year: '2024', image: null },
  { id: 4, title: 'Cum Laude', organization: 'Polytechnic University of the Philippines - Biñan Campus', year: '2024', image: null }
]);

const hobbies = ref({
  title: 'Life Outside Code',
  description: 'When I\'m not coding, I enjoy playing FPS games on mobile and PC. I also enjoy watching movies and series.'
});

const skills = ref([
  { category: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'Vue.js', 'React'] },
  { category: 'Backend', items: ['Laravel', 'Node.js', 'PHP'] },
  { category: 'Database', items: ['MySQL'] },
  { category: 'Tools', items: ['Git', 'Tailwind CSS', 'UIKit'] }
]);

const projects = ref([
  {
    id: 1,
    title: 'Travel & Tours',
    description: 'This is a freelance capstone project for a travel and tours company, aimed at automating their booking system, creating customizable travel packages, offering seasonal promotions, and tracking both income and overall bookings.',
    technologies: ['Vue JS', 'Laravel', 'MySQL', 'Tailwind CSS'],
    link: 'https://jetravelandtours.com'
  },
  {
    id: 2,
    title: 'JMOS',
    description: 'A full-stack e-commerce application designed to deliver a high-end, "industrial executive" shopping experience. Built with a focus on performance and modern aesthetics, the platform features a custom-built Laravel API backend and a dynamic React frontend.',
    technologies: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Laravel 11 (PHP)', 'MySQL'],
    link: 'https://jmos.vercel.app/'
  },
  {
    id: 3,
    title: 'WealthWarp',
    description: 'WealthWarp is a modern, premium personal finance management application designed to help users take control of their financial health. It features a sleek interface with "glassmorphic" design elements and smooth animations to provide a high-end user experience.',
    technologies: ['Vue JS', 'Vite', 'Pinia', 'Tailwind CSS', 'Axios', 'Laravel 12 (PHP)', 'Laravel Sanctum', 'MySQL', 'RESTful API'],
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
    link: 'https://jmncls.vercel.app/'
  }
]);
</script>

<style scoped>
/* Modal animations */
:deep(.modal-enter-active),
:deep(.modal-leave-active) {
  transition: all 0.3s ease;
}

:deep(.modal-enter-from),
:deep(.modal-leave-to) {
  opacity: 0;
}

/* Scale animation for modal content */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

:deep(.animate-scale-in) {
  animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Minimalist dark mode toggle button */
button:focus {
  outline: none;
}

/* Hide scrollbar for gallery */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>