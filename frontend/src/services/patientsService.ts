import { api } from './api'
import type { PaginatedPatientsResponse, Patient, PatientPayload } from '../types/patient'

const CACHE_TTL_IN_MS = 2 * 60 * 1000
const LIST_CACHE_PREFIX = 'patients:list:'
const DETAIL_CACHE_PREFIX = 'patients:detail:'

type CacheEntry<T> = {
  data: T
  expiresAt: number
}

function isBrowserEnvironment() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function getCacheKey(prefix: string, identifier: string) {
  return `${prefix}${identifier}`
}

function readCache<T>(key: string) {
  if (!isBrowserEnvironment()) {
    return null
  }

  const rawValue = window.sessionStorage.getItem(key)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as CacheEntry<T>

    if (parsedValue.expiresAt <= Date.now()) {
      window.sessionStorage.removeItem(key)
      return null
    }

    return parsedValue.data
  } catch {
    window.sessionStorage.removeItem(key)
    return null
  }
}

function writeCache<T>(key: string, data: T) {
  if (!isBrowserEnvironment()) {
    return
  }

  const cacheEntry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + CACHE_TTL_IN_MS,
  }

  window.sessionStorage.setItem(key, JSON.stringify(cacheEntry))
}

function clearPatientsListCache() {
  if (!isBrowserEnvironment()) {
    return
  }

  const keysToRemove: string[] = []

  for (let index = 0; index < window.sessionStorage.length; index += 1) {
    const key = window.sessionStorage.key(index)

    if (key?.startsWith(LIST_CACHE_PREFIX)) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach((key) => window.sessionStorage.removeItem(key))
}

function invalidatePatientCache(id?: string) {
  clearPatientsListCache()

  if (!id || !isBrowserEnvironment()) {
    return
  }

  window.sessionStorage.removeItem(getCacheKey(DETAIL_CACHE_PREFIX, id))
}

export const patientsService = {
  async getAll(page = 1, limit = 10, search = ''): Promise<PaginatedPatientsResponse> {
    const cacheKey = getCacheKey(
      LIST_CACHE_PREFIX,
      JSON.stringify({
        page,
        limit,
        search: search.trim().toLowerCase(),
      }),
    )
    const cachedResponse = readCache<PaginatedPatientsResponse>(cacheKey)

    if (cachedResponse) {
      return cachedResponse
    }

    const response = await api.get<PaginatedPatientsResponse>('/patients', {
      params: { page, limit, search },
    })

    const normalizedResponse = {
      items: Array.isArray(response.data?.items) ? response.data.items : [],
      total: Number(response.data?.total ?? 0),
      page: Number(response.data?.page ?? page),
      limit: Number(response.data?.limit ?? limit),
      totalPages: Number(response.data?.totalPages ?? 0),
    }

    writeCache(cacheKey, normalizedResponse)

    return normalizedResponse
  },

  async getById(id: string) {
    const cacheKey = getCacheKey(DETAIL_CACHE_PREFIX, id)
    const cachedPatient = readCache<Patient>(cacheKey)

    if (cachedPatient) {
      return cachedPatient
    }

    const response = await api.get<Patient>(`/patients/${id}`)
    writeCache(cacheKey, response.data)
    return response.data
  },

  async create(data: PatientPayload) {
    const response = await api.post<Patient>('/patients', data)
    invalidatePatientCache()
    writeCache(getCacheKey(DETAIL_CACHE_PREFIX, response.data.id), response.data)
    return response.data
  },

  async update(id: string, data: PatientPayload) {
    const response = await api.put<Patient>(`/patients/${id}`, data)
    invalidatePatientCache(id)
    writeCache(getCacheKey(DETAIL_CACHE_PREFIX, response.data.id), response.data)
    return response.data
  },

  async remove(id: string) {
    await api.delete(`/patients/${id}`)
    invalidatePatientCache(id)
  },
}
