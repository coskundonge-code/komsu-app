/**
 * Format Utilities
 *
 * Collection of formatting functions for Turkish locale.
 * All functions are pure and have no external dependencies.
 */

/**
 * Formats a date to Turkish locale format
 *
 * @param date - Date to format
 * @param format - Format style: 'short' (d.m.Y), 'medium' (d MMMM Y), 'long' (dddd, d MMMM Y)
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date('2026-03-10')) // "10.03.2026"
 * formatDate(new Date('2026-03-10'), 'medium') // "10 Mart 2026"
 * formatDate(new Date('2026-03-10'), 'long') // "Pazartesi, 10 Mart 2026"
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'short'
): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return 'Geçersiz tarih';
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (format === 'short') {
    return `${day}.${month}.${year}`;
  }

  const monthNames = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ];

  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  const monthName = monthNames[d.getMonth()];
  const dayName = dayNames[d.getDay()];

  if (format === 'medium') {
    return `${day} ${monthName} ${year}`;
  }

  return `${dayName}, ${day} ${monthName} ${year}`;
}

/**
 * Formats a date relative to now in Turkish
 *
 * @param date - Date to format
 * @returns Relative time string (e.g., "2 saat önce", "3 gün önce")
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 60000)) // "1 dakika önce"
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 saat önce"
 * formatRelativeTime(new Date(Date.now() - 86400000)) // "1 gün önce"
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return 'Geçersiz tarih';
  }

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return diffSeconds === 0 ? 'az önce' : `${diffSeconds} saniye önce`;
  }

  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 dakika önce' : `${diffMinutes} dakika önce`;
  }

  if (diffHours < 24) {
    return diffHours === 1 ? '1 saat önce' : `${diffHours} saat önce`;
  }

  if (diffDays < 7) {
    return diffDays === 1 ? '1 gün önce' : `${diffDays} gün önce`;
  }

  if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 hafta önce' : `${diffWeeks} hafta önce`;
  }

  if (diffMonths < 12) {
    return diffMonths === 1 ? '1 ay önce' : `${diffMonths} ay önce`;
  }

  return diffYears === 1 ? '1 yıl önce' : `${diffYears} yıl önce`;
}

/**
 * Formats a number with Turkish locale (space for thousands, comma for decimal)
 *
 * @param num - Number to format
 * @param decimalPlaces - Number of decimal places (default: 0)
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567) // "1.234.567"
 * formatNumber(1234.567, 2) // "1.234,57"
 */
export function formatNumber(num: number, decimalPlaces: number = 0): string {
  if (!Number.isFinite(num)) {
    return '0';
  }

  const parts = num.toFixed(decimalPlaces).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add dots to integer part for thousands
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (decimalPlaces === 0) {
    return formattedInteger;
  }

  return `${formattedInteger},${decimalPart}`;
}

/**
 * Formats a number as Turkish currency (Turkish Lira)
 *
 * @param amount - Amount to format
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @param showSymbol - Show currency symbol (default: true)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // "₺1.234,56"
 * formatCurrency(100) // "₺100,00"
 * formatCurrency(5000, 0) // "₺5.000"
 * formatCurrency(99.99, 2, false) // "99,99"
 */
export function formatCurrency(
  amount: number,
  decimalPlaces: number = 2,
  showSymbol: boolean = true
): string {
  const formatted = formatNumber(amount, decimalPlaces);
  return showSymbol ? `₺${formatted}` : formatted;
}

/**
 * Truncates text and adds ellipsis if it exceeds max length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: "...")
 * @returns Truncated text
 *
 * @example
 * truncateText("Uzun bir metin örneği", 10) // "Uzun bir..."
 * truncateText("Kısa", 10) // "Kısa"
 * truncateText("Merhaba Dünya", 8, "→") // "Merhaba→"
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || maxLength <= 0) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  const truncatedLength = maxLength - suffix.length;
  return text.slice(0, truncatedLength) + suffix;
}

/**
 * Formats a phone number
 *
 * @param phone - Phone number (digits only)
 * @returns Formatted phone number
 *
 * @example
 * formatPhone("5551234567") // "555 123 4567"
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  if (digits.length === 11) {
    return `${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  return phone;
}

/**
 * Formats file size in human-readable format
 *
 * @param bytes - File size in bytes
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted file size
 *
 * @example
 * formatFileSize(1024) // "1,00 KB"
 * formatFileSize(1048576) // "1,00 MB"
 * formatFileSize(1073741824) // "1,00 GB"
 */
export function formatFileSize(bytes: number, decimalPlaces: number = 2): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, index);

  return `${formatNumber(size, decimalPlaces)} ${units[index]}`;
}
