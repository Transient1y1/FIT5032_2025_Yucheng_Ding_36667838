<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, DoughnutController, ArcElement, Legend, LinearScale, Tooltip } from 'chart.js'
import InteractiveDataTable from '../components/InteractiveDataTable.vue'
import OpportunityMap from '../components/OpportunityMap.vue'
import { currentUser, getUserForCoordinator } from '../services/authService'
import { getApplicationsForCoordinator } from '../services/applicationService'
import { getOpportunities } from '../services/opportunityStorage'
import { generateAiSuggestion, getCloudStats, getRestApiUrl, sendBulkEmail } from '../services/cloudService'
import { apiEnabled, apiListApplications } from '../services/apiService'
import { csvAttachment, downloadCsv, downloadPdf } from '../utils/exportUtils'

Chart.register(BarController, BarElement, CategoryScale, DoughnutController, ArcElement, Legend, LinearScale, Tooltip)
const opportunities = getOpportunities()
function decorateApplications(rows) {
  return rows.map((application) => ({
    ...application,
    applicantName: application.applicantName || getUserForCoordinator(application.userId)?.name || 'Volunteer',
    applicantEmail: application.applicantEmail || getUserForCoordinator(application.userId)?.email || 'Unavailable',
    opportunityTitle: opportunities.find((item) => item.id === application.opportunityId)?.title || 'Unknown opportunity',
  }))
}
const applications = ref(decorateApplications(getApplicationsForCoordinator()))
const selected = ref([])
const feedback = ref('')
const aiPrompt = ref('')
const aiResult = ref('')
const apiResult = ref('')
const applicationsCanvas = ref(null)
const causeCanvas = ref(null)
let charts = []

const applicationColumns = [
  { key: 'applicantName', label: 'Applicant' },
  { key: 'applicantEmail', label: 'Email' },
  { key: 'opportunityTitle', label: 'Opportunity' },
  { key: 'status', label: 'Status' },
  { key: 'submittedAt', label: 'Submitted' },
]
const opportunityRows = opportunities.map((opportunity) => ({ id: opportunity.id, title: opportunity.title, cause: opportunity.cause, location: opportunity.location, mode: opportunity.deliveryMode }))
const opportunityColumns = [{ key: 'title', label: 'Opportunity' }, { key: 'cause', label: 'Cause' }, { key: 'location', label: 'Location' }, { key: 'mode', label: 'Mode' }]
const pending = computed(() => applications.value.filter((application) => application.status === 'pending').length)
const selectedRecipients = computed(() => applications.value.filter((application) => selected.value.includes(application.id) && application.applicantEmail !== 'Unavailable').map((application) => application.applicantEmail))

function countBy(key) { return applications.value.reduce((result, item) => { result[item[key]] = (result[item[key]] || 0) + 1; return result }, {}) }
function drawCharts() {
  charts.forEach((chart) => chart.destroy()); charts = []
  const statusCounts = countBy('status'); const causeCounts = {}
  applications.value.forEach((application) => { const opportunity = opportunities.find((item) => item.id === application.opportunityId); const cause = opportunity?.cause || 'Other'; causeCounts[cause] = (causeCounts[cause] || 0) + 1 })
  if (applicationsCanvas.value) charts.push(new Chart(applicationsCanvas.value, { type: 'doughnut', data: { labels: Object.keys(statusCounts), datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#f2b84b', '#1f5d50', '#df7866', '#364f68', '#8da69f'] }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } } } }))
  if (causeCanvas.value) charts.push(new Chart(causeCanvas.value, { type: 'bar', data: { labels: Object.keys(causeCounts), datasets: [{ label: 'Applications', data: Object.values(causeCounts), backgroundColor: '#1f5d50' }] }, options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } } }))
}
async function bulkEmail() {
  if (!selectedRecipients.value.length) { feedback.value = 'Select at least one applicant with an available email address.'; return }
  const result = await sendBulkEmail({ recipients: selectedRecipients.value, subject: 'VolunteerConnect application update', text: 'Thank you for taking part in VolunteerConnect.', attachments: [csvAttachment(applications.value.filter((item) => selected.value.includes(item.id)))] })
  feedback.value = result.ok ? 'Bulk email queued successfully.' : 'Bulk email is ready for deployment; configure Resend for the Vercel API.'
}
function exportApplications() { downloadCsv('volunteerconnect-applications.csv', applications.value.map(({ applicantName, applicantEmail, opportunityTitle, status, submittedAt }) => ({ applicantName, applicantEmail, opportunityTitle, status, submittedAt }))); feedback.value = 'Applications CSV downloaded.' }
function exportReport() { downloadPdf('volunteerconnect-admin-report.pdf', 'VolunteerConnect application report', applications.value.map(({ applicantName, opportunityTitle, status, submittedAt }) => ({ applicantName, opportunityTitle, status, submittedAt }))); feedback.value = 'PDF report downloaded.' }
async function runAi() { const result = await generateAiSuggestion({ prompt: aiPrompt.value || 'Summarise the current volunteer application workload.', context: applications.value.slice(0, 20) }); aiResult.value = result.ok ? result.text || 'The AI service returned no text.' : 'Demo insight: focus coordinator attention on pending applications and upcoming sessions.' }
async function loadApiPreview() { try { const response = await fetch(getRestApiUrl('/api/opportunities')); apiResult.value = JSON.stringify(await response.json(), null, 2).slice(0, 1000) } catch { apiResult.value = 'REST API is available after the Neon-backed Vercel API is configured.' } }
onMounted(async () => {
  if (apiEnabled) {
    const result = await apiListApplications()
    if (result.ok) applications.value = decorateApplications(result.data || [])
  }
  await nextTick(); drawCharts(); if (getCloudStats) getCloudStats().catch(() => {})
})
</script>

<template>
  <section class="dashboard-page container-xxl py-5 py-lg-6">
    <div class="dashboard-heading mb-4">
      <p class="eyebrow mb-2">Coordinator command centre</p>
      <h1 class="display-6 fw-bold mb-2">See the whole volunteer journey.</h1>
      <p class="lead text-secondary mb-0">Welcome, {{ currentUser?.name }}. Review applications, contact selected volunteers and monitor program demand.</p>
    </div>

    <div class="row g-3 g-lg-4 mb-4">
      <div v-for="stat in [{ label: 'Opportunities', value: opportunities.length }, { label: 'Applications', value: applications.length }, { label: 'Pending review', value: pending }, { label: 'Selected recipients', value: selectedRecipients.length }]" :key="stat.label" class="col-sm-6 col-xl-3"><div class="dashboard-stat h-100 p-4"><p class="stat-label mb-2">{{ stat.label }}</p><p class="stat-value mb-0">{{ stat.value }}</p></div></div>
    </div>

    <section class="dashboard-list-section mb-4" aria-labelledby="chart-heading">
      <div class="dashboard-section-heading"><div><p class="eyebrow mb-2">Interactive charts</p><h2 id="chart-heading" class="h3 mb-0">Demand at a glance</h2></div><span class="dashboard-count">F</span></div>
      <div class="row g-4 p-3 p-lg-4"><div class="col-lg-5"><canvas ref="applicationsCanvas" aria-label="Applications by status chart"></canvas></div><div class="col-lg-7"><canvas ref="causeCanvas" aria-label="Applications by cause chart"></canvas></div></div>
    </section>

    <section class="dashboard-list-section mb-4" aria-labelledby="application-table-heading">
      <div class="dashboard-section-heading"><div><p class="eyebrow mb-2">BR D.3</p><h2 id="application-table-heading" class="h3 mb-0">Application table</h2></div><div class="d-flex flex-wrap gap-2"><button class="btn btn-outline-primary btn-sm" type="button" @click="exportApplications">Export CSV</button><button class="btn btn-outline-primary btn-sm" type="button" @click="exportReport">Export PDF</button><button class="btn btn-primary btn-sm" type="button" @click="bulkEmail">Email selected</button></div></div>
      <InteractiveDataTable v-model:selected="selected" :rows="applications" :columns="applicationColumns" selectable row-key="id" empty-message="No applications have been submitted yet." />
      <p v-if="feedback" class="small text-secondary mt-3" role="status">{{ feedback }}</p>
    </section>

    <section class="dashboard-list-section mb-4" aria-labelledby="opportunity-table-heading"><div class="dashboard-section-heading"><div><p class="eyebrow mb-2">BR D.3</p><h2 id="opportunity-table-heading" class="h3 mb-0">Opportunity directory table</h2></div></div><InteractiveDataTable :rows="opportunityRows" :columns="opportunityColumns" row-key="id" /></section>

    <OpportunityMap :opportunities="opportunities" class="mb-4" />

    <section class="dashboard-action p-4 p-lg-5 mb-4" aria-labelledby="ai-heading"><div class="w-100"><p class="eyebrow mb-2">GenAI adapter</p><h2 id="ai-heading" class="h3 mb-2">Ask for a coordinator insight.</h2><div class="d-flex flex-column flex-lg-row gap-2"><label class="visually-hidden" for="ai-prompt">AI prompt</label><input id="ai-prompt" v-model="aiPrompt" class="form-control" type="text" maxlength="240" placeholder="e.g. Which applications need attention first?" /><button class="btn btn-primary flex-shrink-0" type="button" @click="runAi">Generate insight</button></div><p v-if="aiResult" class="mt-3 mb-0" role="status">{{ aiResult }}</p></div></section>

    <section class="dashboard-action p-4 p-lg-5" aria-labelledby="api-heading"><div><p class="eyebrow mb-2">REST API</p><h2 id="api-heading" class="h3 mb-2">A documented public data surface.</h2><p class="text-secondary mb-0">The deployed Functions API exposes opportunity records and administrator statistics for approved integrations.</p></div><button class="btn btn-outline-primary" type="button" @click="loadApiPreview">Preview opportunities API</button><pre v-if="apiResult" class="api-preview mt-3 mb-0" aria-live="polite">{{ apiResult }}</pre></section>
  </section>
</template>
