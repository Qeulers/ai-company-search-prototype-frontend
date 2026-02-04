<script setup>
import { RouterView, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { onMounted, onUnmounted } from "vue";
import { onAuthEvent } from "./services/polestarApi";

const authStore = useAuthStore();
const router = useRouter();

let unsubscribeAuthEvent = null;

onMounted(() => {
  authStore.initializeFromStorage();

  unsubscribeAuthEvent = onAuthEvent((event) => {
    if (event.type === "session_expired") {
      authStore.logout();
      router.push({ name: "login", query: { expired: "1" } });
    } else if (event.type === "token_refreshed") {
      authStore.initializeFromStorage();
    }
  });
});

onUnmounted(() => {
  if (unsubscribeAuthEvent) {
    unsubscribeAuthEvent();
  }
});
</script>

<template>
  <RouterView />
</template>
