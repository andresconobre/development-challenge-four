export type Address = {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export type Patient = {
  id: string
  name: string
  birthDate: string
  email: string
  address: Address
  createdAt: string
  updatedAt: string
}

export type PaginatedPatientsResponse = {
  items: Patient[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PatientPayload = {
  name: string
  birthDate: string
  email: string
  address: Address
}