<script setup>
import { ref, onMounted } from "vue";
import { useVesselStore } from "../stores/vessel";
import { useUserStore } from "../stores/user";
import { useAuthStore } from "../stores/auth";
import AppHeader from "../components/layout/AppHeader.vue";
import VesselSearchBar from "../components/search/VesselSearchBar.vue";
import VesselSearchResults from "../components/search/VesselSearchResults.vue";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import PersonaSelector from "../components/user/PersonaSelector.vue";

const vesselStore = useVesselStore();
const userStore = useUserStore();
const authStore = useAuthStore();

const showPersonaModal = ref(false);

onMounted(async () => {
  if (userStore.needsPersonaSelection) {
    showPersonaModal.value = true;
  }
});

const handleSearch = async ({ query, searchType }) => {
  const value =
    searchType === "imo" || searchType === "mmsi" ? parseInt(query, 10) : query;

  const params = {
    [searchType]: value,
    limit: 50,
  };

  await vesselStore.search(params);
};

const handlePersonaSelected = async (persona) => {
  await userStore.setPersona(authStore.userId, persona);
  showPersonaModal.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />

    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-brand-dark mb-2">Vessel Search</h2>
        <p class="text-slate-600">
          Search for vessels by name, IMO number, or MMSI
        </p>
      </div>

      <div class="mb-8">
        <VesselSearchBar @search="handleSearch" />
      </div>

      <ErrorMessage
        v-if="vesselStore.searchError"
        :message="vesselStore.searchError"
        @dismiss="vesselStore.searchError = null"
        class="mb-6"
      />

      <div v-if="vesselStore.isSearching" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <VesselSearchResults
        v-else-if="
          vesselStore.searchResults.length > 0 || vesselStore.searchMeta
        "
        :vessels="vesselStore.searchResults"
        :meta="vesselStore.searchMeta"
      />

      <div v-else class="text-center py-16">
        <svg
          class="mx-auto h-16 w-16 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p class="mt-4 text-lg text-slate-600">
          Enter a search term to find vessels
        </p>
        <p class="mt-2 text-sm text-slate-500">
          Try searching for "FELICITY" to test
        </p>
      </div>
    </main>

    <PersonaSelector
      v-if="showPersonaModal"
      @select="handlePersonaSelected"
      @close="showPersonaModal = false"
    />
  </div>
</template>
