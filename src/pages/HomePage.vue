<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const slides = [
  {
    title: 'Empowering SMMEs through market access',
    description: 'Create visibility for your business and find tenders, contracts, and growth opportunities.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    alt: 'Team collaborating in a modern office',
  },
  {
    title: 'Connecting professionals with employers',
    description: 'Build a strong profile and get matched with roles aligned to your qualifications.',
    image:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=80',
    alt: 'Professional discussing work opportunities',
  },
  {
    title: 'Helping jobseekers build real momentum',
    description: 'Access jobs, training, and practical work experience in one trusted place.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
    alt: 'Community members learning and planning',
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
let intervalId

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

onMounted(() => {
  intervalId = setInterval(nextSlide, 4500)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <section class="slider-wrap reveal delay-2">
    <article class="slide-card">
      <img :src="slides[currentSlide].image" :alt="slides[currentSlide].alt" class="slide-image" />
      <div class="slide-overlay">
        <p class="eyebrow">Featured</p>
        <h3>{{ slides[currentSlide].title }}</h3>
        <p>{{ slides[currentSlide].description }}</p>
      </div>
      <button class="slide-nav prev" type="button" @click="prevSlide">Prev</button>
      <button class="slide-nav next" type="button" @click="nextSlide">Next</button>
    </article>
    <div class="slide-dots">
      <button
        v-for="(slide, index) in slides"
        :key="slide.title"
        class="dot"
        :class="{ active: index === currentSlide }"
        type="button"
        :aria-label="`Go to slide ${index + 1}`"
        @click="goToSlide(index)"
      />
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
