<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({ opportunities: { type: Array, default: () => [] } })
const mapElement = ref(null)
const search = ref('')
const message = ref('Search a Melbourne place to add a map marker.')
let map
let markerLayer
let routeLayer
const fallbackCoordinates = [-37.8136, 144.9631]

function coordinateFor(opportunity, index) { return opportunity.coordinates || [-37.8136 + (index % 3) * 0.018, 144.9631 + (index % 4) * 0.022] }
function popupContent(title, subtitle) {
  const element = document.createElement('div')
  const heading = document.createElement('strong')
  heading.textContent = title
  const detail = document.createElement('div')
  detail.textContent = subtitle
  element.append(heading, detail)
  return element
}
function addOpportunityMarkers() {
  markerLayer?.clearLayers()
  props.opportunities.forEach((opportunity, index) => {
    const marker = L.marker(coordinateFor(opportunity, index)).bindPopup(popupContent(opportunity.title, opportunity.location))
    markerLayer.addLayer(marker)
  })
}
async function searchPlace() {
  const query = search.value.trim()
  if (!query || !map) return
  message.value = 'Searching OpenStreetMap…'
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query + ', Melbourne')}`, { headers: { Accept: 'application/json' } })
    const results = await response.json()
    if (!results.length) { message.value = 'No place found. Try a suburb, venue or landmark.'; return }
    const point = [Number(results[0].lat), Number(results[0].lon)]
    L.marker(point).addTo(markerLayer).bindPopup(popupContent(results[0].display_name, 'OpenStreetMap search result')).openPopup()
    map.setView(point, 14)
    message.value = 'Place added to the map.'
  } catch { message.value = 'Place search is unavailable while offline.' }
}
async function planRoute() {
  const points = props.opportunities.slice(0, 2).map(coordinateFor)
  if (points.length < 2) return
  message.value = 'Planning a route…'
  try {
    const coordinates = points.map(([lat, lon]) => `${lon},${lat}`).join(';')
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`)
    const result = await response.json()
    routeLayer?.remove()
    if (result.routes?.[0]) routeLayer = L.geoJSON(result.routes[0].geometry, { color: '#df7866', weight: 5 }).addTo(map)
    message.value = 'Route shown between the first two opportunities.'
  } catch { message.value = 'Route planning is unavailable while offline.' }
}

onMounted(() => {
  map = L.map(mapElement.value, { scrollWheelZoom: false }).setView(fallbackCoordinates, 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
  addOpportunityMarkers()
})
onBeforeUnmount(() => { map?.remove() })
</script>

<template>
  <section class="map-panel" aria-labelledby="map-heading">
    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-3">
      <div><p class="eyebrow mb-2">Geo location</p><h2 id="map-heading" class="h3 mb-0">Find support near you.</h2></div>
      <div class="map-controls d-flex flex-wrap gap-2">
        <label class="visually-hidden" for="map-search">Search place</label>
        <input id="map-search" v-model="search" class="form-control" type="search" placeholder="Suburb or landmark" @keyup.enter="searchPlace" />
        <button class="btn btn-outline-primary" type="button" @click="searchPlace">Search place</button>
        <button class="btn btn-primary" type="button" @click="planRoute">Plan route</button>
      </div>
    </div>
    <div ref="mapElement" class="opportunity-map" role="img" aria-label="Interactive map of VolunteerConnect opportunities"></div>
    <p class="small text-secondary mt-2 mb-0" role="status">{{ message }} Map data © OpenStreetMap contributors.</p>
  </section>
</template>
