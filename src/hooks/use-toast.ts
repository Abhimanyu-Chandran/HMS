
// Re-export from shadcn/ui toast.tsx
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"

import {
  useToast as useToastOriginal,
} from "@/components/ui/use-toast"

export { useToastOriginal as useToast }

type ToastOptions = Omit<ToastProps, "id"> & {
  description?: React.ReactNode
  action?: ToastActionElement
}

export function toast(opts: ToastOptions) {
  const { useToast } = require("@/components/ui/use-toast")
  const { toast } = useToast()
  return toast(opts)
}
