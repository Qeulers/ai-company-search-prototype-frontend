<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useUserStore } from "../../stores/user";
import UserProfileBadge from "../user/UserProfileBadge.vue";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const showDropdown = ref(false);

const handleLogout = () => {
  authStore.logout();
  userStore.clearPersona();
  router.push({ name: "login" });
};

const navigateToSettings = () => {
  showDropdown.value = false;
  router.push({ name: "settings" });
};

const navigateToSearch = () => {
  router.push({ name: "search" });
};
</script>

<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div
          class="flex items-center gap-3 cursor-pointer"
          @click="navigateToSearch"
        >
          <img
            src="/PSG%20Logo%20No%20Text.png"
            alt="Pole Star Global"
            class="h-10 w-10"
          />
          <div>
            <h1 class="text-lg font-semibold text-brand-dark">
              Company Details Search
            </h1>
            <p class="text-xs text-slate-500 hidden sm:block">
              Pole Star Global
            </p>
          </div>
        </div>

        <div class="relative">
          <button
            @click="showDropdown = !showDropdown"
            class="flex items-center gap-2 hover:bg-slate-50 rounded-lg p-2 transition-colors"
          >
            <UserProfileBadge />
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
            @click.stop
          >
            <button
              @click="navigateToSettings"
              class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Settings
            </button>
            <hr class="my-1 border-slate-200" />
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div
    v-if="showDropdown"
    class="fixed inset-0 z-40"
    @click="showDropdown = false"
  />
</template>
