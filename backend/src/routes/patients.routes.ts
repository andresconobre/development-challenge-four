import { Router } from 'express'
import { patientsController } from '../controllers/patients.controller.js'

export const patientsRoutes = Router()

patientsRoutes.get('/', patientsController.list)
patientsRoutes.get('/:id', patientsController.getById)
patientsRoutes.post('/', patientsController.create)
patientsRoutes.put('/:id', patientsController.update)
patientsRoutes.delete('/:id', patientsController.remove)