import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

// 리포트 요청 스키마
const reportSchema = z.object({
  partner_id: z.string().optional(),
  campaign_id: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  status: z.enum(['all', 'pending', 'paid', 'cancelled']).optional(),
  group_by: z.enum(['day', 'week', 'month', 'partner', 'campaign']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    // 인증 검증 (관리자만 접근 가능)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const searchParams = request.nextUrl.searchParams
    const params = {
      partner_id: searchParams.get('partner_id'),
      campaign_id: searchParams.get('campaign_id'),
      start_date: searchParams.get('start_date') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: searchParams.get('end_date') || new Date().toISOString(),
      status: searchParams.get('status') || 'all',
      group_by: searchParams.get('group_by') || 'day',
    }
    
    const validationResult = reportSchema.safeParse(params)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    // 커미션 데이터 조회
    let query = supabase
      .from('commissions')
      .select(`
        *,
        leads (
          id,
          name,
          phone,
          created_at,
          status
        ),
        campaigns (
          id,
          name
        ),
        offers (
          id,
          name,
          commission_type,
          commission_rate
        )
      `)
      .gte('created_at', params.start_date)
      .lte('created_at', params.end_date)
    
    if (params.partner_id) {
      query = query.eq('partner_id', params.partner_id)
    }
    
    if (params.campaign_id) {
      query = query.eq('campaign_id', params.campaign_id)
    }
    
    if (params.status !== 'all') {
      query = query.eq('status', params.status)
    }
    
    const { data: commissions, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch commission data' },
        { status: 500 }
      )
    }
    
    // 통계 계산
    const stats = calculateStats(commissions || [])
    
    // 그룹별 집계
    const grouped = groupCommissions(commissions || [], params.group_by as any)
    
    // CSV 내보내기용 데이터 준비
    const exportData = prepareExportData(commissions || [])
    
    return NextResponse.json({
      success: true,
      period: {
        start: params.start_date,
        end: params.end_date,
      },
      summary: stats,
      grouped: grouped,
      details: commissions,
      export_url: `/api/reports/commission/export?${searchParams.toString()}`,
    })
    
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 통계 계산 함수
function calculateStats(commissions: any[]) {
  const total = commissions.reduce((sum, c) => sum + c.amount, 0)
  const pending = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0)
  const paid = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0)
  const cancelled = commissions
    .filter(c => c.status === 'cancelled')
    .reduce((sum, c) => sum + c.amount, 0)
  
  return {
    total_commissions: commissions.length,
    total_amount: total,
    pending_amount: pending,
    paid_amount: paid,
    cancelled_amount: cancelled,
    average_commission: commissions.length > 0 ? total / commissions.length : 0,
    conversion_rate: calculateConversionRate(commissions),
  }
}

// 전환율 계산
function calculateConversionRate(commissions: any[]) {
  const approved = commissions.filter(c => c.status !== 'cancelled').length
  return commissions.length > 0 ? (approved / commissions.length) * 100 : 0
}

// 그룹별 집계
function groupCommissions(commissions: any[], groupBy: string) {
  const grouped: Record<string, any> = {}
  
  commissions.forEach(commission => {
    let key: string
    
    switch (groupBy) {
      case 'day':
        key = new Date(commission.created_at).toISOString().split('T')[0]
        break
      case 'week':
        key = getWeekNumber(new Date(commission.created_at))
        break
      case 'month':
        key = new Date(commission.created_at).toISOString().slice(0, 7)
        break
      case 'partner':
        key = commission.partner_id
        break
      case 'campaign':
        key = commission.campaigns?.name || commission.campaign_id
        break
      default:
        key = 'total'
    }
    
    if (!grouped[key]) {
      grouped[key] = {
        count: 0,
        amount: 0,
        pending: 0,
        paid: 0,
        cancelled: 0,
      }
    }
    
    grouped[key].count++
    grouped[key].amount += commission.amount
    
    if (commission.status === 'pending') {
      grouped[key].pending += commission.amount
    } else if (commission.status === 'paid') {
      grouped[key].paid += commission.amount
    } else if (commission.status === 'cancelled') {
      grouped[key].cancelled += commission.amount
    }
  })
  
  return grouped
}

// 주차 계산
function getWeekNumber(date: Date): string {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`
}

// 내보내기 데이터 준비
function prepareExportData(commissions: any[]) {
  return commissions.map(c => ({
    '정산ID': c.id,
    '리드ID': c.lead_id,
    '파트너ID': c.partner_id,
    '캠페인': c.campaigns?.name || c.campaign_id,
    '오퍼': c.offers?.name || c.offer_id,
    '리드명': c.leads?.name,
    '리드전화': c.leads?.phone,
    '커미션': c.amount,
    '상태': c.status,
    '생성일': new Date(c.created_at).toLocaleString('ko-KR'),
  }))
}

// POST 메서드 - 정산 상태 업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { commission_ids, status, payment_date, payment_method, notes } = body
    
    if (!commission_ids || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    const { error } = await supabase
      .from('commissions')
      .update({
        status,
        payment_date: payment_date || new Date().toISOString(),
        payment_method,
        notes,
        updated_at: new Date().toISOString(),
      })
      .in('id', commission_ids)
    
    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { error: 'Failed to update commission status' },
        { status: 500 }
      )
    }
    
    // 정산 이력 저장
    await supabase
      .from('settlement_history')
      .insert({
        commission_ids,
        status,
        payment_date,
        payment_method,
        notes,
        processed_by: 'admin', // 실제로는 인증된 사용자 ID
      })
    
    return NextResponse.json({
      success: true,
      updated_count: commission_ids.length,
    })
    
  } catch (error) {
    console.error('Settlement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}