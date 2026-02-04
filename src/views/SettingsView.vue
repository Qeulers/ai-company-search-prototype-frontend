<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useUserStore, PERSONAS } from "../stores/user";
import AppHeader from "../components/layout/AppHeader.vue";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";

const authStore = useAuthStore();
const userStore = useUserStore();

const selectedPersona = ref(userStore.persona);
const isSaving = ref(false);
const saveSuccess = ref(false);
const error = ref(null);

const personaList = Object.values(PERSONAS);

const handleSave = async () => {
  if (!selectedPersona.value || selectedPersona.value === userStore.persona)
    return;

  isSaving.value = true;
  error.value = null;
  saveSuccess.value = false;

  try {
    await userStore.setPersona(authStore.userId, selectedPersona.value);
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to save settings";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />

    <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-bold text-brand-dark mb-8">Settings</h1>

      <div class="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-brand-dark mb-1">Account</h2>
        <p class="text-sm text-slate-500 mb-4">
          Your Pole Star account information
        </p>

        <dl class="space-y-3">
          <div class="flex justify-between">
            <dt class="text-sm text-slate-600">Name</dt>
            <dd class="text-sm font-medium text-brand-dark">
              {{ authStore.fullName }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-slate-600">Email</dt>
            <dd class="text-sm font-medium text-brand-dark">
              {{ authStore.email }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-slate-600">User ID</dt>
            <dd class="text-sm font-mono text-slate-500">
              {{ authStore.userId }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-brand-dark mb-1">Your Role</h2>
        <p class="text-sm text-slate-500 mb-4">
          Select your role to prioritise relevant contact information in search
          results
        </p>

        <ErrorMessage
          v-if="error"
          :message="error"
          @dismiss="error = null"
          class="mb-4"
        />

        <div
          v-if="saveSuccess"
          class="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700"
        >
          Settings saved successfully
        </div>

        <div class="space-y-3 mb-6">
          <label
            v-for="persona in personaList"
            :key="persona.id"
            class="flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all"
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
              class="mt-0.5 h-4 w-4 text-primary focus:ring-primary border-slate-300"
            />
            <div>
              <span class="font-medium text-brand-dark">{{
                persona.name
              }}</span>
              <p class="text-xs text-slate-500 mt-0.5">
                {{
                  persona.priorities.length > 0
                    ? `Priority: ${persona.priorities.join(", ")}`
                    : "No specific contact prioritisation"
                }}
              </p>
            </div>
          </label>
        </div>

        <button
          @click="handleSave"
          :disabled="isSaving || selectedPersona === userStore.persona"
          class="w-full sm:w-auto px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <LoadingSpinner v-if="isSaving" size="sm" />
          {{ isSaving ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </main>
  </div>
</template>
