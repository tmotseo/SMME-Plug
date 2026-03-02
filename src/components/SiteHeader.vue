<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const navOpen = ref(false)
const logoError = ref(false)
const ADMIN_AUTH_KEY = 'smme_admin_logged_in'
const adminLoggedIn = ref(localStorage.getItem(ADMIN_AUTH_KEY) === 'true')
const router = useRouter()

const closeMenu = () => {
  navOpen.value = false
}

const onLogoError = () => {
  logoError.value = true
}

const refreshAdminAuth = () => {
  adminLoggedIn.value = localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
}

const logoutAdmin = async () => {
  localStorage.removeItem(ADMIN_AUTH_KEY)
  adminLoggedIn.value = false
  closeMenu()
  window.dispatchEvent(new Event('admin-auth-changed'))
  await router.push('/')
}

onMounted(() => {
  window.addEventListener('storage', refreshAdminAuth)
  window.addEventListener('admin-auth-changed', refreshAdminAuth)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', refreshAdminAuth)
  window.removeEventListener('admin-auth-changed', refreshAdminAuth)
})
</script>

<template>
  <header class="top-nav reveal delay-1">
    <div class="top-nav-inner">
      <router-link class="brand-link" to="/" @click="closeMenu">
        <span class="brand-mark" aria-hidden="true">
          <img v-if="!logoError" class="brand-logo" src="/Logo.jpeg" alt="" @error="onLogoError" />
          <span v-else class="brand-placeholder">SP</span>
        </span>
        <span class="brand-text">SMME Plug</span>
      </router-link>

      <button class="menu-btn" type="button" @click="navOpen = !navOpen">
        {{ navOpen ? 'Close' : 'Menu' }}
      </button>

      <nav class="main-nav" :class="{ open: navOpen }">
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
    </div>
  </header>
</template>
