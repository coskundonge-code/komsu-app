import { useToastStore } from '@/lib/stores/toast-store'
import type { ToastType } from '@/lib/stores/toast-store'

/**
 * Non-hook toast utility for use in event handlers.
 * Directly accesses the Zustand store without requiring React hooks.
 */
export function showToast(message: string, type: ToastType = 'info', duration?: number) {
  useToastStore.getState().addToast(message, type, duration)
}

export const toast = {
  success: (message: string, duration?: number) => showToast(message, 'success', duration),
  error: (message: string, duration?: number) => showToast(message, 'error', duration),
  warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
  info: (message: string, duration?: number) => showToast(message, 'info', duration),
}
