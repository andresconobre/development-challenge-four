import axios from 'axios'

type ValidationIssues = {
  formErrors?: unknown[]
  fieldErrors?: Record<string, unknown>
}

type ValidationFieldError = {
  path?: string
  message?: string
}

type ErrorPayload = {
  message?: string
  issues?: ValidationIssues
  fieldErrors?: ValidationFieldError[]
}

function findFirstIssue(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const issue = findFirstIssue(item)

      if (issue) {
        return issue
      }
    }
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      const issue = findFirstIssue(item)

      if (issue) {
        return issue
      }
    }
  }

  return null
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<ErrorPayload>(error)) {
    const payload = error.response?.data
    const validationIssue =
      findFirstIssue(payload?.issues?.fieldErrors) ?? findFirstIssue(payload?.issues?.formErrors)

    return validationIssue ?? payload?.message ?? fallbackMessage
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

export function getFieldErrorMap(error: unknown) {
  if (!axios.isAxiosError<ErrorPayload>(error)) {
    return {}
  }

  const fieldErrors = error.response?.data?.fieldErrors ?? []

  return fieldErrors.reduce<Record<string, string>>((accumulator, fieldError) => {
    if (fieldError.path && fieldError.message) {
      accumulator[fieldError.path] = fieldError.message
    }

    return accumulator
  }, {})
}
