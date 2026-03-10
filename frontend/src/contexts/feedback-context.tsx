import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { FeedbackStack, type FeedbackItem } from '../components/FeedbackStack'

type FeedbackContextValue = {
  pushFeedback: (message: string, severity: FeedbackItem['severity']) => void
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([])

  function pushFeedback(message: string, severity: FeedbackItem['severity']) {
    setItems((current) => [
      ...current,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        message,
        severity,
      },
    ])
  }

  function removeFeedback(id: number) {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const value = useMemo(() => ({ pushFeedback }), [])

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <FeedbackStack items={items} onClose={removeFeedback} />
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)

  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider')
  }

  return context
}
