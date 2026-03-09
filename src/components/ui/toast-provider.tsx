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
import { useEffect, useState } from "react";

const TOAST_DURATION = 4000; // 4 seconds default
const MAX_VISIBLE_TOASTS = 3;

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  // Show only the most recent MAX_VISIBLE_TOASTS toasts
  const visibleToasts = toasts.slice(-MAX_VISIBLE_TOASTS);

  return (
    <div className="fixed right-0 top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:w-[420px] pointer-events-none">
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        </div>
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
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getProgressColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-amber-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

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
      <div className="flex items-start gap-3 flex-1 w-full">
        <ToastIcon variant={toast.type} />
        <div className="flex-1">
          <ToastTitle>
            {toast.type === "success" && "Başarılı"}
            {toast.type === "error" && "Hata"}
            {toast.type === "warning" && "Uyarı"}
            {toast.type === "info" && "Bilgi"}
          </ToastTitle>
          <ToastDescription>{toast.message}</ToastDescription>
          <div className="mt-3 h-1 rounded-full bg-black bg-opacity-10 overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${getProgressColor(toast.type)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <ToastClose />
    </Toast>
  );
}
