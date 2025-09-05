'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  FileText,
  Palette,
  Layers,
  Settings,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  Copy,
  Star,
  ChevronRight
} from 'lucide-react'

interface TemplateOption {
  id: string
  name: string
  description: string
  icon: any
  color: string
  preview: string[]
  recommended?: boolean
}

const templates: TemplateOption[] = [
  {
    id: 'blank',
    name: '빈 템플릿',
    description: '처음부터 시작하여 나만의 랜딩 페이지를 만드세요',
    icon: FileText,
    color: 'bg-gray-500',
    preview: ['완전한 자유도', '모든 블록 사용 가능', '커스텀 디자인'],
  },
  {
    id: 'insurance',
    name: '보험 상담',
    description: '보험 상담 리드 수집에 최적화된 템플릿',
    icon: Shield,
    color: 'bg-blue-500',
    preview: ['신뢰감 있는 디자인', '상담 예약 폼', '혜택 강조 섹션'],
    recommended: true,
  },
  {
    id: 'review',
    name: '제품 리뷰',
    description: '제품 체험단 모집 및 리뷰 수집용 템플릿',
    icon: Star,
    color: 'bg-purple-500',
    preview: ['제품 소개 갤러리', '리뷰 작성 폼', '참여 혜택 안내'],
  },
  {
    id: 'promotion',
    name: '특가 프로모션',
    description: '시간 한정 특가 이벤트를 위한 템플릿',
    icon: Zap,
    color: 'bg-red-500',
    preview: ['카운트다운 타이머', '긴급성 메시지', '한정 수량 표시'],
  },
  {
    id: 'education',
    name: '교육 상담',
    description: '교육 프로그램 상담 신청 템플릿',
    icon: Users,
    color: 'bg-green-500',
    preview: ['커리큘럼 소개', '강사진 소개', '수강 신청 폼'],
  },
  {
    id: 'real-estate',
    name: '부동산 분양',
    description: '부동산 분양 상담 및 정보 수집 템플릿',
    icon: Target,
    color: 'bg-orange-500',
    preview: ['위치 정보', '평면도 갤러리', '분양 상담 신청'],
  },
]

export default function NewLandingPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [step, setStep] = useState<'template' | 'details'>('template')

  const handleCreateProject = async () => {
    if (!selectedTemplate || !projectName) {
      alert('프로젝트 이름을 입력해주세요.')
      return
    }

    try {
      // 실제 구현시 API 호출하여 새 프로젝트 생성
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: projectName,
      //     description: projectDescription,
      //     templateId: selectedTemplate,
      //   }),
      // })
      // const data = await response.json()
      // router.push(`/editor/templates/${data.id}`)

      // 임시로 에디터 페이지로 이동
      console.log('Creating project:', { projectName, projectDescription, selectedTemplate })
      router.push(`/editor/templates/new-${Date.now()}`)
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('프로젝트 생성에 실패했습니다.')
    }
  }

  const handleBack = () => {
    if (step === 'details') {
      setStep('template')
    } else {
      router.push('/templates')
    }
  }

  const handleNext = () => {
    if (step === 'template' && selectedTemplate) {
      setStep('details')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            새 랜딩 페이지 만들기
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {step === 'template' ? '템플릿을 선택하세요' : '프로젝트 정보 입력'}
          </h1>
          <p className="text-xl text-gray-600">
            {step === 'template'
              ? '미리 만들어진 템플릿으로 빠르게 시작하거나 빈 템플릿으로 시작하세요'
              : '프로젝트의 이름과 설명을 입력해주세요'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'template' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step === 'template' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="font-medium">템플릿 선택</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className={`flex items-center gap-2 ${step === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="font-medium">프로젝트 정보</span>
            </div>
          </div>
        </div>

        {step === 'template' ? (
          <>
            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`relative bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {template.recommended && (
                    <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                      추천
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${template.color} flex items-center justify-center mb-4`}>
                      <template.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.description}
                    </p>
                    
                    <div className="space-y-2">
                      {template.preview.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedTemplate === template.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                템플릿 선택 팁
              </h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• 업종에 맞는 템플릿을 선택하면 더 빠르게 시작할 수 있습니다</li>
                <li>• 모든 템플릿은 완전히 커스터마이징 가능합니다</li>
                <li>• 나중에 언제든지 템플릿을 변경할 수 있습니다</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Project Details Form */}
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${
                    templates.find(t => t.id === selectedTemplate)?.color || 'bg-gray-500'
                  } flex items-center justify-center`}>
                    {(() => {
                      const template = templates.find(t => t.id === selectedTemplate);
                      if (template) {
                        const Icon = template.icon;
                        return <Icon className="w-5 h-5 text-white" />;
                      }
                      return null;
                    })()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">선택된 템플릿</p>
                    <p className="font-semibold text-gray-900">
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로젝트 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="예: 2024년 여름 특가 프로모션"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    이 이름은 관리 페이지에서 프로젝트를 구분하는 데 사용됩니다
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로젝트 설명
                  </label>
                  <textarea
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    팀원들과 공유할 때 유용한 정보를 입력하세요
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    추가 설정
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                      <span className="text-sm text-gray-700">자동 저장 활성화</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                      <span className="text-sm text-gray-700">실시간 미리보기 활성화</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">팀원에게 알림 보내기</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
          >
            {step === 'details' ? '이전' : '취소'}
          </button>
          
          {step === 'template' ? (
            <button
              onClick={handleNext}
              disabled={!selectedTemplate}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                selectedTemplate
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              다음
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreateProject}
              disabled={!projectName}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                projectName
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              프로젝트 생성
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Start Guide */}
        {step === 'template' && (
          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 시작 가이드</h3>
            <div className="inline-flex gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  1
                </div>
                <span>템플릿 선택</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  2
                </div>
                <span>프로젝트 정보 입력</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  3
                </div>
                <span>에디터에서 커스터마이징</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  4
                </div>
                <span>배포 및 공유</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}