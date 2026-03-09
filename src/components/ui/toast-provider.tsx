"use client";

import * as React from "react";
import { useToastStore } from "@/lib/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastTitle,
} from "@/components/ui/toast";
import { useEffect } from "react";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed right-0 top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:w-[420px]">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    timestamp: number;
  };
  onRemove: () => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <Toast
      variant={toast.type}
      className="animate-in slide-in-from-top-full"
      onOpenChange={(open) => {
        if (!open) {
          onRemove();
        }
      }}
    >
      <div className="flex items-start gap-3 flex-1">
        <ToastIcon variant={toast.type} />
        <div className="flex-1">
          <ToastTitle>
            {toast.type === "success" && "Başarılı"}
            {toast.type === "error" && "Hata"}
            {toast.type === "warning" && "Uyarı"}
            {toast.type === "info" && "Bilgi"}
          </ToastTitle>
          <ToastDescription>{toast.message}</ToastDescription>
        </div>
      </div>
      <ToastClose />
    </Toast>
  );
}
