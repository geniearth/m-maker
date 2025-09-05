'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  TrendingUp, 
  Target, 
  Calendar,
  Download,
  RefreshCw,
  ChevronRight,
  Activity,
  DollarSign,
  Eye
} from 'lucide-react'

interface DashboardStats {
  totalLeads: number
  todayLeads: number
  weekLeads: number
  monthLeads: number
  conversionRate: number
  averageScore: number
  totalRevenue: number
  activeCompaigns: number
}

interface RecentLead {
  id: string
  name: string
  phone: string
  email?: string
  campaign: string
  score: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    todayLeads: 0,
    weekLeads: 0,
    monthLeads: 0,
    conversionRate: 0,
    averageScore: 0,
    totalRevenue: 0,
    activeCompaigns: 0,
  })
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // 실제 구현시 API 호출
      // const response = await fetch('/api/dashboard')
      // const data = await response.json()
      
      // 임시 데이터
      setStats({
        totalLeads: 1234,
        todayLeads: 45,
        weekLeads: 312,
        monthLeads: 1234,
        conversionRate: 15.3,
        averageScore: 72,
        totalRevenue: 4567000,
        activeCompaigns: 8,
      })

      setRecentLeads([
        {
          id: '1',
          name: '김○○',
          phone: '010-****-5678',
          email: 'kim***@email.com',
          campaign: '보험 상담',
          score: 85,
          status: 'converted',
          created_at: '2024-09-05T10:30:00',
        },
        {
          id: '2',
          name: '이○○',
          phone: '010-****-1234',
          email: 'lee***@email.com',
          campaign: '화장품 체험',
          score: 72,
          status: 'pending',
          created_at: '2024-09-05T10:15:00',
        },
        {
          id: '3',
          name: '박○○',
          phone: '010-****-9999',
          campaign: '특가 프로모션',
          score: 65,
          status: 'contacted',
          created_at: '2024-09-05T09:45:00',
        },
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color 
  }: { 
    title: string
    value: string | number
    change?: string
    icon: any
    color: string
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change} from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">실시간 리드 생성 현황 및 성과 지표</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {(['today', 'week', 'month'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === period
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {period === 'today' && '오늘'}
            {period === 'week' && '이번 주'}
            {period === 'month' && '이번 달'}
          </button>
        ))}
        <button
          onClick={fetchDashboardData}
          className="ml-auto px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          새로고침
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="전체 리드"
          value={stats.totalLeads.toLocaleString()}
          change="+12.5%"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="전환율"
          value={`${stats.conversionRate}%`}
          change="+2.1%"
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="평균 스코어"
          value={stats.averageScore}
          change="-0.5%"
          icon={Target}
          color="bg-purple-500"
        />
        <StatCard
          title="예상 수익"
          value={`₩${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          change="+18.2%"
          icon={DollarSign}
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 리드 추이 차트 */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">리드 생성 추이</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <Activity className="w-8 h-8 mr-2" />
            차트 영역 (Chart.js 또는 Recharts 연동 예정)
          </div>
        </div>

        {/* 캠페인별 성과 */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">캠페인별 성과</h3>
          <div className="space-y-4">
            {[
              { name: '보험 상담', leads: 456, conversion: 18.5 },
              { name: '화장품 체험', leads: 342, conversion: 15.2 },
              { name: '특가 프로모션', leads: 289, conversion: 12.8 },
            ].map((campaign, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{campaign.name}</span>
                    <span className="text-sm text-gray-500">{campaign.leads} 리드</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(campaign.leads / 456) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-semibold text-gray-900">{campaign.conversion}%</div>
                  <div className="text-xs text-gray-500">전환율</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">최근 리드</h3>
          <a
            href="/leads"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            전체 보기
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  리드 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  캠페인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  스코어
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성 시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                      {lead.email && (
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{lead.campaign}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(lead.status)}`}>
                      {lead.status === 'pending' && '대기중'}
                      {lead.status === 'contacted' && '연락완료'}
                      {lead.status === 'converted' && '전환완료'}
                      {lead.status === 'rejected' && '거절'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          리포트 내보내기
        </button>
        <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          설정
        </button>
      </div>
    </div>
  )
}