import cors from 'cors'
import express from 'express'
import {
  addMessage,
  createRegistration,
  getRegistration,
  getStats,
  listRegistrations,
  updateRegistration,
  updateStatus,
} from './db.js'

const app = express()
const port = Number(process.env.PORT || 4000)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/registrations', (req, res) => {
  const registrations = listRegistrations({
    type: req.query.type,
    status: req.query.status,
    search: req.query.search,
  })
  res.json(registrations)
})

app.get('/api/registrations/:id', (req, res) => {
  const user = getRegistration(req.params.id)
  if (!user) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.json(user)
})

app.post('/api/registrations', (req, res) => {
  const { type, displayName } = req.body
  if (!type || !displayName) {
    res.status(400).json({ error: 'type and displayName are required' })
    return
  }
  const user = createRegistration(req.body)
  res.status(201).json(user)
})

app.put('/api/registrations/:id', (req, res) => {
  const user = updateRegistration(req.params.id, req.body)
  if (!user) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.json(user)
})

app.patch('/api/registrations/:id/status', (req, res) => {
  const { status } = req.body
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: 'invalid status' })
    return
  }
  const user = updateStatus(req.params.id, status)
  if (!user) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.json(user)
})

app.post('/api/registrations/:id/messages', (req, res) => {
  const user = addMessage(req.params.id, req.body.text ?? '')
  if (!user) {
    res.status(404).json({ error: 'Not found or invalid message' })
    return
  }
  res.json(user)
})

app.get('/api/stats', (_req, res) => {
  res.json(getStats())
})

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`)
})
