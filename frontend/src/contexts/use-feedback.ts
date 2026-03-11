import { createContext, useContext } from 'react'
import type { FeedbackItem } from '../components/FeedbackStack'

export type FeedbackContextValue = {
  pushFeedback: (message: string, severity: FeedbackItem['severity']) => void
}

export const FeedbackContext = createContext<FeedbackContextValue | null>(null)

export function useFeedback() {
  const context = useContext(FeedbackContext)

  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider')
  }

  return context
}
