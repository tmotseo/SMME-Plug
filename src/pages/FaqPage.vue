<script setup>
import { ref } from 'vue'

const activeCategory = ref('smmes')

const categories = [
  { id: 'smmes', label: 'SMMEs' },
  { id: 'jobseekers', label: 'Jobseekers' },
  { id: 'professionals', label: 'Professionals' },
]

const faqs = {
  smmes: [
    {
      question: 'What is an SMME?',
      answer: 'SMME stands for Small, Medium, and Micro Enterprises. These are small businesses that typically have fewer than 250 employees and can include sole proprietors, startups, and growing companies.',
    },
    {
      question: 'How do I register as an SMME on SMME Plug?',
      answer: 'Click on the "SMMEs" menu item in the navigation, fill out the business profile form with your business name, contact person details, phone number, sector, and services offered. Click submit and your application will be reviewed by our team.',
    },
    {
      question: 'What information do I need to provide?',
      answer: 'You need to provide: Business Name, Contact Person Name, Phone Number, Sector/Industry, and a description of Services Offered.',
    },
    {
      question: 'How long does the approval process take?',
      answer: 'Once you submit your application, our team will review it. The approval typically takes 1-3 business days. You will receive notification once your profile is approved and published.',
    },
    {
      question: 'What are the benefits of registering?',
      answer: 'Benefits include: Access to tender notices and procurement opportunities, promotion of your services to employers and stakeholders, reduced barriers to market entry, and visibility to connections seeking your business services.',
    },
    {
      question: 'Is there a fee to register?',
      answer: 'Registration on SMME Plug is free. Check our Pricing page for any premium services or features.',
    },
    {
      question: 'Can I update my business information after registration?',
      answer: 'Yes, once approved, you can contact our team to update your business information. Visit the Admin section if you need to make changes to your profile.',
    },
    {
      question: 'What sectors can I register under?',
      answer: 'Sectors include: Construction, IT Services, Cleaning Services, Logistics, Hospitality, and more. Select the sector that best describes your business.',
    },
  ],
  jobseekers: [
    {
      question: 'How do I register as a jobseeker?',
      answer: 'Click on the "Jobseekers" menu item, fill out the jobseeker registration form with your full name, phone number, location, skill level, and work interests. Submit the form to create your profile.',
    },
    {
      question: 'What is a skill level?',
      answer: 'Skill levels categorize your experience: Skilled (professional with years of experience), Semi-skilled (some training or experience), or Entry-level (no prior experience required).',
    },
    {
      question: 'What types of work can I find?',
      answer: 'You can find short-term gigs, contract work, full-time positions, and training opportunities across various sectors including construction, hospitality, retail, and more.',
    },
    {
      question: 'How does matching work?',
      answer: 'Our platform matches jobseekers to opportunities based on your skills, location, and interests. Employers and opportunity providers review profiles and reach out to suitable candidates.',
    },
    {
      question: 'Do I need qualifications to register?',
      answer: 'No, jobseekers of all skill levels can register. Whether you are skilled, semi-skilled, or looking for entry-level opportunities, there is a place for you on our platform.',
    },
    {
      question: 'How do I increase my chances of getting hired?',
      answer: 'Complete your profile with accurate information, keep your contact details updated, and clearly describe your skills and experience. Being available and responsive to opportunities also helps.',
    },
    {
      question: 'Is my information shared with employers?',
      answer: 'Your profile is visible to potential employers. Only approved profiles are shown publicly. You control what information is displayed on your public profile.',
    },
  ],
  professionals: [
    {
      question: 'How do I register as a professional?',
      answer: 'Click on the "Professionals" menu item, fill out the professional registration form with your full name, email, phone, primary field, and experience summary. Submit to create your professional profile.',
    },
    {
      question: 'What fields can I register under?',
      answer: 'Professional fields include: Project Management, Engineering, Finance, ICT, Operations, and other specialized professional areas.',
    },
    {
      question: 'What is the difference between a professional and a jobseeker?',
      answer: 'Professionals typically have specialized qualifications, degrees, or significant experience in their field. Jobseekers can include entry-level workers, semi-skilled labor, and those seeking any type of employment.',
    },
    {
      question: 'What benefits do professionals receive?',
      answer: 'Benefits include: Job alerts matching your skills, boosted visibility through curated CV promotion, access to exclusive career opportunities, and faster connections with employers.',
    },
    {
      question: 'How does CV promotion work?',
      answer: 'Your professional profile is promoted to employers and stakeholders seeking your specific skills and expertise. Our team also actively markets qualified professionals to relevant opportunities.',
    },
    {
      question: 'Can I update my professional profile?',
      answer: 'Yes, you can update your profile information at any time. Contact our team through the Admin section to make changes to your professional details.',
    },
    {
      question: 'What happens after I submit my profile?',
      answer: 'Your profile will be reviewed by our team. Once approved, you will become visible to employers and start receiving relevant job alerts and opportunity notifications.',
    },
  ],
}

const toggleFaq = (index) => {
  const element = document.getElementById(`faq-${activeCategory.value}-${index}`)
  if (element) {
    element.classList.toggle('hidden')
  }
}
</script>

<template>
  <section class="hero-panel reveal delay-2">
    <p class="eyebrow">Help Center</p>
    <h1>Frequently Asked Questions</h1>
    <p class="lead">
      Find answers to common questions about registering and using SMME Plug.
    </p>
  </section>

  <section class="reveal delay-3">
    <!-- Category Tabs -->
    <div class="flex flex-wrap justify-center gap-3 mb-8">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="activeCategory = category.id"
        class="px-6 py-3 rounded-xl font-semibold transition"
        :class="activeCategory === category.id 
          ? 'bg-emerald-600 text-white' 
          : 'bg-white text-slate-600 hover:bg-slate-100'"
      >
        {{ category.label }}
      </button>
    </div>

    <!-- FAQ Accordion - Centered for all screens -->
    <div class="max-w-3xl mx-auto space-y-4 px-4 md:px-8" style="margin-top: 2rem;">
      <div
        v-for="(faq, index) in faqs[activeCategory]"
        :key="index"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <button
          @click="toggleFaq(index)"
          class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition"
        >
          <span class="font-semibold text-slate-800">{{ faq.question }}</span>
          <span class="text-emerald-600 text-xl">+</span>
        </button>
        <div :id="`faq-${activeCategory.value || activeCategory}-${index}`" class="hidden px-6 pb-4">
          <p class="text-slate-600">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="content-card reveal delay-4">
    <p class="eyebrow">Still Have Questions?</p>
    <h3 style="margin-top: 0.45rem">Can't find the answer you're looking for?</h3>
    <p class="mt-4">
      Contact our support team at <a href="mailto:support@smmeplug.co.za" class="text-emerald-600 underline">support@smmeplug.co.za</a> 
      and we'll be happy to help.
    </p>
  </section>
</template>
