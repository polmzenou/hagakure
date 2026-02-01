const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export interface ApiError {
  message: string
  status: number
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    username: string
  }
}

export interface TimelineEvent {
  id: number
  year: number
  date: string
  title: string
  type: string
  description: string
  battle_id?: number
}

// Fonction utilitaire pour gérer les requêtes API
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const token = localStorage.getItem('token')
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      let errorDetails = null
      
      try {
        const errorData = await response.json()
        if (errorData.message) {
          errorMessage = errorData.message
        }
        if (errorData.error) {
          errorMessage = errorData.error
        }
        errorDetails = errorData
      } catch {
        try {
          const errorText = await response.text()
          if (errorText) {
            console.error('Error response text:', errorText)
          }
        } catch {
          // Ignorer si on ne peut pas lire le texte
        }
      }

      console.error('API Error Details:', errorDetails)

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      }
      throw error
    }

    // Gérer les réponses vides
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      // API Platform retourne les données dans 'hydra:member' pour les collections
      if (data['hydra:member']) {
        return data['hydra:member'] as T
      }
      return data as T
    }

    return {} as T
  } catch (error) {
    if (error instanceof Error) {
      throw { message: error.message, status: 0 } as ApiError
    }
    throw error
  }
}

// API Samourai
export const samouraiApi = {
  getAll: () => apiRequest<any[]>('/samourais'),
  getOne: (id: string | number) => apiRequest<any>(`/samourais/${id}`),
  create: (data: unknown) => apiRequest<any>('/samourais', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string | number, data: unknown) =>
    apiRequest<any>(`/samourais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiRequest<void>(`/samourais/${id}`, { method: 'DELETE' }),
}

// API Clan
export const clanApi = {
  getAll: () => apiRequest<any[]>('/clans'),
  getOne: (id: string | number) => apiRequest<any>(`/clans/${id}`),
  create: (data: unknown) => apiRequest<any>('/clans', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string | number, data: unknown) =>
    apiRequest<any>(`/clans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiRequest<void>(`/clans/${id}`, { method: 'DELETE' }),
}

// API Bataille
export const battleApi = {
  getAll: () => apiRequest<any[]>('/battles'),
  getOne: (id: string | number) => apiRequest<any>(`/battles/${id}`),
  create: (data: unknown) => apiRequest<any>('/battles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string | number, data: unknown) =>
    apiRequest<any>(`/battles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiRequest<void>(`/battles/${id}`, { method: 'DELETE' }),
}

// API Arme
export const weaponApi = {
  getAll: () => apiRequest<any[]>('/weapons'),
  getOne: (id: string | number) => apiRequest<any>(`/weapons/${id}`),
  create: (data: unknown) => apiRequest<any>('/weapons', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string | number, data: unknown) =>
    apiRequest<any>(`/weapons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiRequest<void>(`/weapons/${id}`, { method: 'DELETE' }),
}

// API Style
export const styleApi = {
  getAll: () => apiRequest<any[]>('/styles'),
  getOne: (id: string | number) => apiRequest<any>(`/styles/${id}`),
  create: (data: unknown) => apiRequest<any>('/styles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string | number, data: unknown) =>
    apiRequest<any>(`/styles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiRequest<void>(`/styles/${id}`, { method: 'DELETE' }),
}

// API Authentification
export const authApi = {
  login: (data: LoginData) => apiRequest<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  register: (data: RegisterData) => apiRequest<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token')
}

// API Localisation
export const locationApi = {
  getAll: () => apiRequest<any[]>('/locations'),
  getOne: (id: string | number) => apiRequest<any>(`/locations/${id}`),
  create: (data: unknown) => apiRequest<any>('/locations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string | number, data: unknown) =>
    apiRequest<any>(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiRequest<void>(`/locations/${id}`, { method: 'DELETE' }),
}

// Timeline API
export const timelineApi = {
  getAll: () => apiRequest<TimelineEvent[]>('/timeline'),
  getOne: (id: string | number) => apiRequest<TimelineEvent>(`/timeline/${id}`),
}

// Profile API
export interface ProfileData {
  id: number
  email: string
  username: string
  roles: string[]
}

export interface UpdateProfileData {
  email: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export const profileApi = {
  get: () => apiRequest<ProfileData>('/profile'),
  update: (data: UpdateProfileData) => apiRequest<ProfileData & { message?: string }>('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  changePassword: (data: ChangePasswordData) => apiRequest<{ message: string }>('/profile/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

// Favorite API
export interface FavoriteEntity {
  id: number
  name: string
  type: 'samourai' | 'clan' | 'weapon' | 'style' | 'battle' | 'timeline'
  url: string
  year?: number
  date?: string
  description?: string
  event_type?: string
  image?: string
}

export interface Favorite {
  id: number
  entity: FavoriteEntity
  created_at: string
}

export interface ToggleFavoriteData {
  entity_type: string
  entity_id: number
}

export interface CheckFavoriteData {
  entity_type: string
  entity_id: number
}

export const favoriteApi = {
  getAll: () => apiRequest<Favorite[]>('/favorites'),
  toggle: (data: ToggleFavoriteData) => apiRequest<{ message: string; is_favorite: boolean; favorite_id?: number }>('/favorites/toggle', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  check: (data: CheckFavoriteData) => apiRequest<{ is_favorite: boolean; favorite_id?: number }>('/favorites/check', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/favorites/${id}`, {
    method: 'DELETE',
  }),
}