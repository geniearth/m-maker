'use client'

import { BlockType } from '../types'
import { useState } from 'react'

interface DisclosureBlockData {
  title?: string
  companyInfo: {
    name: string
    ceo: string
    businessNumber: string
    telecomNumber?: string
    address: string
    email: string
    phone: string
  }
  disclaimers: string[]
  showPrivacyPolicy?: boolean
  showTermsOfService?: boolean
  showMarketingInfo?: boolean
}

interface DisclosureBlockProps {
  block: BlockType
}

export default function DisclosureBlock({ block }: DisclosureBlockProps) {
  const data = block.data as DisclosureBlockData
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <section className="py-8 px-4 bg-gray-100 border-t border-gray-300">
      <div className="max-w-6xl mx-auto">
        {data.title && (
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {data.title}
          </h3>
        )}

        {/* 회사 정보 */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">사업자 정보</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>상호명: {data.companyInfo.name}</div>
            <div>대표자: {data.companyInfo.ceo}</div>
            <div>사업자등록번호: {data.companyInfo.businessNumber}</div>
            {data.companyInfo.telecomNumber && (
              <div>통신판매업신고번호: {data.companyInfo.telecomNumber}</div>
            )}
            <div className="md:col-span-2">
              사업장 소재지: {data.companyInfo.address}
            </div>
            <div>이메일: {data.companyInfo.email}</div>
            <div>대표전화: {data.companyInfo.phone}</div>
          </div>
        </div>

        {/* 필수 고지사항 */}
        {data.disclaimers && data.disclaimers.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              📢 필수 고지사항
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {data.disclaimers.map((disclaimer, index) => (
                <li key={index}>{disclaimer}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 약관 링크 */}
        <div className="flex flex-wrap gap-4 text-sm">
          {data.showPrivacyPolicy && (
            <button
              onClick={() => toggleSection('privacy')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              개인정보처리방침
            </button>
          )}
          {data.showTermsOfService && (
            <button
              onClick={() => toggleSection('terms')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              이용약관
            </button>
          )}
          {data.showMarketingInfo && (
            <button
              onClick={() => toggleSection('marketing')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              마케팅정보수신
            </button>
          )}
          <a
            href="/unsubscribe"
            className="text-red-600 hover:text-red-800 underline"
          >
            수신거부
          </a>
        </div>

        {/* 확장 가능한 약관 내용 */}
        {expandedSection === 'privacy' && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">개인정보처리방침</h4>
            <div className="text-sm text-gray-600 space-y-2 max-h-96 overflow-y-auto">
              <p>
                {data.companyInfo.name}(이하 '회사'라 함)은 개인정보보호법에 따라 
                이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 
                이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 
                두고 있습니다.
              </p>
              <p className="font-semibold">1. 개인정보의 수집 및 이용목적</p>
              <p>
                회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:
                - 서비스 제공에 관한 계약 이행 및 서비스 제공
                - 회원 관리
                - 마케팅 및 광고에의 활용
              </p>
              <p className="font-semibold">2. 수집하는 개인정보 항목</p>
              <p>
                필수항목: 이름, 연락처
                선택항목: 이메일, 주소, 생년월일
              </p>
              <p className="font-semibold">3. 개인정보의 보유 및 이용기간</p>
              <p>
                회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 
                해당 정보를 지체 없이 파기합니다.
              </p>
            </div>
          </div>
        )}

        {expandedSection === 'terms' && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">이용약관</h4>
            <div className="text-sm text-gray-600 space-y-2 max-h-96 overflow-y-auto">
              <p className="font-semibold">제1조 (목적)</p>
              <p>
                이 약관은 {data.companyInfo.name}(이하 '회사'라 함)가 제공하는 
                서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 
                기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
              <p className="font-semibold">제2조 (정의)</p>
              <p>
                1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.
                2. "회원"이란 회사의 서비스에 접속하여 이 약관에 따라 회사와 
                이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
              </p>
            </div>
          </div>
        )}

        {expandedSection === 'marketing' && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">마케팅 정보 수신</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                귀하는 개인정보의 선택적인 수집·이용, 제공에 대한 동의를 거부할 수 
                있습니다. 다만, 동의하지 않을 경우 관련 편의 제공(이벤트 안내, 
                경품 발송 등)이 제한될 수 있습니다.
              </p>
              <p className="font-semibold">수신동의 항목</p>
              <ul className="list-disc list-inside ml-4">
                <li>SMS: 상품 안내, 이벤트 정보, 혜택 안내</li>
                <li>이메일: 뉴스레터, 프로모션 정보</li>
                <li>카카오톡: 알림톡, 친구톡 메시지</li>
              </ul>
              <p className="font-semibold">수신동의 철회</p>
              <p>
                동의 철회는 수신거부 페이지 또는 고객센터({data.companyInfo.phone})를 
                통해 언제든지 가능합니다.
              </p>
            </div>
          </div>
        )}

        {/* 표시광고법 준수 문구 */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>
            본 페이지는 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 
            제공받을 수 있습니다.
          </p>
          <p>
            제공되는 정보는 참고용이며, 실제 내용과 다를 수 있습니다. 
            정확한 정보는 각 기업 공식 홈페이지를 참조하시기 바랍니다.
          </p>
        </div>
      </div>
    </section>
  )
}