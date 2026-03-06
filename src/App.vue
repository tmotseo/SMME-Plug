<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import { useRegistrationStore } from './stores/registrationStore'

const store = useRegistrationStore()
const scrollProgress = ref(0)

const updateProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
}

onMounted(() => {
  store.initializeAdminAuth()
  store.loadUsers()
  store.loadOpportunities()
  store.startRealtime()
  window.addEventListener('scroll', updateProgress, { passive: true })
})

onBeforeUnmount(() => {
  store.stopRealtime()
  window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
  <div class="site-shell">
    <!-- Scroll progress indicator -->
    <div
      class="scroll-progress"
      :style="{ width: scrollProgress + '%' }"
      role="progressbar"
      :aria-valuenow="scrollProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Page scroll progress"
    />

    <SiteHeader />

    <main class="site-main">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <SiteFooter />
  </div>
</template>
