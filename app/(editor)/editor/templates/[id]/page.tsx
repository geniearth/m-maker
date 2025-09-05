'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Save,
  Preview,
  Undo,
  Redo,
  Settings,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  X,
  Layers,
  Type,
  Image,
  Video,
  FileText,
  Users,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Grid,
  Palette,
  Code,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

interface Block {
  id: string
  type: string
  content: any
  settings: any
  visible: boolean
}

interface Template {
  id: string
  name: string
  description: string
  blocks: Block[]
  settings: {
    theme: string
    primaryColor: string
    fontFamily: string
    customCss?: string
  }
}

const blockTypes = [
  { id: 'hero', name: '히어로', icon: Type, color: 'bg-blue-500' },
  { id: 'benefits', name: '혜택', icon: Star, color: 'bg-green-500' },
  { id: 'testimonials', name: '후기', icon: Users, color: 'bg-purple-500' },
  { id: 'comparison', name: '비교', icon: Grid, color: 'bg-yellow-500' },
  { id: 'process', name: '프로세스', icon: TrendingUp, color: 'bg-pink-500' },
  { id: 'urgency', name: '긴급성', icon: Clock, color: 'bg-red-500' },
  { id: 'form', name: '폼', icon: FileText, color: 'bg-indigo-500' },
  { id: 'disclosure', name: '고지', icon: Shield, color: 'bg-gray-500' },
]

export default function TemplateEditor() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string
  
  const [template, setTemplate] = useState<Template | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [history, setHistory] = useState<Template[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showSettings, setShowSettings] = useState(false)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplate()
  }, [templateId])

  const fetchTemplate = async () => {
    try {
      // 실제 구현시 API 호출
      // const response = await fetch(`/api/templates/${templateId}`)
      // const data = await response.json()
      
      // 임시 데이터
      const mockTemplate: Template = {
        id: templateId,
        name: '보험 상담 템플릿',
        description: '효과적인 보험 상담 리드 수집 템플릿',
        blocks: [
          {
            id: '1',
            type: 'hero',
            content: {
              title: '당신의 보험, 제대로 선택하셨나요?',
              subtitle: '전문가 무료 상담으로 최적의 보험을 찾아드립니다',
              buttonText: '무료 상담 신청하기',
            },
            settings: {
              backgroundColor: '#1e40af',
              textColor: '#ffffff',
              padding: '60px',
            },
            visible: true,
          },
          {
            id: '2',
            type: 'benefits',
            content: {
              title: '왜 우리 서비스를 선택해야 할까요?',
              items: [
                { icon: '✓', title: '맞춤형 보험 설계', description: '개인별 상황에 맞는 최적의 보험 추천' },
                { icon: '✓', title: '전문가 1:1 상담', description: '10년 이상 경력의 전문 상담사' },
                { icon: '✓', title: '최저가 보장', description: '동일 조건 최저가 보험료 보장' },
              ],
            },
            settings: {
              columns: 3,
              showIcons: true,
            },
            visible: true,
          },
          {
            id: '3',
            type: 'form',
            content: {
              title: '무료 상담 신청',
              fields: [
                { type: 'text', name: 'name', label: '이름', required: true },
                { type: 'tel', name: 'phone', label: '연락처', required: true },
                { type: 'email', name: 'email', label: '이메일', required: false },
              ],
              submitButton: '상담 신청하기',
            },
            settings: {
              layout: 'vertical',
              showLabels: true,
            },
            visible: true,
          },
        ],
        settings: {
          theme: 'light',
          primaryColor: '#3b82f6',
          fontFamily: 'Pretendard',
        },
      }
      
      setTemplate(mockTemplate)
      addToHistory(mockTemplate)
    } catch (error) {
      console.error('Failed to fetch template:', error)
    }
  }

  const addToHistory = (newTemplate: Template) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newTemplate)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setTemplate(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setTemplate(history[historyIndex + 1])
    }
  }

  const handleAddBlock = (blockType: string) => {
    if (!template) return

    const newBlock: Block = {
      id: Date.now().toString(),
      type: blockType,
      content: getDefaultContent(blockType),
      settings: getDefaultSettings(blockType),
      visible: true,
    }

    const updatedTemplate = {
      ...template,
      blocks: [...template.blocks, newBlock],
    }

    setTemplate(updatedTemplate)
    addToHistory(updatedTemplate)
    setSelectedBlock(newBlock.id)
  }

  const handleDeleteBlock = (blockId: string) => {
    if (!template) return

    const updatedTemplate = {
      ...template,
      blocks: template.blocks.filter(b => b.id !== blockId),
    }

    setTemplate(updatedTemplate)
    addToHistory(updatedTemplate)
    setSelectedBlock(null)
  }

  const handleDuplicateBlock = (blockId: string) => {
    if (!template) return

    const blockIndex = template.blocks.findIndex(b => b.id === blockId)
    if (blockIndex === -1) return

    const originalBlock = template.blocks[blockIndex]
    const newBlock = {
      ...originalBlock,
      id: Date.now().toString(),
    }

    const updatedBlocks = [...template.blocks]
    updatedBlocks.splice(blockIndex + 1, 0, newBlock)

    const updatedTemplate = {
      ...template,
      blocks: updatedBlocks,
    }

    setTemplate(updatedTemplate)
    addToHistory(updatedTemplate)
  }

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!template) return

    const blockIndex = template.blocks.findIndex(b => b.id === blockId)
    if (blockIndex === -1) return
    
    if (direction === 'up' && blockIndex === 0) return
    if (direction === 'down' && blockIndex === template.blocks.length - 1) return

    const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1
    const updatedBlocks = [...template.blocks]
    const [movedBlock] = updatedBlocks.splice(blockIndex, 1)
    updatedBlocks.splice(newIndex, 0, movedBlock)

    const updatedTemplate = {
      ...template,
      blocks: updatedBlocks,
    }

    setTemplate(updatedTemplate)
    addToHistory(updatedTemplate)
  }

  const handleToggleVisibility = (blockId: string) => {
    if (!template) return

    const updatedTemplate = {
      ...template,
      blocks: template.blocks.map(block =>
        block.id === blockId
          ? { ...block, visible: !block.visible }
          : block
      ),
    }

    setTemplate(updatedTemplate)
    addToHistory(updatedTemplate)
  }

  const handleUpdateBlockContent = (blockId: string, newContent: any) => {
    if (!template) return

    const updatedTemplate = {
      ...template,
      blocks: template.blocks.map(block =>
        block.id === blockId
          ? { ...block, content: newContent }
          : block
      ),
    }

    setTemplate(updatedTemplate)
    addToHistory(updatedTemplate)
  }

  const handleUpdateBlockSettings = (blockId: string, newSettings: any) => {
    if (!template) return

    const updatedTemplate = {
      ...template,
      blocks: template.blocks.map(block =>
        block.id === blockId
          ? { ...block, settings: newSettings }
          : block
      ),
    }

    setTemplate(updatedTemplate)
    addToHistory(updatedTemplate)
  }

  const handleSave = async () => {
    if (!template) return

    setIsSaving(true)
    try {
      // 실제 구현시 API 호출
      // await fetch(`/api/templates/${templateId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(template),
      // })
      
      console.log('Saving template:', template)
      
      // 성공 알림
      setTimeout(() => {
        setIsSaving(false)
        alert('템플릿이 저장되었습니다.')
      }, 1000)
    } catch (error) {
      console.error('Failed to save template:', error)
      setIsSaving(false)
    }
  }

  const getDefaultContent = (blockType: string) => {
    const defaults: Record<string, any> = {
      hero: {
        title: '제목을 입력하세요',
        subtitle: '부제목을 입력하세요',
        buttonText: '버튼 텍스트',
      },
      benefits: {
        title: '혜택',
        items: [
          { icon: '✓', title: '혜택 1', description: '설명' },
        ],
      },
      testimonials: {
        title: '고객 후기',
        items: [
          { name: '김○○', content: '후기 내용', rating: 5 },
        ],
      },
      form: {
        title: '신청 폼',
        fields: [
          { type: 'text', name: 'name', label: '이름', required: true },
        ],
        submitButton: '제출',
      },
    }
    return defaults[blockType] || {}
  }

  const getDefaultSettings = (blockType: string) => {
    const defaults: Record<string, any> = {
      hero: {
        backgroundColor: '#1e40af',
        textColor: '#ffffff',
        padding: '60px',
      },
      benefits: {
        columns: 3,
        showIcons: true,
      },
      testimonials: {
        columns: 2,
        showRatings: true,
      },
      form: {
        layout: 'vertical',
        showLabels: true,
      },
    }
    return defaults[blockType] || {}
  }

  const deviceWidths = {
    desktop: 'max-w-full',
    tablet: 'max-w-3xl',
    mobile: 'max-w-md',
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">템플릿을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => router.push('/templates')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            템플릿 목록으로
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{template.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
        </div>

        {/* Block Types */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">블록 추가</h3>
          <div className="grid grid-cols-2 gap-2">
            {blockTypes.map(blockType => (
              <button
                key={blockType.id}
                onClick={() => handleAddBlock(blockType.id)}
                className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${blockType.color}`}>
                  <blockType.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-700">{blockType.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Block List */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            블록 목록 ({template.blocks.length})
          </h3>
          <div className="space-y-2">
            {template.blocks.map((block, index) => (
              <div
                key={block.id}
                className={`p-3 rounded-lg border ${
                  selectedBlock === block.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                } cursor-pointer`}
                onClick={() => setSelectedBlock(block.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {blockTypes.find(bt => bt.id === block.type)?.name || block.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMoveBlock(block.id, 'up')
                      }}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMoveBlock(block.id, 'down')
                      }}
                      disabled={index === template.blocks.length - 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleVisibility(block.id)
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {block.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicateBlock(block.id)
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteBlock(block.id)
                      }}
                      className="p-1 hover:bg-gray-100 rounded text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {!block.visible && (
                  <div className="mt-1 text-xs text-gray-500">숨김</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <Redo className="w-4 h-4" />
              </button>
              <div className="h-6 w-px bg-gray-300 mx-2" />
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`p-2 rounded ${
                    device === 'desktop' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={`p-2 rounded ${
                    device === 'tablet' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`p-2 rounded ${
                    device === 'mobile' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                설정
              </button>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? '편집' : '미리보기'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className={`mx-auto bg-white shadow-lg ${deviceWidths[device]}`}>
            {template.blocks.map(block => (
              <div
                key={block.id}
                className={`relative group ${
                  !block.visible ? 'opacity-50' : ''
                } ${
                  selectedBlock === block.id && !isPreview
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : ''
                }`}
                onClick={() => !isPreview && setSelectedBlock(block.id)}
              >
                {/* Block Content Preview */}
                <div
                  className="p-8"
                  style={{
                    backgroundColor: block.settings.backgroundColor || '#ffffff',
                    color: block.settings.textColor || '#000000',
                  }}
                >
                  {block.type === 'hero' && (
                    <div className="text-center">
                      <h1 className="text-4xl font-bold mb-4">{block.content.title}</h1>
                      <p className="text-xl mb-6">{block.content.subtitle}</p>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                        {block.content.buttonText}
                      </button>
                    </div>
                  )}

                  {block.type === 'benefits' && (
                    <div>
                      <h2 className="text-3xl font-bold text-center mb-8">
                        {block.content.title}
                      </h2>
                      <div className={`grid grid-cols-${block.settings.columns || 3} gap-6`}>
                        {block.content.items?.map((item: any, i: number) => (
                          <div key={i} className="text-center">
                            {block.settings.showIcons && (
                              <div className="text-4xl mb-2">{item.icon}</div>
                            )}
                            <h3 className="font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'form' && (
                    <div className="max-w-md mx-auto">
                      <h2 className="text-2xl font-bold mb-6">{block.content.title}</h2>
                      <form className="space-y-4">
                        {block.content.fields?.map((field: any, i: number) => (
                          <div key={i}>
                            {block.settings.showLabels && (
                              <label className="block text-sm font-medium mb-1">
                                {field.label}
                                {field.required && <span className="text-red-500">*</span>}
                              </label>
                            )}
                            <input
                              type={field.type}
                              placeholder={field.label}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        ))}
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          {block.content.submitButton}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Add more block type renderers as needed */}
                </div>

                {/* Block Controls (shown on hover when not in preview) */}
                {!isPreview && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1 bg-white rounded-lg shadow-lg p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingBlock(block.id)
                          setShowSettings(false)
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateBlock(block.id)
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteBlock(block.id)
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {template.blocks.length === 0 && (
              <div className="p-16 text-center text-gray-500">
                <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>블록이 없습니다.</p>
                <p className="text-sm mt-2">왼쪽 사이드바에서 블록을 추가해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Edit Panel */}
      {editingBlock && (() => {
        const block = template.blocks.find(b => b.id === editingBlock)
        if (!block) return null
        
        return (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {blockTypes.find(bt => bt.id === block.type)?.name || block.type} 편집
                </h3>
                <button
                  onClick={() => setEditingBlock(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Block Content */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">내용</h4>
                {block.type === 'hero' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        제목
                      </label>
                      <input
                        type="text"
                        value={block.content.title || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, {
                          ...block.content,
                          title: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        부제목
                      </label>
                      <textarea
                        rows={2}
                        value={block.content.subtitle || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, {
                          ...block.content,
                          subtitle: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        버튼 텍스트
                      </label>
                      <input
                        type="text"
                        value={block.content.buttonText || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, {
                          ...block.content,
                          buttonText: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {block.type === 'benefits' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        제목
                      </label>
                      <input
                        type="text"
                        value={block.content.title || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, {
                          ...block.content,
                          title: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        혜택 항목
                      </label>
                      {block.content.items?.map((item: any, index: number) => (
                        <div key={index} className="mb-3 p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">항목 {index + 1}</span>
                            <button
                              onClick={() => {
                                const newItems = [...block.content.items]
                                newItems.splice(index, 1)
                                handleUpdateBlockContent(block.id, {
                                  ...block.content,
                                  items: newItems
                                })
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.icon || ''}
                            onChange={(e) => {
                              const newItems = [...block.content.items]
                              newItems[index] = { ...item, icon: e.target.value }
                              handleUpdateBlockContent(block.id, {
                                ...block.content,
                                items: newItems
                              })
                            }}
                            placeholder="아이콘"
                            className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const newItems = [...block.content.items]
                              newItems[index] = { ...item, title: e.target.value }
                              handleUpdateBlockContent(block.id, {
                                ...block.content,
                                items: newItems
                              })
                            }}
                            placeholder="제목"
                            className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-sm"
                          />
                          <textarea
                            rows={2}
                            value={item.description || ''}
                            onChange={(e) => {
                              const newItems = [...block.content.items]
                              newItems[index] = { ...item, description: e.target.value }
                              handleUpdateBlockContent(block.id, {
                                ...block.content,
                                items: newItems
                              })
                            }}
                            placeholder="설명"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newItems = [...(block.content.items || [])]
                          newItems.push({ icon: '✓', title: '새 항목', description: '설명' })
                          handleUpdateBlockContent(block.id, {
                            ...block.content,
                            items: newItems
                          })
                        }}
                        className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        항목 추가
                      </button>
                    </div>
                  </div>
                )}

                {block.type === 'form' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        폼 제목
                      </label>
                      <input
                        type="text"
                        value={block.content.title || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, {
                          ...block.content,
                          title: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        폼 필드
                      </label>
                      {block.content.fields?.map((field: any, index: number) => (
                        <div key={index} className="mb-3 p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">필드 {index + 1}</span>
                            <button
                              onClick={() => {
                                const newFields = [...block.content.fields]
                                newFields.splice(index, 1)
                                handleUpdateBlockContent(block.id, {
                                  ...block.content,
                                  fields: newFields
                                })
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <select
                            value={field.type || 'text'}
                            onChange={(e) => {
                              const newFields = [...block.content.fields]
                              newFields[index] = { ...field, type: e.target.value }
                              handleUpdateBlockContent(block.id, {
                                ...block.content,
                                fields: newFields
                              })
                            }}
                            className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-sm"
                          >
                            <option value="text">텍스트</option>
                            <option value="email">이메일</option>
                            <option value="tel">전화번호</option>
                            <option value="number">숫자</option>
                            <option value="date">날짜</option>
                          </select>
                          <input
                            type="text"
                            value={field.label || ''}
                            onChange={(e) => {
                              const newFields = [...block.content.fields]
                              newFields[index] = { ...field, label: e.target.value }
                              handleUpdateBlockContent(block.id, {
                                ...block.content,
                                fields: newFields
                              })
                            }}
                            placeholder="라벨"
                            className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-sm"
                          />
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required || false}
                              onChange={(e) => {
                                const newFields = [...block.content.fields]
                                newFields[index] = { ...field, required: e.target.checked }
                                handleUpdateBlockContent(block.id, {
                                  ...block.content,
                                  fields: newFields
                                })
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">필수 입력</span>
                          </label>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newFields = [...(block.content.fields || [])]
                          newFields.push({ type: 'text', name: `field_${Date.now()}`, label: '새 필드', required: false })
                          handleUpdateBlockContent(block.id, {
                            ...block.content,
                            fields: newFields
                          })
                        }}
                        className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        필드 추가
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        제출 버튼 텍스트
                      </label>
                      <input
                        type="text"
                        value={block.content.submitButton || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, {
                          ...block.content,
                          submitButton: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Block Settings */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">스타일</h4>
                <div className="space-y-4">
                  {(block.type === 'hero') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          배경색
                        </label>
                        <input
                          type="color"
                          value={block.settings.backgroundColor || '#ffffff'}
                          onChange={(e) => handleUpdateBlockSettings(block.id, {
                            ...block.settings,
                            backgroundColor: e.target.value
                          })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          텍스트 색상
                        </label>
                        <input
                          type="color"
                          value={block.settings.textColor || '#000000'}
                          onChange={(e) => handleUpdateBlockSettings(block.id, {
                            ...block.settings,
                            textColor: e.target.value
                          })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          패딩
                        </label>
                        <input
                          type="text"
                          value={block.settings.padding || '60px'}
                          onChange={(e) => handleUpdateBlockSettings(block.id, {
                            ...block.settings,
                            padding: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </>
                  )}
                  {block.type === 'benefits' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          컬럼 수
                        </label>
                        <select
                          value={block.settings.columns || 3}
                          onChange={(e) => handleUpdateBlockSettings(block.id, {
                            ...block.settings,
                            columns: parseInt(e.target.value)
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={block.settings.showIcons || false}
                          onChange={(e) => handleUpdateBlockSettings(block.id, {
                            ...block.settings,
                            showIcons: e.target.checked
                          })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">아이콘 표시</span>
                      </label>
                    </>
                  )}
                  {block.type === 'form' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          레이아웃
                        </label>
                        <select
                          value={block.settings.layout || 'vertical'}
                          onChange={(e) => handleUpdateBlockSettings(block.id, {
                            ...block.settings,
                            layout: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="vertical">세로</option>
                          <option value="horizontal">가로</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={block.settings.showLabels || false}
                          onChange={(e) => handleUpdateBlockSettings(block.id, {
                            ...block.settings,
                            showLabels: e.target.checked
                          })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">라벨 표시</span>
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Settings Panel */}
      {showSettings && (
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">템플릿 설정</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                테마
              </label>
              <select
                value={template.settings.theme}
                onChange={(e) => {
                  const updatedTemplate = {
                    ...template,
                    settings: { ...template.settings, theme: e.target.value },
                  }
                  setTemplate(updatedTemplate)
                  addToHistory(updatedTemplate)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="light">라이트</option>
                <option value="dark">다크</option>
                <option value="auto">자동</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주 색상
              </label>
              <input
                type="color"
                value={template.settings.primaryColor}
                onChange={(e) => {
                  const updatedTemplate = {
                    ...template,
                    settings: { ...template.settings, primaryColor: e.target.value },
                  }
                  setTemplate(updatedTemplate)
                  addToHistory(updatedTemplate)
                }}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                폰트
              </label>
              <select
                value={template.settings.fontFamily}
                onChange={(e) => {
                  const updatedTemplate = {
                    ...template,
                    settings: { ...template.settings, fontFamily: e.target.value },
                  }
                  setTemplate(updatedTemplate)
                  addToHistory(updatedTemplate)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Pretendard">Pretendard</option>
                <option value="Noto Sans KR">Noto Sans KR</option>
                <option value="Spoqa Han Sans Neo">Spoqa Han Sans Neo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                커스텀 CSS
              </label>
              <textarea
                rows={10}
                value={template.settings.customCss || ''}
                onChange={(e) => {
                  const updatedTemplate = {
                    ...template,
                    settings: { ...template.settings, customCss: e.target.value },
                  }
                  setTemplate(updatedTemplate)
                  addToHistory(updatedTemplate)
                }}
                placeholder="/* 커스텀 CSS를 입력하세요 */"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}