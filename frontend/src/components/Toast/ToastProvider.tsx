import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import styles from './toast.module.scss'

type ToastKind = 'success' | 'error' | 'info'

export type Toast = { id: number; kind: ToastKind; message: string }

type ToastCtx = {
  show: (message: string, kind?: ToastKind, timeoutMs?: number) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Toast[]>([])

  const show = useCallback((message: string, kind: ToastKind = 'info', timeoutMs = 3000) => {
    const id = Date.now() + Math.random()
    setItems(prev => [...prev, { id, kind, message }])
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), timeoutMs)
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={styles.container}>
        {items.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles[t.kind]}`}>{t.message}</div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
