<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// ── Carousel ────────────────────────────────────────
const slides = [
  {
    badge: 'Empowering SMMEs',
    title: 'Market Access for Small Business',
    highlight: 'Growth.',
    description: 'Create visibility for your business and connect directly to tenders, contracts, and procurement opportunities — all in one place.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    alt: 'Team collaborating in a modern office',
    primary: { label: 'Start SMME Profile', to: '/smmes' },
    secondary: { label: 'Browse Opportunities', to: '/opportunities' },
  },
  {
    badge: 'For Professionals',
    title: 'Connecting Talent with the Right',
    highlight: 'Employers.',
    description: 'Build a verified professional profile and get matched with roles that align to your qualifications, experience, and ambitions.',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=80',
    alt: 'Professional discussing work opportunities',
    primary: { label: 'Join as Professional', to: '/professionals' },
    secondary: { label: 'View Jobseeker Path', to: '/jobseekers' },
  },
  {
    badge: 'For Jobseekers',
    title: 'Helping You Build Real',
    highlight: 'Momentum.',
    description: 'Access job listings, training programs, and practical work experience in Ward 112 and beyond — your career journey starts here.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
    alt: 'Community members learning and planning',
    primary: { label: 'Register as Jobseeker', to: '/jobseekers' },
    secondary: { label: 'Explore SMME Path', to: '/smmes' },
  },
]

const current = ref(0)
const isPlaying = ref(true)
const isPaused = ref(false)
const progressWidth = ref(0)
const activeSlide = computed(() => slides[current.value])

const DURATION = 5500
let intervalId = null
let progressId = null
let progressStart = null
let progressElapsed = 0

const clearTimers = () => {
  clearInterval(intervalId)
  cancelAnimationFrame(progressId)
}

const animateProgress = (timestamp) => {
  if (!progressStart) progressStart = timestamp
  const elapsed = progressElapsed + (timestamp - progressStart)
  progressWidth.value = Math.min((elapsed / DURATION) * 100, 100)
  if (elapsed < DURATION) {
    progressId = requestAnimationFrame(animateProgress)
  }
}

const startProgress = (fromElapsed = 0) => {
  cancelAnimationFrame(progressId)
  progressStart = null
  progressElapsed = fromElapsed
  progressWidth.value = (fromElapsed / DURATION) * 100
  progressId = requestAnimationFrame(animateProgress)
}

const startAutoplay = () => {
  clearTimers()
  if (!isPlaying.value || isPaused.value) return
  startProgress(0)
  intervalId = setInterval(() => {
    current.value = (current.value + 1) % slides.length
    startProgress(0)
  }, DURATION)
}

const pause = () => {
  isPaused.value = true
  clearTimers()
}

const resume = () => {
  if (!isPlaying.value) return
  isPaused.value = false
  startAutoplay()
}

const goTo = (index) => {
  current.value = index
  if (isPlaying.value) startAutoplay()
}

const prev = () => {
  current.value = (current.value - 1 + slides.length) % slides.length
  if (isPlaying.value) startAutoplay()
}

const next = () => {
  current.value = (current.value + 1) % slides.length
  if (isPlaying.value) startAutoplay()
}

const onKey = (e) => {
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

let touchStartX = 0
const onTouchStart = (e) => { touchStartX = e.changedTouches[0].clientX; pause() }
const onTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 48) dx < 0 ? next() : prev()
  resume()
}

// Scroll-reveal with IntersectionObserver
let observer
const initScrollReveal = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.sr').forEach((el) => observer.observe(el))
}

onMounted(() => {
  startAutoplay()
  setTimeout(initScrollReveal, 80)
})

onBeforeUnmount(() => {
  clearTimers()
  if (observer) observer.disconnect()
})

const features = [
  {
    title: 'Market Access',
    desc: 'Gain visibility for your SMME and connect directly to tender opportunities and procurement networks.',
    icon: 'briefcase',
  },
  {
    title: 'Career Matching',
    desc: 'Build a verified professional profile and get matched to roles that align with your skills and experience.',
    icon: 'users',
  },
  {
    title: 'Work Readiness',
    desc: 'Access jobs, practical training, and work experience programs in one trusted community platform.',
    icon: 'star',
  },
  {
    title: 'Dedicated Support',
    desc: 'Our team is always available to help with registration, profiles, and navigating available opportunities.',
    icon: 'headset',
  },
]

const partnerNames = [
  'Othaniel Consulting and Projects',
  'Lethajako Group',
  'BAPELA SOLUTIONS',
  'Wazitech Solutions',
  'CKN Security Services',
  'Safe Riderz Group',
  'Braintree Construction',
  'Khopelas General Trading',
  'Bignocia Inc ta Vision Works',
  'Enzo Trading Group',
  'Sanracle PTY LTD',
  'Morwasehla Attorneys',
  'Vutomi PTY LTD',
  'Cypress Web',
  'Silof Projects',
  'Handy Air And Main Company',
  'Rage In Pretoria (Pty) Ltd',
  'Morare Construction',
]

// Duplicate for seamless infinite marquee loop
const partners = [...partnerNames, ...partnerNames]
</script>

<template>
  <!-- ══════════════════════════════════════════════════
       MODERN CAROUSEL HERO
  ═══════════════════════════════════════════════════ -->
  <section
    class="carousel-hero"
    tabindex="0"
    aria-label="Homepage carousel"
    @keydown="onKey"
    @mouseenter="pause"
    @mouseleave="resume"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Slide images (Ken Burns) -->
    <transition name="carousel-fade" mode="out-in">
      <div :key="current" class="carousel-bg">
        <img :src="activeSlide.image" :alt="activeSlide.alt" class="carousel-bg-img" />
        <div class="carousel-overlay" />
      </div>
    </transition>

    <!-- Slide content -->
    <div class="container carousel-content">
      <transition name="carousel-slide-up" mode="out-in">
        <div :key="current" class="carousel-text">
          <span class="badge badge-dark">
            <svg class="badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
            {{ activeSlide.badge }}
          </span>

          <h1 class="carousel-heading">
            {{ activeSlide.title }}
            <span class="carousel-highlight">{{ activeSlide.highlight }}</span>
          </h1>

          <p class="carousel-desc">{{ activeSlide.description }}</p>

          <div class="carousel-actions">
            <router-link class="btn btn-primary btn-lg" :to="activeSlide.primary.to">
              {{ activeSlide.primary.label }}
            </router-link>
            <router-link class="btn btn-ghost btn-lg" :to="activeSlide.secondary.to">
              {{ activeSlide.secondary.label }}
            </router-link>
          </div>
        </div>
      </transition>

      <!-- Slide count + arrows -->
      <div class="carousel-controls">
        <button class="carousel-arrow" type="button" aria-label="Previous slide" @click="prev">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:1.1rem;height:1.1rem">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span class="carousel-count">
          <strong>{{ String(current + 1).padStart(2, '0') }}</strong>
          <span> / {{ String(slides.length).padStart(2, '0') }}</span>
        </span>
        <button class="carousel-arrow" type="button" aria-label="Next slide" @click="next">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:1.1rem;height:1.1rem">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Dot navigation -->
    <div class="carousel-dots" role="tablist" aria-label="Slide navigation">
      <button
        v-for="(slide, i) in slides"
        :key="i"
        class="carousel-dot"
        :class="{ active: i === current }"
        role="tab"
        :aria-selected="i === current"
        :aria-label="`Go to slide ${i + 1}`"
        type="button"
        @click="goTo(i)"
      >
        <span
          class="carousel-dot-progress"
          :style="i === current ? { width: progressWidth + '%' } : {}"
        />
      </button>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       STATS BAND
  ═══════════════════════════════════════════════════ -->
  <div class="stats-band">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item sr sr-delay-1">
          <p class="stat-number">500<span>+</span></p>
          <p class="stat-label">Registered SMMEs</p>
        </div>
        <div class="stat-item sr sr-delay-2">
          <p class="stat-number">1.2<span>K</span></p>
          <p class="stat-label">Professionals</p>
        </div>
        <div class="stat-item sr sr-delay-3">
          <p class="stat-number">3.4<span>K</span></p>
          <p class="stat-label">Jobseekers</p>
        </div>
        <div class="stat-item sr sr-delay-4">
          <p class="stat-number">800<span>+</span></p>
          <p class="stat-label">Opportunities Posted</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════
       FEATURES
  ═══════════════════════════════════════════════════ -->
  <section style="background: var(--bg);">
    <div class="container">
      <div class="section-header sr">
        <span class="badge">
          <svg class="badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          What We Offer
        </span>
        <h2 class="section-title">
          Empowering Businesses with Innovation, Expertise, and <span class="highlight-dark">Success.</span>
        </h2>
        <p class="section-lead">
          Whether you're an SMME, a qualified professional, or a jobseeker, SMME Plug gives you the tools and connections to grow.
        </p>
      </div>

      <div class="feature-grid">
        <div
          v-for="(f, i) in features"
          :key="f.title"
          class="feature-card sr"
          :class="`sr-delay-${i + 1}`"
        >
          <div v-if="f.icon === 'briefcase'" class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-4.073M16.5 7.5V6a2.25 2.25 0 00-2.25-2.25h-4.5A2.25 2.25 0 007.5 6v1.5M3.75 10.5h16.5" /></svg>
          </div>
          <div v-else-if="f.icon === 'users'" class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
          </div>
          <div v-else-if="f.icon === 'star'" class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
          </div>
          <div v-else class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
          </div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       ABOUT / PLATFORM
  ═══════════════════════════════════════════════════ -->
  <section class="about-section">
    <div class="container about-inner">
      <div class="about-img-wrap sr sr-delay-1">
        <img
          class="about-img"
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"
          alt="Professional working with laptop"
          loading="lazy"
        />
        <div class="about-img-badge">
          <strong>112</strong>
          <span>Ward Community</span>
        </div>
      </div>

      <div class="sr sr-delay-2">
        <span class="badge">
          <svg class="badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
          </svg>
          Get to Know Us
        </span>
        <h2 class="section-title" style="margin-top:0.65rem">
          Empowering Businesses with Innovation, Expertise, and <span class="highlight-dark">Success.</span>
        </h2>
        <p style="margin-top:0.85rem;color:var(--ink-soft);font-size:0.95rem;line-height:1.75">
          SMME Plug is a community-driven platform built to bridge the gap between small business, skilled professionals, and employment opportunities in underserved areas.
        </p>
        <ul class="about-list">
          <li>Centralized database for SMMEs, professionals, and laborers.</li>
          <li>Real-time visibility to opportunities that are usually fragmented.</li>
          <li>Clear pathways for registration, application, and profile growth.</li>
          <li>Designed for Ward 112 and scalable to all communities.</li>
        </ul>
        <div style="margin-top:1.5rem;display:flex;gap:0.75rem;flex-wrap:wrap">
          <router-link class="btn btn-primary" to="/smmes">Explore SMME Path</router-link>
          <router-link class="btn btn-secondary" to="/professionals">For Professionals</router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       PARTNERS MARQUEE
  ═══════════════════════════════════════════════════ -->
  <div class="partners-section">
    <div class="partners-label">Trusted by our registered SMMEs</div>
    <div style="overflow:hidden">
      <div class="marquee-track">
        <div v-for="(p, i) in partners" :key="i" class="marquee-item">
          <svg style="width:0.9rem;height:0.9rem;color:var(--brand)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          {{ p }}
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════
       CTA
  ═══════════════════════════════════════════════════ -->
  <section class="cta-section sr">
    <div class="container cta-inner">
      <div class="cta-text">
        <h2>Ready to Join Over <span style="font-style:italic">1 000+</span> Community Members?</h2>
        <p>Sign up today and take your first step toward business growth, career advancement, or new employment.</p>
      </div>
      <div class="cta-actions">
        <router-link class="btn btn-secondary btn-lg" to="/smmes">Register as SMME</router-link>
        <router-link class="btn btn-ghost btn-lg" to="/jobseekers">Register as Jobseeker</router-link>
      </div>
    </div>
  </section>
</template>
