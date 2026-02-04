import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getUserProfile, updateUserProfile } from "../services/backendApi";

export const PERSONAS = {
  general: { id: "general", name: "General", priorities: [] },
  bunker_provider: {
    id: "bunker_provider",
    name: "Bunker Provider",
    priorities: ["Fuel procurement", "Bunkering", "Purchasing"],
  },
  charterer: {
    id: "charterer",
    name: "Charterer",
    priorities: ["Chartering", "Operations", "Commercial"],
  },
  ship_insurer: {
    id: "ship_insurer",
    name: "Ship Insurer / P&I Club",
    priorities: ["Claims", "Underwriting", "Risk"],
  },
  port_operator: {
    id: "port_operator",
    name: "Port Operator / Agent",
    priorities: ["Port operations", "Husbandry"],
  },
  commodity_trader: {
    id: "commodity_trader",
    name: "Commodity Trader",
    priorities: ["Trading desk", "Cargo", "Logistics"],
  },
  shipbroker: {
    id: "shipbroker",
    name: "Shipbroker",
    priorities: ["S&P", "Chartering"],
  },
  bank_financial: {
    id: "bank_financial",
    name: "Bank / Financial Markets",
    priorities: ["Treasury", "Ship finance", "Credit"],
  },
};

export const useUserStore = defineStore("user", () => {
  const persona = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const personaDisplay = computed(() => {
    if (!persona.value) return null;
    return PERSONAS[persona.value]?.name || persona.value;
  });

  const personaPriorities = computed(() => {
    if (!persona.value) return [];
    return PERSONAS[persona.value]?.priorities || [];
  });

  const needsPersonaSelection = computed(() => !persona.value);

  function initializeFromStorage() {
    const stored = localStorage.getItem("user_persona");
    if (stored) {
      persona.value = stored;
    }
  }

  async function fetchProfile(userId) {
    isLoading.value = true;
    error.value = null;

    try {
      const profile = await getUserProfile(userId);
      if (profile.persona) {
        persona.value = profile.persona;
        localStorage.setItem("user_persona", profile.persona);
      }
      return profile;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to load profile";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function setPersona(userId, newPersona) {
    isLoading.value = true;
    error.value = null;

    try {
      await updateUserProfile(userId, newPersona);
      persona.value = newPersona;
      localStorage.setItem("user_persona", newPersona);
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to update persona";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function clearPersona() {
    persona.value = null;
    localStorage.removeItem("user_persona");
  }

  initializeFromStorage();

  return {
    persona,
    isLoading,
    error,
    personaDisplay,
    personaPriorities,
    needsPersonaSelection,
    initializeFromStorage,
    fetchProfile,
    setPersona,
    clearPersona,
  };
});
