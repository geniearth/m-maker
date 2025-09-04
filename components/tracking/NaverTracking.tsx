'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    wcs: any
    wcs_add: any
    wcs_do: any
  }
}

interface NaverTrackingProps {
  accountId: string
}

export default function NaverTracking({ accountId }: NaverTrackingProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.wcs) {
      // 기본 추적 설정
      if (!window.wcs_add) window.wcs_add = {}
      window.wcs_add['wa'] = accountId
      
      // 유입 경로 추적
      if (window.wcs.inflow) {
        window.wcs.inflow()
      }
      
      // 페이지뷰 전송
      if (window.wcs_do) {
        window.wcs_do()
      }
    }
  }, [accountId])

  if (!accountId) {
    console.warn('Naver WCS Account ID is not configured')
    return null
  }

  return (
    <>
      <Script
        id="naver-wcs-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (!wcs_add) var wcs_add = {};
            wcs_add["wa"] = "${accountId}";
          `,
        }}
      />
      <Script
        id="naver-wcs"
        strategy="afterInteractive"
        src="//wcs.naver.net/wcslog.js"
      />
      <Script
        id="naver-wcs-do"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if(typeof wcs !== 'undefined') {
              wcs.inflow();
              wcs_do();
            }
          `,
        }}
      />
    </>
  )
}

// Naver 전환 추적
export const trackNaverConversion = (params: {
  accountId: string
  conversionId?: string
  value?: number
  type?: string
}) => {
  if (typeof window !== 'undefined' && window.wcs) {
    const _nasa = {} as any
    
    if (window.wcs) {
      if (!window.wcs_add) window.wcs_add = {}
      window.wcs_add['wa'] = params.accountId
      
      // 전환 추적 설정
      const conversionValue = params.value || 0
      const conversionType = params.type || '1' // 기본값: 문의
      
      // 전환 이벤트 전송
      window.wcs.trans({
        'cnv': true,
        'order_id': params.conversionId || `lead_${Date.now()}`,
        'amount': conversionValue,
        'type': conversionType,
      })
      
      // 전환 완료 전송
      window.wcs_do(_nasa)
    }
  }
}

// 네이버 프리미엄 로그 분석
export const trackNaverPremiumLog = (params: {
  accountId: string
  event: string
  value?: any
}) => {
  if (typeof window !== 'undefined' && window.wcs) {
    const _nasa = {
      'event': params.event,
      ...params.value,
    } as any
    
    if (window.wcs) {
      if (!window.wcs_add) window.wcs_add = {}
      window.wcs_add['wa'] = params.accountId
      
      window.wcs_do(_nasa)
    }
  }
}

// 네이버 전환 타입
export const NAVER_CONVERSION_TYPES = {
  INQUIRY: '1',        // 문의
  SIGNUP: '2',         // 회원가입
  PURCHASE: '3',       // 구매
  RESERVATION: '4',    // 예약
  APPLICATION: '5',    // 신청
  PARTICIPATION: '6',  // 참여
  DOWNLOAD: '7',       // 다운로드
}

// 네이버 프리미엄 로그 이벤트
export const NAVER_PREMIUM_EVENTS = {
  PAGE_VIEW: 'pageView',
  VIEW_CONTENT: 'viewContent',
  ADD_TO_CART: 'addToCart',
  PURCHASE: 'purchase',
  LEAD: 'lead',
  SIGN_UP: 'signUp',
}