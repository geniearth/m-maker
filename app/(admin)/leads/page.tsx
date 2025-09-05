'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  User,
  X,
  Check
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  age?: string
  gender?: string
  region?: string
  campaign_id: string
  campaign_name: string
  offer_id?: string
  offer_name?: string
  score: number
  status: 'pending' | 'contacted' | 'converted' | 'rejected'
  marketing_sms: boolean
  marketing_email: boolean
  marketing_kakao: boolean
  created_at: string
  updated_at: string
  notes?: string
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // 검색 및 필터
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [campaignFilter, setCampaignFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [searchTerm, statusFilter, campaignFilter, dateFilter, leads])

  const fetchLeads = async () => {
    setIsLoading(true)
    try {
      // 실제 구현시 API 호출
      // const response = await fetch('/api/leads')
      // const data = await response.json()
      
      // 임시 데이터
      const mockLeads: Lead[] = [
        {
          id: '1',
          name: '김민수',
          phone: '010-1234-5678',
          email: 'kim@email.com',
          age: '30대',
          gender: '남성',
          region: '서울',
          campaign_id: 'camp1',
          campaign_name: '보험 상담 캠페인',
          offer_id: 'offer1',
          offer_name: '실비보험 특가',
          score: 85,
          status: 'converted',
          marketing_sms: true,
          marketing_email: true,
          marketing_kakao: false,
          created_at: '2024-09-05T10:30:00',
          updated_at: '2024-09-05T11:00:00',
          notes: '관심도 높음, 즉시 연락 요망'
        },
        {
          id: '2',
          name: '이영희',
          phone: '010-2345-6789',
          email: 'lee@email.com',
          age: '40대',
          gender: '여성',
          region: '부산',
          campaign_id: 'camp2',
          campaign_name: '화장품 체험단',
          score: 72,
          status: 'pending',
          marketing_sms: true,
          marketing_email: false,
          marketing_kakao: true,
          created_at: '2024-09-05T09:15:00',
          updated_at: '2024-09-05T09:15:00'
        },
        {
          id: '3',
          name: '박철수',
          phone: '010-3456-7890',
          age: '50대',
          gender: '남성',
          region: '대구',
          campaign_id: 'camp3',
          campaign_name: '부동산 투자 상담',
          score: 65,
          status: 'contacted',
          marketing_sms: false,
          marketing_email: false,
          marketing_kakao: false,
          created_at: '2024-09-04T15:20:00',
          updated_at: '2024-09-05T08:30:00',
          notes: '저녁 시간대 연락 선호'
        }
      ]
      
      // 더 많은 데이터 생성
      for (let i = 4; i <= 50; i++) {
        mockLeads.push({
          id: i.toString(),
          name: `테스트${i}`,
          phone: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          email: Math.random() > 0.3 ? `test${i}@email.com` : undefined,
          age: ['20대', '30대', '40대', '50대'][Math.floor(Math.random() * 4)],
          gender: ['남성', '여성'][Math.floor(Math.random() * 2)],
          region: ['서울', '부산', '대구', '인천', '광주'][Math.floor(Math.random() * 5)],
          campaign_id: `camp${Math.floor(Math.random() * 3) + 1}`,
          campaign_name: ['보험 상담 캠페인', '화장품 체험단', '부동산 투자 상담'][Math.floor(Math.random() * 3)],
          score: Math.floor(Math.random() * 40) + 60,
          status: ['pending', 'contacted', 'converted', 'rejected'][Math.floor(Math.random() * 4)] as any,
          marketing_sms: Math.random() > 0.5,
          marketing_email: Math.random() > 0.5,
          marketing_kakao: Math.random() > 0.5,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString()
        })
      }
      
      setLeads(mockLeads)
      setFilteredLeads(mockLeads)
      setTotalPages(Math.ceil(mockLeads.length / itemsPerPage))
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterLeads = () => {
    let filtered = [...leads]
    
    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }
    
    // 캠페인 필터
    if (campaignFilter !== 'all') {
      filtered = filtered.filter(lead => lead.campaign_id === campaignFilter)
    }
    
    // 날짜 필터
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
      }
      
      filtered = filtered.filter(lead => 
        new Date(lead.created_at) >= filterDate
      )
    }
    
    setFilteredLeads(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    const labels = {
      pending: '대기중',
      contacted: '연락완료',
      converted: '전환완료',
      rejected: '거절'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const exportToCSV = () => {
    // CSV 내보내기 로직
    console.log('Exporting to CSV...')
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    // API 호출하여 상태 업데이트
    console.log(`Updating lead ${leadId} to ${newStatus}`)
    
    // 로컬 상태 업데이트
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus as any } : lead
      )
    )
  }

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">리드 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">리드 관리</h1>
        <p className="text-gray-600 mt-2">전체 리드 조회 및 관리</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
          <div className="text-sm text-gray-600">전체 리드</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">
            {leads.filter(l => l.status === 'pending').length}
          </div>
          <div className="text-sm text-yellow-600">대기중</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-700">
            {leads.filter(l => l.status === 'converted').length}
          </div>
          <div className="text-sm text-green-600">전환완료</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">
            {Math.round(leads.reduce((acc, l) => acc + l.score, 0) / leads.length)}
          </div>
          <div className="text-sm text-blue-600">평균 스코어</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 전화번호, 이메일 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">모든 상태</option>
            <option value="pending">대기중</option>
            <option value="contacted">연락완료</option>
            <option value="converted">전환완료</option>
            <option value="rejected">거절</option>
          </select>
          
          {/* Campaign Filter */}
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">모든 캠페인</option>
            <option value="camp1">보험 상담 캠페인</option>
            <option value="camp2">화장품 체험단</option>
            <option value="camp3">부동산 투자 상담</option>
          </select>
          
          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">전체 기간</option>
            <option value="today">오늘</option>
            <option value="week">최근 1주일</option>
            <option value="month">최근 1개월</option>
          </select>
          
          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV 내보내기
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  리드 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  캠페인
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  스코어
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  마케팅 수신
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500">
                        {lead.age && `${lead.age} · `}
                        {lead.gender && `${lead.gender} · `}
                        {lead.region}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-900">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.campaign_name}</div>
                    {lead.offer_name && (
                      <div className="text-xs text-gray-500">{lead.offer_name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center justify-center w-12 h-6 text-xs font-semibold rounded ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded ${lead.marketing_sms ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        S
                      </span>
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded ${lead.marketing_email ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        E
                      </span>
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded ${lead.marketing_kakao ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        K
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedLead(lead)
                          setShowDetailModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              전체 {filteredLeads.length}개 중 {((currentPage - 1) * itemsPerPage) + 1}-
              {Math.min(currentPage * itemsPerPage, filteredLeads.length)}개 표시
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">리드 상세 정보</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">기본 정보</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selectedLead.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selectedLead.phone}</span>
                    </div>
                    {selectedLead.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{selectedLead.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selectedLead.region}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">캠페인 정보</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">캠페인: </span>
                      <span className="text-gray-900">{selectedLead.campaign_name}</span>
                    </div>
                    {selectedLead.offer_name && (
                      <div>
                        <span className="text-sm text-gray-600">오퍼: </span>
                        <span className="text-gray-900">{selectedLead.offer_name}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">스코어: </span>
                      <span className={`font-semibold ${getScoreColor(selectedLead.score).split(' ')[0]}`}>
                        {selectedLead.score}점
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">상태: </span>
                      {getStatusBadge(selectedLead.status)}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">마케팅 수신 동의</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedLead.marketing_sms ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                      <span>SMS 수신</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedLead.marketing_email ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                      <span>이메일 수신</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedLead.marketing_kakao ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                      <span>카카오톡 수신</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">시간 정보</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">생성일: </span>
                      <span className="text-gray-900">
                        {new Date(selectedLead.created_at).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">수정일: </span>
                      <span className="text-gray-900">
                        {new Date(selectedLead.updated_at).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedLead.notes && (
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">메모</h3>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedLead.notes}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  상태 변경
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  수정
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}