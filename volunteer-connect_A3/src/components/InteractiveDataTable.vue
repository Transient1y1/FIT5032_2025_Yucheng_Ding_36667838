<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
  selectable: { type: Boolean, default: false },
  emptyMessage: { type: String, default: 'No matching records.' },
})
const selected = defineModel('selected', { type: Array, default: () => [] })
const columnSearch = ref({})
const sortKey = ref('')
const sortDirection = ref('asc')
const page = ref(1)
const pageSize = 10

const filteredRows = computed(() => props.rows.filter((row) => props.columns.every((column) => {
  const query = String(columnSearch.value[column.key] || '').trim().toLowerCase()
  return !query || String(row[column.key] ?? '').toLowerCase().includes(query)
})))
const sortedRows = computed(() => [...filteredRows.value].sort((left, right) => {
  if (!sortKey.value) return 0
  const a = String(left[sortKey.value] ?? '').toLowerCase()
  const b = String(right[sortKey.value] ?? '').toLowerCase()
  return (a.localeCompare(b, undefined, { numeric: true }) || 0) * (sortDirection.value === 'asc' ? 1 : -1)
}))
const pageCount = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize)))
const visibleRows = computed(() => sortedRows.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const allVisibleSelected = computed(() => visibleRows.value.length > 0 && visibleRows.value.every((row) => selected.value.includes(row[props.rowKey])))

watch([filteredRows, pageCount], () => { if (page.value > pageCount.value) page.value = pageCount.value })
function sortBy(key) { sortDirection.value = sortKey.value === key && sortDirection.value === 'asc' ? 'desc' : 'asc'; sortKey.value = key }
function toggleRow(row) { const key = row[props.rowKey]; selected.value = selected.value.includes(key) ? selected.value.filter((item) => item !== key) : [...selected.value, key] }
function toggleVisible() {
  const keys = visibleRows.value.map((row) => row[props.rowKey])
  selected.value = allVisibleSelected.value ? selected.value.filter((key) => !keys.includes(key)) : [...new Set([...selected.value, ...keys])]
}
</script>

<template>
  <div class="data-table-wrap">
    <div class="table-responsive">
      <table class="table align-middle data-table">
        <caption class="visually-hidden">Interactive data table with search, sorting and pagination</caption>
        <thead>
          <tr>
            <th v-if="selectable" scope="col" class="table-select-cell">
              <input class="form-check-input" type="checkbox" :checked="allVisibleSelected" aria-label="Select visible rows" @change="toggleVisible" />
            </th>
            <th v-for="column in columns" :key="column.key" scope="col">
              <button class="table-sort-button" type="button" @click="sortBy(column.key)">
                {{ column.label }} <span aria-hidden="true">{{ sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </button>
              <input v-model="columnSearch[column.key]" class="form-control form-control-sm mt-2" type="search" :aria-label="`Search ${column.label}`" :placeholder="`Search ${column.label}`" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in visibleRows" :key="row[rowKey]">
            <td v-if="selectable" class="table-select-cell"><input class="form-check-input" type="checkbox" :checked="selected.includes(row[rowKey])" :aria-label="`Select row ${row[rowKey]}`" @change="toggleRow(row)" /></td>
            <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
          </tr>
          <tr v-if="!visibleRows.length"><td :colspan="columns.length + (selectable ? 1 : 0)" class="text-center text-secondary py-4">{{ emptyMessage }}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="data-table-footer d-flex flex-wrap align-items-center justify-content-between gap-2">
      <span class="small text-secondary" aria-live="polite">{{ filteredRows.length }} record{{ filteredRows.length === 1 ? '' : 's' }} · page {{ page }} of {{ pageCount }}</span>
      <div class="btn-group" role="group" aria-label="Table pagination">
        <button class="btn btn-outline-primary btn-sm" type="button" :disabled="page === 1" @click="page -= 1">Previous</button>
        <button class="btn btn-outline-primary btn-sm" type="button" :disabled="page === pageCount" @click="page += 1">Next</button>
      </div>
    </div>
  </div>
</template>

