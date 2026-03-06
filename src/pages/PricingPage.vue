<script setup>
const packages = [
  {
    name: 'Brand Identity',
    price: 'From R1,000',
    subtitle: 'Visual foundation for your business',
    features: [
      'Logo design concepts',
      'Color palette and typography system',
      'Brand style guide',
      'Social media profile kit',
    ],
  },
  {
    name: 'Website Development',
    price: 'From R1,500',
    subtitle: 'Professional website for growth',
    features: [
      'Responsive multi-page website',
      'SEO-ready structure',
      'Contact/lead forms',
      'Basic analytics integration',
    ],
  },
  {
    name: 'Mobile Application Development',
    price: 'From R10,000',
    subtitle: 'Custom mobile app experience',
    features: [
      'Android/iOS-ready architecture',
      'UI/UX design and prototyping',
      'API integration',
      'App store deployment support',
    ],
  },
  {
    name: 'Digital Marketing',
    price: 'From R1,100 / month',
    subtitle: 'Consistent visibility and leads',
    features: [
      'Social media campaign management',
      'Content calendar and creatives',
      'Paid ad optimization',
      'Performance reporting',
    ],
  },
]

const buildQuoteEmail = (serviceName) => {
  const to = 'tumelo@cypressweb.co.za'
  const subject = encodeURIComponent(serviceName)
  const body = encodeURIComponent(`Hello,\n\nI would like to request a quote for: ${serviceName}.\n\nRegards,`)
  return `mailto:${to}?subject=${subject}&body=${body}`
}
</script>

<template>
  <section class="hero-panel reveal delay-2">
    <p class="eyebrow">Pricing</p>
    <h1>Flexible packages for growing businesses and professionals.</h1>
    <p class="lead">
      Choose a package that matches your current stage. Each package is tailored to practical outcomes and scalable
      delivery.
    </p>
  </section>

  <section class="content-card reveal delay-3">
    <p class="eyebrow">Service Packages</p>
    <h3 style="margin-top: 0.45rem">Transparent starter pricing</h3>
    <div class="company-grid" style="margin-top: 1rem">
      <article v-for="pkg in packages" :key="pkg.name" class="company-item company-rich-card">
        <h4>{{ pkg.name }}</h4>
        <p class="small-note" style="margin-top: 0.35rem">{{ pkg.subtitle }}</p>
        <p style="margin-top: 0.6rem; font-weight: 700; color: var(--brand-dark)">{{ pkg.price }}</p>
        <ul class="company-services" style="margin-top: 0.7rem">
          <li v-for="feature in pkg.features" :key="`${pkg.name}-${feature}`">{{ feature }}</li>
        </ul>
        <a
          class="btn btn-primary"
          :href="buildQuoteEmail(pkg.name)"
          style="display: block; margin-top: 1rem; text-align: center"
        >
          Request Quote
        </a>
      </article>
    </div>
  </section>
</template>
