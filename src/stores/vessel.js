import { defineStore } from 'pinia'
import { ref } from 'vue'
import { searchVessels, getVesselCharacteristics } from '../services/polestarApi'

const SEARCH_HISTORY_KEY = 'search_history'
const MAX_HISTORY_ITEMS = 20

export const useVesselStore = defineStore('vessel', () => {
  const searchResults = ref([])
  const searchMeta = ref(null)
  const currentVessel = ref(null)
  const isSearching = ref(false)
  const isLoadingVessel = ref(false)
  const searchError = ref(null)
  const vesselError = ref(null)
  const searchHistory = ref([])

  function loadSearchHistory() {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
      searchHistory.value = stored ? JSON.parse(stored) : []
    } catch {
      searchHistory.value = []
    }
  }

  function saveSearchToHistory(query, resultCount) {
    const entry = {
      query,
      timestamp: new Date().toISOString(),
      resultCount
    }

    searchHistory.value = [
      entry,
      ...searchHistory.value.filter(h => h.query !== query)
    ].slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value))
  }

  async function search(params) {
    isSearching.value = true
    searchError.value = null

    try {
      const response = await searchVessels(params)
      searchResults.value = response.data || []
      searchMeta.value = response.meta || null

      if (params.name_contains) {
        saveSearchToHistory(params.name_contains, searchMeta.value?.total_count || 0)
      }

      return response
    } catch (error) {
      searchError.value = error.response?.data?.message || 'Failed to search vessels'
      searchResults.value = []
      searchMeta.value = null
      throw error
    } finally {
      isSearching.value = false
    }
  }

  async function fetchVesselDetails(imo) {
    isLoadingVessel.value = true
    vesselError.value = null

    try {
      const response = await getVesselCharacteristics(imo)
      currentVessel.value = response.data || null
      return response
    } catch (error) {
      vesselError.value = error.response?.data?.message || 'Failed to load vessel details'
      currentVessel.value = null
      throw error
    } finally {
      isLoadingVessel.value = false
    }
  }

  function clearCurrentVessel() {
    currentVessel.value = null
    vesselError.value = null
  }

  function clearSearch() {
    searchResults.value = []
    searchMeta.value = null
    searchError.value = null
  }

  loadSearchHistory()

  return {
    searchResults,
    searchMeta,
    currentVessel,
    isSearching,
    isLoadingVessel,
    searchError,
    vesselError,
    searchHistory,
    search,
    fetchVesselDetails,
    clearCurrentVessel,
    clearSearch,
    loadSearchHistory
  }
})
