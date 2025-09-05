import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    // 인증 검증
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const searchParams = request.nextUrl.searchParams
    const partnerId = searchParams.get('partner_id')
    const campaignId = searchParams.get('campaign_id')
    const startDate = searchParams.get('start_date') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get('end_date') || new Date().toISOString()
    const status = searchParams.get('status') || 'all'
    
    const supabase = createClient()
    
    // 데이터 조회
    let query = supabase
      .from('commissions')
      .select(`
        *,
        leads (
          id,
          name,
          phone,
          email,
          created_at,
          status,
          region,
          age,
          gender
        ),
        campaigns (
          id,
          name,
          type
        ),
        offers (
          id,
          name,
          commission_type,
          commission_rate
        ),
        postbacks (
          conversion_time,
          sub_id,
          sub_id2,
          sub_id3
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
    
    if (partnerId) {
      query = query.eq('partner_id', partnerId)
    }
    
    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }
    
    if (status !== 'all') {
      query = query.eq('status', status)
    }
    
    const { data: commissions, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }
    
    // CSV 생성
    const csv = generateCSV(commissions || [])
    
    // 한글 파일명 인코딩
    const fileName = `정산리포트_${new Date().toISOString().split('T')[0]}.csv`
    const encodedFileName = encodeURIComponent(fileName)
    
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateCSV(commissions: any[]): string {
  // BOM 추가 (Excel에서 한글 깨짐 방지)
  const BOM = '\uFEFF'
  
  // CSV 헤더
  const headers = [
    '정산ID',
    '생성일시',
    '파트너ID',
    '캠페인명',
    '오퍼명',
    '리드ID',
    '리드명',
    '연락처',
    '이메일',
    '지역',
    '연령',
    '성별',
    '리드상태',
    '전환일시',
    'Sub ID',
    'Sub ID2',
    'Sub ID3',
    '커미션타입',
    '커미션율',
    '커미션금액',
    '정산상태',
    '지급일',
    '지급방법',
    '비고',
  ]
  
  // CSV 데이터
  const rows = commissions.map(c => {
    const lead = c.leads || {}
    const campaign = c.campaigns || {}
    const offer = c.offers || {}
    const postback = c.postbacks?.[0] || {}
    
    return [
      c.id,
      formatDate(c.created_at),
      c.partner_id,
      campaign.name || c.campaign_id,
      offer.name || c.offer_id,
      lead.id || c.lead_id,
      lead.name || '',
      formatPhone(lead.phone || ''),
      lead.email || '',
      lead.region || '',
      lead.age || '',
      formatGender(lead.gender),
      formatStatus(lead.status),
      formatDate(postback.conversion_time),
      postback.sub_id || '',
      postback.sub_id2 || '',
      postback.sub_id3 || '',
      formatCommissionType(offer.commission_type),
      offer.commission_rate ? `${offer.commission_rate}%` : '',
      formatCurrency(c.amount),
      formatStatus(c.status),
      formatDate(c.payment_date),
      c.payment_method || '',
      c.notes || '',
    ]
  })
  
  // CSV 문자열 생성
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // 셀에 쉼표, 줄바꿈, 따옴표가 있으면 따옴표로 감싸기
        const cellStr = String(cell || '')
        if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
          return `"${cellStr.replace(/"/g, '""')}"`
        }
        return cellStr
      }).join(',')
    ),
  ].join('\n')
  
  return BOM + csvContent
}

// 날짜 포맷
function formatDate(date: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 전화번호 포맷
function formatPhone(phone: string): string {
  if (!phone) return ''
  // 010-1234-5678 형식으로 변환
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}

// 성별 포맷
function formatGender(gender: string | null): string {
  const genderMap: Record<string, string> = {
    male: '남성',
    female: '여성',
    other: '기타',
  }
  return genderMap[gender || ''] || ''
}

// 상태 포맷
function formatStatus(status: string | null): string {
  const statusMap: Record<string, string> = {
    pending: '대기',
    approved: '승인',
    rejected: '거절',
    converted: '전환완료',
    paid: '지급완료',
    cancelled: '취소',
  }
  return statusMap[status || ''] || status || ''
}

// 커미션 타입 포맷
function formatCommissionType(type: string | null): string {
  const typeMap: Record<string, string> = {
    fixed: '고정',
    percentage: '퍼센트',
  }
  return typeMap[type || ''] || ''
}

// 통화 포맷
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount || 0)
}