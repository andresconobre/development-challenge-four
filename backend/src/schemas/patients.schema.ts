import { z } from 'zod'

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/
const cepRegex = /^\d{5}-?\d{3}$/

const addressSchema = z.object({
  cep: z
    .string()
    .trim()
    .regex(cepRegex, 'CEP inválido'),
  street: z.string().min(1, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro obrigatório'),
  city: z.string().min(1, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório')
})

export const createPatientSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  birthDate: z
    .string()
    .regex(isoDateRegex, 'Data de nascimento deve estar no formato YYYY-MM-DD')
    .refine((value) => {
      const parsedDate = new Date(`${value}T00:00:00.000Z`)
      return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(value)
    }, 'Data de nascimento inválida')
    .refine((value) => {
      const parsedDate = new Date(`${value}T00:00:00.000Z`)
      return parsedDate <= new Date()
    }, 'Data de nascimento não pode estar no futuro')
    .refine((value) => {
      const year = Number(value.slice(0, 4))
      return year >= 1900
    }, 'Data de nascimento deve ter ano maior ou igual a 1900'),
  email: z.string().email('E-mail inválido'),
  address: addressSchema
})

export const updatePatientSchema = createPatientSchema

export type PatientInput = z.infer<typeof createPatientSchema>
