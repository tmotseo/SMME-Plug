<script setup>
import { computed, reactive, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'

const submitted = ref(false)
const store = useRegistrationStore()
const form = reactive({
  fullName: '',
  phone: '',
  location: '',
  skillLevel: 'Skilled',
  interests: '',
})

const approvedJobseekers = computed(() => {
  const users = store.approvedUsersByType('jobseekers')
  if (!searchQuery.value.trim()) return users
  
  const query = searchQuery.value.toLowerCase()
  return users.filter(user => 
    user.displayName?.toLowerCase().includes(query) ||
    user.profile?.skillLevel?.toLowerCase().includes(query) ||
    user.profile?.location?.toLowerCase().includes(query) ||
    user.phone?.toLowerCase().includes(query)
  )
})

const searchQuery = ref('')

const submitForm = async () => {
  await store.addRegistration({
    type: 'jobseekers',
    displayName: form.fullName,
    phone: form.phone,
    profile: {
      location: form.location,
      skillLevel: form.skillLevel,
      interests: form.interests,
    },
  })

  form.fullName = ''
  form.phone = ''
  form.location = ''
  form.skillLevel = 'Skilled'
  form.interests = ''
  submitted.value = true
}
</script>

<template>
  <section class="hero-panel reveal delay-2">
    <p class="eyebrow">Jobseekers and Laborers</p>
    <h1>Access real jobs, training pathways, and steady work exposure.</h1>
    <p class="lead">
      The platform helps skilled and unskilled workers build a digital track record and connect with suitable
      employers across multiple sectors.
    </p>
  </section>

  <section class="split">
    <article class="content-card reveal delay-3">
      <h3>How Jobseekers Benefit</h3>
      <ul class="feature-list">
        <li>Apply for short-term gigs, contract work, and full-time roles.</li>
        <li>Find training opportunities in high-demand sectors.</li>
        <li>Build credibility through completed jobs and profile history.</li>
        <li>Get matched to roles based on your skills and availability.</li>
      </ul>
    </article>

    <article class="form-card reveal delay-4">
      <h3>Jobseeker Registration</h3>
      <form @submit.prevent="submitForm">
        <div class="field-group">
          <label for="fullName">Full Name</label>
          <input id="fullName" v-model="form.fullName" type="text" required />
        </div>
        <div class="field-group">
          <label for="phone">Phone Number</label>
          <input id="phone" v-model="form.phone" type="tel" required />
        </div>
        <div class="field-group">
          <label for="location">Area / Location</label>
          <input id="location" v-model="form.location" type="text" required />
        </div>
        <div class="field-group">
          <label for="skillLevel">Skill Level</label>
          <select id="skillLevel" v-model="form.skillLevel">
            <option>Skilled</option>
            <option>Semi-skilled</option>
            <option>Entry-level</option>
          </select>
        </div>
        <div class="field-group">
          <label for="interests">Work Interests</label>
          <textarea id="interests" v-model="form.interests" required />
        </div>
        <button class="btn btn-primary" type="submit">Submit Jobseeker Profile</button>
      </form>
      <p v-if="submitted" class="small-note success-note">
        Registration saved. You can now be matched with relevant work opportunities.
      </p>
    </article>
  </section>

  <section class="content-card reveal delay-5">
    <p class="eyebrow">Approved Jobseekers</p>
    <h3 style="margin-top: 0.45rem">Profiles visible after admin approval</h3>
    
    <!-- Search Box -->
    <div class="mt-4 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, skill level, location or phone..."
        class="w-full md:w-96 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-emerald-200 transition focus:ring"
      />
    </div>
    
    <div v-if="approvedJobseekers.length" class="approved-grid">
      <article v-for="user in approvedJobseekers" :key="user.id" class="approved-card">
        <h4>{{ user.displayName }}</h4>
        <p>{{ user.profile.skillLevel }} | {{ user.profile.location }}</p>
        <p>{{ user.phone }}</p>
      </article>
    </div>
    <p v-else class="small-note">No approved jobseeker profiles yet.</p>
  </section>
</template>
