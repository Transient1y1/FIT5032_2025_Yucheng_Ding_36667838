<script setup>
import { computed, onMounted, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { currentUser } from '../services/authService'
import { apiCreateBooking, apiEnabled, apiListBookings } from '../services/apiService'

const props = defineProps({ opportunity: { type: Object, required: true } })
const feedback = ref('Select an available session. Bookings are checked for conflicts.')
const bookings = ref(readBookings())
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  height: 'auto',
  fixedWeekCount: false,
  selectable: true,
  events: sessions.value,
  eventClick: ({ event }) => book(event.startStr),
  select: ({ startStr }) => book(startStr),
}))
const sessions = computed(() => Array.from({ length: 8 }, (_, index) => {
  const date = new Date(); date.setDate(date.getDate() + index + 1)
  return { id: `${props.opportunity.id}-${date.toISOString().slice(0, 10)}`, title: 'Available volunteer session', start: date.toISOString().slice(0, 10), backgroundColor: '#1f5d50', borderColor: '#1f5d50' }
}))
function readBookings() { try { const value = JSON.parse(localStorage.getItem('vc_bookings') || '[]'); return Array.isArray(value) ? value : [] } catch { return [] } }
onMounted(async () => {
  if (!apiEnabled || !currentUser.value) return
  const result = await apiListBookings()
  if (result.ok) bookings.value = result.data || []
})
async function book(date) {
  if (!currentUser.value) { feedback.value = 'Sign in as a volunteer before booking a session.'; return }
  if (bookings.value.some((item) => item.userId === currentUser.value.id && item.date === date)) { feedback.value = 'You already have a booking on this date.'; return }
  if (bookings.value.some((item) => item.userId === currentUser.value.id && item.opportunityId === props.opportunity.id && item.date === date)) { feedback.value = 'This opportunity is already booked for that date.'; return }
  if (apiEnabled) {
    const result = await apiCreateBooking({ opportunityId: props.opportunity.id, date })
    if (!result.ok) { feedback.value = result.message || 'The booking service is unavailable.'; return }
    bookings.value.push(result.data)
    feedback.value = `Session booked for ${new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium' }).format(new Date(date))}.`
    return
  }
  const booking = { id: crypto.randomUUID(), userId: currentUser.value.id, opportunityId: props.opportunity.id, date, status: 'confirmed' }
  bookings.value.push(booking); localStorage.setItem('vc_bookings', JSON.stringify(bookings.value)); feedback.value = `Session booked for ${new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium' }).format(new Date(date))}.`
}
</script>

<template>
  <section class="booking-panel" aria-labelledby="booking-heading">
    <p class="eyebrow mb-2">Appointment booking</p>
    <h2 id="booking-heading" class="h3 mb-2">Choose a supported session.</h2>
    <p class="text-secondary mb-3">Available dates are shown in green. The app prevents duplicate bookings and date conflicts.</p>
    <FullCalendar :options="calendarOptions" />
    <p class="small text-secondary mt-3 mb-0" role="status">{{ feedback }}</p>
  </section>
</template>
