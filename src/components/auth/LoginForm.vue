<script setup>
import { ref } from 'vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import ErrorMessage from '../common/ErrorMessage.vue'

const emit = defineEmits(['submit'])

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    await emit('submit', { username: username.value, password: password.value })
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}

defineExpose({ setError: (msg) => { error.value = msg }, setLoading: (val) => { isLoading.value = val } })
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <ErrorMessage
      v-if="error"
      :message="error"
      @dismiss="error = null"
    />

    <div>
      <label for="username" class="block text-sm font-medium text-slate-700">
        Email / Username
      </label>
      <input
        id="username"
        v-model="username"
        type="text"
        autocomplete="username"
        required
        :disabled="isLoading"
        class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-100 disabled:cursor-not-allowed"
        placeholder="you@example.com"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-slate-700">
        Password
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
        :disabled="isLoading"
        class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-100 disabled:cursor-not-allowed"
        placeholder="••••••••"
      />
    </div>

    <button
      type="submit"
      :disabled="isLoading"
      class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LoadingSpinner v-if="isLoading" size="sm" class="mr-2" />
      {{ isLoading ? 'Signing in...' : 'Sign in' }}
    </button>
  </form>
</template>
