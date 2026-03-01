import { computed, reactive } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

const state = reactive({
  users: [],
  loading: false,
  loaded: false,
  error: '',
})

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed (${res.status})`)
  }

  return res.json()
}

const loadUsers = async (query = {}) => {
  state.loading = true
  state.error = ''

  try {
    const params = new URLSearchParams()
    if (query.type) params.set('type', query.type)
    if (query.status) params.set('status', query.status)
    if (query.search) params.set('search', query.search)

    const path = params.size ? `/registrations?${params.toString()}` : '/registrations'
    const users = await request(path)
    state.users = users
    state.loaded = true
  } catch (error) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

const refreshUsers = async () => {
  await loadUsers()
}

const addRegistration = async ({ type, displayName, email = '', phone = '', profile = {} }) => {
  const user = await request('/registrations', {
    method: 'POST',
    body: JSON.stringify({ type, displayName, email, phone, profile }),
  })
  state.users.unshift(user)
  return user
}

const getUserById = (id) => state.users.find((user) => user.id === id)

const updateUserProfile = async (id, payload) => {
  const user = await request(`/registrations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  const index = state.users.findIndex((u) => u.id === id)
  if (index >= 0) state.users[index] = user
  return true
}

const approveUser = async (id) => {
  const user = await request(`/registrations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'approved' }),
  })
  const index = state.users.findIndex((u) => u.id === id)
  if (index >= 0) state.users[index] = user
  return true
}

const rejectUser = async (id) => {
  const user = await request(`/registrations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'rejected' }),
  })
  const index = state.users.findIndex((u) => u.id === id)
  if (index >= 0) state.users[index] = user
  return true
}

const sendAdminMessage = async (id, text) => {
  if (!text?.trim()) return false

  const user = await request(`/registrations/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
  const index = state.users.findIndex((u) => u.id === id)
  if (index >= 0) state.users[index] = user
  return true
}

const usersByType = (type) => state.users.filter((user) => user.type === type)
const approvedUsersByType = (type) => state.users.filter((user) => user.type === type && user.status === 'approved')

const stats = computed(() => {
  const total = state.users.length
  const pending = state.users.filter((u) => u.status === 'pending').length
  const approved = state.users.filter((u) => u.status === 'approved').length
  const rejected = state.users.filter((u) => u.status === 'rejected').length
  const smmes = state.users.filter((u) => u.type === 'smmes').length
  const professionals = state.users.filter((u) => u.type === 'professionals').length
  const jobseekers = state.users.filter((u) => u.type === 'jobseekers').length

  return { total, pending, approved, rejected, smmes, professionals, jobseekers }
})

export const useRegistrationStore = () => ({
  state,
  stats,
  loadUsers,
  refreshUsers,
  addRegistration,
  getUserById,
  updateUserProfile,
  approveUser,
  rejectUser,
  sendAdminMessage,
  usersByType,
  approvedUsersByType,
})
