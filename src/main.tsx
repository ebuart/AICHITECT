import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/router'
import { ProgressProvider } from '@/features/progress/ProgressContext'
import { initTheme } from '@/lib/useTheme'
import { initLocale } from '@/lib/i18n'
import './index.css'

initTheme() // apply persisted dark/light theme before first paint
initLocale() // apply persisted app language (html lang) before first paint

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  </StrictMode>,
)
