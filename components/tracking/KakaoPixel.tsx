'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    kakaoPixel: (...args: any[]) => void
    Kakao: any
  }
}

interface KakaoPixelProps {
  pixelId: string
}

export default function KakaoPixel({ pixelId }: KakaoPixelProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.kakaoPixel) {
      // 페이지뷰 이벤트
      window.kakaoPixel(pixelId).pageView()
    }
  }, [pixelId])

  if (!pixelId) {
    console.warn('Kakao Pixel ID is not configured')
    return null
  }

  return (
    <Script
      id="kakao-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s){if(f.kakaoPixel)return;n=f.kakaoPixel=function(){n.queue.push(arguments)};
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script','//t1.kakaocdn.net/adfit/static/kp.js');
          kakaoPixel('${pixelId}').pageView();
        `,
      }}
    />
  )
}

// Kakao Pixel 이벤트 헬퍼 함수들
export const kakaoEvent = (pixelId: string, eventName: string, tag?: string) => {
  if (typeof window !== 'undefined' && window.kakaoPixel) {
    if (tag) {
      window.kakaoPixel(pixelId).track(eventName, { tag })
    } else {
      window.kakaoPixel(pixelId).track(eventName)
    }
  }
}

// 리드 완료 이벤트
export const trackKakaoLead = (pixelId: string) => {
  if (typeof window !== 'undefined' && window.kakaoPixel) {
    window.kakaoPixel(pixelId).completeRegistration()
  }
}

// 구매 완료 (리드를 구매로 매핑)
export const trackKakaoPurchase = (pixelId: string, params?: { 
  total_price?: number
  currency?: string
  products?: any[]
}) => {
  if (typeof window !== 'undefined' && window.kakaoPixel) {
    window.kakaoPixel(pixelId).purchase({
      total_price: params?.total_price || 0,
      currency: params?.currency || 'KRW',
      products: params?.products || [],
    })
  }
}

// 장바구니 추가 (폼 시작으로 매핑)
export const trackKakaoAddToCart = (pixelId: string) => {
  if (typeof window !== 'undefined' && window.kakaoPixel) {
    window.kakaoPixel(pixelId).addToCart()
  }
}

// 콘텐츠 조회
export const trackKakaoViewContent = (pixelId: string, contentId?: string) => {
  if (typeof window !== 'undefined' && window.kakaoPixel) {
    window.kakaoPixel(pixelId).viewContent({
      id: contentId || 'landing_page',
    })
  }
}

// 검색 이벤트
export const trackKakaoSearch = (pixelId: string, keyword?: string) => {
  if (typeof window !== 'undefined' && window.kakaoPixel) {
    window.kakaoPixel(pixelId).search({
      keyword: keyword || '',
    })
  }
}

// Kakao 표준 이벤트 목록
export const KAKAO_STANDARD_EVENTS = {
  PAGE_VIEW: 'pageView',
  VIEW_CONTENT: 'viewContent',
  SEARCH: 'search',
  ADD_TO_CART: 'addToCart',
  ADD_TO_WISHLIST: 'addToWishList',
  PURCHASE: 'purchase',
  COMPLETE_REGISTRATION: 'completeRegistration',
  PARTICIPATION: 'participation',
  SIGN_UP: 'signUp',
}