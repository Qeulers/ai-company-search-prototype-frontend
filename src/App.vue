<script setup>
import { RouterView, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { onMounted, onUnmounted } from "vue";
import { onAuthEvent, validateSession } from "./services/polestarApi";
import ToastContainer from "./components/common/ToastContainer.vue";

const authStore = useAuthStore();
const router = useRouter();

let unsubscribeAuthEvent = null;

onMounted(async () => {
  authStore.initializeFromStorage();

  unsubscribeAuthEvent = onAuthEvent((event) => {
    if (event.type === "session_expired") {
      authStore.logout();
      router.push({ name: "login", query: { expired: "1" } });
    } else if (event.type === "token_refreshed") {
      authStore.initializeFromStorage();
    }
  });

  if (authStore.isAuthenticated) {
    await validateSession();
  }
});

onUnmounted(() => {
  if (unsubscribeAuthEvent) {
    unsubscribeAuthEvent();
  }
});
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>
