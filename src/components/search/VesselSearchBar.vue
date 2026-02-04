<script setup>
import { ref } from "vue";

const emit = defineEmits(["search"]);

const searchQuery = ref("");
const searchType = ref("name_contains");

const searchOptions = [
  { value: "name_contains", label: "Vessel Name" },
  { value: "imo", label: "IMO Number" },
  { value: "mmsi", label: "MMSI" },
];

const handleSubmit = () => {
  const query = searchQuery.value.trim();
  if (query) {
    emit("search", { query, searchType: searchType.value });
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full">
    <div class="flex gap-3">
      <select
        v-model="searchType"
        class="px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-brand-dark bg-white"
      >
        <option
          v-for="option in searchOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="flex-1 relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-slate-400"
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
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Enter search value..."
          class="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-brand-dark placeholder-slate-400"
        />
      </div>
      <button
        type="submit"
        class="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
      >
        Search
      </button>
    </div>
  </form>
</template>
