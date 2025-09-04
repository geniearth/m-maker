'use client'

import React from 'react'
import { FormBlock } from '../types'
import MultiStepForm from '@/components/forms/MultiStepForm'
import { leadFormSchema, consentSchema } from '@/lib/validation/lead-schema'
import { z } from 'zod'

interface FormBlockProps {
  block: FormBlock
  editable?: boolean
  onEdit?: (data: FormBlock['data']) => void
}

export default function FormBlockComponent({ block, editable = false, onEdit }: FormBlockProps) {
  const { data } = block

  // 폼 제출 핸들러
  const handleSubmit = async (formData: any) => {
    console.log('Form submitted:', formData)
    
    // API 호출
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': process.env.NEXT_PUBLIC_CLIENT_ID || 'test',
        },
        body: JSON.stringify({
          campaign_id: 'test-campaign',
          offer_id: 'test-offer',
          form: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            answers: {
              birthYear: formData.birthYear,
              gender: formData.gender,
              region: formData.region,
              timeline: formData.timeline,
              budget: formData.budget,
              message: formData.message,
            },
          },
          consents: [
            {
              type: 'privacy_required',
              version: 'v1.0',
              granted: formData.privacyRequired,
            },
            {
              type: 'marketing_optional',
              channel: 'sms',
              version: 'v1.0',
              granted: formData.marketingOptional?.sms || false,
            },
            {
              type: 'marketing_optional',
              channel: 'email',
              version: 'v1.0',
              granted: formData.marketingOptional?.email || false,
            },
            {
              type: 'marketing_optional',
              channel: 'kakao',
              version: 'v1.0',
              granted: formData.marketingOptional?.kakao || false,
            },
            {
              type: 'thirdparty_optional',
              version: 'v1.0',
              granted: formData.thirdPartyOptional || false,
            },
          ],
          utm: formData.utm,
          tracking: formData.tracking,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert('신청이 완료되었습니다! 곧 연락드리겠습니다.')
        
        // 성공 페이지로 이동하거나 성공 메시지 표시
        if (data.successMessage) {
          // TODO: Show success message
        }
      } else {
        const error = await response.json()
        if (error.code === 'DUPLICATE') {
          alert('이미 신청하신 이력이 있습니다.')
        } else {
          alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  // 다단계 폼 설정
  const steps = data.multiStep && data.steps ? data.steps : [
    {
      id: 'basic',
      title: '기본 정보',
      subtitle: '상담을 위한 기본 정보를 입력해주세요',
      fields: ['name', 'phone', 'email'],
    },
    {
      id: 'detail',
      title: '상세 정보',
      subtitle: '더 나은 상담을 위한 추가 정보입니다',
      fields: ['birthYear', 'gender', 'region'],
    },
    {
      id: 'needs',
      title: '관심사 및 동의',
      subtitle: '어떤 도움이 필요하신가요?',
      fields: ['timeline', 'budget', 'message'],
    },
  ]

  // 전체 스키마 (모든 필드 + 동의)
  const fullSchema = leadFormSchema.merge(consentSchema)

  if (editable) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <input
                  type="text"
                  value={data.title || '문의하기'}
                  onChange={(e) => onEdit?.({ ...data, title: e.target.value })}
                  className="text-2xl font-bold bg-transparent border-b border-dashed border-gray-300 text-center"
                />
                <input
                  type="text"
                  value={data.subtitle || '정보를 입력해주세요'}
                  onChange={(e) => onEdit?.({ ...data, subtitle: e.target.value })}
                  className="text-gray-600 bg-transparent border-b border-dashed border-gray-300 text-center mt-2"
                />
              </div>
              <div className="text-center text-gray-400">
                [편집 모드에서는 폼이 표시되지 않습니다]
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="form" className="py-16 bg-gray-50">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {data.title && (
              <h2 className="text-2xl font-bold text-center mb-2">
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="text-gray-600 text-center mb-8">
                {data.subtitle}
              </p>
            )}
            
            <MultiStepForm
              steps={steps}
              schema={fullSchema}
              onSubmit={handleSubmit}
              campaignId="test-campaign"
              offerId="test-offer"
            />
          </div>
        </div>
      </div>
    </section>
  )
}