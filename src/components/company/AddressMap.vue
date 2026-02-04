<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
});

const mapContainer = ref(null);
const mapInstance = ref(null);
const isLoading = ref(true);
const hasError = ref(false);
const coordinates = ref(null);

const geocodeAddress = async (address) => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          "User-Agent": "CompanyDetailsSearch/1.0",
        },
      },
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const initMap = async () => {
  if (!props.address) return;

  isLoading.value = true;
  hasError.value = false;

  const coords = await geocodeAddress(props.address);
  if (!coords) {
    hasError.value = true;
    isLoading.value = false;
    return;
  }

  coordinates.value = coords;
  isLoading.value = false;

  await nextTick();

  if (!mapContainer.value) return;

  if (mapInstance.value) {
    mapInstance.value.remove();
  }

  mapInstance.value = L.map(mapContainer.value).setView(
    [coords.lat, coords.lng],
    15,
  );

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    },
  ).addTo(mapInstance.value);

  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1E3A5F" width="32" height="32">
      <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
    </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  L.marker([coords.lat, coords.lng], { icon: markerIcon }).addTo(
    mapInstance.value,
  );
};

onMounted(() => {
  initMap();
});

watch(
  () => props.address,
  () => {
    initMap();
  },
);
</script>

<template>
  <div class="mt-3">
    <div
      v-if="isLoading && !hasError"
      class="h-40 bg-slate-100 rounded-lg flex items-center justify-center"
    >
      <div class="flex items-center gap-2 text-slate-500 text-sm">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading map...
      </div>
    </div>
    <div
      v-show="!isLoading && !hasError"
      ref="mapContainer"
      class="h-40 rounded-lg overflow-hidden border border-slate-200"
    ></div>
  </div>
</template>

<style>
.custom-marker {
  background: transparent;
  border: none;
}
</style>
