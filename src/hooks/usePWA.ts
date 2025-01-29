import { useEffect, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

export function usePWA() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true)
      },
      onOfflineReady() {
        setOfflineReady(true)
      },
    })

    return () => {
      updateSW()
    }
  }, [])

  const updateServiceWorker = async () => {
    const updateSW = registerSW({
      onNeedRefresh() {},
      onOfflineReady() {},
    })
    await updateSW?.(true)
    setNeedRefresh(false)
  }

  const closePrompt = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    closePrompt,
  }
} 