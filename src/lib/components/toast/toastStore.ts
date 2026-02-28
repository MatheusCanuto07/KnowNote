import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export const toasts = writable<Toast[]>([]);

let count = 0;

export function showToast(message: string, type: ToastType = 'info') {
  const id = count++;
  const newToast: Toast = { id, message, type };
  toasts.update((all) => [...all, newToast]);

  setTimeout(() => {
    toasts.update((all) => all.filter((t) => t.id !== id));
  }, 3000);
}
