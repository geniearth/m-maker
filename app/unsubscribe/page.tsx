'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UnsubscribePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    reason: '',
    channels: {
      sms: false,
      email: false,
      kakao: false,
      all: false,
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleChannelChange = (channel: keyof typeof formData.channels) => {
    if (channel === 'all') {
      const newValue = !formData.channels.all
      setFormData(prev => ({
        ...prev,
        channels: {
          sms: newValue,
          email: newValue,
          kakao: newValue,
          all: newValue,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        channels: {
          ...prev.channels,
          [channel]: !prev.channels[channel],
          all: false,
        },
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.phone && !formData.email) {
      alert('연락처 또는 이메일 중 하나는 필수입니다.')
      return
    }

    const hasChannelSelected = Object.entries(formData.channels)
      .filter(([key]) => key !== 'all')
      .some(([_, value]) => value)
    
    if (!hasChannelSelected) {
      alert('수신거부할 채널을 선택해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          email: formData.email,
          reason: formData.reason,
          channels: formData.channels,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        alert('수신거부 처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('수신거부 처리 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            수신거부 완료
          </h2>
          <p className="text-gray-600 mb-6">
            요청하신 수신거부가 정상적으로 처리되었습니다.
            처리 완료까지 최대 3영업일이 소요될 수 있습니다.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            광고성 정보 수신거부
          </h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              정보통신망 이용촉진 및 정보보호 등에 관한 법률에 의거하여 
              광고성 정보 수신을 거부할 권리가 있으며, 수신거부 시 
              관련 정보를 받아보실 수 없습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 연락처 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                수신거부 신청 정보
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    휴대폰 번호
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <p className="mt-2 text-sm text-gray-500">
                * 연락처 또는 이메일 중 하나는 필수로 입력해주세요.
              </p>
            </div>

            {/* 수신거부 채널 선택 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                수신거부 채널 선택
              </h3>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.channels.all}
                    onChange={() => handleChannelChange('all')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">전체 수신거부</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.channels.sms}
                    onChange={() => handleChannelChange('sms')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">SMS 수신거부</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.channels.email}
                    onChange={() => handleChannelChange('email')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">이메일 수신거부</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.channels.kakao}
                    onChange={() => handleChannelChange('kakao')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">카카오톡 수신거부</span>
                </label>
              </div>
            </div>

            {/* 수신거부 사유 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                수신거부 사유 (선택)
              </h3>
              
              <select
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">사유를 선택해주세요</option>
                <option value="too_frequent">메시지가 너무 자주 옵니다</option>
                <option value="not_interested">관심있는 내용이 아닙니다</option>
                <option value="privacy_concern">개인정보 보호를 위해서입니다</option>
                <option value="not_agreed">수신 동의한 적이 없습니다</option>
                <option value="other">기타</option>
              </select>
            </div>

            {/* 안내사항 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">안내사항</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 수신거부 처리는 신청 후 3영업일 이내 완료됩니다.</li>
                <li>• 법령에 따른 안내 및 주요 공지사항은 수신거부와 관계없이 발송됩니다.</li>
                <li>• 수신거부 후에도 이미 발송된 메시지는 취소되지 않습니다.</li>
                <li>• 문의사항은 고객센터(1588-0000)로 연락주시기 바랍니다.</li>
              </ul>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isSubmitting ? '처리중...' : '수신거부 신청'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}