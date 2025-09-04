'use client'

import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import FormFields from './FormFields'
import ConsentFields from './ConsentFields'

interface FormStep {
  id: string
  title: string
  subtitle?: string
  fields: string[]
  validation?: z.ZodObject<any>
}

interface MultiStepFormProps {
  steps: FormStep[]
  schema: z.ZodObject<any>
  onSubmit: (data: any) => Promise<void>
  className?: string
  campaignId?: string
  offerId?: string
}

export default function MultiStepForm({
  steps,
  schema,
  onSubmit,
  className,
  campaignId,
  offerId,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: loadSavedFormData(),
  })

  const { handleSubmit, trigger, getValues, watch } = methods

  // 자동저장
  useEffect(() => {
    const subscription = watch((value) => {
      saveFormData(value)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // 진행률 계산
  const progress = ((currentStep + 1) / steps.length) * 100

  // 현재 단계의 필드들
  const currentFields = steps[currentStep].fields

  // 다음 단계로 이동
  const handleNext = async () => {
    // 현재 단계의 필드만 검증
    const isValid = await trigger(currentFields)
    
    if (isValid) {
      setCompletedSteps([...completedSteps, currentStep])
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        
        // 트래킹 이벤트
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'lead_progress',
            step_no: currentStep + 2,
            progress: Math.round(((currentStep + 2) / steps.length) * 100),
          })
        }
      } else {
        // 마지막 단계에서 제출
        handleSubmit(onSubmitForm)()
      }
    }
  }

  // 이전 단계로 이동
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 특정 단계로 이동
  const goToStep = async (stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.includes(stepIndex - 1)) {
      setCurrentStep(stepIndex)
    }
  }

  // 폼 제출
  const onSubmitForm = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      // UTM 파라미터 추가
      const utm = getUTMParams()
      const tracking = getTrackingIds()
      
      const submitData = {
        ...data,
        campaign_id: campaignId,
        offer_id: offerId,
        utm,
        tracking,
      }
      
      await onSubmit(submitData)
      
      // 성공 시 저장된 데이터 삭제
      clearSavedFormData()
      
      // 트래킹 이벤트
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'lead_submit',
          lead_id: 'temp_' + Date.now(),
          score: 0,
          offer_id: offerId,
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className={cn('w-full', className)}>
        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentStep + 1} / {steps.length} 단계
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% 완료
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 단계 인디케이터 */}
        <div className="flex justify-center mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center"
            >
              <button
                onClick={() => goToStep(index)}
                disabled={index > currentStep && !completedSteps.includes(index - 1)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  index === currentStep
                    ? 'bg-primary-600 text-white'
                    : completedSteps.includes(index)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                )}
              >
                {completedSteps.includes(index) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 h-1 mx-1',
                    completedSteps.includes(index)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* 현재 단계 내용 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {steps[currentStep].title}
          </h2>
          {steps[currentStep].subtitle && (
            <p className="text-gray-600">
              {steps[currentStep].subtitle}
            </p>
          )}
        </div>

        {/* 폼 필드 */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <FormFields fields={currentFields} />

          {/* 마지막 단계에서 동의 필드 표시 */}
          {currentStep === steps.length - 1 && (
            <ConsentFields />
          )}

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={cn(
                'px-6 py-3 rounded-lg font-medium flex items-center gap-2',
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              )}
            >
              <ChevronLeft className="h-5 w-5" />
              이전
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
              >
                다음
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    제출 중...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    제출하기
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

// 로컬 스토리지에 폼 데이터 저장
function saveFormData(data: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lead_form_data', JSON.stringify(data))
    localStorage.setItem('lead_form_timestamp', Date.now().toString())
  }
}

// 저장된 폼 데이터 불러오기
function loadSavedFormData() {
  if (typeof window === 'undefined') return {}
  
  const saved = localStorage.getItem('lead_form_data')
  const timestamp = localStorage.getItem('lead_form_timestamp')
  
  if (saved && timestamp) {
    const age = Date.now() - parseInt(timestamp)
    // 24시간 이내 데이터만 복원
    if (age < 24 * 60 * 60 * 1000) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved form data:', e)
      }
    }
  }
  
  return {}
}

// 저장된 폼 데이터 삭제
function clearSavedFormData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lead_form_data')
    localStorage.removeItem('lead_form_timestamp')
  }
}

// UTM 파라미터 추출
function getUTMParams() {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    content: params.get('utm_content') || undefined,
    term: params.get('utm_term') || undefined,
  }
}

// 트래킹 ID 추출
function getTrackingIds() {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  return {
    click_id: params.get('click_id') || undefined,
    sub_id: params.get('sub_id') || undefined,
    gclid: params.get('gclid') || undefined,
    kclid: params.get('kclid') || undefined,
    nclick: params.get('nclick') || undefined,
    fbclid: params.get('fbclid') || undefined,
  }
}