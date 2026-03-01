import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

const dataDir = path.resolve(process.cwd(), 'server', 'data')
fs.mkdirSync(dataDir, { recursive: true })

const dbPath = path.join(dataDir, 'registrations.db')
const db = new Database(dbPath)

db.exec(`
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  profile_json TEXT DEFAULT '{}',
  admin_note TEXT DEFAULT '',
  messages_json TEXT DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  approved_at TEXT,
  rejected_at TEXT
);
`)

const toRecord = (row) => ({
  id: row.id,
  type: row.type,
  status: row.status,
  displayName: row.display_name,
  email: row.email,
  phone: row.phone,
  profile: JSON.parse(row.profile_json || '{}'),
  adminNote: row.admin_note || '',
  messages: JSON.parse(row.messages_json || '[]'),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  approvedAt: row.approved_at,
  rejectedAt: row.rejected_at,
})

const nowIso = () => new Date().toISOString()
const createId = () => `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

const sanitizeText = (value) => (typeof value === 'string' ? value.trim() : '')

export const listRegistrations = ({ type, status, search }) => {
  const clauses = []
  const params = {}

  if (type && type !== 'all') {
    clauses.push('type = @type')
    params.type = type
  }
  if (status && status !== 'all') {
    clauses.push('status = @status')
    params.status = status
  }
  if (search) {
    clauses.push('(LOWER(display_name) LIKE @search OR LOWER(email) LIKE @search OR LOWER(phone) LIKE @search)')
    params.search = `%${search.toLowerCase()}%`
  }

  const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const stmt = db.prepare(`SELECT * FROM registrations ${whereSql} ORDER BY created_at DESC`)
  return stmt.all(params).map(toRecord)
}

export const getRegistration = (id) => {
  const row = db.prepare('SELECT * FROM registrations WHERE id = ?').get(id)
  return row ? toRecord(row) : null
}

export const createRegistration = ({ type, displayName, email = '', phone = '', profile = {} }) => {
  const id = createId()
  const now = nowIso()

  db.prepare(
    `INSERT INTO registrations
      (id, type, status, display_name, email, phone, profile_json, admin_note, messages_json, created_at, updated_at)
     VALUES
      (@id, @type, 'pending', @display_name, @email, @phone, @profile_json, '', '[]', @created_at, @updated_at)`,
  ).run({
    id,
    type,
    display_name: sanitizeText(displayName),
    email: sanitizeText(email),
    phone: sanitizeText(phone),
    profile_json: JSON.stringify(profile ?? {}),
    created_at: now,
    updated_at: now,
  })

  return getRegistration(id)
}

export const updateRegistration = (id, payload) => {
  const existing = getRegistration(id)
  if (!existing) return null

  const mergedProfile = { ...existing.profile, ...(payload.profile ?? {}) }
  const updatedAt = nowIso()

  db.prepare(
    `UPDATE registrations SET
      display_name = @display_name,
      email = @email,
      phone = @phone,
      profile_json = @profile_json,
      admin_note = @admin_note,
      updated_at = @updated_at
    WHERE id = @id`,
  ).run({
    id,
    display_name: sanitizeText(payload.displayName ?? existing.displayName),
    email: sanitizeText(payload.email ?? existing.email),
    phone: sanitizeText(payload.phone ?? existing.phone),
    profile_json: JSON.stringify(mergedProfile),
    admin_note: sanitizeText(payload.adminNote ?? existing.adminNote),
    updated_at: updatedAt,
  })

  return getRegistration(id)
}

export const updateStatus = (id, status) => {
  const existing = getRegistration(id)
  if (!existing) return null

  const updatedAt = nowIso()
  const approvedAt = status === 'approved' ? updatedAt : null
  const rejectedAt = status === 'rejected' ? updatedAt : null

  db.prepare(
    `UPDATE registrations SET
      status = @status,
      approved_at = @approved_at,
      rejected_at = @rejected_at,
      updated_at = @updated_at
    WHERE id = @id`,
  ).run({
    id,
    status,
    approved_at: approvedAt,
    rejected_at: rejectedAt,
    updated_at: updatedAt,
  })

  return getRegistration(id)
}

export const addMessage = (id, text) => {
  const existing = getRegistration(id)
  if (!existing) return null
  const content = sanitizeText(text)
  if (!content) return null

  const messages = [
    {
      id: createId(),
      from: 'admin',
      text: content,
      at: nowIso(),
    },
    ...existing.messages,
  ]

  db.prepare('UPDATE registrations SET messages_json = @messages_json, updated_at = @updated_at WHERE id = @id').run({
    id,
    messages_json: JSON.stringify(messages),
    updated_at: nowIso(),
  })

  return getRegistration(id)
}

export const getStats = () => {
  const rows = db.prepare('SELECT type, status FROM registrations').all()
  const stats = {
    total: rows.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    smmes: 0,
    professionals: 0,
    jobseekers: 0,
  }

  for (const row of rows) {
    if (row.status in stats) stats[row.status] += 1
    if (row.type in stats) stats[row.type] += 1
  }

  return stats
}
