'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Eye,
  Copy,
  BarChart,
  Users,
  TrendingUp,
  Calendar,
  Link,
  Settings,
  X
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  description: string
  type: 'insurance' | 'review' | 'promotion' | 'custom'
  status: 'draft' | 'active' | 'paused' | 'ended'
  template_id?: string
  landing_url?: string
  start_date: string
  end_date?: string
  budget?: number
  spent?: number
  leads_count: number
  conversion_rate: number
  avg_score: number
  created_at: string
  updated_at: string
}

export default function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'draft' | 'ended'>('all')

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'custom' as Campaign['type'],
    start_date: '',
    end_date: '',
    budget: '',
    template_id: ''
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    try {
      // 실제 구현시 API 호출
      // const response = await fetch('/api/campaigns')
      // const data = await response.json()

      // 임시 데이터
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: '2024 보험 상담 캠페인',
          description: '30-50대 타겟 실비보험 상담 리드 수집',
          type: 'insurance',
          status: 'active',
          template_id: 'insurance-001',
          landing_url: '/landing/insurance-2024',
          start_date: '2024-09-01',
          end_date: '2024-09-30',
          budget: 5000000,
          spent: 2340000,
          leads_count: 456,
          conversion_rate: 18.5,
          avg_score: 78,
          created_at: '2024-08-28T10:00:00',
          updated_at: '2024-09-05T15:30:00'
        },
        {
          id: '2',
          name: '화장품 체험단 모집',
          description: '신제품 출시 기념 체험단 100명 모집',
          type: 'review',
          status: 'active',
          template_id: 'review-001',
          landing_url: '/landing/cosmetic-review',
          start_date: '2024-09-03',
          end_date: '2024-09-10',
          budget: 2000000,
          spent: 890000,
          leads_count: 342,
          conversion_rate: 15.2,
          avg_score: 72,
          created_at: '2024-09-01T14:20:00',
          updated_at: '2024-09-05T10:15:00'
        },
        {
          id: '3',
          name: '블랙프라이데이 특가',
          description: '연말 특가 프로모션 사전예약',
          type: 'promotion',
          status: 'paused',
          template_id: 'promotion-001',
          landing_url: '/landing/black-friday',
          start_date: '2024-11-20',
          end_date: '2024-11-30',
          budget: 10000000,
          spent: 0,
          leads_count: 0,
          conversion_rate: 0,
          avg_score: 0,
          created_at: '2024-09-05T09:00:00',
          updated_at: '2024-09-05T09:00:00'
        },
        {
          id: '4',
          name: '부동산 투자 상담',
          description: '강남 오피스텔 분양 상담',
          type: 'custom',
          status: 'ended',
          landing_url: '/landing/real-estate',
          start_date: '2024-08-01',
          end_date: '2024-08-31',
          budget: 3000000,
          spent: 2980000,
          leads_count: 289,
          conversion_rate: 12.8,
          avg_score: 65,
          created_at: '2024-07-25T11:00:00',
          updated_at: '2024-09-01T00:00:00'
        },
        {
          id: '5',
          name: '교육 프로그램 신청',
          description: '온라인 코딩 부트캠프 사전신청',
          type: 'custom',
          status: 'draft',
          start_date: '2024-10-01',
          budget: 1500000,
          spent: 0,
          leads_count: 0,
          conversion_rate: 0,
          avg_score: 0,
          created_at: '2024-09-05T16:00:00',
          updated_at: '2024-09-05T16:00:00'
        }
      ]

      setCampaigns(mockCampaigns)
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    // API 호출하여 캠페인 생성
    console.log('Creating campaign:', formData)
    setShowCreateModal(false)
    resetForm()
    fetchCampaigns()
  }

  const handleUpdateCampaign = async () => {
    if (!selectedCampaign) return
    // API 호출하여 캠페인 수정
    console.log('Updating campaign:', selectedCampaign.id, formData)
    setShowEditModal(false)
    resetForm()
    fetchCampaigns()
  }

  const handleDeleteCampaign = async (id: string) => {
    if (confirm('정말로 이 캠페인을 삭제하시겠습니까?')) {
      // API 호출하여 캠페인 삭제
      console.log('Deleting campaign:', id)
      fetchCampaigns()
    }
  }

  const handleStatusChange = async (id: string, newStatus: Campaign['status']) => {
    // API 호출하여 상태 변경
    console.log(`Changing campaign ${id} status to ${newStatus}`)
    setCampaigns(prev =>
      prev.map(camp =>
        camp.id === id ? { ...camp, status: newStatus } : camp
      )
    )
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'custom',
      start_date: '',
      end_date: '',
      budget: '',
      template_id: ''
    })
    setSelectedCampaign(null)
  }

  const getStatusBadge = (status: Campaign['status']) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      ended: 'bg-red-100 text-red-800'
    }
    const labels = {
      draft: '초안',
      active: '진행중',
      paused: '일시중지',
      ended: '종료'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getTypeBadge = (type: Campaign['type']) => {
    const styles = {
      insurance: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      promotion: 'bg-red-100 text-red-800',
      custom: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      insurance: '보험',
      review: '리뷰',
      promotion: '프로모션',
      custom: '커스텀'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type]}`}>
        {labels[type]}
      </span>
    )
  }

  const filteredCampaigns = filter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.status === filter)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">캠페인을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">캠페인 관리</h1>
          <p className="text-gray-600 mt-2">마케팅 캠페인 생성 및 관리</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          새 캠페인
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
          <div className="text-sm text-gray-600">전체 캠페인</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-700">
            {campaigns.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-green-600">진행중</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">
            {campaigns.reduce((sum, c) => sum + c.leads_count, 0).toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">총 리드 수</div>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-sm p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-700">
            {campaigns.length > 0 
              ? (campaigns.reduce((sum, c) => sum + c.conversion_rate, 0) / campaigns.length).toFixed(1)
              : 0}%
          </div>
          <div className="text-sm text-purple-600">평균 전환율</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'paused', 'draft', 'ended'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status === 'all' && '전체'}
            {status === 'active' && '진행중'}
            {status === 'paused' && '일시중지'}
            {status === 'draft' && '초안'}
            {status === 'ended' && '종료'}
            {status !== 'all' && (
              <span className="ml-2 text-xs">
                ({campaigns.filter(c => c.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {campaign.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(campaign.status)}
                  {getTypeBadge(campaign.type)}
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    리드
                  </span>
                  <span className="font-semibold text-gray-900">
                    {campaign.leads_count.toLocaleString()}명
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    전환율
                  </span>
                  <span className="font-semibold text-gray-900">
                    {campaign.conversion_rate}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    평균 스코어
                  </span>
                  <span className="font-semibold text-gray-900">
                    {campaign.avg_score}점
                  </span>
                </div>
                {campaign.budget && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">예산 소진율</span>
                    <span className="font-semibold text-gray-900">
                      {((campaign.spent || 0) / campaign.budget * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {campaign.budget && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${((campaign.spent || 0) / campaign.budget) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₩{((campaign.spent || 0) / 1000000).toFixed(1)}M</span>
                    <span>₩{(campaign.budget / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(campaign.start_date).toLocaleDateString('ko-KR')}
                  {campaign.end_date && ` ~ ${new Date(campaign.end_date).toLocaleDateString('ko-KR')}`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {campaign.status === 'active' ? (
                  <button
                    onClick={() => handleStatusChange(campaign.id, 'paused')}
                    className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 flex items-center justify-center gap-1"
                  >
                    <Pause className="h-4 w-4" />
                    일시중지
                  </button>
                ) : campaign.status === 'paused' || campaign.status === 'draft' ? (
                  <button
                    onClick={() => handleStatusChange(campaign.id, 'active')}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center justify-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    시작
                  </button>
                ) : null}
                
                {campaign.landing_url && (
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedCampaign(campaign)
                    setFormData({
                      name: campaign.name,
                      description: campaign.description,
                      type: campaign.type,
                      start_date: campaign.start_date,
                      end_date: campaign.end_date || '',
                      budget: campaign.budget?.toString() || '',
                      template_id: campaign.template_id || ''
                    })
                    setShowEditModal(true)
                  }}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCampaign(campaign.id)}
                  className="px-3 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {showCreateModal ? '새 캠페인 만들기' : '캠페인 수정'}
                </h2>
                <button
                  onClick={() => {
                    showCreateModal ? setShowCreateModal(false) : setShowEditModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    캠페인명
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 2024 가을 프로모션"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="캠페인 설명을 입력하세요"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      캠페인 유형
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Campaign['type'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="insurance">보험</option>
                      <option value="review">리뷰</option>
                      <option value="promotion">프로모션</option>
                      <option value="custom">커스텀</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      템플릿
                    </label>
                    <select
                      value={formData.template_id}
                      onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">템플릿 선택</option>
                      <option value="insurance-001">보험형 템플릿</option>
                      <option value="review-001">리뷰형 템플릿</option>
                      <option value="promotion-001">홍보형 템플릿</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시작일
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      종료일 (선택)
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    예산 (선택)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 5000000"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={showCreateModal ? handleCreateCampaign : handleUpdateCampaign}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {showCreateModal ? '캠페인 생성' : '수정 완료'}
                </button>
                <button
                  onClick={() => {
                    showCreateModal ? setShowCreateModal(false) : setShowEditModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}