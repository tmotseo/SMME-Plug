<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const slides = [
  {
    kicker: 'Featured for SMMEs',
    shortTitle: 'Market Access',
    title: 'Empowering SMMEs through market access',
    description: 'Create visibility for your business and find tenders, contracts, and growth opportunities.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    alt: 'Team collaborating in a modern office',
    primaryCta: {
      label: 'Start SMME Profile',
      to: '/smmes',
    },
    secondaryCta: {
      label: 'Explore Portal',
      to: '/professionals',
    },
  },
  {
    kicker: 'Featured for Professionals',
    shortTitle: 'Career Matching',
    title: 'Connecting professionals with employers',
    description: 'Build a strong profile and get matched with roles aligned to your qualifications.',
    image:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=80',
    alt: 'Professional discussing work opportunities',
    primaryCta: {
      label: 'Join Professionals',
      to: '/professionals',
    },
    secondaryCta: {
      label: 'View Jobseeker Path',
      to: '/jobseekers',
    },
  },
  {
    kicker: 'Featured for Jobseekers',
    shortTitle: 'Work Readiness',
    title: 'Helping jobseekers build real momentum',
    description: 'Access jobs, training, and practical work experience in one trusted place.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
    alt: 'Community members learning and planning',
    primaryCta: {
      label: 'Register as Jobseeker',
      to: '/jobseekers',
    },
    secondaryCta: {
      label: 'Browse SMME Path',
      to: '/smmes',
    },
  },
]

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1100&q=80',
    alt: 'Business planning documents and laptop',
  },
  {
    src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1100&q=80',
    alt: 'People in a strategy meeting',
  },
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1100&q=80',
    alt: 'Small team collaborating',
  },
]

const currentSlide = ref(0)
const isAutoplay = ref(true)
const isPaused = ref(false)
const activeSlide = computed(() => slides[currentSlide.value])

const AUTO_PLAY_MS = 5000
const AUTO_RESUME_MS = 6000
const SWIPE_THRESHOLD = 50

let touchStartX = 0
let touchCurrentX = 0
let intervalId
let resumeTimeoutId

const clearAutoTimers = () => {
  clearInterval(intervalId)
  clearTimeout(resumeTimeoutId)
}

const startAutoplay = () => {
  clearInterval(intervalId)
  if (!isAutoplay.value || isPaused.value) return
  intervalId = setInterval(() => {
    nextSlide(true)
  }, AUTO_PLAY_MS)
}

const queueResume = () => {
  if (!isAutoplay.value || isPaused.value) return
  clearTimeout(resumeTimeoutId)
  clearInterval(intervalId)
  resumeTimeoutId = setTimeout(() => {
    startAutoplay()
  }, AUTO_RESUME_MS)
}

const nextSlide = (fromTimer = false) => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
  if (!fromTimer) queueResume()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
  queueResume()
}

const goToSlide = (index) => {
  currentSlide.value = index
  queueResume()
}

const pauseAutoplay = () => {
  isPaused.value = true
  clearInterval(intervalId)
}

const resumeAutoplay = () => {
  if (!isAutoplay.value) return
  isPaused.value = false
  queueResume()
}

const toggleAutoplay = () => {
  isAutoplay.value = !isAutoplay.value
  if (!isAutoplay.value) {
    clearAutoTimers()
    isPaused.value = false
    return
  }
  isPaused.value = false
  startAutoplay()
}

const onVisibilityChange = () => {
  if (document.hidden) {
    pauseAutoplay()
    return
  }
  if (isAutoplay.value) {
    isPaused.value = false
    startAutoplay()
  }
}

const onKeydown = (event) => {
  if (event.key === 'ArrowRight') {
    nextSlide()
  }
  if (event.key === 'ArrowLeft') {
    prevSlide()
  }
  if (event.key === 'Home') {
    goToSlide(0)
  }
  if (event.key === 'End') {
    goToSlide(slides.length - 1)
  }
  if (event.key === ' ') {
    event.preventDefault()
    toggleAutoplay()
  }
}

const onTouchStart = (event) => {
  touchStartX = event.changedTouches[0].clientX
  touchCurrentX = touchStartX
  pauseAutoplay()
}

const onTouchMove = (event) => {
  touchCurrentX = event.changedTouches[0].clientX
}

const onTouchEnd = () => {
  const deltaX = touchCurrentX - touchStartX
  if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
    if (deltaX < 0) nextSlide()
    if (deltaX > 0) prevSlide()
  }
  resumeAutoplay()
}

onMounted(() => {
  startAutoplay()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  clearAutoTimers()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <section class="slider-wrap reveal delay-2">
    <article
      class="slide-card"
      tabindex="0"
      aria-roledescription="carousel"
      :aria-label="`Homepage spotlight slider. Slide ${currentSlide + 1} of ${slides.length}`"
      @keydown="onKeydown"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
      @focusin="pauseAutoplay"
      @focusout="resumeAutoplay"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      <transition name="slide-fade" mode="out-in">
        <img :key="activeSlide.image" :src="activeSlide.image" :alt="activeSlide.alt" class="slide-image" />
      </transition>
      <div class="slide-gradient" />
      <div class="slide-overlay">
        <div class="slide-meta">
          <p class="eyebrow">{{ activeSlide.kicker }}</p>
          <p class="slide-count">{{ String(currentSlide + 1).padStart(2, '0') }} / {{ String(slides.length).padStart(2, '0') }}</p>
        </div>
        <h3>{{ activeSlide.title }}</h3>
        <p>{{ activeSlide.description }}</p>
        <div class="actions slide-actions">
          <router-link class="btn btn-primary" :to="activeSlide.primaryCta.to">{{ activeSlide.primaryCta.label }}</router-link>
          <router-link class="btn btn-secondary" :to="activeSlide.secondaryCta.to">{{ activeSlide.secondaryCta.label }}</router-link>
        </div>
      </div>

      <div class="slide-controls">
        <button class="slide-nav prev" type="button" aria-label="Go to previous slide" @click="prevSlide">&#8592;</button>
        <button class="slide-toggle" type="button" :aria-label="isAutoplay ? 'Pause autoplay' : 'Resume autoplay'" @click="toggleAutoplay">
          {{ isAutoplay ? 'Pause' : 'Play' }}
        </button>
        <button class="slide-nav next" type="button" aria-label="Go to next slide" @click="nextSlide">&#8594;</button>
      </div>
    </article>
    <div class="slide-dots" role="tablist" aria-label="Choose a spotlight slide">
      <button
        v-for="(slide, index) in slides"
        :key="slide.title"
        class="dot"
        :class="{ active: index === currentSlide }"
        role="tab"
        :aria-selected="index === currentSlide"
        type="button"
        :aria-label="`Go to slide ${index + 1}: ${slide.shortTitle}`"
        @click="goToSlide(index)"
      >
        <span class="dot-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="dot-title">{{ slide.shortTitle }}</span>
      </button>
    </div>
  </section>

  <section class="hero-panel reveal delay-2">
    <p class="eyebrow">SMMEs | Professionals | Jobseekers</p>
    <h1>One modern platform that connects talent, small business, and opportunity.</h1>
    <p class="lead">
      SMME Plug supports sustainable and inclusive growth by connecting community members to procurement, work
      opportunities, and career development.
    </p>
    <div class="actions">
      <router-link class="btn btn-primary" to="/smmes">Explore SMME Path</router-link>
      <router-link class="btn btn-secondary" to="/professionals">Explore Professional Path</router-link>
      <router-link class="btn btn-secondary" to="/jobseekers">Explore Jobseeker Path</router-link>
    </div>
  </section>

  <section class="image-showcase">
    <article v-for="image in galleryImages" :key="image.src" class="showcase-tile reveal delay-4">
      <img :src="image.src" :alt="image.alt" />
    </article>
  </section>

  <section class="content-grid">
    <article class="content-card reveal delay-3">
      <h3>Discover Opportunities</h3>
      <p>Access job openings, tenders, and business opportunities in one place.</p>
    </article>
    <article class="content-card reveal delay-4">
      <h3>Build Credibility</h3>
      <p>Create a strong profile with your achievements, skills, and project history.</p>
    </article>
    <article class="content-card reveal delay-5">
      <h3>Grow with Support</h3>
      <p>Get connected with stakeholders who can unlock training and market access.</p>
    </article>
  </section>

  <section class="split">
    <article class="content-card reveal delay-2">
      <p class="eyebrow">Platform Focus</p>
      <h3 style="margin-top: 0.45rem">Ward 112 Community Development</h3>
      <ul class="feature-list">
        <li>Centralized database for SMMEs, professionals, and laborers.</li>
        <li>Real-time visibility to opportunities that are usually fragmented.</li>
        <li>Clear pathways for registration, application, and profile growth.</li>
      </ul>
    </article>
    <article class="content-card reveal delay-3">
      <p class="eyebrow">Quick Links</p>
      <h3 style="margin-top: 0.45rem">Start Your Journey</h3>
      <div class="actions">
        <a class="btn btn-primary" href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">Open Portal</a>
        <a class="btn btn-secondary" href="https://smmesplug.co.za/" target="_blank" rel="noreferrer">View Registry</a>
      </div>
      <p class="small-note">
        This redesigned site is responsive and route-based, with dedicated pages for each navigation category.
      </p>
    </article>
  </section>
</template>
