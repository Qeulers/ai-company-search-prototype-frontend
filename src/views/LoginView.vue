<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import LoginForm from "../components/auth/LoginForm.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const userStore = useUserStore();
const loginFormRef = ref(null);

const sessionExpired = computed(() => route.query.expired === "1");

const handleLogin = async ({ username, password }) => {
  loginFormRef.value?.setLoading(true);
  loginFormRef.value?.setError(null);

  try {
    await authStore.login(username, password);

    try {
      await userStore.fetchProfile(authStore.userId);
    } catch {}

    router.push({ name: "search" });
  } catch (err) {
    loginFormRef.value?.setError(
      err.response?.data?.message ||
        "Login failed. Please check your credentials.",
    );
  } finally {
    loginFormRef.value?.setLoading(false);
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div
          v-if="sessionExpired"
          class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md"
        >
          <p class="text-sm text-amber-800">
            Your session has expired. Please sign in again.
          </p>
        </div>

        <div class="text-center mb-8">
          <img
            src="/PSG%20Logo.png"
            alt="Pole Star Global"
            class="mx-auto h-16 w-auto"
          />
          <h2 class="mt-4 text-2xl font-bold text-brand-dark">
            Company Details Search
          </h2>
          <p class="mt-2 text-sm text-slate-600">
            Sign in with your Pole Star credentials
          </p>
        </div>

        <LoginForm ref="loginFormRef" @submit="handleLogin" />

        <p class="mt-6 text-center text-xs text-slate-500">
          Pole Star Global - Maritime Intelligence
        </p>
      </div>
    </div>
  </div>
</template>
