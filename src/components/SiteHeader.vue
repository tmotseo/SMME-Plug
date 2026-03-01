<script setup>
import { ref } from 'vue'

const navOpen = ref(false)
const logoError = ref(false)

const closeMenu = () => {
  navOpen.value = false
}

const onLogoError = () => {
  logoError.value = true
}
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
        <router-link class="nav-link" to="/" @click="closeMenu">Home</router-link>
        <router-link class="nav-link" to="/smmes" @click="closeMenu">SMMEs</router-link>
        <router-link class="nav-link" to="/professionals" @click="closeMenu">Professionals</router-link>
        <router-link class="nav-link" to="/jobseekers" @click="closeMenu">Jobseekers</router-link>
        <router-link class="nav-link" to="/admin" @click="closeMenu">Admin</router-link>
      </nav>
    </div>
  </header>
</template>
