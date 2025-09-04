import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhoneKR(phone: string): boolean {
  const re = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/
  return re.test(phone.replace(/-/g, ''))
}

export function maskPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3')
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  const maskedLocal = localPart.length > 2 
    ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
    : localPart
  return `${maskedLocal}@${domain}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function getUTMParams(url: string | URL): Record<string, string> {
  const urlObj = typeof url === 'string' ? new URL(url) : url
  const searchParams = new URLSearchParams(urlObj.search)
  const utmParams: Record<string, string> = {}
  
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  
  for (const key of utmKeys) {
    const value = searchParams.get(key)
    if (value) {
      utmParams[key.replace('utm_', '')] = value
    }
  }
  
  return utmParams
}

export function getTrackingIds(url: string | URL): Record<string, string | null> {
  const urlObj = typeof url === 'string' ? new URL(url) : url
  const searchParams = new URLSearchParams(urlObj.search)
  
  return {
    click_id: searchParams.get('click_id'),
    sub_id: searchParams.get('sub_id'),
    gclid: searchParams.get('gclid'),
    kclid: searchParams.get('kclid'),
    nclick: searchParams.get('nclick'),
    fbclid: searchParams.get('fbclid'),
    wbraid: searchParams.get('wbraid'),
    gbraid: searchParams.get('gbraid'),
  }
}