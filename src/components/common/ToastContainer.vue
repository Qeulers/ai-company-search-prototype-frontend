<script setup>
import { useCompanySearchStore } from '../../stores/companySearch'

const store = useCompanySearchStore()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="toast in store.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm w-full"
        :class="toast.type === 'success' ? 'bg-white border border-green-200' : 'bg-white border border-red-200'"
      >
        <div class="flex-shrink-0 mt-0.5">
          <svg
            v-if="toast.type === 'success'"
            class="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg
            v-else
            class="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="flex-1 text-sm text-slate-700">{{ toast.message }}</p>
        <button
          @click="store.removeToast(toast.id)"
          class="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
