<script setup>
import { computed, reactive, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'

const submitted = ref(false)
const store = useRegistrationStore()
const form = reactive({
  businessName: '',
  contactName: '',
  phone: '',
  category: 'Construction',
  services: '',
})

const listedCompanies = [
  {
    name: 'Othaniel Consulting and Projects',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/Otha1-r7s6h6483qdikhbwbtt86y6ewrgktrd7fgntha2osk.jpg',
    services: ['Construction & Renovations', 'Supply', 'Cleaning'],
  },
  {
    name: 'Lethajako Group',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/Ltjk1-r7s6ijxo5y9pntbj8xcgd3lue6n15puzab8jwy0tms.jpg',
    services: ['Stationery, Office & School Furniture', 'Plumbing and Minor Renovations', 'Supply of Building Material'],
  },
  {
    name: 'BAPELA SOLUTIONS PTY (LTD)',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/Bap1-r7s6jlj7rbp6k7sx5dlj4u4a5lhppm08rhbz40h2pw.jpg',
    services: ['Plumbing', 'Glass Services', 'Furniture'],
  },
  {
    name: 'Wazitech Solutions (Pty)ltd',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/fZERdwjINEII-IMG-20250406-WA0091-r9a40dmubjnakyn1eezzf4xfqivf96i14mjzb7r2f8.jpg',
    services: ['Building Works', 'Demolishing', 'Clearing & Rubbles Removal'],
  },
  {
    name: 'CKN Security Services',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/ckn1-r7u4yfso87pdzft0gkr6qof901l2gw5c9rzx241gxw.jpg',
    services: ['24-hour Physical Guarding', 'Alarm & CCTV', 'VIP Protection'],
  },
  {
    name: 'Safe Riderz Group',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/SafeR1-r7s6kyetmpk3bxtx7yq4qhs91msstveaa7982eglqc.jpg',
    services: ['Tours & Transfers', 'Vehicle Licensing & Registration', 'School Transportation'],
  },
  {
    name: 'Braintree Construction',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/braintr-ra6m1xa3lve9v3q593c6goff7q1sl7lo8w2fuighdw.png',
    services: ['Building and Civil Engineering Works', 'Building & Maintenance', 'Consulting'],
  },
  {
    name: 'khopelas general trading',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/khoploog11-r81aup44rl5lqxwgwqy1utt5osnl2o0g2lbtui6ebo.png',
    services: ['Construction', 'Maintenance', 'Supply'],
  },
  {
    name: 'Bignocia Inc ta Vision Works',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/cropped-Smmeplug2-r75oofdb3pz4zbwqgx7l1f5h6i2vfuamcr8ivq2cgw.png',
    services: ['Spectacles', 'Eye Test', 'Contact Lenses'],
  },
  {
    name: 'Enzo Trading Group',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/enzo-jungle-gyms-official-logo-1-r81bzvfpc7wr5au2ha7qd8u5e6svt4bflyjrnzh8qs.webp',
    services: ['Manufacturer New Jungle Gyms(Wooden, Plastic Timber and Steel)', 'Repainting of Jungle Gyms', 'Playground Equipment'],
  },
  {
    name: 'Sanracle PTY LTD',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/Capturett-ra6n1761cqf0s4j1cx7foh05af1drli2xsvgboh9h8.png',
    services: ['Construction and Steelwork', 'Cleaning Services', 'Pest Control'],
  },
  {
    name: 'Morwasehla Attorneys',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/cropped-Smmeplug2-r75oofdb3pz4zbwqgx7l1f5h6i2vfuamcr8ivq2cgw.png',
    services: ['Client Representation', 'Family law, Labour & Employmet', 'Rescission Application & Hearings'],
  },
  {
    name: 'Vutomi PTY LTD',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/vutm1-r7s6mkotvza5qo2md6x8lyp63ja3wv4c86sh9mzli8.jpg',
    services: ['Technology Solutions', 'Furniture supply', 'Contact Lenses'],
  },
  {
    name: 'Cypress Web',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/GNI1iPUF0Nu6-Logo-rjckm5v3bb728lgn6vfo7akcj2fsepvng5u2lvzq1s.png',
    services: ['Website', 'Mobile Apps', 'Graphic designs'],
  },
  {
    name: 'Silof Projects',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/SilofLogo-rjeatfrirmlexysgeb8jrpxevrc4san8zjljzpsotc.png',
    services: ['Construction', 'Plumbing', 'Landscaping'],
  },
  {
    name: 'Handy Air And Main Company',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/cropped-Smmeplug1-scaled-1-r72gpulicbam4vpr2fsh8uzo8y1dwxihqiod7fr2qo.png',
    services: ['Construction and HVAC', 'Plumbing', 'Landscaping'],
  },
  {
    name: 'Rage In Pretoria (Pty) Ltd',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/Rage-rjecqw27qxo4spwmuc0606zj0p0hj6d97ax4jqth28.png',
    services: ['Comprehension Landscaping Solutions', 'Construction and Maintenance', 'Environmental Services'],
  },
]

const approvedSmmes = computed(() => store.approvedUsersByType('smmes'))

const submitForm = async () => {
  await store.addRegistration({
    type: 'smmes',
    displayName: form.businessName,
    phone: form.phone,
    profile: {
      contactName: form.contactName,
      category: form.category,
      services: form.services,
    },
  })

  form.businessName = ''
  form.contactName = ''
  form.phone = ''
  form.category = 'Construction'
  form.services = ''
  submitted.value = true
}
</script>

<template>
  <section class="hero-panel reveal delay-2">
    <p class="eyebrow">SMME Registration</p>
    <h1>Scale your enterprise with better access to opportunities.</h1>
    <p class="lead">
      Register your business profile to receive visibility for procurement tenders, job opportunities, and strategic
      growth connections.
    </p>
  </section>

  <section class="split">
    <article class="content-card reveal delay-3">
      <h3>SMME Benefits</h3>
      <ul class="feature-list">
        <li>Access tender notices and procurement opportunities.</li>
        <li>Promote services to employers and local stakeholders.</li>
        <li>Reduce barriers to market entry through one trusted platform.</li>
        <li>Contribute to job creation and formal economy participation.</li>
      </ul>
    </article>

    <article class="form-card reveal delay-4">
      <h3>Business Profile Form</h3>
      <form @submit.prevent="submitForm">
        <div class="field-group">
          <label for="businessName">Business Name</label>
          <input id="businessName" v-model="form.businessName" type="text" required />
        </div>
        <div class="field-group">
          <label for="contactName">Contact Person</label>
          <input id="contactName" v-model="form.contactName" type="text" required />
        </div>
        <div class="field-group">
          <label for="phone">Phone Number</label>
          <input id="phone" v-model="form.phone" type="tel" required />
        </div>
        <div class="field-group">
          <label for="category">Sector</label>
          <select id="category" v-model="form.category">
            <option>Construction</option>
            <option>IT Services</option>
            <option>Cleaning Services</option>
            <option>Logistics</option>
            <option>Hospitality</option>
          </select>
        </div>
        <div class="field-group">
          <label for="services">Services Offered</label>
          <textarea id="services" v-model="form.services" required />
        </div>
        <button class="btn btn-primary" type="submit">Submit SMME Profile</button>
      </form>
      <p v-if="submitted" class="small-note success-note">Submission captured. A coordinator will review your profile.</p>
    </article>
  </section>

  <section class="content-card reveal delay-5">
    <p class="eyebrow">Approved SMME Applications</p>
    <h3 style="margin-top: 0.45rem">Profiles published after admin approval</h3>
    <div v-if="approvedSmmes.length" class="approved-grid">
      <article v-for="user in approvedSmmes" :key="user.id" class="approved-card">
        <h4>{{ user.displayName }}</h4>
        <p>{{ user.profile.category }} | {{ user.profile.contactName }}</p>
        <p>{{ user.phone }}</p>
      </article>
    </div>
    <p v-else class="small-note">No approved SMME applications yet.</p>
  </section>

  <section class="content-card reveal delay-5">
    <p class="eyebrow">Listed Companies</p>
    <h3 style="margin-top: 0.45rem">SMMEs from the official SMME Plug listing</h3>
    <div class="company-grid">
      <article v-for="company in listedCompanies" :key="company.name" class="company-item company-rich-card">
        <img class="company-logo" :src="company.logo" :alt="`${company.name} logo`" loading="lazy" />
        <h4>{{ company.name }}</h4>
        <ul class="company-services">
          <li v-for="service in company.services" :key="`${company.name}-${service}`">{{ service }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
