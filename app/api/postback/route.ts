import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

// S2S 포스트백 검증 스키마
const postbackSchema = z.object({
  partner_id: z.string(),
  lead_id: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'duplicate']),
  commission: z.number().optional(),
  conversion_value: z.number().optional(),
  conversion_time: z.string().optional(),
  sub_id: z.string().optional(),
  sub_id2: z.string().optional(),
  sub_id3: z.string().optional(),
  reject_reason: z.string().optional(),
})

// 파트너별 시크릿 키 (실제로는 환경변수나 DB에서 관리)
const PARTNER_SECRETS: Record<string, string> = {
  'partner_001': process.env.PARTNER_001_SECRET || '',
  'partner_002': process.env.PARTNER_002_SECRET || '',
  'partner_003': process.env.PARTNER_003_SECRET || '',
}

// IP 화이트리스트 (선택적)
const ALLOWED_IPS: string[] = [
  // 파트너사 IP 목록
]

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // IP 검증 (선택적)
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    
    if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
      return NextResponse.json(
        { error: 'Unauthorized IP' },
        { status: 403 }
      )
    }
    
    // 인증 검증
    const authHeader = request.headers.get('authorization')
    const apiKey = request.headers.get('x-api-key')
    
    // Request body 파싱
    const body = await request.json()
    
    // 데이터 검증
    const validationResult = postbackSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }
    
    const data = validationResult.data
    
    // 파트너 시크릿 키 검증
    const partnerSecret = PARTNER_SECRETS[data.partner_id]
    if (!partnerSecret || apiKey !== partnerSecret) {
      return NextResponse.json(
        { error: 'Invalid partner credentials' },
        { status: 401 }
      )
    }
    
    const supabase = createClient()
    
    // 리드 존재 여부 확인
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, status, campaign_id, offer_id')
      .eq('id', data.lead_id)
      .single()
    
    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }
    
    // 포스트백 로그 저장
    const { error: logError } = await supabase
      .from('postbacks')
      .insert({
        partner_id: data.partner_id,
        lead_id: data.lead_id,
        status: data.status,
        commission: data.commission,
        conversion_value: data.conversion_value,
        conversion_time: data.conversion_time || new Date().toISOString(),
        sub_id: data.sub_id,
        sub_id2: data.sub_id2,
        sub_id3: data.sub_id3,
        reject_reason: data.reject_reason,
        ip_address: clientIp,
        processing_time: Date.now() - startTime,
      })
    
    if (logError) {
      console.error('Failed to save postback log:', logError)
    }
    
    // 리드 상태 업데이트
    if (data.status === 'approved') {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          status: 'converted',
          conversion_value: data.conversion_value,
          converted_at: data.conversion_time || new Date().toISOString(),
        })
        .eq('id', data.lead_id)
      
      if (updateError) {
        console.error('Failed to update lead status:', updateError)
      }
      
      // 커미션 계산 및 저장
      if (data.commission) {
        await calculateAndSaveCommission({
          lead_id: data.lead_id,
          partner_id: data.partner_id,
          commission: data.commission,
          campaign_id: lead.campaign_id,
          offer_id: lead.offer_id,
        })
      }
    } else if (data.status === 'rejected') {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          status: 'rejected',
          reject_reason: data.reject_reason,
        })
        .eq('id', data.lead_id)
      
      if (updateError) {
        console.error('Failed to update lead status:', updateError)
      }
    }
    
    // 실시간 알림 전송 (웹소켓 또는 푸시 알림)
    await sendRealtimeNotification({
      type: 'postback_received',
      partner_id: data.partner_id,
      lead_id: data.lead_id,
      status: data.status,
    })
    
    return NextResponse.json({
      success: true,
      lead_id: data.lead_id,
      status: data.status,
      processing_time: Date.now() - startTime,
    })
    
  } catch (error) {
    console.error('Postback processing error:', error)
    
    // 에러 로그 저장
    const supabase = createClient()
    await supabase
      .from('webhook_logs')
      .insert({
        type: 'postback_error',
        payload: await request.text(),
        error: error instanceof Error ? error.message : 'Unknown error',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET 메서드 - 포스트백 상태 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const leadId = searchParams.get('lead_id')
  const partnerId = searchParams.get('partner_id')
  
  if (!leadId || !partnerId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }
  
  // API 키 검증
  const apiKey = request.headers.get('x-api-key')
  const partnerSecret = PARTNER_SECRETS[partnerId]
  
  if (!partnerSecret || apiKey !== partnerSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('postbacks')
    .select('*')
    .eq('lead_id', leadId)
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    return NextResponse.json(
      { error: 'Postback not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(data)
}

// 커미션 계산 함수
async function calculateAndSaveCommission(params: {
  lead_id: string
  partner_id: string
  commission: number
  campaign_id: string
  offer_id: string
}) {
  const supabase = createClient()
  
  // 오퍼 정보 조회
  const { data: offer } = await supabase
    .from('offers')
    .select('commission_type, commission_rate')
    .eq('id', params.offer_id)
    .single()
  
  let finalCommission = params.commission
  
  // 커미션 타입에 따른 계산
  if (offer) {
    if (offer.commission_type === 'percentage') {
      // 퍼센트 기반 커미션
      finalCommission = params.commission * (offer.commission_rate / 100)
    }
    // fixed는 그대로 사용
  }
  
  // 커미션 저장
  await supabase
    .from('commissions')
    .insert({
      lead_id: params.lead_id,
      partner_id: params.partner_id,
      campaign_id: params.campaign_id,
      offer_id: params.offer_id,
      amount: finalCommission,
      status: 'pending', // pending, paid, cancelled
    })
}

// 실시간 알림 함수
async function sendRealtimeNotification(data: any) {
  // 웹소켓, SSE, 또는 푸시 알림 서비스 연동
  // 예: Pusher, Socket.io, Firebase 등
  console.log('Sending realtime notification:', data)
}