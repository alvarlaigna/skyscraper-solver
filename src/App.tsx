import SkyscraperSolver from '@/components/SkyscraperSolver'
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt'

function App() {
  return (
    <>
      <main className="min-h-screen">
        <SkyscraperSolver />
      </main>
      <PWAUpdatePrompt />
    </>
  )
}

export default App
