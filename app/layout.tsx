import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'
import TrackingProvider from '@/components/tracking/TrackingProvider'

export const metadata: Metadata = {
  title: 'M-Maker - Lead Generation Platform',
  description: '고성능 리드 생성 및 제휴 마케팅 플랫폼',
  keywords: ['리드생성', '랜딩페이지', '제휴마케팅', 'CPL', 'CPA'],
  authors: [{ name: 'M-Maker Team' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://m-maker.com',
    title: 'M-Maker - Lead Generation Platform',
    description: '고성능 리드 생성 및 제휴 마케팅 플랫폼',
    siteName: 'M-Maker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M-Maker - Lead Generation Platform',
    description: '고성능 리드 생성 및 제휴 마케팅 플랫폼',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 트래킹 설정
  const trackingConfig = {
    ga4: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    kakaoPixel: process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID,
    naverWcs: process.env.NEXT_PUBLIC_NAVER_WCS_ID,
    sgtmUrl: process.env.NEXT_PUBLIC_SGTM_URL,
  }

  return (
    <html lang="ko" className="h-full">
      <head>
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className={cn("min-h-full bg-white antialiased")}>
        <TrackingProvider config={trackingConfig}>
          {children}
        </TrackingProvider>
      </body>
    </html>
  )
}