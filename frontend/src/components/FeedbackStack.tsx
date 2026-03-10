import { Alert, Slide, Snackbar, Stack, type SlideProps } from '@mui/material'
import { useEffect, useState } from 'react'

export type FeedbackItem = {
  id: number
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
}

type FeedbackStackProps = {
  items: FeedbackItem[]
  onClose: (id: number) => void
}

type ManagedFeedbackItem = FeedbackItem & {
  createdAt: number
  isOpen: boolean
}

const AUTO_HIDE_DURATION = 3500

function SlideLeftTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />
}

export function FeedbackStack({ items, onClose }: FeedbackStackProps) {
  const [managedItems, setManagedItems] = useState<ManagedFeedbackItem[]>([])
  const [pausedEntries, setPausedEntries] = useState<Record<number, number>>({})

  useEffect(() => {
    setManagedItems((current) => {
      const nextById = new Map(items.map((item) => [item.id, item]))
      const currentIds = new Set(current.map((item) => item.id))

      const updatedCurrent = current.map((item) => {
        const nextItem = nextById.get(item.id)

        if (nextItem) {
          return { ...item, ...nextItem, isOpen: true }
        }

        return { ...item, isOpen: false }
      })

      const newItems = items
        .filter((item) => !currentIds.has(item.id))
        .map((item) => ({ ...item, createdAt: Date.now(), isOpen: true }))

      return [...updatedCurrent, ...newItems]
    })
  }, [items])

  useEffect(() => {
    const timers = managedItems
      .filter((item) => item.isOpen)
      .map((item) => {
        const elapsed = pausedEntries[item.id] ?? Date.now() - item.createdAt
        const remaining = Math.max(AUTO_HIDE_DURATION - elapsed, 0)

        return window.setTimeout(() => {
          onClose(item.id)
        }, remaining)
      })

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [managedItems, onClose, pausedEntries])

  function pauseTimer(id: number) {
    setPausedEntries((current) => {
      if (id in current) {
        return current
      }

      const item = managedItems.find((entry) => entry.id === id)

      if (!item) {
        return current
      }

      return {
        ...current,
        [id]: Date.now() - item.createdAt,
      }
    })
  }

  function resumeTimer(id: number) {
    setManagedItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item
        }

        const elapsed = pausedEntries[id]

        if (elapsed === undefined) {
          return item
        }

        return {
          ...item,
          createdAt: Date.now() - elapsed,
        }
      }),
    )

    setPausedEntries((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  return (
    <Stack
      spacing={1.5}
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 1400,
        width: { xs: 'calc(100% - 32px)', sm: 420 },
        maxWidth: 'calc(100% - 32px)',
      }}
    >
      {managedItems.map((item) => (
        <Snackbar
          key={item.id}
          open={item.isOpen}
          TransitionComponent={SlideLeftTransition}
          TransitionProps={{
            onExited: () => {
              setManagedItems((current) => current.filter((entry) => entry.id !== item.id))
              setPausedEntries((current) => {
                const next = { ...current }
                delete next[item.id]
                return next
              })
            },
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={(_, reason) => {
            if (reason === 'clickaway') {
              return
            }

            onClose(item.id)
          }}
          onMouseEnter={() => pauseTimer(item.id)}
          onMouseLeave={() => resumeTimer(item.id)}
          sx={{ position: 'static', transform: 'none' }}
        >
          <Alert
            severity={item.severity}
            variant="filled"
            onClose={() => onClose(item.id)}
            sx={{ width: '100%', alignItems: 'center', borderRadius: 1.5 }}
          >
            {item.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  )
}
