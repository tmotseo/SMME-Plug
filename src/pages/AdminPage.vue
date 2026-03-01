<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'

const store = useRegistrationStore()

const adminPasscode = 'admin123'
const passcodeInput = ref('')
const unlocked = ref(false)

const typeFilter = ref('all')
const statusFilter = ref('all')
const searchTerm = ref('')
const selectedId = ref('')
const adminMessage = ref('')

const editForm = reactive({
  displayName: '',
  email: '',
  phone: '',
  contactName: '',
  category: '',
  services: '',
  field: '',
  experience: '',
  location: '',
  skillLevel: '',
  interests: '',
  adminNote: '',
})

const filteredUsers = computed(() =>
  store.state.users.filter((user) => {
    const matchesType = typeFilter.value === 'all' || user.type === typeFilter.value
    const matchesStatus = statusFilter.value === 'all' || user.status === statusFilter.value
    const q = searchTerm.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      user.displayName.toLowerCase().includes(q) ||
      user.phone.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    return matchesType && matchesStatus && matchesSearch
  }),
)

const selectedUser = computed(() => store.getUserById(selectedId.value) ?? null)

watch(
  () => selectedUser.value,
  (user) => {
    if (!user) return
    editForm.displayName = user.displayName ?? ''
    editForm.email = user.email ?? ''
    editForm.phone = user.phone ?? ''
    editForm.contactName = user.profile.contactName ?? ''
    editForm.category = user.profile.category ?? ''
    editForm.services = user.profile.services ?? ''
    editForm.field = user.profile.field ?? ''
    editForm.experience = user.profile.experience ?? ''
    editForm.location = user.profile.location ?? ''
    editForm.skillLevel = user.profile.skillLevel ?? ''
    editForm.interests = user.profile.interests ?? ''
    editForm.adminNote = user.adminNote ?? ''
  },
  { immediate: true },
)

const unlockAdmin = () => {
  unlocked.value = passcodeInput.value === adminPasscode
  if (unlocked.value) {
    store.loadUsers()
  }
}

const saveProfile = async () => {
  if (!selectedUser.value) return
  await store.updateUserProfile(selectedUser.value.id, {
    displayName: editForm.displayName,
    email: editForm.email,
    phone: editForm.phone,
    adminNote: editForm.adminNote,
    profile: {
      contactName: editForm.contactName,
      category: editForm.category,
      services: editForm.services,
      field: editForm.field,
      experience: editForm.experience,
      location: editForm.location,
      skillLevel: editForm.skillLevel,
      interests: editForm.interests,
    },
  })
}

const approve = async () => {
  if (!selectedUser.value) return
  await store.approveUser(selectedUser.value.id)
}

const reject = async () => {
  if (!selectedUser.value) return
  await store.rejectUser(selectedUser.value.id)
}

const sendMessage = async () => {
  if (!selectedUser.value) return
  const sent = await store.sendAdminMessage(selectedUser.value.id, adminMessage.value)
  if (sent) adminMessage.value = ''
}

const pct = (value) => {
  const total = store.stats.value.total || 1
  return `${Math.round((value / total) * 100)}%`
}

onMounted(() => {
  if (unlocked.value) store.loadUsers()
})
</script>

<template>
  <section class="hero-panel reveal delay-2">
    <p class="eyebrow">Admin Panel</p>
    <h1>Registration Management Console</h1>
    <p class="lead">
      Approve or reject applications, send updates, review full profiles, and track registration activity visually.
    </p>
  </section>

  <section v-if="!unlocked" class="form-card reveal delay-3" style="margin-top: 1rem">
    <h3>Admin Access</h3>
    <p class="small-note">Enter passcode to continue. Default demo passcode: admin123</p>
    <div class="actions" style="margin-top: 0.6rem">
      <input v-model="passcodeInput" type="password" placeholder="Enter passcode" />
      <button class="btn btn-primary" type="button" @click="unlockAdmin">Unlock</button>
    </div>
  </section>

  <section v-else class="admin-layout">
    <article class="content-card reveal delay-3">
      <h3>Registration Overview</h3>
      <div class="admin-stats-grid">
        <div class="admin-stat">
          <p>Total</p>
          <strong>{{ store.stats.value.total }}</strong>
        </div>
        <div class="admin-stat">
          <p>Pending</p>
          <strong>{{ store.stats.value.pending }}</strong>
        </div>
        <div class="admin-stat">
          <p>Approved</p>
          <strong>{{ store.stats.value.approved }}</strong>
        </div>
        <div class="admin-stat">
          <p>Rejected</p>
          <strong>{{ store.stats.value.rejected }}</strong>
        </div>
      </div>
      <div class="bar-viz">
        <p>Pending</p>
        <div><span :style="{ width: pct(store.stats.value.pending) }" /></div>
        <p>Approved</p>
        <div><span :style="{ width: pct(store.stats.value.approved) }" /></div>
        <p>Rejected</p>
        <div><span :style="{ width: pct(store.stats.value.rejected) }" /></div>
      </div>
    </article>

    <article class="content-card reveal delay-3">
      <h3>Registration by User Type</h3>
      <div class="admin-stats-grid">
        <div class="admin-stat">
          <p>SMMEs</p>
          <strong>{{ store.stats.value.smmes }}</strong>
        </div>
        <div class="admin-stat">
          <p>Professionals</p>
          <strong>{{ store.stats.value.professionals }}</strong>
        </div>
        <div class="admin-stat">
          <p>Jobseekers</p>
          <strong>{{ store.stats.value.jobseekers }}</strong>
        </div>
        <div class="admin-stat">
          <p>Total</p>
          <strong>{{ store.stats.value.total }}</strong>
        </div>
      </div>
      <div class="bar-viz">
        <p>SMMEs</p>
        <div><span :style="{ width: pct(store.stats.value.smmes) }" /></div>
        <p>Professionals</p>
        <div><span :style="{ width: pct(store.stats.value.professionals) }" /></div>
        <p>Jobseekers</p>
        <div><span :style="{ width: pct(store.stats.value.jobseekers) }" /></div>
      </div>
    </article>

    <article class="content-card reveal delay-4">
      <h3>Applications</h3>
      <div class="admin-filters">
        <select v-model="typeFilter">
          <option value="all">All Types</option>
          <option value="smmes">SMMEs</option>
          <option value="professionals">Professionals</option>
          <option value="jobseekers">Jobseekers</option>
        </select>
        <select v-model="statusFilter">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input v-model="searchTerm" type="text" placeholder="Search name/email/phone" />
      </div>

      <div class="admin-user-list">
        <button
          v-for="user in filteredUsers"
          :key="user.id"
          type="button"
          class="admin-user-row"
          :class="{ active: selectedId === user.id }"
          @click="selectedId = user.id"
        >
          <strong>{{ user.displayName }}</strong>
          <span>{{ user.type }}</span>
          <span class="status-pill" :class="`status-${user.status}`">{{ user.status }}</span>
        </button>
      </div>
    </article>

    <article class="form-card reveal delay-5">
      <h3>User Profile</h3>
      <p v-if="!selectedUser" class="small-note">Select an application from the list to manage it.</p>

      <template v-else>
        <div class="admin-actions">
          <button class="btn btn-primary" type="button" @click="approve">Approve</button>
          <button class="btn btn-secondary" type="button" @click="reject">Reject</button>
          <button class="btn btn-secondary" type="button" @click="saveProfile">Update Profile</button>
        </div>

        <div class="field-group"><label>Display Name</label><input v-model="editForm.displayName" type="text" /></div>
        <div class="field-group"><label>Email</label><input v-model="editForm.email" type="email" /></div>
        <div class="field-group"><label>Phone</label><input v-model="editForm.phone" type="text" /></div>
        <div class="field-group"><label>Contact Name</label><input v-model="editForm.contactName" type="text" /></div>
        <div class="field-group"><label>Category</label><input v-model="editForm.category" type="text" /></div>
        <div class="field-group"><label>Services</label><textarea v-model="editForm.services" /></div>
        <div class="field-group"><label>Field</label><input v-model="editForm.field" type="text" /></div>
        <div class="field-group"><label>Experience</label><textarea v-model="editForm.experience" /></div>
        <div class="field-group"><label>Location</label><input v-model="editForm.location" type="text" /></div>
        <div class="field-group"><label>Skill Level</label><input v-model="editForm.skillLevel" type="text" /></div>
        <div class="field-group"><label>Interests</label><textarea v-model="editForm.interests" /></div>
        <div class="field-group"><label>Admin Note</label><textarea v-model="editForm.adminNote" /></div>

        <h4>Send Message</h4>
        <div class="admin-actions">
          <input v-model="adminMessage" type="text" placeholder="Message to user" />
          <button class="btn btn-primary" type="button" @click="sendMessage">Send</button>
        </div>

        <div class="message-list">
          <p v-if="!selectedUser.messages.length" class="small-note">No messages sent yet.</p>
          <article v-for="msg in selectedUser.messages" :key="msg.id" class="message-item">
            <strong>Admin</strong>
            <p>{{ msg.text }}</p>
          </article>
        </div>
      </template>
    </article>
  </section>
</template>
