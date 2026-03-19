'use client';

import { useEffect } from 'react';
import { isNativeApp, hideSplashScreen, setupAppListeners, setStatusBarStyle } from '@/lib/capacitor';

/**
 * Native app initialization component
 * Handles splash screen, status bar, and app lifecycle events for Capacitor builds
 */
export function NativeAppInit() {
  useEffect(() => {
    if (!isNativeApp()) return;

    // Hide splash screen after app loads
    const timer = setTimeout(() => {
      hideSplashScreen();
    }, 500);

    // Set status bar style
    setStatusBarStyle('light');

    // Setup app lifecycle listeners
    setupAppListeners({
      onResume: () => {
        // Refresh data when app comes back to foreground
        console.log('[Mahallemiz] App resumed');
      },
      onPause: () => {
        console.log('[Mahallemiz] App paused');
      },
      onBackButton: () => {
        // Handle Android back button
        if (window.history.length > 1) {
          window.history.back();
        }
      },
    });

    return () => clearTimeout(timer);
  }, []);

  return null;
}
