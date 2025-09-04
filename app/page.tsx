import Link from 'next/link'
import { ArrowRight, BarChart3, Globe, Lock, Zap, Users, DollarSign } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              고성능 리드 생성 &
              <br />
              제휴 마케팅 플랫폼
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              상세페이지 형식의 랜딩페이지로 고품질 리드를 수집하고,
              제휴 마케팅을 통해 수익을 극대화하세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                관리자 대시보드
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/editor/builder"
                className="inline-flex items-center px-6 py-3 bg-primary-700 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors border border-primary-500"
              >
                페이지 빌더 시작
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              엔터프라이즈급 기능
            </h2>
            <p className="text-xl text-gray-600">
              RFP 요구사항을 완벽히 충족하는 통합 솔루션
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-primary-600" />}
              title="블록 기반 에디터"
              description="드래그 앤 드롭으로 쉽게 랜딩페이지를 제작하세요. 히어로, 비교표, FAQ, 리뷰 등 다양한 블록 제공"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary-600" />}
              title="다단계 리드 폼"
              description="진행률 표시, 자동저장, 실시간 검증으로 전환율을 극대화. OTP 인증 지원"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-primary-600" />}
              title="통합 추적 시스템"
              description="GA4, Meta Pixel, Kakao, Naver 픽셀 통합. 서버사이드 태깅(sGTM) 지원"
            />
            <FeatureCard
              icon={<DollarSign className="h-8 w-8 text-primary-600" />}
              title="제휴 마케팅"
              description="CPL/CPA 기반 커미션 관리, S2S 포스트백, 실시간 정산 리포트"
            />
            <FeatureCard
              icon={<Lock className="h-8 w-8 text-primary-600" />}
              title="한국 규제 준수"
              description="개인정보보호법, 정보통신망법, 표시광고법 완벽 준수. 동의 관리 시스템"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-primary-600" />}
              title="성능 최적화"
              description="Core Web Vitals 최적화, 이미지 최적화, Critical CSS, 99.9% 가용성"
            />
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              즉시 사용 가능한 템플릿
            </h2>
            <p className="text-xl text-gray-600">
              업종별 최적화된 템플릿으로 빠르게 시작하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TemplateCard
              title="보험형 템플릿"
              description="보험 상담/견적 리드에 최적화. 보장 요약, 플랜 비교표, 전문 상담 폼 포함"
              image="/templates/insurance.jpg"
            />
            <TemplateCard
              title="리뷰형 템플릿"
              description="사용자 리뷰 중심 구성. UGC 모자이크, 장단점 비교, 신뢰 지표 강조"
              image="/templates/review.jpg"
            />
            <TemplateCard
              title="홍보형 템플릿"
              description="범용 캠페인용. 기능 소개, 고객사 로고, 이벤트 폼 구성"
              image="/templates/generic.jpg"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 시작하세요
          </h2>
          <p className="text-xl mb-8">
            2주 내 MVP 구축, 실제 캠페인 즉시 활용 가능
          </p>
          <Link
            href="/admin/register"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold text-lg rounded-lg hover:bg-primary-50 transition-colors"
          >
            무료로 시작하기
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">M-Maker</h3>
              <p className="text-sm">
                엔터프라이즈급 리드 생성 및 제휴 마케팅 플랫폼
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">기능</Link></li>
                <li><Link href="/templates" className="hover:text-white">템플릿</Link></li>
                <li><Link href="/pricing" className="hover:text-white">가격</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">리소스</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-white">문서</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
                <li><Link href="/support" className="hover:text-white">지원</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">법적 고지</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">개인정보처리방침</Link></li>
                <li><Link href="/terms" className="hover:text-white">이용약관</Link></li>
                <li><Link href="/compliance" className="hover:text-white">규제 준수</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 M-Maker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TemplateCard({ title, description, image }: {
  title: string
  description: string
  image: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href="/templates" className="text-primary-600 font-semibold hover:text-primary-700">
          자세히 보기 →
        </Link>
      </div>
    </div>
  )
}