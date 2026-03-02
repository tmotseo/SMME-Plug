import { computed, reactive } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const OPPORTUNITIES_KEY = 'smme_opportunities'

const state = reactive({
  users: [],
  opportunities: [],
  loading: false,
  loaded: false,
  error: '',
})

const loadOpportunities = () => {
  try {
    const raw = localStorage.getItem(OPPORTUNITIES_KEY)
    state.opportunities = raw ? JSON.parse(raw) : []
  } catch (error) {
    state.opportunities = []
  }
}

const persistOpportunities = () => {
  localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(state.opportunities))
}

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
const opportunitiesByAudience = (audience) =>
  state.opportunities.filter((item) => item.audience === 'all' || item.audience === audience)

const addOpportunity = ({ title, audience, organization = '', location = '', deadline = '', link = '', details = '' }) => {
  const trimmedTitle = title?.trim()
  if (!trimmedTitle) return null

  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
  const opportunity = {
    id,
    title: trimmedTitle,
    audience: audience || 'all',
    organization: organization.trim(),
    location: location.trim(),
    deadline,
    link: link.trim(),
    details: details.trim(),
    createdAt: new Date().toISOString(),
  }

  state.opportunities.unshift(opportunity)
  persistOpportunities()
  return opportunity
}

const removeOpportunity = (id) => {
  const index = state.opportunities.findIndex((item) => item.id === id)
  if (index < 0) return false
  state.opportunities.splice(index, 1)
  persistOpportunities()
  return true
}

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
  loadOpportunities,
  refreshUsers,
  addRegistration,
  getUserById,
  updateUserProfile,
  approveUser,
  rejectUser,
  sendAdminMessage,
  usersByType,
  approvedUsersByType,
  opportunitiesByAudience,
  addOpportunity,
  removeOpportunity,
})
