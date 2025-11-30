<template>
  <div class="h-screen flex overflow-hidden transition-colors duration-300"
    :class="darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'">
    <div v-if="showResumeModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="showResumeModal = false">
      <div class="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col" @click.stop>
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-black">Resume - Jan Marco Nicolas</h3>
          <div class="flex items-center gap-3">
            <a :href="resumePdfUrl" download="Jan_Marco_Nicolas_Resume.pdf"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Download PDF
            </a>
            <button @click="showResumeModal = false"
              class="text-gray-500 hover:text-black text-2xl font-bold w-8 h-8 flex items-center justify-center">
              ×
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-hidden bg-gray-100">
          <iframe :src="resumePdfUrl" class="w-full h-full" frameborder="0" type="application/pdf"></iframe>
        </div>
      </div>
    </div>

    <div v-if="showProjectModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="showProjectModal = false">
      <div class="bg-white rounded-lg w-full max-w-2xl flex flex-col" @click.stop>
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-2xl font-semibold text-black">{{ selectedProject?.title }}</h3>
          <button @click="showProjectModal = false"
            class="text-gray-500 hover:text-black text-2xl font-bold w-8 h-8 flex items-center justify-center">
            ×
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[70vh]">
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Description</h4>
            <p class="text-gray-800 leading-relaxed">{{ selectedProject?.description }}</p>
          </div>
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Technologies Used</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in selectedProject?.technologies" :key="tech"
                class="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm font-medium border border-gray-300">
                {{ tech }}
              </span>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <a v-if="selectedProject?.link && selectedProject.link !== '#'" :href="selectedProject.link" target="_blank"
              class="flex-1 bg-black text-white py-3 px-6 text-center font-semibold hover:bg-gray-800 transition-all">
              View Project
            </a>
            <button @click="showProjectModal = false"
              class="flex-1 bg-gray-200 text-black py-3 px-6 font-semibold hover:bg-gray-300 transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <aside
      class="w-64 bg-gradient-to-b from-black via-gray-900 to-black text-white p-6 flex flex-col h-screen relative overflow-hidden shadow-2xl">
      <div class="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl -ml-16 -mb-16"></div>

      <div class="flex-shrink-0 mb-8 relative z-10">
        <div class="w-28 h-28 mx-auto mb-4 relative group">
          <div class="absolute inset-0 bg-white opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
          <div class="absolute inset-0 border-2 border-white group-hover:scale-110 transition-transform duration-300">
          </div>
          <div
            class="absolute inset-2 border border-gray-400 flex items-center justify-center bg-black group-hover:bg-gray-900 transition-colors">
            <span class="text-3xl font-bold tracking-wider">JN</span>
          </div>
        </div>
        <h1
          class="text-xl font-bold text-center mb-1 tracking-wide hover:text-gray-300 transition-colors cursor-default">
          {{ profile.name }}</h1>
        <p class="text-gray-400 text-xs text-center mb-1">{{ profile.location }}</p>
        <p class="text-xs font-semibold text-gray-300 text-center uppercase tracking-widest">{{ profile.title }}</p>

        <div class="mt-6 space-y-3">
          <button @click="openResumeModal"
            class="w-full bg-white text-black py-2.5 px-4 text-sm font-semibold uppercase tracking-wider hover:bg-gray-200 transition-all border-2 border-white hover:shadow-lg">
            View Resume
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto space-y-6 relative z-10">
        <div class="bg-white bg-opacity-5 p-4 rounded-lg border border-gray-800 hover:bg-opacity-10 transition-all">
          <h2 class="text-sm font-bold uppercase tracking-widest mb-3 text-white flex items-center gap-2">
            <span class="w-1 h-4 bg-white"></span>
            About
          </h2>
          <p class="text-gray-300 text-sm leading-relaxed">{{ profile.bio }}</p>
        </div>

        <div class="bg-white bg-opacity-5 p-4 rounded-lg border border-gray-800 hover:bg-opacity-10 transition-all">
          <h2 class="text-sm font-bold uppercase tracking-widest mb-4 text-white flex items-center gap-2">
            <span class="w-1 h-4 bg-white"></span>
            Contact
          </h2>
          <div class="space-y-2">
            <a v-for="link in socialLinks" :key="link.id" :href="link.url" target="_blank"
              class="flex items-center gap-3 text-gray-300 hover:text-white transition-all text-xs font-medium group p-3 rounded-lg border border-gray-700 hover:border-white hover:bg-white hover:bg-opacity-5">
              <span class="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg v-if="link.icon === 'linkedin'" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24ZM16.9605 19.8778H11.5216V36.2196H16.9605V19.8778ZM17.3188 14.8227C17.2835 13.2204 16.1377 12 14.277 12C12.4164 12 11.2 13.2204 11.2 14.8227C11.2 16.3918 12.3805 17.6473 14.2064 17.6473H14.2412C16.1377 17.6473 17.3188 16.3918 17.3188 14.8227ZM36.5754 26.8497C36.5754 21.8303 33.8922 19.4941 30.3131 19.4941C27.4254 19.4941 26.1326 21.0802 25.4107 22.1929V19.8783H19.9711C20.0428 21.4117 19.9711 36.22 19.9711 36.22H25.4107V27.0934C25.4107 26.605 25.446 26.1178 25.5898 25.7681C25.9829 24.7924 26.8779 23.7822 28.3805 23.7822C30.3494 23.7822 31.1365 25.2807 31.1365 27.4767V36.2196H36.5752L36.5754 26.8497Z"
                    fill="white" />
                </svg>
                <svg v-else-if="link.icon === 'mail'" viewBox="0 0 48 48" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0ZM23.9639 26.0193L14.9987 19.5115V33.23H13.5009C12.6664 33.23 12.0031 32.5667 12.0031 31.7322V16.562C12.0031 16.4985 12.007 16.4389 12.0144 16.3831C12.0416 16.1451 12.1284 15.9122 12.2813 15.7061C12.7734 15.0428 13.7363 14.893 14.421 15.3851L23.9853 22.3391L33.6138 15.2996C34.2771 14.8074 35.2186 14.9572 35.7107 15.6419C35.9723 15.9945 36.0525 16.4256 35.9674 16.8261V31.7536C35.9674 32.5667 35.3041 33.23 34.4697 33.23H32.9719V19.4788L23.9639 26.0193Z"
                    fill="white" />
                </svg>
                <svg v-else-if="link.icon === 'facebook'" viewBox="0 0 48 48" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24ZM26.5016 38.1115V25.0542H30.1059L30.5836 20.5546H26.5016L26.5077 18.3025C26.5077 17.1289 26.6192 16.5001 28.3048 16.5001H30.5581V12H26.9532C22.6231 12 21.0991 14.1828 21.0991 17.8536V20.5551H18.4V25.0547H21.0991V38.1115H26.5016Z"
                    fill="white" />
                </svg>
              </span>
              <span class="truncate">{{ link.label }}</span>
            </a>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 overflow-hidden flex flex-col transition-colors duration-300"
      :class="darkMode ? 'bg-gray-800' : 'bg-gray-50'">
      <div class="flex-1 overflow-y-auto p-6 min-h-0">
        <div class="grid grid-cols-3 gap-6 items-start">
          <div class="col-span-2 space-y-4">
            <section>
              <h2 class="text-2xl font-semibold mb-3 tracking-tight" :class="darkMode ? 'text-white' : 'text-black'">
                Experience</h2>
              <div class="p-4 shadow-lg border min-h-[130px] transition-colors duration-300"
                :class="darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-white border-gray-300'">
                <div class="space-y-4">
                  <div v-for="exp in experience" :key="exp.id"
                    class="pb-4 last:border-0 last:pb-0 transition-colors duration-300"
                    :class="darkMode ? 'border-b border-gray-600' : 'border-b border-gray-200'">
                    <h3 class="font-semibold text-sm mb-1" :class="darkMode ? 'text-white' : 'text-black'">{{
                      exp.position }}</h3>
                    <p class="text-sm mb-1" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">{{ exp.company }}</p>
                    <p class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ exp.duration }}</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-semibold mb-3 tracking-tight" :class="darkMode ? 'text-white' : 'text-black'">
                Achievements</h2>
              <div class="p-4 shadow-lg border min-h-[130px] transition-colors duration-300"
                :class="darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-300'">
                <div class="grid grid-cols-3 gap-4">
                  <div v-for="achievement in achievements" :key="achievement.id"
                    class="text-center p-3 border hover:shadow-md transition-all"
                    :class="darkMode ? 'border-gray-600 hover:border-gray-400 bg-gray-800' : 'border-gray-200 hover:border-black bg-white'">
                    <h3 class="font-semibold text-xs mb-2" :class="darkMode ? 'text-white' : 'text-black'">{{
                      achievement.title }}</h3>
                    <p class="text-xs mb-1" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">{{
                      achievement.organization }}</p>
                    <p class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ achievement.year }}</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-semibold mb-3 tracking-tight" :class="darkMode ? 'text-white' : 'text-black'">
                Recent Projects</h2>
              <div class="p-4 shadow-lg border transition-colors duration-300"
                :class="darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'">
                <div class="grid grid-cols-2 gap-2">
                  <div v-for="project in projects" :key="project.id" @click="openProjectModal(project)"
                    class="p-2.5 border hover:shadow-lg transition-all cursor-pointer"
                    :class="darkMode ? 'border-gray-600 hover:border-gray-400 bg-gray-800' : 'border-gray-200 hover:border-black bg-white'">
                    <h3 class="font-semibold text-xs mb-1" :class="darkMode ? 'text-white' : 'text-black'">{{
                      project.title }}</h3>
                    <p class="text-xs mb-1.5 line-clamp-2" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">{{
                      project.description }}</p>
                    <div class="flex flex-wrap gap-1 mb-1.5">
                      <span v-for="tech in project.technologies" :key="tech" class="text-xs px-1.5 py-0.5"
                        :class="darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'">
                        {{ tech }}
                      </span>
                    </div>
                    <a :href="project.link" target="_blank" class="text-xs font-medium underline hover:no-underline"
                      :class="darkMode ? 'text-white' : 'text-black'" @click.stop>View Project</a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div class="space-y-4">
            <section>
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-2xl font-semibold tracking-tight" :class="darkMode ? 'text-white' : 'text-black'">
                  Education</h2>
                <label class="switch">
                  <span class="sun"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g fill="#ffd43b">
                        <circle r="5" cy="12" cx="12"></circle>
                        <path
                          d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z">
                        </path>
                      </g>
                    </svg></span>
                  <span class="moon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path
                        d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z">
                      </path>
                    </svg></span>
                  <input v-model="darkMode" type="checkbox" class="input">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="p-4 shadow-lg border min-h-[130px] transition-colors duration-300"
                :class="darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-white to-gray-100 border-gray-300'">
                <div class="space-y-4">
                  <div v-for="edu in education" :key="edu.id"
                    class="pb-4 last:border-0 last:pb-0 transition-colors duration-300"
                    :class="darkMode ? 'border-b border-gray-600' : 'border-b border-gray-200'">
                    <h3 class="font-semibold text-sm mb-1" :class="darkMode ? 'text-white' : 'text-black'">{{ edu.degree
                      }}</h3>
                    <p class="text-sm mb-1" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">{{ edu.school }}</p>
                    <p class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ edu.year }}</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-semibold mb-3 tracking-tight" :class="darkMode ? 'text-white' : 'text-black'">
                Tech Stack</h2>
              <div class="p-4 shadow-lg border min-h-[320px] transition-colors duration-300"
                :class="darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-gray-100 to-white border-gray-300'">
                <div class="space-y-4">
                  <div v-for="skillGroup in skills" :key="skillGroup.category">
                    <h3 class="font-semibold text-xs mb-2 uppercase tracking-wider"
                      :class="darkMode ? 'text-gray-300' : 'text-gray-700'">{{ skillGroup.category }}</h3>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="skill in skillGroup.items" :key="skill"
                        class="px-3 py-1 border text-xs font-medium transition-colors"
                        :class="darkMode ? 'border-gray-400 text-gray-300 hover:bg-gray-600' : 'border-black text-black hover:bg-black hover:text-white'">
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer class="flex-shrink-0 py-4 text-center border-t transition-colors duration-300"
        :class="darkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'">
        <p class="text-xs">© 2025 Jan Marco Nicolas. All rights reserved.</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const darkMode = ref(false);
const showResumeModal = ref(false);
const showProjectModal = ref(false);
const selectedProject = ref(null);
const resumePdfUrl = ref('/resume/MARCO-NICOLAS_CV.pdf');

const profile = ref({
  name: 'Jan Marco Nicolas',
  location: 'Biñan City, Laguna, Philippines',
  title: 'Associate Software Engineer',
  bio: 'As an associate software engineer, I am driven by curiosity and a strong desire to solve problems. I take pleasure in breaking down complex challenges and transforming them into clear, effective solutions.'
});

const openResumeModal = () => {
  showResumeModal.value = true;
};

const openProjectModal = (project) => {
  selectedProject.value = project;
  showProjectModal.value = true;
};

const socialLinks = ref([
  { id: 1, icon: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/jan-marco-nicolas-a3996a206' },
  { id: 2, icon: 'mail', label: 'Email', url: 'mailto:jmncls08@gmail.com' },
  { id: 3, icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/jmnicolass' }
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
  { id: 1, title: 'Titanium Skills Award Q1', organization: 'Qstrike Innovations Phils., OPC', year: '2025' },
  { id: 2, title: 'Best in Capstone', organization: 'Polytechnic University of the Philippines - Biñan Campus', year: '2024' },
  { id: 3, title: 'Cum Laude', organization: 'Polytechnic University of the Philippines - Biñan Campus', year: '2024' }
]);

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
    description: 'It is a capstone project for a travel and tours company to automate their booking system, create packages, offer seasonal promotions, and track their income and bookings.',
    technologies: ['Vue.js', 'Laravel', 'MySQL'],
    link: '#'
  }
]);
</script>

<style scoped>
.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 64px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #73C0FC;
  transition: .4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 30px;
  width: 30px;
  border-radius: 20px;
  left: 2px;
  bottom: 2px;
  z-index: 2;
  background-color: #e8e8e8;
  transition: .4s;
}

.sun svg {
  position: absolute;
  top: 6px;
  left: 36px;
  z-index: 1;
  width: 24px;
  height: 24px;
}

.moon svg {
  fill: #73C0FC;
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
  width: 24px;
  height: 24px;
}

/* .switch:hover */
.sun svg {
  animation: rotate 15s linear infinite;
}

@keyframes rotate {

  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* .switch:hover */
.moon svg {
  animation: tilt 5s linear infinite;
}

@keyframes tilt {

  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-10deg);
  }

  75% {
    transform: rotate(10deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.input:checked+.slider {
  background-color: #183153;
}

.input:focus+.slider {
  box-shadow: 0 0 1px #183153;
}

.input:checked+.slider:before {
  transform: translateX(30px);
}
</style>