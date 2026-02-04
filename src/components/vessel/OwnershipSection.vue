<script setup>
import { computed } from "vue";

const props = defineProps({
  ownership: {
    type: Object,
    required: true,
  },
  vesselContext: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["search-company"]);

const ownershipRoles = [
  { key: "operator", label: "Operator" },
  { key: "registered_owner", label: "Registered Owner" },
  { key: "technical_manager", label: "Technical Manager" },
  { key: "ship_manager", label: "Ship Manager" },
  { key: "group_beneficial_owner", label: "Group Beneficial Owner" },
  { key: "doc_company", label: "DOC Company" },
];

const ownershipItems = computed(() => {
  const seen = new Set();
  return ownershipRoles
    .filter((role) => props.ownership[role.key])
    .map((role) => {
      const companyName = props.ownership[role.key];
      const isDuplicate = seen.has(companyName);
      seen.add(companyName);
      return {
        ...role,
        companyName,
        isDuplicate,
      };
    });
});

const handleSearchCompany = (companyName, role) => {
  emit("search-company", { companyName, role });
};
</script>

<template>
  <div class="bg-white rounded-lg border border-slate-200 p-5">
    <h3
      class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4"
    >
      Ownership
    </h3>

    <div v-if="ownershipItems.length === 0" class="text-sm text-slate-500">
      No ownership information available
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in ownershipItems"
        :key="item.key"
        class="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0"
      >
        <div class="min-w-0 flex-1">
          <p class="text-xs text-slate-500">{{ item.label }}</p>
          <p class="text-sm font-medium text-brand-dark truncate">
            {{ item.companyName }}
          </p>
        </div>
        <button
          @click="handleSearchCompany(item.companyName, item.label)"
          class="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
          :title="`View ${item.companyName} details`"
        >
          <svg
            class="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.813 15.904L9 18l-.813-2.096a4.5 4.5 0 00-2.408-2.408L3.683 12l2.096-.813a4.5 4.5 0 002.408-2.408L9 6.683l.813 2.096a4.5 4.5 0 002.408 2.408L14.317 12l-2.096.813a4.5 4.5 0 00-2.408 2.408zM18.257 7.962L18 9l-.257-1.038a2.25 2.25 0 00-1.205-1.205L15.5 6.5l1.038-.257a2.25 2.25 0 001.205-1.205L18 4l.257 1.038a2.25 2.25 0 001.205 1.205L20.5 6.5l-1.038.257a2.25 2.25 0 00-1.205 1.205z"
            />
          </svg>
          Details
        </button>
      </div>
    </div>
  </div>
</template>
