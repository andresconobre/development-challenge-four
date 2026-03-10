import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/app.error.js'

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Erro de validação',
      issues: error.flatten(),
      fieldErrors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  if (error instanceof Error) {
    return res.status(500).json({
      message: error.message
    })
  }

  return res.status(500).json({
    message: 'Erro interno do servidor'
  })
}
