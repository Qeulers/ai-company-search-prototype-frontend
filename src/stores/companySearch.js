import { defineStore } from 'pinia'
import { ref } from 'vue'

const CACHE_KEY = 'company_search_cache'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

let toastIdCounter = 0

export function buildCacheKey(companyName, role, imo) {
  const normalize = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '_')
  return `${normalize(companyName)}__${normalize(role)}__${normalize(imo)}`
}

export const useCompanySearchStore = defineStore('companySearch', () => {
  const cache = ref({})
  const pendingSearches = ref(new Set())
  const toasts = ref([])

  function _loadFromStorage() {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return
      const stored = JSON.parse(raw)
      const now = Date.now()
      const valid = {}
      for (const [key, entry] of Object.entries(stored)) {
        if (now - entry.timestamp < CACHE_TTL_MS) {
          valid[key] = entry
        }
      }
      cache.value = valid
    } catch {
      cache.value = {}
    }
  }

  function _persistToStorage() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache.value))
    } catch {
      // Storage quota exceeded — fail silently
    }
  }

  function getCached(key) {
    const entry = cache.value[key]
    if (!entry) return null
    if (Date.now() - entry.timestamp >= CACHE_TTL_MS) {
      const updated = { ...cache.value }
      delete updated[key]
      cache.value = updated
      _persistToStorage()
      return null
    }
    return entry.data
  }

  function startSearch(key) {
    pendingSearches.value = new Set([...pendingSearches.value, key])
  }

  function finishSearch(key, data) {
    cache.value = {
      ...cache.value,
      [key]: { data, timestamp: Date.now() }
    }
    _persistToStorage()
    pendingSearches.value = new Set([...pendingSearches.value].filter(k => k !== key))
    _addToast('success', `Company details ready for "${data.company_name}"`)
  }

  function failSearch(key, errorMessage) {
    pendingSearches.value = new Set([...pendingSearches.value].filter(k => k !== key))
    _addToast('error', errorMessage || 'Company search failed. Please try again.')
  }

  function invalidateCache(key) {
    const updated = { ...cache.value }
    delete updated[key]
    cache.value = updated
    _persistToStorage()
  }

  function _addToast(type, message) {
    const id = ++toastIdCounter
    toasts.value = [...toasts.value, { id, type, message }]
    setTimeout(() => removeToast(id), 5000)
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // Hydrate on store init
  _loadFromStorage()

  return {
    cache,
    pendingSearches,
    toasts,
    getCached,
    startSearch,
    finishSearch,
    failSearch,
    invalidateCache,
    removeToast,
    buildCacheKey
  }
})
