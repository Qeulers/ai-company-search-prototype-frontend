import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { signin as apiSignin, logout as apiLogout } from '../services/polestarApi'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const refreshToken = ref(null)
  const userId = ref(null)
  const email = ref(null)
  const firstName = ref(null)
  const lastName = ref(null)
  const accountId = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value)
  const fullName = computed(() => {
    if (firstName.value && lastName.value) {
      return `${firstName.value} ${lastName.value}`
    }
    return email.value || ''
  })

  function initializeFromStorage() {
    accessToken.value = localStorage.getItem('polestar_access_token')
    refreshToken.value = localStorage.getItem('polestar_refresh_token')
    userId.value = localStorage.getItem('polestar_user_id')
    email.value = localStorage.getItem('polestar_email')
    firstName.value = localStorage.getItem('polestar_first_name')
    lastName.value = localStorage.getItem('polestar_last_name')
    accountId.value = localStorage.getItem('polestar_account_id')
  }

  async function login(username, password) {
    const data = await apiSignin(username, password)
    
    accessToken.value = data.access_token
    refreshToken.value = data.refresh_token
    userId.value = data.user_id
    email.value = data.email
    firstName.value = data.first_name
    lastName.value = data.last_name
    accountId.value = data.account_id
    
    return data
  }

  function logout() {
    apiLogout()
    accessToken.value = null
    refreshToken.value = null
    userId.value = null
    email.value = null
    firstName.value = null
    lastName.value = null
    accountId.value = null
  }

  return {
    accessToken,
    refreshToken,
    userId,
    email,
    firstName,
    lastName,
    accountId,
    isAuthenticated,
    fullName,
    initializeFromStorage,
    login,
    logout
  }
})
