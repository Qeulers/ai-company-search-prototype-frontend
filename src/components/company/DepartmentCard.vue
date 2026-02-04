<script setup>
defineProps({
  department: {
    type: Object,
    required: true,
  },
  highlighted: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    :class="
      highlighted
        ? 'bg-white border-primary-300'
        : 'bg-slate-50 border-slate-200'
    "
    class="rounded-lg border p-3"
  >
    <h5 class="font-medium text-brand-dark">{{ department.name }}</h5>
    <p
      v-if="department.relevance_to_maritime"
      class="text-xs text-slate-500 mt-0.5"
    >
      {{ department.relevance_to_maritime }}
    </p>
    <div class="mt-2 space-y-1">
      <div v-if="department.phone" class="flex items-center gap-2 text-sm">
        <svg
          class="h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        <span class="text-slate-700">{{ department.phone }}</span>
      </div>
      <div v-if="department.email" class="flex items-center gap-2 text-sm">
        <svg
          class="h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <a
          :href="`mailto:${department.email}`"
          class="text-primary hover:underline"
        >
          {{ department.email }}
        </a>
      </div>
    </div>
  </div>
</template>
