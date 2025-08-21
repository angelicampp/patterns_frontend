import { createContext } from "react"

export const ToastContext = createContext<{ toast: (opts: { title: string; description?: string; variant?: string }) => void }>({
  toast: () => {},
})