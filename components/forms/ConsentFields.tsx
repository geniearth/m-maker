'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ConsentFields() {
  const { register, formState: { errors }, watch, setValue } = useFormContext()
  const [expandedConsent, setExpandedConsent] = useState<string | null>(null)
  
  const marketingAll = watch('marketingOptional.all')
  
  // 전체 동의 체크 시 개별 항목 모두 체크
  React.useEffect(() => {
    if (marketingAll !== undefined) {
      setValue('marketingOptional.sms', marketingAll)
      setValue('marketingOptional.email', marketingAll)
      setValue('marketingOptional.kakao', marketingAll)
    }
  }, [marketingAll, setValue])

  const toggleConsent = (consentType: string) => {
    setExpandedConsent(expandedConsent === consentType ? null : consentType)
  }

  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">약관 동의</h3>
      
      {/* 필수: 개인정보 수집 및 이용 동의 */}
      <div className="border rounded-lg">
        <div className="p-4">
          <div className="flex items-start">
            <input
              {...register('privacyRequired')}
              type="checkbox"
              id="privacyRequired"
              className="mt-1 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="privacyRequired" className="ml-2 flex-1">
              <span className="font-medium">
                [필수] 개인정보 수집 및 이용 동의
              </span>
            </label>
            <button
              type="button"
              onClick={() => toggleConsent('privacy')}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {expandedConsent === 'privacy' ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {errors.privacyRequired && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 ml-6">
              <AlertCircle className="h-4 w-4" />
              {errors.privacyRequired.message?.toString()}
            </p>
          )}
        </div>
        
        {expandedConsent === 'privacy' && (
          <div className="px-4 pb-4">
            <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
              <h4 className="font-semibold mb-2">1. 수집 목적</h4>
              <p className="mb-3">- 서비스 상담 및 이용 안내</p>
              
              <h4 className="font-semibold mb-2">2. 수집 항목</h4>
              <p className="mb-3">- 필수: 이름, 연락처(휴대전화번호)</p>
              <p className="mb-3">- 선택: 이메일, 생년월일, 성별, 지역</p>
              
              <h4 className="font-semibold mb-2">3. 보유 기간</h4>
              <p className="mb-3">- 수집일로부터 2년 또는 서비스 종료 시까지</p>
              <p className="mb-3">- 단, 관련 법령에 의해 보존할 필요가 있는 경우 해당 기간 동안 보관</p>
              
              <h4 className="font-semibold mb-2">4. 동의 거부권</h4>
              <p>귀하는 개인정보 수집·이용에 동의하지 않을 수 있으며, 동의 거부 시 서비스 이용이 제한될 수 있습니다.</p>
            </div>
          </div>
        )}
      </div>

      {/* 선택: 마케팅 정보 수신 동의 */}
      <div className="border rounded-lg">
        <div className="p-4">
          <div className="flex items-start">
            <input
              {...register('marketingOptional.all')}
              type="checkbox"
              id="marketingAll"
              className="mt-1 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="marketingAll" className="ml-2 flex-1">
              <span className="font-medium">
                [선택] 마케팅 정보 수신 동의 (전체)
              </span>
            </label>
            <button
              type="button"
              onClick={() => toggleConsent('marketing')}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {expandedConsent === 'marketing' ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        {expandedConsent === 'marketing' && (
          <div className="px-4 pb-4">
            <div className="bg-gray-50 p-4 rounded">
              {/* 개별 채널 선택 */}
              <div className="space-y-3 mb-4">
                <label className="flex items-center">
                  <input
                    {...register('marketingOptional.sms')}
                    type="checkbox"
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm">SMS 수신 동의</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    {...register('marketingOptional.email')}
                    type="checkbox"
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm">이메일 수신 동의</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    {...register('marketingOptional.kakao')}
                    type="checkbox"
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm">카카오톡 알림 수신 동의</span>
                </label>
              </div>
              
              <div className="text-sm text-gray-600">
                <h4 className="font-semibold mb-2">광고성 정보 수신 동의</h4>
                <p className="mb-2">
                  - 상품 및 서비스 안내, 이벤트 정보, 할인 혜택 등의 광고성 정보를 수신합니다.
                </p>
                <p className="mb-2">
                  - 수신 동의는 2년마다 재확인됩니다.
                </p>
                <p className="mb-2">
                  - 동의하지 않아도 서비스 이용이 가능합니다.
                </p>
                <p className="font-semibold">
                  * 수신거부: 마이페이지 또는 수신 메시지 내 수신거부 링크를 통해 언제든지 거부 가능
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 선택: 제3자 제공 동의 */}
      <div className="border rounded-lg">
        <div className="p-4">
          <div className="flex items-start">
            <input
              {...register('thirdPartyOptional')}
              type="checkbox"
              id="thirdPartyOptional"
              className="mt-1 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="thirdPartyOptional" className="ml-2 flex-1">
              <span className="font-medium">
                [선택] 개인정보 제3자 제공 동의
              </span>
            </label>
            <button
              type="button"
              onClick={() => toggleConsent('thirdparty')}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {expandedConsent === 'thirdparty' ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        {expandedConsent === 'thirdparty' && (
          <div className="px-4 pb-4">
            <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
              <h4 className="font-semibold mb-2">제공받는 자</h4>
              <p className="mb-3">- 제휴 서비스 제공 업체</p>
              
              <h4 className="font-semibold mb-2">제공 목적</h4>
              <p className="mb-3">- 서비스 상담 및 맞춤형 상품 안내</p>
              
              <h4 className="font-semibold mb-2">제공 항목</h4>
              <p className="mb-3">- 이름, 연락처, 관심 서비스 정보</p>
              
              <h4 className="font-semibold mb-2">보유 기간</h4>
              <p className="mb-3">- 제공 목적 달성 시까지</p>
              
              <p className="font-semibold">
                * 동의하지 않아도 서비스 이용이 가능하나, 제휴 서비스 이용이 제한될 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 안내 문구 */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">📢 안내</span><br />
          만 14세 미만은 서비스를 이용할 수 없습니다.<br />
          개인정보 처리방침은 홈페이지에서 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  )
}