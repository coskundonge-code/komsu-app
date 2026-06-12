"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { ToastContainer } from "@/components/ui/toast-provider";
import { PushInit } from "@/components/shared/push-init";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
        <ToastViewport />
        <ToastContainer />
        {/* Native uygulamada push token kaydı; web'de no-op */}
        <PushInit />
      </ToastProvider>
    </QueryClientProvider>
  );
}
