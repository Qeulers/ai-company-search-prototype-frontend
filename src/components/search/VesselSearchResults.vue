<script setup>
import { useRouter } from "vue-router";
import { getFlagCode } from "../../utils/countryFlags";

defineProps({
  vessels: {
    type: Array,
    required: true,
  },
  meta: {
    type: Object,
    default: null,
  },
});

const router = useRouter();

const navigateToVessel = (imo) => {
  router.push({ name: "vessel-detail", params: { imo } });
};
</script>

<template>
  <div class="space-y-4">
    <div v-if="meta" class="text-sm text-slate-600">
      Showing {{ vessels.length }} of {{ meta.total_count }} results
    </div>

    <div v-if="vessels.length === 0" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="mt-4 text-slate-600">No vessels found</p>
      <p class="mt-1 text-sm text-slate-500">Try adjusting your search terms</p>
    </div>

    <div v-else class="grid gap-3">
      <div
        v-for="vessel in vessels"
        :key="vessel.asset_id"
        @click="navigateToVessel(vessel.imo)"
        class="bg-white rounded-lg border border-slate-200 p-4 hover:border-primary hover:shadow-md cursor-pointer transition-all"
      >
        <div class="flex items-start gap-4">
          <span
            v-if="getFlagCode(vessel.flag_code)"
            :class="`fi fi-${getFlagCode(vessel.flag_code)}`"
            class="flex-shrink-0 !w-9 !h-6 rounded shadow-sm"
          ></span>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-brand-dark truncate">
              {{ vessel.name }}
            </h3>
            <p class="text-sm text-slate-600 mt-0.5">
              {{ vessel.vessel_type }}
            </p>
            <div class="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
              <span
                ><strong class="text-slate-700">IMO:</strong>
                {{ vessel.imo }}</span
              >
              <span
                ><strong class="text-slate-700">MMSI:</strong>
                {{ vessel.mmsi }}</span
              >
              <span v-if="vessel.callsign"
                ><strong class="text-slate-700">Callsign:</strong>
                {{ vessel.callsign }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
