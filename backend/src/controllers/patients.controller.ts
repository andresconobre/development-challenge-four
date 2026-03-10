import type { Request, Response, NextFunction } from 'express'
import { createPatientSchema, updatePatientSchema } from '../schemas/patients.schema.js'
import { patientsService } from '../services/patients.service.js'

type PatientParams = {
  id: string
}

export const patientsController = {
  list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page ?? 1)
      const limit = Number(req.query.limit ?? 10)
      const search = typeof req.query.search === 'string' ? req.query.search : ''

      const result = patientsService.list(page, limit, search)

      res.json(result)
    } catch (error) {
      next(error)
    }
  },

  getById(req: Request<PatientParams>, res: Response, next: NextFunction) {
    try {
      const patient = patientsService.getById(req.params.id)
      res.json(patient)
    } catch (error) {
      next(error)
    }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createPatientSchema.parse(req.body)
      const patient = patientsService.create(data)
      res.status(201).json(patient)
    } catch (error) {
      next(error)
    }
  },

  update(req: Request<PatientParams>, res: Response, next: NextFunction) {
    try {
      const data = updatePatientSchema.parse(req.body)
      const patient = patientsService.update(req.params.id, data)
      res.json(patient)
    } catch (error) {
      next(error)
    }
  },

  remove(req: Request<PatientParams>, res: Response, next: NextFunction) {
    try {
      patientsService.remove(req.params.id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
