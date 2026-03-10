import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import type { FeedbackItem } from '../components/FeedbackStack'
import { FeedbackProvider, useFeedback } from '../contexts/feedback-context'

function AppLayoutContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { pushFeedback } = useFeedback()
  const consumedNavigationFeedback = useRef<number | null>(null)

  useEffect(() => {
    const navigationFeedback = location.state?.feedback as
      | { id: number; message: string; severity: FeedbackItem['severity'] }
      | undefined

    if (!navigationFeedback) {
      return
    }

    if (consumedNavigationFeedback.current === navigationFeedback.id) {
      return
    }

    consumedNavigationFeedback.current = navigationFeedback.id
    pushFeedback(navigationFeedback.message, navigationFeedback.severity)
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate, pushFeedback])

  return <Outlet />
}

export function AppLayout() {
  return (
    <FeedbackProvider>
      <AppLayoutContent />
    </FeedbackProvider>
  )
}
