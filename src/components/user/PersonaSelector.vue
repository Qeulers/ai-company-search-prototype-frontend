<script setup>
import { ref } from "vue";
import { PERSONAS } from "../../stores/user";
import LoadingSpinner from "../common/LoadingSpinner.vue";

const emit = defineEmits(["select", "close"]);

const selectedPersona = ref(null);
const isLoading = ref(false);

const personaList = Object.values(PERSONAS);

const handleSelect = async () => {
  if (!selectedPersona.value) return;

  isLoading.value = true;
  try {
    await emit("select", selectedPersona.value);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6 border-b border-slate-200">
        <h2 class="text-xl font-semibold text-brand-dark">Select Your Role</h2>
        <p class="mt-1 text-sm text-slate-600">
          This helps us prioritise the most relevant contact information for
          you.
        </p>
      </div>

      <div class="p-6 space-y-3">
        <label
          v-for="persona in personaList"
          :key="persona.id"
          class="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all"
          :class="
            selectedPersona === persona.id
              ? 'border-primary bg-primary-50'
              : 'border-slate-200 hover:border-slate-300'
          "
        >
          <input
            type="radio"
            :value="persona.id"
            v-model="selectedPersona"
            class="mt-1 h-4 w-4 text-primary focus:ring-primary border-slate-300"
          />
          <div>
            <span class="font-medium text-brand-dark">{{ persona.name }}</span>
            <p class="text-sm text-slate-500 mt-0.5">
              {{
                persona.priorities.length > 0
                  ? `Priority: ${persona.priorities.join(", ")}`
                  : "No specific contact prioritisation"
              }}
            </p>
          </div>
        </label>
      </div>

      <div class="p-6 border-t border-slate-200 flex justify-end gap-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Skip for now
        </button>
        <button
          @click="handleSelect"
          :disabled="!selectedPersona || isLoading"
          class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <LoadingSpinner v-if="isLoading" size="sm" />
          Continue
        </button>
      </div>
    </div>
  </div>
</template>
