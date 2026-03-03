import { computed, reactive } from 'vue'
import { hasSupabase, supabase } from '../lib/supabaseClient'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const OPPORTUNITIES_KEY = 'smme_opportunities'

const state = reactive({
  users: [],
  opportunities: [],
  admins: [],
  adminSession: null,
  loading: false,
  loaded: false,
  error: '',
})

let registrationsChannel = null
let opportunitiesChannel = null

const nowIso = () => new Date().toISOString()
const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const sanitizeText = (value) => (typeof value === 'string' ? value.trim() : '')

const toUser = (row) => ({
  id: row.id,
  type: row.type,
  status: row.status,
  displayName: row.display_name,
  email: row.email ?? '',
  phone: row.phone ?? '',
  profile: row.profile_json ?? {},
  adminNote: row.admin_note ?? '',
  messages: row.messages_json ?? [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  approvedAt: row.approved_at,
  rejectedAt: row.rejected_at,
})

const toOpportunity = (row) => ({
  id: row.id,
  title: row.title,
  audience: row.audience,
  organization: row.organization ?? '',
  location: row.location ?? '',
  deadline: row.deadline ?? '',
  link: row.link ?? '',
  details: row.details ?? '',
  createdAt: row.created_at,
  createdBy: row.created_by ?? null,
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
    if (hasSupabase) {
      let q = supabase.from('registrations').select('*').order('created_at', { ascending: false })
      if (query.type && query.type !== 'all') q = q.eq('type', query.type)
      if (query.status && query.status !== 'all') q = q.eq('status', query.status)
      if (query.search) {
        const s = query.search.trim().replace(/,/g, ' ')
        q = q.or(`display_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%`)
      }

      const { data, error } = await q
      if (error) throw error
      state.users = (data ?? []).map(toUser)
      state.loaded = true
      return
    }

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
  if (hasSupabase) {
    const payload = {
      type,
      status: 'pending',
      display_name: sanitizeText(displayName),
      email: sanitizeText(email),
      phone: sanitizeText(phone),
      profile_json: profile ?? {},
      admin_note: '',
      messages_json: [],
      created_at: nowIso(),
      updated_at: nowIso(),
    }

    const { data, error } = await supabase.from('registrations').insert(payload).select('*').single()
    if (error) throw error
    const user = toUser(data)
    state.users.unshift(user)
    return user
  }

  const user = await request('/registrations', {
    method: 'POST',
    body: JSON.stringify({ type, displayName, email, phone, profile }),
  })
  state.users.unshift(user)
  return user
}

const getUserById = (id) => state.users.find((user) => user.id === id)

const updateUserProfile = async (id, payload) => {
  if (hasSupabase) {
    const existing = getUserById(id)
    if (!existing) return false
    const mergedProfile = { ...(existing.profile ?? {}), ...(payload.profile ?? {}) }

    const { data, error } = await supabase
      .from('registrations')
      .update({
        display_name: sanitizeText(payload.displayName ?? existing.displayName),
        email: sanitizeText(payload.email ?? existing.email),
        phone: sanitizeText(payload.phone ?? existing.phone),
        profile_json: mergedProfile,
        admin_note: sanitizeText(payload.adminNote ?? existing.adminNote),
        updated_at: nowIso(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    const index = state.users.findIndex((u) => u.id === id)
    if (index >= 0) state.users[index] = toUser(data)
    return true
  }

  const user = await request(`/registrations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  const index = state.users.findIndex((u) => u.id === id)
  if (index >= 0) state.users[index] = user
  return true
}

const setStatus = async (id, status) => {
  if (hasSupabase) {
    const timestamp = nowIso()
    const updatePayload = {
      status,
      updated_at: timestamp,
      approved_at: status === 'approved' ? timestamp : null,
      rejected_at: status === 'rejected' ? timestamp : null,
    }

    const { data, error } = await supabase
      .from('registrations')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error

    const index = state.users.findIndex((u) => u.id === id)
    if (index >= 0) state.users[index] = toUser(data)
    return true
  }

  const user = await request(`/registrations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  const index = state.users.findIndex((u) => u.id === id)
  if (index >= 0) state.users[index] = user
  return true
}

const approveUser = async (id) => setStatus(id, 'approved')
const rejectUser = async (id) => setStatus(id, 'rejected')

const sendAdminMessage = async (id, text) => {
  if (!text?.trim()) return false

  if (hasSupabase) {
    const existing = getUserById(id)
    if (!existing) return false

    const messages = [
      {
        id: createId(),
        from: 'admin',
        text: sanitizeText(text),
        at: nowIso(),
      },
      ...(existing.messages ?? []),
    ]

    const { data, error } = await supabase
      .from('registrations')
      .update({
        messages_json: messages,
        updated_at: nowIso(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    const index = state.users.findIndex((u) => u.id === id)
    if (index >= 0) state.users[index] = toUser(data)
    return true
  }

  const user = await request(`/registrations/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
  const index = state.users.findIndex((u) => u.id === id)
  if (index >= 0) state.users[index] = user
  return true
}

const loadOpportunities = async () => {
  if (hasSupabase) {
    const { data, error } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false })
    if (error) {
      state.opportunities = []
      return
    }
    state.opportunities = (data ?? []).map(toOpportunity)
    return
  }

  try {
    const raw = localStorage.getItem(OPPORTUNITIES_KEY)
    state.opportunities = raw ? JSON.parse(raw) : []
  } catch (_error) {
    state.opportunities = []
  }
}

const persistOpportunities = () => {
  localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(state.opportunities))
}

const addOpportunity = async ({ title, audience, organization = '', location = '', deadline = '', link = '', details = '', createdBy = null }) => {
  const trimmedTitle = title?.trim()
  if (!trimmedTitle) return null

  if (hasSupabase) {
    const payload = {
      title: trimmedTitle,
      audience: audience || 'all',
      organization: organization.trim(),
      location: location.trim(),
      deadline: deadline || null,
      link: link.trim(),
      details: details.trim(),
      created_by: createdBy,
      created_at: nowIso(),
    }

    const { data, error } = await supabase.from('opportunities').insert(payload).select('*').single()
    if (error) throw error
    const item = toOpportunity(data)
    state.opportunities.unshift(item)
    return item
  }

  const id = createId()
  const opportunity = {
    id,
    title: trimmedTitle,
    audience: audience || 'all',
    organization: organization.trim(),
    location: location.trim(),
    deadline,
    link: link.trim(),
    details: details.trim(),
    createdAt: nowIso(),
    createdBy,
  }

  state.opportunities.unshift(opportunity)
  persistOpportunities()
  return opportunity
}

const removeOpportunity = async (id) => {
  if (hasSupabase) {
    const { error } = await supabase.from('opportunities').delete().eq('id', id)
    if (error) throw error
    const index = state.opportunities.findIndex((item) => item.id === id)
    if (index >= 0) state.opportunities.splice(index, 1)
    return true
  }

  const index = state.opportunities.findIndex((item) => item.id === id)
  if (index < 0) return false
  state.opportunities.splice(index, 1)
  persistOpportunities()
  return true
}

const loadAdmins = async () => {
  if (!hasSupabase) {
    state.admins = [{ id: 'local-admin', email: 'admin@local', displayName: 'Local Admin', isActive: true }]
    return state.admins
  }

  const { data, error } = await supabase.from('admins').select('*').eq('is_active', true).order('created_at', { ascending: false })
  if (error) {
    state.admins = []
    return []
  }

  state.admins = (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name ?? '',
    passcode: row.passcode ?? '',
    isActive: Boolean(row.is_active),
  }))
  return state.admins
}

const verifyAdmin = async (passcode) => {
  const trimmedPasscode = sanitizeText(passcode)
  if (!trimmedPasscode) return null

  if (!hasSupabase) {
    if (trimmedPasscode === 'admin123') {
      return { id: 'local-admin', email: 'admin@local', displayName: 'Local Admin' }
    }
    return null
  }

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('is_active', true)
    .eq('passcode', trimmedPasscode)
    .limit(1)

  if (error || !data?.length) return null

  const row = data[0]
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name ?? '',
  }
}

const initializeAdminAuth = async () => {
  if (!hasSupabase) {
    return localStorage.getItem('smme_admin_logged_in') === 'true'
  }

  const { data, error } = await supabase.auth.getSession()
  if (error || !data?.session?.user?.email) {
    state.adminSession = null
    localStorage.removeItem('smme_admin_logged_in')
    return false
  }

  const email = data.session.user.email
  const { data: adminRows, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .limit(1)

  if (adminError || !adminRows?.length) {
    await supabase.auth.signOut()
    state.adminSession = null
    localStorage.removeItem('smme_admin_logged_in')
    return false
  }

  const row = adminRows[0]
  state.adminSession = {
    id: row.id,
    email: row.email,
    displayName: row.display_name || 'Admin',
  }
  localStorage.setItem('smme_admin_logged_in', 'true')
  return true
}

const signInAdmin = async ({ email, password }) => {
  const cleanEmail = sanitizeText(email).toLowerCase()
  const cleanPassword = sanitizeText(password)
  if (!cleanEmail || !cleanPassword) return null

  if (!hasSupabase) {
    if (cleanPassword === 'admin123') {
      const localAdmin = { id: 'local-admin', email: cleanEmail, displayName: 'Local Admin' }
      state.adminSession = localAdmin
      localStorage.setItem('smme_admin_logged_in', 'true')
      return localAdmin
    }
    return null
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: cleanPassword,
  })
  if (authError || !authData?.user?.email) return null

  const { data: adminRows, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('email', authData.user.email)
    .eq('is_active', true)
    .limit(1)

  if (adminError || !adminRows?.length) {
    await supabase.auth.signOut()
    return null
  }

  const row = adminRows[0]
  const admin = {
    id: row.id,
    email: row.email,
    displayName: row.display_name || 'Admin',
  }
  state.adminSession = admin
  localStorage.setItem('smme_admin_logged_in', 'true')
  return admin
}

const signOutAdmin = async () => {
  if (hasSupabase) {
    await supabase.auth.signOut()
  }
  state.adminSession = null
  localStorage.removeItem('smme_admin_logged_in')
}

const startRealtime = () => {
  if (!hasSupabase) return
  if (registrationsChannel || opportunitiesChannel) return

  registrationsChannel = supabase
    .channel('realtime-registrations')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, async () => {
      await loadUsers()
    })
    .subscribe()

  opportunitiesChannel = supabase
    .channel('realtime-opportunities')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, async () => {
      await loadOpportunities()
    })
    .subscribe()
}

const stopRealtime = () => {
  if (!hasSupabase) return
  if (registrationsChannel) {
    supabase.removeChannel(registrationsChannel)
    registrationsChannel = null
  }
  if (opportunitiesChannel) {
    supabase.removeChannel(opportunitiesChannel)
    opportunitiesChannel = null
  }
}

const usersByType = (type) => state.users.filter((user) => user.type === type)
const approvedUsersByType = (type) => state.users.filter((user) => user.type === type && user.status === 'approved')
const opportunitiesByAudience = (audience) =>
  state.opportunities.filter((item) => item.audience === 'all' || item.audience === audience)

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
  hasSupabase,
  initializeAdminAuth,
  signInAdmin,
  signOutAdmin,
  loadUsers,
  startRealtime,
  stopRealtime,
  loadAdmins,
  verifyAdmin,
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
