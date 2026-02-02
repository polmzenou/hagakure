import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react'
import './Toast.css'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, TOAST_DURATION_MS)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <span className="toast-icon">✓</span>}
            {toast.type === 'error' && <span className="toast-icon">!</span>}
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const noopToast = { showToast: (_message: string, _type?: 'success' | 'error') => {} }

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  return ctx ?? noopToast
}
