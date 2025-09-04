'use client'

import React, { useState } from 'react'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { Block, HeroBlock, FAQBlock, Page } from '@/components/blocks/types'
import { Plus, Save, Eye, EyeOff, Settings, Trash2 } from 'lucide-react'
import { generateUUID } from '@/lib/utils'

// Sample initial page data
const initialPage: Page = {
  id: generateUUID(),
  title: '새 랜딩 페이지',
  slug: 'new-landing',
  blocks: [
    {
      id: generateUUID(),
      type: 'hero',
      order: 0,
      data: {
        title: '고성능 리드 생성 솔루션',
        subtitle: '전환율을 극대화하는 랜딩 페이지',
        description: '검증된 템플릿과 강력한 분석 도구로 더 많은 리드를 확보하세요.',
        usps: [
          '평균 전환율 15% 향상',
          '실시간 A/B 테스트',
          '한국 규제 100% 준수',
        ],
        ctaText: '무료로 시작하기',
        ctaLink: '#form',
        secondaryCtaText: '데모 보기',
        secondaryCtaLink: '#demo',
      },
    } as HeroBlock,
    {
      id: generateUUID(),
      type: 'faq',
      order: 1,
      data: {
        title: '자주 묻는 질문',
        subtitle: '궁금하신 점을 빠르게 해결해 드립니다',
        items: [
          {
            question: '어떤 업종에 적합한가요?',
            answer: '보험, 금융, 교육, 부동산 등 리드 생성이 중요한 모든 업종에 적합합니다. 특히 고가치 리드를 필요로 하는 B2B, B2C 서비스에 최적화되어 있습니다.',
            category: '일반',
          },
          {
            question: '개인정보보호법 준수가 가능한가요?',
            answer: '네, 한국 개인정보보호법, 정보통신망법, 표시광고법을 100% 준수합니다. 동의 관리, 수집 목적 명시, 보유기간 설정 등 모든 법적 요구사항을 충족합니다.',
            category: '규제',
          },
          {
            question: '어떤 추적 도구를 지원하나요?',
            answer: 'Google Analytics 4, Meta Pixel, Kakao Pixel, Naver 전환 추적을 기본 지원하며, 서버사이드 태깅(sGTM)을 통해 iOS 14+ 환경에서도 정확한 추적이 가능합니다.',
            category: '기능',
          },
        ],
        expandFirst: true,
      },
    } as FAQBlock,
  ],
  settings: {
    metaTitle: '고성능 리드 생성 솔루션',
    metaDescription: '전환율을 극대화하는 랜딩 페이지 빌더',
    metaKeywords: ['리드생성', '랜딩페이지', '전환율최적화'],
  },
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export default function BuilderPage() {
  const [page, setPage] = useState<Page>(initialPage)
  const [editMode, setEditMode] = useState(true)
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = page.blocks.findIndex(b => b.id === active.id)
      const newIndex = page.blocks.findIndex(b => b.id === over.id)
      
      const newBlocks = arrayMove(page.blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        order: index,
      }))
      
      setPage({ ...page, blocks: newBlocks })
    }
  }

  const handleBlockEdit = (blockId: string, data: any) => {
    const newBlocks = page.blocks.map(block =>
      block.id === blockId ? { ...block, data } : block
    )
    setPage({ ...page, blocks: newBlocks })
  }

  const handleAddBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: generateUUID(),
      type,
      order: page.blocks.length,
      data: getDefaultBlockData(type),
    } as any

    setPage({ 
      ...page, 
      blocks: [...page.blocks, newBlock] 
    })
  }

  const handleDeleteBlock = (blockId: string) => {
    const newBlocks = page.blocks
      .filter(b => b.id !== blockId)
      .map((block, index) => ({ ...block, order: index }))
    
    setPage({ ...page, blocks: newBlocks })
  }

  const handleToggleBlockVisibility = (blockId: string) => {
    const newBlocks = page.blocks.map(block =>
      block.id === blockId 
        ? { ...block, isHidden: !block.isHidden }
        : block
    )
    setPage({ ...page, blocks: newBlocks })
  }

  const handleSave = async () => {
    // TODO: Save to database
    console.log('Saving page:', page)
    alert('페이지가 저장되었습니다!')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">페이지 빌더</h1>
              <input
                type="text"
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                className="px-3 py-1 border border-gray-300 rounded"
                placeholder="페이지 제목"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  editMode 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {editMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {editMode ? '편집 모드' : '미리보기'}
              </button>
              
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                저장
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar - Block List */}
        {editMode && (
          <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto">
            <div className="p-4">
              <h2 className="font-semibold mb-4">블록 추가</h2>
              <div className="grid grid-cols-2 gap-2">
                {blockTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleAddBlock(type.value)}
                    className="p-3 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                  >
                    <type.icon className="h-5 w-5 mx-auto mb-1" />
                    {type.label}
                  </button>
                ))}
              </div>

              <h2 className="font-semibold mt-6 mb-4">현재 블록</h2>
              <div className="space-y-2">
                {page.blocks.map(block => (
                  <div
                    key={block.id}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedBlock === block.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedBlock(block.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {block.type.toUpperCase()}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleBlockVisibility(block.id)
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {block.isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteBlock(block.id)
                          }}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview Area */}
        <div className="flex-1 bg-white">
          <div className={editMode ? 'pointer-events-none' : ''}>
            {page.blocks.map(block => (
              <div 
                key={block.id}
                className={editMode && block.isHidden ? 'opacity-50' : ''}
              >
                <BlockRenderer
                  block={block}
                  editable={editMode}
                  onEdit={handleBlockEdit}
                />
              </div>
            ))}
          </div>

          {page.blocks.length === 0 && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-500 mb-4">아직 블록이 없습니다</p>
                <button
                  onClick={() => handleAddBlock('hero')}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  첫 블록 추가하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Block type definitions
const blockTypes = [
  { value: 'hero' as const, label: '히어로', icon: Plus },
  { value: 'features' as const, label: '특징', icon: Plus },
  { value: 'comparison' as const, label: '비교표', icon: Plus },
  { value: 'faq' as const, label: 'FAQ', icon: Plus },
  { value: 'reviews' as const, label: '리뷰', icon: Plus },
  { value: 'cta' as const, label: 'CTA', icon: Plus },
  { value: 'form' as const, label: '폼', icon: Plus },
  { value: 'pricing' as const, label: '가격', icon: Plus },
  { value: 'trust' as const, label: '신뢰', icon: Plus },
  { value: 'disclosure' as const, label: '고지', icon: Plus },
]

// Default data for new blocks
function getDefaultBlockData(type: Block['type']): any {
  switch (type) {
    case 'hero':
      return {
        title: '새 히어로 섹션',
        subtitle: '부제목을 입력하세요',
        description: '설명을 입력하세요',
        ctaText: 'CTA 버튼',
      }
    case 'faq':
      return {
        title: 'FAQ',
        items: [
          {
            question: '질문을 입력하세요',
            answer: '답변을 입력하세요',
          },
        ],
      }
    default:
      return {}
  }
}