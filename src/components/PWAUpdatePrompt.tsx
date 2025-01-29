import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { usePWA } from '@/hooks/usePWA'

export function PWAUpdatePrompt() {
  const { offlineReady, needRefresh, updateServiceWorker, closePrompt } = usePWA()

  if (!offlineReady && !needRefresh) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-4 rounded-lg bg-white p-4 shadow-lg"
      >
        <div className="flex flex-col">
          <p className="text-sm font-medium">
            {offlineReady
              ? 'App ready to work offline'
              : 'New version available'}
          </p>
          {needRefresh && (
            <p className="text-xs text-gray-500">
              Click the button to update to the latest version
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {needRefresh && (
            <Button onClick={() => updateServiceWorker()}>Update</Button>
          )}
          <Button variant="outline" onClick={() => closePrompt()}>
            Close
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 