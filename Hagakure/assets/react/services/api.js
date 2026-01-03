import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const samouraiApi = {
  getAll: () => api.get('/samourais').then(res => res.data),
  getOne: (id) => api.get(`/samourais/${id}`).then(res => res.data),
  create: (data) => api.post('/samourais', data).then(res => res.data),
  update: (id, data) => api.put(`/samourais/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/samourais/${id}`).then(res => res.data)
}

export const clanApi = {
  getAll: () => api.get('/clans').then(res => res.data),
  getOne: (id) => api.get(`/clans/${id}`).then(res => res.data),
  create: (data) => api.post('/clans', data).then(res => res.data),
  update: (id, data) => api.put(`/clans/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/clans/${id}`).then(res => res.data)
}

export const battleApi = {
  getAll: () => api.get('/battles').then(res => res.data),
  getOne: (id) => api.get(`/battles/${id}`).then(res => res.data),
  create: (data) => api.post('/battles', data).then(res => res.data),
  update: (id, data) => api.put(`/battles/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/battles/${id}`).then(res => res.data)
}

export const weaponApi = {
  getAll: () => api.get('/weapons').then(res => res.data),
  getOne: (id) => api.get(`/weapons/${id}`).then(res => res.data),
  create: (data) => api.post('/weapons', data).then(res => res.data),
  update: (id, data) => api.put(`/weapons/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/weapons/${id}`).then(res => res.data)
}

export const styleApi = {
  getAll: () => api.get('/styles').then(res => res.data),
  getOne: (id) => api.get(`/styles/${id}`).then(res => res.data),
  create: (data) => api.post('/styles', data).then(res => res.data),
  update: (id, data) => api.put(`/styles/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/styles/${id}`).then(res => res.data)
}

export const locationApi = {
  getAll: () => api.get('/locations').then(res => res.data),
  getOne: (id) => api.get(`/locations/${id}`).then(res => res.data),
  create: (data) => api.post('/locations', data).then(res => res.data),
  update: (id, data) => api.put(`/locations/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/locations/${id}`).then(res => res.data)
}

export const statsApi = {
  getStats: async () => {
    const [samourais, clans, battles, weapons] = await Promise.all([
      api.get('/samourais').then(res => res.data),
      api.get('/clans').then(res => res.data),
      api.get('/battles').then(res => res.data),
      api.get('/weapons').then(res => res.data)
    ])
    return {
      samourais: samourais.length,
      clans: clans.length,
      battles: battles.length,
      weapons: weapons.length
    }
  }
}

export default api
