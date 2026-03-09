<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVesselStore } from "../stores/vessel";
import { useUserStore } from "../stores/user";
import { useCompanySearchStore, buildCacheKey } from "../stores/companySearch";
import { searchCompany } from "../services/backendApi";
import AppHeader from "../components/layout/AppHeader.vue";
import VesselInfoCard from "../components/vessel/VesselInfoCard.vue";
import OwnershipSection from "../components/vessel/OwnershipSection.vue";
import CompanySearchResults from "../components/company/CompanySearchResults.vue";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";

const route = useRoute();
const router = useRouter();
const vesselStore = useVesselStore();
const userStore = useUserStore();
const companySearchStore = useCompanySearchStore();

const companySearchData = ref(null);
const activeCacheKey = ref(null);
const isRefreshing = ref(false);

const vessel = computed(() => vesselStore.currentVessel);

const identityItems = computed(() => {
  if (!vessel.value) return [];
  return [
    { label: "IMO", value: vessel.value.imo },
    { label: "MMSI", value: vessel.value.mmsi },
    { label: "Callsign", value: vessel.value.callsign },
    { label: "Flag", value: vessel.value.flag?.name },
  ];
});

const typeItems = computed(() => {
  if (!vessel.value) return [];
  return [
    { label: "Type", value: vessel.value.type },
    { label: "Status", value: vessel.value.ship_status },
    { label: "Hull Type", value: vessel.value.hull_type },
  ];
});

const dimensionItems = computed(() => {
  if (!vessel.value) return [];
  return [
    {
      label: "Length",
      value: vessel.value.dimensions?.length
        ? `${vessel.value.dimensions.length} m`
        : null,
    },
    {
      label: "Breadth",
      value: vessel.value.dimensions?.breadth
        ? `${vessel.value.dimensions.breadth} m`
        : null,
    },
    {
      label: "Draught",
      value: vessel.value.draught ? `${vessel.value.draught} m` : null,
    },
    {
      label: "Deadweight",
      value: vessel.value.deadweight
        ? `${vessel.value.deadweight.toLocaleString()} DWT`
        : null,
    },
    {
      label: "Gross Tonnage",
      value: vessel.value.gross_tonnage
        ? vessel.value.gross_tonnage.toLocaleString()
        : null,
    },
  ];
});

const buildItems = computed(() => {
  if (!vessel.value) return [];
  return [
    { label: "Year Built", value: vessel.value.build_year },
    { label: "Country", value: vessel.value.country_of_build?.country_name },
    { label: "Shipbuilder", value: vessel.value.shipbuilder },
  ];
});

const registrationItems = computed(() => {
  if (!vessel.value) return [];
  return [
    { label: "Port of Registry", value: vessel.value.port_of_registry },
    { label: "Classification", value: vessel.value.classification_society },
    { label: "P&I Club", value: vessel.value.pandi_club },
  ];
});

const vesselContext = computed(() => ({
  name: vessel.value?.name || "",
  type: vessel.value?.type || "",
  imo: vessel.value?.imo || "",
}));

onMounted(async () => {
  const imo = route.params.imo;
  if (imo) {
    await vesselStore.fetchVesselDetails(imo);
  }
});

const goBack = () => {
  router.push({ name: "search" });
};

const normalizeRole = (role) => role.toLowerCase().replace(/ /g, "_");

const runCompanySearch = async (companyName, role, cacheKey) => {
  companySearchStore.startSearch(cacheKey);
  try {
    const response = await searchCompany(
      companyName,
      normalizeRole(role),
      vesselContext.value,
      userStore.persona || "general",
    );
    if (response.success) {
      companySearchStore.finishSearch(cacheKey, response.data);
      return response.data;
    } else {
      companySearchStore.failSearch(
        cacheKey,
        response.message || "Failed to search company",
      );
      return null;
    }
  } catch (error) {
    companySearchStore.failSearch(
      cacheKey,
      error.response?.data?.detail ||
        "Failed to search company. Please try again.",
    );
    return null;
  }
};

const handleSearchCompany = async ({ companyName, role }) => {
  const cacheKey = buildCacheKey(companyName, role, vesselContext.value.imo);

  // If cached, show immediately
  const cached = companySearchStore.getCached(cacheKey);
  if (cached) {
    companySearchData.value = cached;
    activeCacheKey.value = cacheKey;
    return;
  }

  // If already pending, do nothing (search in progress)
  if (companySearchStore.pendingSearches.has(cacheKey)) return;

  // Fire background search (non-blocking)
  activeCacheKey.value = cacheKey;
  runCompanySearch(companyName, role, cacheKey).then((data) => {
    // If this panel is not currently open (user navigated away etc.), don't show
    if (activeCacheKey.value === cacheKey && data) {
      companySearchData.value = data;
    }
  });
};

const handleRefresh = async () => {
  if (!activeCacheKey.value || isRefreshing.value) return;
  const key = activeCacheKey.value;

  // Determine companyName and role from cache entry to re-run the search
  // We can re-derive them from the current companySearchData
  const companyName = companySearchData.value?.company_name;
  if (!companyName) return;

  // Invalidate cache so a fresh result is stored
  companySearchStore.invalidateCache(key);

  // Extract role from cache key: format is name__role__imo
  const parts = key.split("__");
  const roleForApi = parts.length >= 2 ? parts[1] : "";

  isRefreshing.value = true;
  try {
    companySearchStore.startSearch(key);
    const response = await searchCompany(
      companyName,
      roleForApi,
      vesselContext.value,
      userStore.persona || "general",
    );
    if (response.success) {
      companySearchStore.finishSearch(key, response.data);
      companySearchData.value = response.data;
    } else {
      companySearchStore.failSearch(
        key,
        response.message || "Failed to refresh company details",
      );
    }
  } catch (error) {
    companySearchStore.failSearch(
      key,
      error.response?.data?.detail || "Failed to refresh company details.",
    );
  } finally {
    isRefreshing.value = false;
  }
};

const closeCompanyResults = () => {
  companySearchData.value = null;
  activeCacheKey.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />

    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 text-slate-600 hover:text-brand-dark mb-6"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Search
      </button>

      <div v-if="vesselStore.isLoadingVessel" class="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>

      <ErrorMessage
        v-else-if="vesselStore.vesselError"
        :message="vesselStore.vesselError"
        @dismiss="vesselStore.vesselError = null"
      />

      <template v-else-if="vessel">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-brand-dark">{{ vessel.name }}</h1>
          <p class="mt-1 text-lg text-slate-600">{{ vessel.type }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VesselInfoCard title="Identity" :items="identityItems" />
          <VesselInfoCard title="Type & Status" :items="typeItems" />
          <VesselInfoCard title="Dimensions" :items="dimensionItems" />
          <VesselInfoCard title="Build" :items="buildItems" />
          <VesselInfoCard title="Registration" :items="registrationItems" />

          <OwnershipSection
            v-if="vessel.ownership"
            :ownership="vessel.ownership"
            :vessel-context="vesselContext"
            :pending-keys="[...companySearchStore.pendingSearches]"
            :cached-keys="Object.keys(companySearchStore.cache)"
            @search-company="handleSearchCompany"
          />
        </div>
      </template>
    </main>

    <CompanySearchResults
      v-if="companySearchData"
      :data="companySearchData"
      :persona-display="userStore.personaDisplay"
      :is-refreshing="isRefreshing"
      @close="closeCompanyResults"
      @refresh="handleRefresh"
    />
  </div>
</template>
