<script setup>
import { ref } from 'vue'

const logoError = ref(false)

const onLogoError = () => {
  logoError.value = true
}
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="brand-mark footer-brand-mark" aria-hidden="true">
          <img v-if="!logoError" class="brand-logo" src="/Logo.jpeg" alt="" loading="lazy" @error="onLogoError" />
          <span v-else class="brand-placeholder">SP</span>
        </span>
        <p>Copyright 2026 SMME Plug | Inclusive growth for Ward 112 and beyond.</p>
      </div>
      <div class="footer-links">
        <a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Official Portal</a>
        <a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Consent Form</a>
      </div>
    </div>
  </footer>
</template>
