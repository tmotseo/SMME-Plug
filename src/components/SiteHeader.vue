<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRegistrationStore } from '../stores/registrationStore'

const navOpen = ref(false)
const logoError = ref(false)
const scrolled = ref(false)
const ADMIN_AUTH_KEY = 'smme_admin_logged_in'
const adminLoggedIn = ref(localStorage.getItem(ADMIN_AUTH_KEY) === 'true')
const router = useRouter()
const store = useRegistrationStore()

const closeMenu = () => { navOpen.value = false }
const onLogoError = () => { logoError.value = true }
const refreshAdminAuth = () => {
  adminLoggedIn.value = localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
}

const logoutAdmin = async () => {
  await store.signOutAdmin()
  adminLoggedIn.value = false
  closeMenu()
  window.dispatchEvent(new Event('admin-auth-changed'))
  await router.push('/')
}

const onScroll = () => { scrolled.value = window.scrollY > 20 }

onMounted(() => {
  window.addEventListener('storage', refreshAdminAuth)
  window.addEventListener('admin-auth-changed', refreshAdminAuth)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', refreshAdminAuth)
  window.removeEventListener('admin-auth-changed', refreshAdminAuth)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="top-nav reveal delay-1" :class="{ scrolled }">
    <div class="container top-nav-inner">
      <!-- Brand -->
      <router-link class="brand-link" to="/" @click="closeMenu">
        <span class="brand-mark">
          <img v-if="!logoError" class="brand-logo" src="/Logo.jpeg" alt="" @error="onLogoError" />
          <span v-else class="brand-placeholder">SP</span>
        </span>
        <span class="brand-text">SMME Plug</span>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="main-nav" :class="{ open: navOpen }" aria-label="Main navigation">
        <template v-if="adminLoggedIn">
          <button class="nav-link logout-link" type="button" @click="logoutAdmin">Logout</button>
        </template>
        <template v-else>
          <router-link class="nav-link" to="/" @click="closeMenu">Home</router-link>
          <router-link class="nav-link" to="/opportunities" @click="closeMenu">Opportunities</router-link>
          <router-link class="nav-link" to="/smmes" @click="closeMenu">SMMEs</router-link>
          <router-link class="nav-link" to="/professionals" @click="closeMenu">Professionals</router-link>
          <router-link class="nav-link" to="/jobseekers" @click="closeMenu">Jobseekers</router-link>
          <router-link class="nav-link" to="/admin" @click="closeMenu">Admin</router-link>
        </template>
      </nav>

      <!-- CTA + Hamburger -->
      <div class="nav-cta">
        <router-link v-if="!adminLoggedIn" class="btn btn-primary btn-sm" to="/pricing" @click="closeMenu">
          Member's benefits
        </router-link>
      </div>

      <button
        class="menu-btn"
        type="button"
        :aria-expanded="navOpen"
        aria-label="Toggle navigation"
        @click="navOpen = !navOpen"
      >
        <span class="hamburger-icon" :class="{ open: navOpen }" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  </header>
</template>
