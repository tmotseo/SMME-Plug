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
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/Rage-rjecqw27qxo8w1dhpjqnpm5j3gpbscrhq00oyc4gvc.png',
    services: [
      'Comprehension Landscaping Solutions',
      'Construction and Maintenance',
      'Environmental Services',
      'Office Essentials',
      'Healthcare Solutions',
      'Supply Chains Services',
      'Aesthetics Enhancement and Energy Solutions',
    ],
  },
  {
    name: 'Morare Construction',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/BpKeJ924L8KH-Turquoise-And-Orange-Modern-Minimalist-Home-For-Sale-Flyer11-2-rjscdutrg1lq2oc5wkw4tgltq10l9x17xzsyu149sk.jpg',
    services: [
      'VIP Toilets and Mobile Fridge Hire',
      'Infrastructure Development',
      'General Building',
      'Civil Works',
      'Plumbing',
      'Electrical',
      'Horticulture',
    ],
  },
  {
    name: 'Amavuso Projects Primary co-Operative Ltd',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/1bpE8Fl2MUgG-LOGO-scaled-rjsdixdvgifvu906h0s6btkpurjo1gnujgzuvcwdbs.jpg',
    services: ['Construction', 'Supplier', 'Grasscutting', 'Transport', 'Catering', 'Cleaning'],
  },
  {
    name: 'Polimayethu Projects',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/cropped-Smmeplug1-scaled-1-r72gpuljfs74csdyvf8avs16zmlr2kf1qe23q7x38w.png',
    services: [
      'Air Conditioning Installation and repair',
      'Contraction Services',
      'Waterproofing',
      'Plumbing Contractor',
      'Electrical Contractor',
    ],
  },
  {
    name: 'Matcan pty Ltd',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/c1IBXnmcBOtd-file_00000000838871f5b68da3f769c9e28b-rjsfcn9new9wglyek6bs92xqx0z6b9p3lu6t76l6v8.png',
    services: ['Maintenance & repairs', 'Transportation services', 'Supply and deliveries'],
  },
  {
    name: 'Sago Universal',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/Zw13ma08JknS-Sago-Universal-Logo-rjsfrx58gz6t9gyyo3m9tuxejl85ryxfhhh7jxwdgw.png',
    services: ['Recruitment', 'Labour Broker Services'],
  },
  {
    name: 'The Ease Club (Pty) Ltd',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/CwZUaue9Ysrb-image0-rjsfydbdd20gs6efpkddvll95lwk7fxrxcyshedn2c.png',
    services: ['Pest Control', 'Carpentry', 'Maintenance'],
  },
  {
    name: 'Ndimam supply and projects',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/cropped-Smmeplug1-scaled-1-r72gpuljfs74csdyvf8avs16zmlr2kf1qe23q7x38w.png',
    services: [
      'Construction',
      'Grass Cutting',
      'Land scaping',
      'Plumbing Contractor',
      'Catering Services',
      'Cleaning Services',
    ],
  },
  {
    name: 'Tshwantshetso pty Ltd',
    logo: 'https://smmesplug.co.za/wp-content/uploads/elementor/thumbs/yTPV3CKRAtOp-Screenshot_20250908_214806_All-Document-Reader-rjsgm8fuvmohi402x9v5bv7k2efmi7hbm4osx0cb6o.jpg',
    services: [
      'Electrical installation',
      'Maintenance',
      'Wiring from domestic to industrial',
      'All electrical works from LV to HV',
      'Generator Installations and maintenance',
    ],
  },
]

const smmeProfileLinks = {
  'Othaniel Consulting and Projects': 'https://smmesplug.co.za/Profiles/othaniel.pdf',
  'Lethajako Group': 'https://smmesplug.co.za/Profiles/ltjk.pdf',
  'BAPELA SOLUTIONS PTY (LTD)': 'https://smmesplug.co.za/Profiles/bapela.pdf',
  'CKN Security Services': 'https://smmesplug.co.za/Profiles/cknProfile.pdf',
  'Safe Riderz Group': 'https://smmesplug.co.za/Profiles/saferiders.pdf',
  'Braintree Construction': 'https://smmesplug.co.za/Profiles/brain.pdf',
  'khopelas general trading': 'https://smmesplug.co.za/Profiles/khopelas.pdf',
  'Sanracle PTY LTD': 'https://smmesplug.co.za/Profiles/sanracle.pdf',
  'Morwasehla Attorneys': 'https://smmesplug.co.za/Profiles/morwasehla.pdf',
  'Vutomi PTY LTD': 'https://smmesplug.co.za/Profiles/vutomim.pdf',
  'Silof Projects': 'https://smmesplug.co.za/Profiles/Silof.pdf',
  'Rage In Pretoria (Pty) Ltd': 'https://smmesplug.co.za/Profiles/Rage.pdf',
}

const getProfileUrl = (companyName) => smmeProfileLinks[companyName] ?? 'https://smmesplug.co.za/smmes/'

const searchQuery = ref('')

const approvedSmmes = computed(() => {
  const users = store.approvedUsersByType('smmes')
  if (!searchQuery.value.trim()) return users
  
  const query = searchQuery.value.toLowerCase()
  return users.filter(user => 
    user.displayName?.toLowerCase().includes(query) ||
    user.profile?.category?.toLowerCase().includes(query) ||
    user.profile?.services?.toLowerCase().includes(query) ||
    user.phone?.toLowerCase().includes(query)
  )
})

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
    
    <!-- Search Box -->
    <div class="mt-4 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, category, services or phone..."
        class="w-full md:w-96 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-emerald-200 transition focus:ring"
      />
    </div>
    
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
        <a
          class="btn btn-secondary"
          :href="getProfileUrl(company.name)"
          target="_blank"
          rel="noreferrer"
          style="margin-top: 0.7rem; width: 100%; text-align: center"
        >
          View Profile
        </a>
      </article>
    </div>
  </section>
</template>
