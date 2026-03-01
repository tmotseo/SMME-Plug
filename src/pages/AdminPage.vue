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
  if (unlocked.value) store.loadUsers()
})
</script>

<template>
  <section class="w-full rounded-[28px] bg-[#f0f0f0] p-4 sm:p-6 lg:p-7">
    <div v-if="!unlocked" class="mx-auto max-w-xl rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
      <p class="text-xs font-semibold tracking-[0.12em] text-violet-500">ADMIN ACCESS</p>
      <h2 class="mt-2 text-2xl font-bold text-slate-900">Registration Management Console</h2>
      <p class="mt-2 text-sm text-slate-500">Enter passcode to continue. Demo passcode: admin123</p>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          v-model="passcodeInput"
          type="password"
          placeholder="Enter passcode"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-violet-200 transition focus:ring"
        />
        <button
          type="button"
          class="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          @click="unlockAdmin"
        >
          Unlock
        </button>
      </div>
    </div>

    <div v-else class="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <aside class="rounded-[30px] bg-white p-6 shadow-sm">
        <div class="rounded-3xl bg-gradient-to-br from-[#121f39] to-[#213c6d] p-6 text-white">
          <p class="text-xs tracking-[0.15em] text-sky-200">SMME PLUG</p>
          <h2 class="mt-2 text-xl font-semibold">Admin Dashboard</h2>
          <p class="mt-1 text-xs text-sky-100/90">Manage registrations and approvals</p>
        </div>

        <ul class="mt-6 space-y-2.5">
          <li>
            <a class="flex items-center rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700" href="#">
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

        <div class="mt-6 rounded-2xl bg-slate-50 p-4">
          <p class="text-xs text-slate-500">Active Registrations</p>
          <p class="mt-1 text-2xl font-bold text-slate-900">{{ store.stats.value.total }}</p>
        </div>
      </aside>

      <div class="space-y-6">
        <header class="rounded-3xl bg-white p-6 shadow-sm">
          <p class="text-xs font-semibold tracking-[0.12em] text-violet-500">ADMIN PANEL</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900">Registration Management Console</h1>
          <p class="mt-2 text-sm text-slate-500">
            Approve or reject applications, update profiles, and communicate with registered users.
          </p>
        </header>

        <section class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="tile in dashboardTiles"
            :key="tile.key"
            class="relative min-h-[128px] overflow-hidden rounded-3xl bg-white p-6 shadow-sm"
          >
            <div
              class="pointer-events-none absolute -right-7 -top-7 h-24 w-24 rotate-12 rounded-3xl bg-gradient-to-br opacity-20"
              :class="tile.bg"
            />
            <p class="text-xs font-medium uppercase tracking-wider text-slate-500">{{ tile.label }}</p>
            <p class="mt-2 text-3xl font-bold" :class="tile.text">{{ tile.value }}</p>
          </article>
        </section>

        <section class="grid gap-6 lg:grid-cols-3">
          <article class="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
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

          <article class="rounded-3xl bg-white p-6 shadow-sm">
            <h3 class="text-base font-bold text-slate-900">User Type Totals</h3>
            <div class="mt-4 space-y-3 text-sm">
              <div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span class="text-slate-600">SMMEs</span>
                <strong class="text-slate-900">{{ store.stats.value.smmes }}</strong>
              </div>
              <div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span class="text-slate-600">Professionals</span>
                <strong class="text-slate-900">{{ store.stats.value.professionals }}</strong>
              </div>
              <div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span class="text-slate-600">Jobseekers</span>
                <strong class="text-slate-900">{{ store.stats.value.jobseekers }}</strong>
              </div>
            </div>
          </article>
        </section>

        <section class="grid gap-6 2xl:grid-cols-[1.15fr_1fr]">
          <article class="rounded-3xl bg-white p-6 shadow-sm">
            <div class="flex flex-col gap-3 sm:flex-row">
              <select
                v-model="typeFilter"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-violet-200 focus:ring"
              >
                <option value="all">All Types</option>
                <option value="smmes">SMMEs</option>
                <option value="professionals">Professionals</option>
                <option value="jobseekers">Jobseekers</option>
              </select>
              <select
                v-model="statusFilter"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-violet-200 focus:ring"
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
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-violet-200 focus:ring"
              />
            </div>

            <h3 class="mt-6 text-base font-bold text-slate-900">Applications</h3>
            <div class="mt-4 max-h-[430px] space-y-2.5 overflow-auto pr-1">
              <button
                v-for="user in filteredUsers"
                :key="user.id"
                type="button"
                class="w-full rounded-2xl border px-4 py-3 text-left transition"
                :class="
                  selectedId === user.id
                    ? 'border-violet-300 bg-violet-50'
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
              <p v-if="!filteredUsers.length" class="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                No applications match your filters.
              </p>
            </div>
          </article>

          <article class="rounded-3xl bg-white p-6 shadow-sm">
            <h3 class="text-base font-bold text-slate-900">User Profile</h3>
            <p v-if="!selectedUser" class="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
              Select an application from the list to manage it.
            </p>

            <template v-else>
              <div class="mt-5 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  class="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  @click="approve"
                >
                  Approve
                </button>
                <button
                  type="button"
                  class="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                  @click="reject"
                >
                  Reject
                </button>
                <button
                  type="button"
                  class="rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
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
                  class="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                  @click="sendMessage"
                >
                  Send
                </button>
              </div>

              <div class="mt-5 space-y-2.5">
                <p v-if="!selectedUser.messages.length" class="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                  No messages sent yet.
                </p>
                <article
                  v-for="msg in selectedUser.messages"
                  :key="msg.id"
                  class="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <strong class="text-xs text-slate-700">Admin</strong>
                  <p class="mt-1 text-sm text-slate-600">{{ msg.text }}</p>
                </article>
              </div>
            </template>
          </article>
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
  border-color: rgb(196 181 253);
  box-shadow: 0 0 0 2px rgb(237 233 254);
}
</style>
