<script setup>
import { onMounted } from 'vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import { useRegistrationStore } from './stores/registrationStore'

const store = useRegistrationStore()

onMounted(() => {
  store.loadUsers()
  store.loadOpportunities()
})
</script>

<template>
  <div class="site-shell">
    <div class="ambient ambient-one" />
    <div class="ambient ambient-two" />
    <SiteHeader />
    <main class="site-main">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>
