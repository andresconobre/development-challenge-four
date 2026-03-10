import { AppError } from '../errors/app.error.js'
import { patientsRepository } from '../repositories/patients.repository.js'
import type { PatientInput } from '../schemas/patients.schema.js'

export const patientsService = {
  list(page: number, limit: number, search = '') {
    return patientsRepository.findAllPaginated(page, limit, search)
  },

  getById(id: string) {
    const patient = patientsRepository.findById(id)

    if (!patient) {
      throw new AppError('Paciente não encontrado', 404)
    }

    return patient
  },

  create(data: PatientInput) {
    const existingPatient = patientsRepository.findByEmail(data.email)

    if (existingPatient) {
      throw new AppError('Ja existe paciente com este e-mail', 409)
    }

    return patientsRepository.create(data)
  },

  update(id: string, data: PatientInput) {
    const patient = patientsRepository.findById(id)

    if (!patient) {
      throw new AppError('Paciente não encontrado', 404)
    }

    const existingPatient = patientsRepository.findByEmail(data.email)

    if (existingPatient && existingPatient.id !== id) {
      throw new AppError('Ja existe paciente com este e-mail', 409)
    }

    return patientsRepository.update(id, data)
  },

  remove(id: string) {
    const patient = patientsRepository.findById(id)

    if (!patient) {
      throw new AppError('Paciente não encontrado', 404)
    }

    patientsRepository.delete(id)
  }
}
