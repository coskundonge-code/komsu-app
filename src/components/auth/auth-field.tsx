'use client'

import { AlertCircle, Eye, EyeOff, type LucideIcon } from 'lucide-react'

interface AuthFieldProps {
  id: string
  label: React.ReactNode
  Icon: LucideIcon
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  inputMode?: React.ComponentProps<'input'>['inputMode']
  maxLength?: number
  /** Şifre alanları için göz aç/kapa düğmesi göster */
  showToggle?: boolean
  shown?: boolean
  onToggleShown?: () => void
}

/**
 * Kayıt/giriş formlarındaki tekrarlayan ikon + input + hata satırı bloğu.
 * className'ler kayıt sayfasından birebir taşındı — görünüm değişmedi.
 */
export function AuthField({
  id,
  label,
  Icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  error,
  inputMode,
  maxLength,
  showToggle = false,
  shown = false,
  onToggleShown,
}: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#555] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#999]" />
        <input
          id={id}
          type={showToggle ? (shown ? 'text' : 'password') : type}
          inputMode={inputMode}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-11 ${showToggle ? 'pr-11' : 'pr-4'} py-3 border rounded-xl text-sm text-text-primary placeholder-[#aaa] bg-[#fafafa] focus:bg-surface focus:outline-none focus:ring-2 transition ${
            error
              ? 'border-red-300 focus:ring-red-200'
              : 'border-border focus:border-primary focus:ring-primary/20'
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggleShown}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#555] transition"
          >
            {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}
