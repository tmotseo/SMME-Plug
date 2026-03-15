<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

const submitForm = async () => {
  // Validate form
  if (!form.name || !form.email || !form.message) {
    error.value = 'Please fill in all required fields.'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message')
    }

    submitted.value = true
    // Reset form
    form.name = ''
    form.email = ''
    form.phone = ''
    form.subject = ''
    form.message = ''
  } catch (err) {
    error.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="hero-panel reveal delay-2">
    <p class="eyebrow">Get In Touch</p>
    <h1>Contact Us</h1>
    <p class="lead">
      Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
    </p>
  </section>

  <section class="split">
    <!-- Contact Info -->
    <article class="content-card reveal delay-3">
      <h3>Contact Information</h3>
      <p class="mt-4">
        Fill out the form and our team will get back to you within 24 hours.
      </p>
      
      <div class="contact-details mt-6">
        <div class="contact-item">
          <span class="contact-label">Email</span>
          <a href="mailto:info@smme-plug.co.za" class="contact-value">info@smme-plug.co.za</a>
        </div>
        <div class="contact-item">
          <span class="contact-label">Phone</span>
          <a href="tel:+27 7525 5468" class="contact-value">+27 7525 5468</a>
        </div>
        <div class="contact-item">
          <span class="contact-label">Office Hours</span>
          <span class="contact-value">Monday - Friday, 8:00 AM - 5:00 PM</span>
        </div>
      </div>

      <div class="mt-8">
        <h4>What we can help with:</h4>
        <ul class="feature-list mt-3">
          <li>Registration assistance</li>
          <li>Technical support</li>
          <li>Partnership inquiries</li>
          <li>General questions</li>
        </ul>
      </div>
    </article>

    <!-- Contact Form -->
    <article class="form-card reveal delay-4">
      <h3>Send us a Message</h3>
      
      <div v-if="submitted" class="success-message">
        <p class="text-emerald-600 font-semibold">Thank you for your message!</p>
        <p class="text-sm text-slate-600 mt-2">We've received your inquiry and will get back to you within 24 hours.</p>
        <button 
          class="btn btn-secondary mt-4" 
          @click="submitted = false"
        >
          Send Another Message
        </button>
      </div>

      <form v-else @submit.prevent="submitForm">
        <div class="field-group">
          <label for="name">Full Name *</label>
          <input 
            id="name" 
            v-model="form.name" 
            type="text" 
            required 
            placeholder="Enter your full name"
          />
        </div>

        <div class="field-group">
          <label for="email">Email Address *</label>
          <input 
            id="email" 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="Enter your email address"
          />
        </div>

        <div class="field-group">
          <label for="phone">Phone Number</label>
          <input 
            id="phone" 
            v-model="form.phone" 
            type="tel" 
            placeholder="Enter your phone number"
          />
        </div>

        <div class="field-group">
          <label for="subject">Subject</label>
          <select id="subject" v-model="form.subject">
            <option value="">Select a subject</option>
            <option value="registration">Registration Help</option>
            <option value="support">Technical Support</option>
            <option value="partnership">Partnership Inquiry</option>
            <option value="general">General Question</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="field-group">
          <label for="message">Message *</label>
          <textarea 
            id="message" 
            v-model="form.message" 
            required 
            rows="5"
            placeholder="How can we help you?"
          ></textarea>
        </div>

        <p v-if="error" class="text-rose-600 text-sm mt-2">{{ error }}</p>

        <button 
          class="btn btn-primary mt-4" 
          type="submit" 
          :disabled="submitting"
        >
          {{ submitting ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </article>
  </section>
</template>

<style scoped>
.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.contact-value {
  color: #0f766e;
  text-decoration: none;
}

.contact-value:hover {
  text-decoration: underline;
}

.success-message {
  padding: 2rem;
  text-align: center;
  background: #f0fdf4;
  border-radius: 0.75rem;
}
</style>
