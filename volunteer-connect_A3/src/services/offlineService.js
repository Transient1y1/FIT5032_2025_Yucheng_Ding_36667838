import { ref } from 'vue'

export const isOnline = ref(typeof navigator === 'undefined' ? true : navigator.onLine)
export const offlineQueue = ref(readQueue())

function readQueue() {
  try { const parsed = JSON.parse(localStorage.getItem('vc_offline_queue') || '[]'); return Array.isArray(parsed) ? parsed : [] }
  catch { return [] }
}
function saveQueue() { localStorage.setItem('vc_offline_queue', JSON.stringify(offlineQueue.value)) }
export function queueOfflineAction(action) { offlineQueue.value.push({ ...action, queuedAt: new Date().toISOString() }); saveQueue() }
export function cacheDraft(key, value) { localStorage.setItem(`vc_draft_${key}`, JSON.stringify(value)) }
export function readDraft(key, fallback = null) { try { return JSON.parse(localStorage.getItem(`vc_draft_${key}`) || 'null') || fallback } catch { return fallback } }
export function clearDraft(key) { localStorage.removeItem(`vc_draft_${key}`) }
export function acknowledgeQueueItem(index) { offlineQueue.value.splice(index, 1); saveQueue() }

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { isOnline.value = true })
  window.addEventListener('offline', () => { isOnline.value = false })
}

