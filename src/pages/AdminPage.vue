<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'

const store = useRegistrationStore()
const ADMIN_AUTH_KEY = 'smme_admin_logged_in'

const adminEmail = ref('')
const adminPassword = ref('')
const authError = ref('')
const unlocked = ref(localStorage.getItem(ADMIN_AUTH_KEY) === 'true')

const typeFilter = ref('all')
const statusFilter = ref('all')
const searchTerm = ref('')
const selectedId = ref('')
const adminMessage = ref('')
const opportunitySaved = ref(false)

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

const opportunityForm = reactive({
  title: '',
  audience: 'all',
  organization: '',
  location: '',
  deadline: '',
  link: '',
  details: '',
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
const adminOpportunities = computed(() => store.state.opportunities)

const dashboardTiles = computed(() => [
  {
    key: 'pending',
    label: 'Pending',
    value: store.stats.value.pending,
    bg: 'from-amber-400 to-amber-500',
    text: 'text-amber-600',
  },
  {
    key: 'approved',
    label: 'Approved',
    value: store.stats.value.approved,
    bg: 'from-emerald-500 to-teal-500',
    text: 'text-emerald-600',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    value: store.stats.value.rejected,
    bg: 'from-rose-500 to-rose-600',
    text: 'text-rose-600',
  },
  {
    key: 'total',
    label: 'Total',
    value: store.stats.value.total,
    bg: 'from-sky-500 to-indigo-500',
    text: 'text-indigo-600',
  },
])

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

const unlockAdmin = async () => {
  authError.value = ''
  const admin = await store.signInAdmin({
    email: adminEmail.value,
    password: adminPassword.value,
  })
  unlocked.value = Boolean(admin)

  if (!unlocked.value) {
    authError.value = 'Invalid admin credentials.'
    return
  }

  adminEmail.value = ''
  adminPassword.value = ''
  if (unlocked.value) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true')
    window.dispatchEvent(new Event('admin-auth-changed'))
    await store.loadUsers()
    await store.loadOpportunities()
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

const publishOpportunity = async () => {
  const item = await store.addOpportunity({
    title: opportunityForm.title,
    audience: opportunityForm.audience,
    organization: opportunityForm.organization,
    location: opportunityForm.location,
    deadline: opportunityForm.deadline,
    link: opportunityForm.link,
    details: opportunityForm.details,
  })

  if (!item) return

  opportunityForm.title = ''
  opportunityForm.audience = 'all'
  opportunityForm.organization = ''
  opportunityForm.location = ''
  opportunityForm.deadline = ''
  opportunityForm.link = ''
  opportunityForm.details = ''
  opportunitySaved.value = true
}

const deleteOpportunity = async (id) => {
  await store.removeOpportunity(id)
}

const audienceLabel = (audience) => {
  if (audience === 'smmes') return 'SMMEs'
  if (audience === 'professionals') return 'Professionals'
  if (audience === 'jobseekers') return 'Jobseekers'
  return 'All'
}

const pct = (value) => {
  const total = store.stats.value.total || 1
  return `${Math.round((value / total) * 100)}%`
}

const statusPillClass = (status) => {
  if (status === 'approved') return 'bg-emerald-100 text-emerald-700'
  if (status === 'rejected') return 'bg-rose-100 text-rose-700'
  return 'bg-amber-100 text-amber-700'
}

const statusDotClass = (status) => {
  if (status === 'approved') return 'bg-emerald-500'
  if (status === 'rejected') return 'bg-rose-500'
  return 'bg-amber-500'
}

onMounted(() => {
  store.initializeAdminAuth().then((valid) => {
    unlocked.value = valid
    if (!valid) {
      localStorage.removeItem(ADMIN_AUTH_KEY)
      window.dispatchEvent(new Event('admin-auth-changed'))
      return
    }
    localStorage.setItem(ADMIN_AUTH_KEY, 'true')
    store.loadAdmins()
    store.loadUsers()
    store.loadOpportunities()
  })
})
</script>

<template>
  <section class="w-full min-h-[85vh] flex flex-col items-center justify-center rounded-[28px] bg-[#f0f0f0] p-4 sm:p-6 lg:p-7">
    <div v-if="!unlocked" class="mx-auto max-w-md w-full rounded-xl border border-black/5 bg-white p-8 shadow-sm">
      <p class="text-xs font-semibold tracking-[0.12em] text-emerald-600">ADMIN ACCESS</p>
      <h2 class="mt-2 text-2xl font-bold text-slate-900">Registration Management Console</h2>
      <p class="mt-2 text-sm text-slate-500">Enter admin email and password to continue.</p>
      <div class="mt-6 flex flex-col items-center gap-3">
        <input
          v-model="adminEmail"
          type="email"
          placeholder="Admin email"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-emerald-200 transition focus:ring"
        />
       
      </div>
      <input
        v-model="adminPassword"
        type="password"
        placeholder="Admin password"
        class="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-emerald-200 transition focus:ring"
      />
       <button
          type="button"
          class="w-full rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          @click="unlockAdmin"
        >
          Unlock
        </button>
      <p v-if="authError" class="mt-2 text-xs font-semibold text-rose-600">{{ authError }}</p>
    </div>

    <div v-else class="grid gap-y-10 gap-x-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <aside class="mb-2 rounded-xl bg-white p-6 shadow-sm">
        <div class="rounded-lg bg-gradient-to-br from-[#0c9168] to-[#0b7353] p-6 text-white">
          <p class="text-xs tracking-[0.15em] text-emerald-100">SMME PLUG</p>
          <h2 class="mt-2 text-xl font-semibold">Admin Dashboard</h2>
          <p class="mt-1 text-xs text-emerald-50/90">Manage registrations and approvals</p>
        </div>

        <ul class="mt-6 space-y-2.5">
          <li>
            <a class="flex items-center rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" href="#">
              Dashboard
            </a>
          </li>
          <li>
            <a class="flex items-center rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100" href="#">
              Applications
            </a>
          </li>
          <li>
            <a class="flex items-center rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100" href="#">
              Messages
            </a>
          </li>
          <li>
            <a class="flex items-center rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100" href="#">
              Analytics
            </a>
          </li>
        </ul>

        <div class="mt-6 rounded-lg bg-slate-50 p-4">
          <p class="text-xs text-slate-500">Active Registrations</p>
          <p class="mt-1 text-2xl font-bold text-slate-900">{{ store.stats.value.total }}</p>
        </div>
      </aside>

      <div class="space-y-10">
        <header class="mb-2 rounded-xl bg-white p-6 shadow-sm">
          <p class="text-xs font-semibold tracking-[0.12em] text-emerald-600">ADMIN PANEL</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900">Registration Management Console</h1>
          <p class="mt-2 text-sm text-slate-500">
            Approve or reject applications, update profiles, and communicate with registered users.
          </p>
        </header>

        <section class="grid gap-y-10 gap-x-6 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="tile in dashboardTiles"
            :key="tile.key"
            class="relative mb-2 min-h-[128px] overflow-hidden rounded-xl bg-white p-6 shadow-sm"
          >
            <div
              class="pointer-events-none absolute -right-7 -top-7 h-24 w-24 rotate-12 rounded-3xl bg-gradient-to-br opacity-20"
              :class="tile.bg"
            />
            <p class="text-xs font-medium uppercase tracking-wider text-slate-500">{{ tile.label }}</p>
            <p class="mt-2 text-3xl font-bold" :class="tile.text">{{ tile.value }}</p>
          </article>
        </section>

        <section class="grid gap-y-10 gap-x-6 lg:grid-cols-3">
          <article class="mb-2 rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
            <h3 class="text-base font-bold text-slate-900">Registration Overview</h3>
            <div class="mt-5 space-y-4">
              <div>
                <div class="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Pending</span>
                  <span>{{ pct(store.stats.value.pending) }}</span>
                </div>
                <div class="h-2 rounded-full bg-slate-100">
                  <div class="h-2 rounded-full bg-amber-400" :style="{ width: pct(store.stats.value.pending) }" />
                </div>
              </div>
              <div>
                <div class="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Approved</span>
                  <span>{{ pct(store.stats.value.approved) }}</span>
                </div>
                <div class="h-2 rounded-full bg-slate-100">
                  <div class="h-2 rounded-full bg-emerald-500" :style="{ width: pct(store.stats.value.approved) }" />
                </div>
              </div>
              <div>
                <div class="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Rejected</span>
                  <span>{{ pct(store.stats.value.rejected) }}</span>
                </div>
                <div class="h-2 rounded-full bg-slate-100">
                  <div class="h-2 rounded-full bg-rose-500" :style="{ width: pct(store.stats.value.rejected) }" />
                </div>
              </div>
            </div>
          </article>

          <article class="mb-2 rounded-xl bg-white p-6 shadow-sm">
            <h3 class="text-base font-bold text-slate-900">User Type Totals</h3>
            <div class="mt-4 space-y-3 text-sm">
              <div class="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                <span class="text-slate-600">SMMEs</span>
                <strong class="text-slate-900">{{ store.stats.value.smmes }}</strong>
              </div>
              <div class="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                <span class="text-slate-600">Professionals</span>
                <strong class="text-slate-900">{{ store.stats.value.professionals }}</strong>
              </div>
              <div class="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                <span class="text-slate-600">Jobseekers</span>
                <strong class="text-slate-900">{{ store.stats.value.jobseekers }}</strong>
              </div>
            </div>
          </article>
        </section>

        <section class="grid gap-y-10 gap-x-6 2xl:grid-cols-[1.15fr_1fr]">
          <article class="mb-2 rounded-xl bg-white p-6 shadow-sm">
            <div class="flex flex-col gap-3 sm:flex-row">
              <select
                v-model="typeFilter"
                class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-200 focus:ring"
              >
                <option value="all">All Types</option>
                <option value="smmes">SMMEs</option>
                <option value="professionals">Professionals</option>
                <option value="jobseekers">Jobseekers</option>
              </select>
              <select
                v-model="statusFilter"
                class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-200 focus:ring"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Search name/email/phone"
                class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-200 focus:ring"
              />
            </div>

            <h3 class="mt-6 text-base font-bold text-slate-900">Applications</h3>
            <div class="mt-4 max-h-[430px] space-y-2.5 overflow-auto pr-1">
              <button
                v-for="user in filteredUsers"
                :key="user.id"
                type="button"
                class="w-full rounded-lg border px-4 py-3 text-left transition"
                :class="
                  selectedId === user.id
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                "
                @click="selectedId = user.id"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <strong class="text-sm text-slate-900">{{ user.displayName }}</strong>
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase"
                    :class="statusPillClass(user.status)"
                  >
                    <span class="mr-1.5 h-1.5 w-1.5 rounded-full" :class="statusDotClass(user.status)" />
                    {{ user.status }}
                  </span>
                </div>
                <div class="mt-1 text-xs text-slate-500">{{ user.type }} · {{ user.phone || user.email }}</div>
              </button>
              <p v-if="!filteredUsers.length" class="rounded-md bg-slate-50 p-3 text-sm text-slate-500">
                No applications match your filters.
              </p>
            </div>
          </article>

          <article class="mb-2 rounded-xl bg-white p-6 shadow-sm">
            <h3 class="text-base font-bold text-slate-900">User Profile</h3>
            <p v-if="!selectedUser" class="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-500">
              Select an application from the list to manage it.
            </p>

            <template v-else>
              <div class="mt-5 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  class="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  @click="approve"
                >
                  Approve
                </button>
                <button
                  type="button"
                  class="rounded-md bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                  @click="reject"
                >
                  Reject
                </button>
                <button
                  type="button"
                  class="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  @click="saveProfile"
                >
                  Update Profile
                </button>
              </div>

              <div class="mt-5 grid gap-4">
                <div class="grid gap-3 sm:grid-cols-2">
                  <input v-model="editForm.displayName" type="text" placeholder="Display Name" class="admin-input" />
                  <input v-model="editForm.email" type="email" placeholder="Email" class="admin-input" />
                </div>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input v-model="editForm.phone" type="text" placeholder="Phone" class="admin-input" />
                  <input v-model="editForm.contactName" type="text" placeholder="Contact Name" class="admin-input" />
                </div>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input v-model="editForm.category" type="text" placeholder="Category" class="admin-input" />
                  <input v-model="editForm.field" type="text" placeholder="Field" class="admin-input" />
                </div>
                <textarea v-model="editForm.services" placeholder="Services" class="admin-input min-h-[72px]" />
                <textarea v-model="editForm.experience" placeholder="Experience" class="admin-input min-h-[72px]" />
                <div class="grid gap-3 sm:grid-cols-2">
                  <input v-model="editForm.location" type="text" placeholder="Location" class="admin-input" />
                  <input v-model="editForm.skillLevel" type="text" placeholder="Skill Level" class="admin-input" />
                </div>
                <textarea v-model="editForm.interests" placeholder="Interests" class="admin-input min-h-[72px]" />
                <textarea v-model="editForm.adminNote" placeholder="Admin Note" class="admin-input min-h-[72px]" />
              </div>

              <h4 class="mt-6 text-sm font-semibold text-slate-900">Send Message</h4>
              <div class="mt-3 flex gap-2">
                <input v-model="adminMessage" type="text" placeholder="Message to user" class="admin-input" />
                <button
                  type="button"
                  class="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                  @click="sendMessage"
                >
                  Send
                </button>
              </div>

              <div class="mt-5 space-y-2.5">
                <p v-if="!selectedUser.messages.length" class="rounded-md bg-slate-50 p-3 text-xs text-slate-500">
                  No messages sent yet.
                </p>
                <article
                  v-for="msg in selectedUser.messages"
                  :key="msg.id"
                  class="rounded-md border border-slate-200 bg-slate-50 p-3"
                >
                  <strong class="text-xs text-slate-700">Admin</strong>
                  <p class="mt-1 text-sm text-slate-600">{{ msg.text }}</p>
                </article>
              </div>
            </template>
          </article>
        </section>

        <section class="mb-2 rounded-xl bg-white p-6 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-semibold tracking-[0.12em] text-emerald-600">OPPORTUNITIES</p>
              <h3 class="mt-1 text-lg font-bold text-slate-900">Advertise Opportunities</h3>
              <p class="mt-1 text-sm text-slate-500">
                Post opportunities for SMMEs, Professionals, Jobseekers, or all audiences.
              </p>
            </div>
          </div>

          <form class="mt-5 grid gap-3 md:grid-cols-2" @submit.prevent="publishOpportunity">
            <input v-model="opportunityForm.title" type="text" required placeholder="Opportunity Title" class="admin-input md:col-span-2" />
            <select v-model="opportunityForm.audience" class="admin-input">
              <option value="all">All Audiences</option>
              <option value="smmes">SMMEs</option>
              <option value="professionals">Professionals</option>
              <option value="jobseekers">Jobseekers</option>
            </select>
            <input v-model="opportunityForm.organization" type="text" placeholder="Organization / Company" class="admin-input" />
            <input v-model="opportunityForm.location" type="text" placeholder="Location" class="admin-input" />
            <input v-model="opportunityForm.deadline" type="date" class="admin-input" />
            <input v-model="opportunityForm.link" type="url" placeholder="Application Link (https://...)" class="admin-input md:col-span-2" />
            <textarea
              v-model="opportunityForm.details"
              class="admin-input min-h-[90px] md:col-span-2"
              placeholder="Opportunity description, requirements, or notes"
            />
            <div class="md:col-span-2">
              <button
                type="submit"
                class="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                Publish Opportunity
              </button>
              <p v-if="opportunitySaved" class="mt-2 text-xs font-medium text-emerald-600">Opportunity published successfully.</p>
            </div>
          </form>

          <div class="mt-6 space-y-2.5">
            <article
              v-for="item in adminOpportunities"
              :key="item.id"
              class="rounded-md border border-slate-200 bg-slate-50 p-3"
            >
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 class="text-sm font-semibold text-slate-900">{{ item.title }}</h4>
                  <p class="mt-1 text-xs text-slate-600">
                    {{ audienceLabel(item.audience) }}
                    <span v-if="item.organization"> | {{ item.organization }}</span>
                    <span v-if="item.location"> | {{ item.location }}</span>
                    <span v-if="item.deadline"> | Deadline: {{ item.deadline }}</span>
                  </p>
                </div>
                <button
                  type="button"
                  class="rounded-md border border-rose-200 px-2 py-1 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-50"
                  @click="deleteOpportunity(item.id)"
                >
                  Delete
                </button>
              </div>
              <p v-if="item.details" class="mt-2 text-xs text-slate-600">{{ item.details }}</p>
              <a v-if="item.link" :href="item.link" target="_blank" rel="noreferrer" class="mt-2 inline-block text-xs font-semibold text-emerald-600">
                Open Link
              </a>
            </article>
            <p v-if="!adminOpportunities.length" class="rounded-md bg-slate-50 p-3 text-xs text-slate-500">
              No opportunities published yet.
            </p>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgb(226 232 240);
  background: white;
  padding: 0.55rem 0.75rem;
  font-size: 0.85rem;
  color: rgb(51 65 85);
  outline: none;
}

.admin-input:focus {
  border-color: rgb(16 185 129);
  box-shadow: 0 0 0 2px rgb(209 250 229);
}
</style>
