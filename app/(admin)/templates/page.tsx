'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  Calendar,
  Tag,
  Users,
  TrendingUp,
  Settings,
  Download,
  Upload,
  Check,
  X,
  MoreVertical,
  FileText,
  Layers,
  Palette
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  blocks: any[]
  settings: any
  usage_count: number
  conversion_rate: number
  created_at: string
  updated_at: string
  status: 'active' | 'draft' | 'archived'
  tags: string[]
}

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory, searchQuery])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      // 실제 구현시 API 호출
      // const response = await fetch('/api/templates')
      // const data = await response.json()
      
      // 임시 데이터
      setTemplates([
        {
          id: '1',
          name: '보험 상담 신청',
          description: '효과적인 보험 상담 리드 수집을 위한 템플릿',
          category: 'insurance',
          thumbnail: '/templates/insurance-thumb.jpg',
          blocks: [],
          settings: {},
          usage_count: 234,
          conversion_rate: 15.3,
          created_at: '2024-09-01T10:00:00',
          updated_at: '2024-09-04T14:30:00',
          status: 'active',
          tags: ['보험', '상담', '금융'],
        },
        {
          id: '2',
          name: '제품 리뷰 이벤트',
          description: '제품 체험단 모집 및 리뷰 수집용 템플릿',
          category: 'review',
          thumbnail: '/templates/review-thumb.jpg',
          blocks: [],
          settings: {},
          usage_count: 189,
          conversion_rate: 18.7,
          created_at: '2024-08-28T09:00:00',
          updated_at: '2024-09-03T16:20:00',
          status: 'active',
          tags: ['리뷰', '체험단', '이벤트'],
        },
        {
          id: '3',
          name: '특가 프로모션',
          description: '시간 한정 특가 프로모션 리드 수집 템플릿',
          category: 'promotion',
          thumbnail: '/templates/promotion-thumb.jpg',
          blocks: [],
          settings: {},
          usage_count: 312,
          conversion_rate: 22.1,
          created_at: '2024-08-25T11:00:00',
          updated_at: '2024-09-02T13:15:00',
          status: 'active',
          tags: ['프로모션', '할인', '특가'],
        },
        {
          id: '4',
          name: '부동산 상담',
          description: '부동산 분양 상담 신청 템플릿',
          category: 'real-estate',
          thumbnail: '/templates/realestate-thumb.jpg',
          blocks: [],
          settings: {},
          usage_count: 145,
          conversion_rate: 12.8,
          created_at: '2024-08-20T10:00:00',
          updated_at: '2024-08-30T15:45:00',
          status: 'draft',
          tags: ['부동산', '분양', '상담'],
        },
      ])
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicate = async (template: Template) => {
    try {
      // 실제 구현시 API 호출
      // await fetch('/api/templates/duplicate', {
      //   method: 'POST',
      //   body: JSON.stringify({ templateId: template.id })
      // })
      
      console.log('Duplicating template:', template.id)
      alert(`템플릿 "${template.name}"이(가) 복제되었습니다.`)
      fetchTemplates()
    } catch (error) {
      console.error('Failed to duplicate template:', error)
    }
  }

  const handleDelete = async (template: Template) => {
    if (!confirm(`템플릿 "${template.name}"을(를) 삭제하시겠습니까?`)) return
    
    try {
      // 실제 구현시 API 호출
      // await fetch(`/api/templates/${template.id}`, { method: 'DELETE' })
      
      console.log('Deleting template:', template.id)
      fetchTemplates()
    } catch (error) {
      console.error('Failed to delete template:', error)
    }
  }

  const handleArchive = async (template: Template) => {
    try {
      // 실제 구현시 API 호출
      console.log('Archiving template:', template.id)
      fetchTemplates()
    } catch (error) {
      console.error('Failed to archive template:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  const getCategoryBadge = (category: string) => {
    const styles = {
      insurance: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      promotion: 'bg-red-100 text-red-800',
      'real-estate': 'bg-green-100 text-green-800',
    }
    return styles[category as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const categories = [
    { id: 'all', name: '전체', count: templates.length },
    { id: 'insurance', name: '보험', count: templates.filter(t => t.category === 'insurance').length },
    { id: 'review', name: '리뷰', count: templates.filter(t => t.category === 'review').length },
    { id: 'promotion', name: '프로모션', count: templates.filter(t => t.category === 'promotion').length },
    { id: 'real-estate', name: '부동산', count: templates.filter(t => t.category === 'real-estate').length },
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">템플릿 갤러리</h1>
          <p className="text-gray-600 mt-2">랜딩 페이지 템플릿을 관리하고 커스터마이즈하세요</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 템플릿
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 템플릿</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
            <Layers className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">활성 템플릿</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.status === 'active').length}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">평균 전환율</p>
              <p className="text-2xl font-bold text-gray-900">17.2%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 사용 횟수</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.reduce((acc, t) => acc + t.usage_count, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Categories */}
          <div className="flex-1">
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="템플릿 검색..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">템플릿을 불러오는 중...</div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <FileText className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500">검색 결과가 없습니다</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Layers className="w-16 h-16 text-white/50" />
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(template.status)}`}>
                    {template.status === 'active' && '활성'}
                    {template.status === 'draft' && '초안'}
                    {template.status === 'archived' && '보관'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <div className="relative group">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template)
                          setShowPreviewModal(true)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        미리보기
                      </button>
                      <button
                        onClick={() => window.location.href = `/editor/templates/${template.id}`}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        편집
                      </button>
                      <button
                        onClick={() => handleDuplicate(template)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        복제
                      </button>
                      <button
                        onClick={() => handleArchive(template)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        보관
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => handleDelete(template)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                {/* Category Badge */}
                <div className="mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(template.category)}`}>
                    {template.category === 'insurance' && '보험'}
                    {template.category === 'review' && '리뷰'}
                    {template.category === 'promotion' && '프로모션'}
                    {template.category === 'real-estate' && '부동산'}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">
                      <Users className="w-4 h-4 inline mr-1" />
                      {template.usage_count}회
                    </span>
                    <span className="text-gray-500">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      {template.conversion_rate}%
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1 mt-3 flex-wrap">
                  {template.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  템플릿
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용 횟수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전환율
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수정일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map(template => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(template.category)}`}>
                      {template.category === 'insurance' && '보험'}
                      {template.category === 'review' && '리뷰'}
                      {template.category === 'promotion' && '프로모션'}
                      {template.category === 'real-estate' && '부동산'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(template.status)}`}>
                      {template.status === 'active' && '활성'}
                      {template.status === 'draft' && '초안'}
                      {template.status === 'archived' && '보관'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {template.usage_count}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {template.conversion_rate}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(template.updated_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template)
                          setShowPreviewModal(true)
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.location.href = `/editor/templates/${template.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(template)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">새 템플릿 만들기</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  템플릿 유형
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">선택하세요</option>
                  <option value="blank">빈 템플릿</option>
                  <option value="insurance">보험 템플릿</option>
                  <option value="review">리뷰 템플릿</option>
                  <option value="promotion">프로모션 템플릿</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  템플릿 이름
                </label>
                <input
                  type="text"
                  placeholder="예: 새로운 보험 상담 템플릿"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  rows={3}
                  placeholder="템플릿에 대한 간단한 설명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  window.location.href = '/editor/new'
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.name} - 미리보기</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Palette className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-gray-600">템플릿 미리보기 영역</p>
                  <p className="text-sm text-gray-500 mt-2">실제 랜딩 페이지가 여기에 표시됩니다</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">템플릿 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">카테고리:</span>
                      <span className="text-gray-900">{selectedTemplate.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">상태:</span>
                      <span className="text-gray-900">{selectedTemplate.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">생성일:</span>
                      <span className="text-gray-900">
                        {new Date(selectedTemplate.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">성과 지표</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">사용 횟수:</span>
                      <span className="text-gray-900">{selectedTemplate.usage_count}회</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">전환율:</span>
                      <span className="text-gray-900">{selectedTemplate.conversion_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">최종 수정:</span>
                      <span className="text-gray-900">
                        {new Date(selectedTemplate.updated_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => window.location.href = `/editor/templates/${selectedTemplate.id}`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  편집하기
                </button>
                <button
                  onClick={() => handleDuplicate(selectedTemplate)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  복제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}