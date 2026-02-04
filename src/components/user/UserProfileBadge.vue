<script setup>
import { useAuthStore } from '../../stores/auth'
import { useUserStore } from '../../stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="text-right hidden sm:block">
      <p class="text-sm font-medium text-slate-700">{{ authStore.fullName }}</p>
      <p v-if="userStore.personaDisplay" class="text-xs text-slate-500">{{ userStore.personaDisplay }}</p>
    </div>
    <div class="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
      {{ authStore.firstName?.charAt(0) || authStore.email?.charAt(0) || 'U' }}
    </div>
  </div>
</template>
