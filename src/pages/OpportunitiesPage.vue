<script setup>
import { computed, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'

const store = useRegistrationStore()
const audienceFilter = ref('all')

const opportunities = computed(() => {
  if (audienceFilter.value === 'all') return store.state.opportunities
  return store.opportunitiesByAudience(audienceFilter.value)
})

const audienceLabel = (audience) => {
  if (audience === 'smmes') return 'SMMEs'
  if (audience === 'professionals') return 'Professionals'
  if (audience === 'jobseekers') return 'Jobseekers'
  return 'All'
}
</script>

<template>
  <section class="hero-panel reveal delay-2">
    <p class="eyebrow">Opportunities</p>
    <h1>Current opportunities for SMMEs, Professionals, and Jobseekers.</h1>
    <p class="lead">
      Browse new opportunities posted by admin, including business tenders, professional placements, and job openings.
    </p>
    <div class="actions">
      <select v-model="audienceFilter" class="btn btn-secondary" style="min-width: 210px">
        <option value="all">All Audiences</option>
        <option value="smmes">SMMEs</option>
        <option value="professionals">Professionals</option>
        <option value="jobseekers">Jobseekers</option>
      </select>
    </div>
  </section>

  <section class="content-card reveal delay-3">
    <p class="eyebrow">Open Listings</p>
    <h3 style="margin-top: 0.45rem">Published opportunities</h3>
    <div v-if="opportunities.length" class="company-grid" style="margin-top: 1rem">
      <article v-for="item in opportunities" :key="item.id" class="company-item company-rich-card">
        <h4>{{ item.title }}</h4>
        <p class="small-note" style="margin-top: 0.35rem">
          {{ audienceLabel(item.audience) }}
          <span v-if="item.organization"> | {{ item.organization }}</span>
          <span v-if="item.location"> | {{ item.location }}</span>
        </p>
        <p v-if="item.details" class="small-note" style="margin-top: 0.45rem">{{ item.details }}</p>
        <p v-if="item.deadline" class="small-note" style="margin-top: 0.45rem"><strong>Deadline:</strong> {{ item.deadline }}</p>
        <a
          v-if="item.link"
          class="btn btn-primary"
          :href="item.link"
          target="_blank"
          rel="noreferrer"
          style="display: block; margin-top: 1.2rem; width: 100%; text-align: center"
        >
          Apply / View
        </a>
      </article>
    </div>
    <p v-else class="small-note" style="margin-top: 0.9rem">No opportunities posted yet.</p>
  </section>
</template>
