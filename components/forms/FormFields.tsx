'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormFieldsProps {
  fields: string[]
}

export default function FormFields({ fields }: FormFieldsProps) {
  const { register, formState: { errors }, watch } = useFormContext()

  const renderField = (fieldName: string) => {
    const error = errors[fieldName]

    switch (fieldName) {
      case 'name':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              {...register(fieldName)}
              type="text"
              id={fieldName}
              placeholder="홍길동"
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
          </div>
        )

      case 'phone':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              {...register(fieldName)}
              type="tel"
              id={fieldName}
              placeholder="010-1234-5678"
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              하이픈(-) 없이 숫자만 입력해주세요
            </p>
          </div>
        )

      case 'email':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-gray-400">(선택)</span>
            </label>
            <input
              {...register(fieldName)}
              type="email"
              id={fieldName}
              placeholder="example@email.com"
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
          </div>
        )

      case 'birthYear':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              출생연도 <span className="text-gray-400">(선택)</span>
            </label>
            <input
              {...register(fieldName)}
              type="text"
              id={fieldName}
              placeholder="1990"
              maxLength={4}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
          </div>
        )

      case 'gender':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별 <span className="text-gray-400">(선택)</span>
            </label>
            <div className="flex gap-4">
              {[
                { value: 'male', label: '남성' },
                { value: 'female', label: '여성' },
                { value: 'other', label: '기타' },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    {...register(fieldName)}
                    type="radio"
                    value={option.value}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
          </div>
        )

      case 'region':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              지역 <span className="text-gray-400">(선택)</span>
            </label>
            <select
              {...register(fieldName)}
              id={fieldName}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            >
              <option value="">선택하세요</option>
              <option value="seoul">서울</option>
              <option value="gyeonggi">경기</option>
              <option value="incheon">인천</option>
              <option value="busan">부산</option>
              <option value="daegu">대구</option>
              <option value="gwangju">광주</option>
              <option value="daejeon">대전</option>
              <option value="ulsan">울산</option>
              <option value="sejong">세종</option>
              <option value="gangwon">강원</option>
              <option value="chungbuk">충북</option>
              <option value="chungnam">충남</option>
              <option value="jeonbuk">전북</option>
              <option value="jeonnam">전남</option>
              <option value="gyeongbuk">경북</option>
              <option value="gyeongnam">경남</option>
              <option value="jeju">제주</option>
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
          </div>
        )

      case 'timeline':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              예상 시기 <span className="text-gray-400">(선택)</span>
            </label>
            <select
              {...register(fieldName)}
              id={fieldName}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            >
              <option value="">선택하세요</option>
              <option value="immediate">즉시</option>
              <option value="1month">1개월 이내</option>
              <option value="3months">3개월 이내</option>
              <option value="6months">6개월 이내</option>
              <option value="planning">계획 중</option>
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
          </div>
        )

      case 'budget':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              예산 <span className="text-gray-400">(선택)</span>
            </label>
            <select
              {...register(fieldName)}
              id={fieldName}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            >
              <option value="">선택하세요</option>
              <option value="under-100">100만원 미만</option>
              <option value="100-300">100-300만원</option>
              <option value="300-500">300-500만원</option>
              <option value="500-1000">500-1000만원</option>
              <option value="over-1000">1000만원 이상</option>
              <option value="undecided">미정</option>
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
          </div>
        )

      case 'message':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              문의사항 <span className="text-gray-400">(선택)</span>
            </label>
            <textarea
              {...register(fieldName)}
              id={fieldName}
              rows={4}
              placeholder="궁금하신 사항을 자유롭게 작성해주세요"
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              최대 500자까지 입력 가능합니다
            </p>
          </div>
        )

      // 보험 관련 필드
      case 'insuranceType':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              보험 종류 <span className="text-red-500">*</span>
            </label>
            <select
              {...register(fieldName)}
              id={fieldName}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            >
              <option value="">선택하세요</option>
              <option value="life">생명보험</option>
              <option value="health">건강보험</option>
              <option value="auto">자동차보험</option>
              <option value="home">주택보험</option>
              <option value="travel">여행보험</option>
              <option value="pet">펫보험</option>
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
          </div>
        )

      case 'currentInsurance':
        return (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 가입된 보험이 있으신가요?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  {...register(fieldName)}
                  type="radio"
                  value="true"
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">네, 있습니다</span>
              </label>
              <label className="flex items-center">
                <input
                  {...register(fieldName)}
                  type="radio"
                  value="false"
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">아니요, 없습니다</span>
              </label>
            </div>
          </div>
        )

      default:
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              {fieldName}
            </label>
            <input
              {...register(fieldName)}
              type="text"
              id={fieldName}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                error ? "border-red-500" : "border-gray-300"
              )}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error.message?.toString()}
              </p>
            )}
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {fields.map(renderField)}
    </div>
  )
}