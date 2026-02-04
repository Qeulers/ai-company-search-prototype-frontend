import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const backendApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export const searchCompany = async (companyName, ownershipRole, vesselContext, userPersona) => {
  const response = await backendApi.post('/api/company-search', {
    company_name: companyName,
    ownership_role: ownershipRole,
    vessel_context: vesselContext,
    user_persona: userPersona
  })
  return response.data
}

export const getUserProfile = async (userId) => {
  const response = await backendApi.get(`/api/user-profile/${userId}`)
  return response.data
}

export const updateUserProfile = async (userId, persona) => {
  const response = await backendApi.put(`/api/user-profile/${userId}`, {
    persona
  })
  return response.data
}

export default backendApi
