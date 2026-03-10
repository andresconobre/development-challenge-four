import express from 'express'
import cors from 'cors'
import { patientsRoutes } from './routes/patients.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/patients', patientsRoutes)

app.use(errorMiddleware)
