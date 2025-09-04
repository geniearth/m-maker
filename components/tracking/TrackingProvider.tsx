'use client'

import React, { createContext, useContext, useEffect } from 'react'
import GoogleAnalytics, { trackLeadEvent as gaTrackLead } from './GoogleAnalytics'
import MetaPixel, { trackMetaLead, trackMetaCompleteRegistration } from './MetaPixel'
import KakaoPixel, { trackKakaoLead, trackKakaoPurchase, trackKakaoAddToCart } from './KakaoPixel'
import NaverTracking, { trackNaverConversion, NAVER_CONVERSION_TYPES } from './NaverTracking'
import { generateUUID } from '@/lib/utils'

interface TrackingConfig {
  ga4?: string
  metaPixel?: string
  kakaoPixel?: string
  naverWcs?: string
  sgtmUrl?: string
}

interface TrackingContextType {
  config: TrackingConfig
  trackEvent: (eventName: string, params?: Record<string, any>) => void
  trackLead: (leadData: LeadTrackingData) => void
  trackFormStart: () => void
  trackFormProgress: (step: number, totalSteps: number) => void
  trackOtpComplete: (leadId: string) => void
}

interface LeadTrackingData {
  leadId: string
  score?: number
  offerId?: string
  value?: number
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined)

export function useTracking() {
  const context = useContext(TrackingContext)
  if (!context) {
    throw new Error('useTracking must be used within TrackingProvider')
  }
  return context
}

interface TrackingProviderProps {
  config: TrackingConfig
  children: React.ReactNode
}

export default function TrackingProvider({ config, children }: TrackingProviderProps) {
  // 공통 이벤트 ID 생성 (중복 제거용)
  const generateEventId = () => generateUUID()

  // 통합 이벤트 전송
  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    const eventId = generateEventId()
    
    // Google Analytics / GTM
    if (config.ga4) {
      gaTrackLead(eventName, { ...params, event_id: eventId })
    }
    
    // 서버사이드 태깅 (sGTM)으로 전송
    if (config.sgtmUrl) {
      sendToServerGTM(eventName, { ...params, event_id: eventId })
    }
    
    console.log('Track Event:', eventName, params)
  }

  // 리드 제출 추적
  const trackLead = (leadData: LeadTrackingData) => {
    const eventId = generateEventId()
    
    // GA4
    if (config.ga4) {
      gaTrackLead('lead_submit', {
        lead_id: leadData.leadId,
        score: leadData.score,
        offer_id: leadData.offerId,
        event_id: eventId,
      })
    }
    
    // Meta Pixel
    if (config.metaPixel) {
      trackMetaLead(leadData.value, eventId)
    }
    
    // Kakao Pixel (구매로 매핑)
    if (config.kakaoPixel) {
      trackKakaoPurchase(config.kakaoPixel, {
        total_price: leadData.value || 0,
      })
    }
    
    // Naver 전환
    if (config.naverWcs) {
      trackNaverConversion({
        accountId: config.naverWcs,
        conversionId: leadData.leadId,
        value: leadData.value || 0,
        type: NAVER_CONVERSION_TYPES.INQUIRY,
      })
    }
    
    // 서버사이드 태깅
    if (config.sgtmUrl) {
      sendToServerGTM('lead_submit', {
        lead_id: leadData.leadId,
        score: leadData.score,
        offer_id: leadData.offerId,
        value: leadData.value,
        event_id: eventId,
      })
    }
  }

  // 폼 시작 추적
  const trackFormStart = () => {
    const eventId = generateEventId()
    
    // GA4
    if (config.ga4) {
      gaTrackLead('lead_start', { event_id: eventId })
    }
    
    // Kakao (장바구니 추가로 매핑)
    if (config.kakaoPixel) {
      trackKakaoAddToCart(config.kakaoPixel)
    }
    
    // 서버사이드 태깅
    if (config.sgtmUrl) {
      sendToServerGTM('lead_start', { event_id: eventId })
    }
  }

  // 폼 진행률 추적
  const trackFormProgress = (step: number, totalSteps: number) => {
    const progress = Math.round((step / totalSteps) * 100)
    const eventId = generateEventId()
    
    // GA4
    if (config.ga4) {
      gaTrackLead('lead_progress', {
        step_no: step,
        progress,
        event_id: eventId,
      })
    }
    
    // 서버사이드 태깅
    if (config.sgtmUrl) {
      sendToServerGTM('lead_progress', {
        step_no: step,
        progress,
        event_id: eventId,
      })
    }
  }

  // OTP 완료 추적
  const trackOtpComplete = (leadId: string) => {
    const eventId = generateEventId()
    
    // GA4
    if (config.ga4) {
      gaTrackLead('otp_complete', {
        lead_id: leadId,
        event_id: eventId,
      })
    }
    
    // Meta Pixel (CompleteRegistration)
    if (config.metaPixel) {
      trackMetaCompleteRegistration(0, eventId)
    }
    
    // Kakao (회원가입 완료)
    if (config.kakaoPixel) {
      trackKakaoLead(config.kakaoPixel)
    }
    
    // 서버사이드 태깅
    if (config.sgtmUrl) {
      sendToServerGTM('otp_complete', {
        lead_id: leadId,
        event_id: eventId,
      })
    }
  }

  // 서버사이드 GTM으로 이벤트 전송
  const sendToServerGTM = async (eventName: string, params: Record<string, any>) => {
    if (!config.sgtmUrl) return
    
    try {
      await fetch(`${config.sgtmUrl}/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName,
          ...params,
          client_id: getClientId(),
          session_id: getSessionId(),
          timestamp: Date.now(),
          page_location: window.location.href,
          page_referrer: document.referrer,
          user_agent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error('Failed to send event to sGTM:', error)
    }
  }

  const value = {
    config,
    trackEvent,
    trackLead,
    trackFormStart,
    trackFormProgress,
    trackOtpComplete,
  }

  return (
    <TrackingContext.Provider value={value}>
      {/* 트래킹 픽셀 컴포넌트 렌더링 */}
      {config.ga4 && <GoogleAnalytics measurementId={config.ga4} />}
      {config.metaPixel && <MetaPixel pixelId={config.metaPixel} />}
      {config.kakaoPixel && <KakaoPixel pixelId={config.kakaoPixel} />}
      {config.naverWcs && <NaverTracking accountId={config.naverWcs} />}
      
      {children}
    </TrackingContext.Provider>
  )
}

// 클라이언트 ID 가져오기 (GA 클라이언트 ID 또는 자체 생성)
function getClientId(): string {
  if (typeof window === 'undefined') return ''
  
  // GA 클라이언트 ID 시도
  try {
    const ga = (window as any).ga
    if (ga && ga.getAll) {
      const tracker = ga.getAll()[0]
      if (tracker) {
        return tracker.get('clientId')
      }
    }
  } catch (e) {}
  
  // localStorage에서 가져오거나 생성
  let clientId = localStorage.getItem('client_id')
  if (!clientId) {
    clientId = generateUUID()
    localStorage.setItem('client_id', clientId)
  }
  
  return clientId
}

// 세션 ID 가져오기
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  // sessionStorage에서 가져오거나 생성
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = generateUUID()
    sessionStorage.setItem('session_id', sessionId)
  }
  
  return sessionId
}