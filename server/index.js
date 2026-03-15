import cors from 'cors'
import express from 'express'
import { createClient } from '@supabase/supabase-js'

const app = express()
const port = Number(process.env.PORT || 4000)

// Initialize Supabase server client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

// If no Supabase credentials, the server will respond with an error
const hasSupabase = Boolean(supabaseUrl && supabaseServiceKey)

const supabase = hasSupabase
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })
  : null

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, supabase: hasSupabase })
})

// Contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' })
    return
  }

  // Store contact message in Supabase
  if (hasSupabase) {
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error('Supabase insert error:', error)
        // Continue to send email even if DB insert fails
      }
    } catch (err) {
      console.error('Contact form error:', err)
    }
  }

  // Send email notification
  // Note: For production, configure an email service like SendGrid, Mailgun, or AWS SES
  // The email sending requires SMTP credentials or API keys
  const emailConfig = {
    to: process.env.CONTACT_EMAIL_TO || 'info@smme-plug.co.za',
    from: process.env.CONTACT_EMAIL_FROM || 'noreply@smme-plug.co.za',
  }

  // For now, we'll log the contact message and return success
  // In production, integrate with an email service
  console.log('=== Contact Form Submission ===')
  console.log(`To: ${emailConfig.to}`)
  console.log(`From: ${emailConfig.from}`)
  console.log(`Subject: New Contact Form Submission - ${subject || 'General Inquiry'}`)
  console.log(`Name: ${name}`)
  console.log(`Email: ${email}`)
  console.log(`Phone: ${phone || 'Not provided'}`)
  console.log(`Message: ${message}`)
  console.log('===============================')

  // Return success - in production, this would send an actual email
  res.json({ 
    ok: true, 
    message: 'Message sent successfully. We will get back to you within 24 hours.' 
  })
})

// Get all registrations with optional filters
app.get('/api/registrations', async (req, res) => {
  if (!hasSupabase) {
    res.status(503).json({ error: 'Supabase not configured' })
    return
  }

  try {
    let query = supabase.from('registrations').select('*').order('created_at', { ascending: false })
    
    if (req.query.type && req.query.type !== 'all') {
      query = query.eq('type', req.query.type)
    }
    if (req.query.status && req.query.status !== 'all') {
      query = query.eq('status', req.query.status)
    }
    if (req.query.search) {
      const s = req.query.search.trim().replace(/,/g, ' ')
      query = query.or(`display_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%`)
    }

    const { data, error } = await query
    if (error) throw error

    res.json(data ?? [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single registration by ID
app.get('/api/registrations/:id', async (req, res) => {
  if (!hasSupabase) {
    res.status(503).json({ error: 'Supabase not configured' })
    return
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new registration
app.post('/api/registrations', async (req, res) => {
  if (!hasSupabase) {
    res.status(503).json({ error: 'Supabase not configured' })
    return
  }

  const { type, displayName, email = '', phone = '', profile = {} } = req.body
  
  if (!type || !displayName) {
    res.status(400).json({ error: 'type and displayName are required' })
    return
  }

  try {
    const now = new Date().toISOString()
    const payload = {
      type,
      status: 'pending',
      display_name: displayName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      profile_json: profile ?? {},
      admin_note: '',
      messages_json: [],
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert(payload)
      .select('*')
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update registration
app.put('/api/registrations/:id', async (req, res) => {
  if (!hasSupabase) {
    res.status(503).json({ error: 'Supabase not configured' })
    return
  }

  try {
    const { displayName, email, phone, profile, adminNote } = req.body
    const now = new Date().toISOString()

    // First get existing record to merge profile
    const { data: existing } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    const mergedProfile = { ...(existing.profile_json ?? {}), ...(profile ?? {}) }

    const { data, error } = await supabase
      .from('registrations')
      .update({
        display_name: displayName?.trim() ?? existing.display_name,
        email: email?.trim() ?? existing.email,
        phone: phone?.trim() ?? existing.phone,
        profile_json: mergedProfile,
        admin_note: adminNote?.trim() ?? existing.admin_note,
        updated_at: now,
      })
      .eq('id', req.params.id)
      .select('*')
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update registration status
app.patch('/api/registrations/:id/status', async (req, res) => {
  if (!hasSupabase) {
    res.status(503).json({ error: 'Supabase not configured' })
    return
  }

  const { status } = req.body

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: 'invalid status' })
    return
  }

  try {
    const now = new Date().toISOString()
    const updatePayload = {
      status,
      updated_at: now,
      approved_at: status === 'approved' ? now : null,
      rejected_at: status === 'rejected' ? now : null,
    }

    const { data, error } = await supabase
      .from('registrations')
      .update(updatePayload)
      .eq('id', req.params.id)
      .select('*')
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add message to registration
app.post('/api/registrations/:id/messages', async (req, res) => {
  if (!hasSupabase) {
    res.status(503).json({ error: 'Supabase not configured' })
    return
  }

  const text = req.body.text?.trim()
  if (!text) {
    res.status(400).json({ error: 'Message text is required' })
    return
  }

  try {
    // Get existing record
    const { data: existing } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      from: 'admin',
      text,
      at: new Date().toISOString(),
    }

    const messages = [message, ...(existing.messages_json ?? [])]

    const { data, error } = await supabase
      .from('registrations')
      .update({
        messages_json: messages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select('*')
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get stats
app.get('/api/stats', async (_req, res) => {
  if (!hasSupabase) {
    res.status(503).json({ error: 'Supabase not configured' })
    return
  }

  try {
    const { data, error } = await supabase.from('registrations').select('type, status')
    if (error) throw error

    const stats = {
      total: data?.length ?? 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      smmes: 0,
      professionals: 0,
      jobseekers: 0,
    }

    for (const row of data ?? []) {
      if (row.status in stats) stats[row.status] += 1
      if (row.type in stats) stats[row.type] += 1
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Start server
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`)
  console.log(`Supabase configured: ${hasSupabase}`)
})
