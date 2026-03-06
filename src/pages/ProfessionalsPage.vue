<script setup>
import { computed, reactive, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'

const submitted = ref(false)
const store = useRegistrationStore()
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  field: 'Project Management',
  experience: '',
})

const approvedProfessionals = computed(() => store.approvedUsersByType('professionals'))

const submitForm = async () => {
  await store.addRegistration({
    type: 'professionals',
    displayName: form.fullName,
    email: form.email,
    phone: form.phone,
    profile: {
      field: form.field,
      experience: form.experience,
    },
  })

  form.fullName = ''
  form.email = ''
  form.phone = ''
  form.field = 'Project Management'
  form.experience = ''
  submitted.value = true
}
</script>

<template>
  <section class="hero-panel reveal delay-2">
    <p class="eyebrow">Professional Pathway</p>
    <h1>Get matched with opportunities aligned to your expertise.</h1>
    <p class="lead">
      Join the professional network to receive relevant openings, targeted profile promotion, and visibility to
      stakeholders seeking your skills.
    </p>
  </section>

  <section class="split">
    <article class="content-card reveal delay-3">
      <h3>Why Register as a Professional</h3>
      <ul class="feature-list">
        <li>Receive job alerts matching your skills and industry.</li>
        <li>Boost visibility through curated CV promotion.</li>
        <li>Access exclusive career and placement opportunities.</li>
        <li>Connect with employers and ecosystem partners faster.</li>
      </ul>
    </article>

    <article class="form-card reveal delay-4">
      <h3>Professional Registration</h3>
      <form @submit.prevent="submitForm">
        <div class="field-group">
          <label for="fullName">Full Name</label>
          <input id="fullName" v-model="form.fullName" type="text" required />
        </div>
        <div class="field-group">
          <label for="email">Email Address</label>
          <input id="email" v-model="form.email" type="email" required />
        </div>
        <div class="field-group">
          <label for="phone">Phone Number</label>
          <input id="phone" v-model="form.phone" type="tel" required />
        </div>
        <div class="field-group">
          <label for="field">Primary Field</label>
          <select id="field" v-model="form.field">
            <option>Project Management</option>
            <option>Engineering</option>
            <option>Finance</option>
            <option>ICT</option>
            <option>Operations</option>
          </select>
        </div>
        <div class="field-group">
          <label for="experience">Experience Summary</label>
          <textarea id="experience" v-model="form.experience" required />
        </div>
        <small><em>I hereby give my consent to [SMMEs Plug] to collect, store, and process my personal information for the purposes stated above, in accordance with POPIA.
I understand that I may withdraw my consent in writing at any time.</em></small>
<a href="https://smmesplug.co.za/consent-form/" target="_blank">Clic on the Link</a>
        <button class="btn btn-primary" type="submit">Submit Professional Profile</button>
      </form>
      <p v-if="submitted" class="small-note success-note">
        Details received. Your profile is ready for opportunity matching.
      </p>
    </article>
  </section>

  <section class="content-card reveal delay-5">
    <p class="eyebrow">Approved Professionals</p>
    <h3 style="margin-top: 0.45rem">Public profiles approved by admin</h3>
    <div v-if="approvedProfessionals.length" class="approved-grid">
      <article v-for="user in approvedProfessionals" :key="user.id" class="approved-card">
        <h4>{{ user.displayName }}</h4>
        <p>{{ user.profile.field }}</p>
        <p>{{ user.email }}</p>
      </article>
    </div>
    <p v-else class="small-note">No approved professional profiles yet.</p>
  </section>
</template>
