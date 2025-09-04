'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    fbq: (...args: any[]) => void
    _fbq: any
  }
}

interface MetaPixelProps {
  pixelId: string
}

export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!window.fbq) return

    // 페이지뷰 이벤트
    window.fbq('track', 'PageView')
  }, [pathname, searchParams])

  if (!pixelId) {
    console.warn('Meta Pixel ID is not configured')
    return null
  }

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `,
      }}
    />
  )
}

// Meta Pixel 이벤트 헬퍼 함수들
export const fbqEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

// 리드 이벤트
export const trackMetaLead = (value?: number, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const params: any = {
      currency: 'KRW',
      value: value || 0,
    }
    
    // 서버사이드 중복 제거를 위한 event_id
    if (eventId) {
      window.fbq('track', 'Lead', params, { eventID: eventId })
    } else {
      window.fbq('track', 'Lead', params)
    }
  }
}

// 회원가입 완료 (OTP 인증 후)
export const trackMetaCompleteRegistration = (value?: number, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const params: any = {
      currency: 'KRW',
      value: value || 0,
      content_name: 'lead_registration',
    }
    
    if (eventId) {
      window.fbq('track', 'CompleteRegistration', params, { eventID: eventId })
    } else {
      window.fbq('track', 'CompleteRegistration', params)
    }
  }
}

// 커스텀 이벤트
export const trackMetaCustom = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}

// 표준 이벤트 목록
export const META_STANDARD_EVENTS = {
  ADD_TO_CART: 'AddToCart',
  ADD_TO_WISHLIST: 'AddToWishlist',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
  CONTACT: 'Contact',
  FIND_LOCATION: 'FindLocation',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  LEAD: 'Lead',
  PAGE_VIEW: 'PageView',
  PURCHASE: 'Purchase',
  SCHEDULE: 'Schedule',
  SEARCH: 'Search',
  START_TRIAL: 'StartTrial',
  SUBMIT_APPLICATION: 'SubmitApplication',
  SUBSCRIBE: 'Subscribe',
  VIEW_CONTENT: 'ViewContent',
}