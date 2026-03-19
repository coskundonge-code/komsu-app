'use client';

/**
 * Capacitor native bridge utilities for Mahallemiz iOS/Android app
 * These functions safely check for native availability before calling native APIs.
 * All Capacitor imports are dynamic and will gracefully fail on web.
 */

// Check if running inside a Capacitor native app
export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(window as any).Capacitor?.isNativePlatform?.();
}

// Get the current platform
export function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cap = (window as any).Capacitor;
  if (!cap?.isNativePlatform?.()) return 'web';
  return cap.getPlatform?.() || 'web';
}

// Safe dynamic import helper
async function capImport(module: string): Promise<any> {
  try {
    return await import(/* webpackIgnore: true */ module);
  } catch {
    return null;
  }
}

// Haptic feedback (light tap)
export async function hapticTap() {
  if (!isNativeApp()) return;
  const mod = await capImport('@capacitor/haptics');
  if (mod?.Haptics) {
    await mod.Haptics.impact({ style: mod.ImpactStyle?.Light || 'LIGHT' });
  }
}

// Haptic feedback (notification)
export async function hapticNotification(type: 'success' | 'warning' | 'error' = 'success') {
  if (!isNativeApp()) return;
  const mod = await capImport('@capacitor/haptics');
  if (mod?.Haptics) {
    const typeMap: Record<string, string> = { success: 'SUCCESS', warning: 'WARNING', error: 'ERROR' };
    await mod.Haptics.notification({ type: mod.NotificationType?.[typeMap[type]] || typeMap[type] });
  }
}

// Share content natively
export async function nativeShare(options: { title: string; text?: string; url?: string }) {
  if (!isNativeApp()) {
    if (typeof navigator !== 'undefined' && navigator.share) {
      return navigator.share(options);
    }
    return;
  }
  const mod = await capImport('@capacitor/share');
  if (mod?.Share) {
    await mod.Share.share({ title: options.title, text: options.text, url: options.url, dialogTitle: 'Paylaş' });
  }
}

// Set status bar style
export async function setStatusBarStyle(style: 'light' | 'dark') {
  if (!isNativeApp()) return;
  const mod = await capImport('@capacitor/status-bar');
  if (mod?.StatusBar) {
    const s = style === 'light' ? (mod.Style?.Light || 'LIGHT') : (mod.Style?.Dark || 'DARK');
    await mod.StatusBar.setStyle({ style: s });
  }
}

// Hide splash screen
export async function hideSplashScreen() {
  if (!isNativeApp()) return;
  const mod = await capImport('@capacitor/splash-screen');
  if (mod?.SplashScreen) {
    await mod.SplashScreen.hide();
  }
}

// Register push notifications
export async function registerPushNotifications() {
  if (!isNativeApp()) return null;
  const mod = await capImport('@capacitor/push-notifications');
  if (!mod?.PushNotifications) return null;
  const result = await mod.PushNotifications.requestPermissions();
  if (result.receive === 'granted') {
    await mod.PushNotifications.register();
  }
  return result;
}

// Get current geolocation
export async function getCurrentPosition() {
  if (!isNativeApp()) {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  const mod = await capImport('@capacitor/geolocation');
  if (mod?.Geolocation) {
    return await mod.Geolocation.getCurrentPosition();
  }
  throw new Error('Konum alınamadı');
}

// App lifecycle listeners
export async function setupAppListeners(callbacks: {
  onResume?: () => void;
  onPause?: () => void;
  onBackButton?: () => void;
}) {
  if (!isNativeApp()) return;
  const mod = await capImport('@capacitor/app');
  if (!mod?.App) return;

  if (callbacks.onResume || callbacks.onPause) {
    mod.App.addListener('appStateChange', (state: { isActive: boolean }) => {
      if (state.isActive) callbacks.onResume?.();
      else callbacks.onPause?.();
    });
  }

  if (callbacks.onBackButton) {
    mod.App.addListener('backButton', () => {
      callbacks.onBackButton?.();
    });
  }
}
