<script setup>
import { ref } from 'vue'
const logoError = ref(false)
const year = new Date().getFullYear()
const onLogoError = () => { logoError.value = true }
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Brand Col -->
        <div class="footer-brand-col">
          <div class="brand-link" style="pointer-events:none">
            <span class="brand-mark">
              <img v-if="!logoError" class="brand-logo" src="/Logo.jpeg" alt="" loading="lazy" @error="onLogoError" />
              <span v-else class="brand-placeholder">SP</span>
            </span>
            <span class="brand-text">SMME Plug</span>
          </div>
          <p class="footer-tagline">
            Inclusive growth for Ward 112 and beyond. Connecting small business, professionals, and jobseekers to real opportunity.
          </p>
        </div>

        <!-- Platform Links -->
        <div class="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/opportunities">Opportunities</router-link></li>
            <li><router-link to="/smmes">SMMEs</router-link></li>
            <li><router-link to="/professionals">Professionals</router-link></li>
            <li><router-link to="/jobseekers">Jobseekers</router-link></li>
          </ul>
        </div>

        <!-- Company Links -->
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><router-link to="/pricing">Pricing</router-link></li>
            <li><a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Official Portal</a></li>
            <li><a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Consent Form</a></li>
            <li><router-link to="/admin">Admin</router-link></li>
          </ul>
        </div>

        <!-- Community -->
        <div class="footer-col">
          <h4>Community</h4>
          <ul>
            <li><a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Ward 112</a></li>
            <li><a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Business Registry</a></li>
            <li><a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Skills Database</a></li>
            <li><a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">News & Updates</a></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p>Copyright &copy; {{ year }} SMME Plug. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Privacy Policy</a>
          <a href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Terms of Use</a>
        </div>
      </div>
    </div>
  </footer>
</template>
