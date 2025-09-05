import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

const unsubscribeSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  reason: z.string().optional(),
  channels: z.object({
    sms: z.boolean(),
    email: z.boolean(),
    kakao: z.boolean(),
    all: z.boolean(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 데이터 검증
    const validationResult = unsubscribeSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const data = validationResult.data
    
    // 연락처 또는 이메일 필수 체크
    if (!data.phone && !data.email) {
      return NextResponse.json(
        { error: 'Phone or email is required' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    // 기존 리드 찾기
    let query = supabase
      .from('leads')
      .select('id, marketing_sms, marketing_email, marketing_kakao')
    
    if (data.phone) {
      query = query.eq('phone', data.phone.replace(/-/g, ''))
    } else if (data.email) {
      query = query.eq('email', data.email)
    }
    
    const { data: leads, error: searchError } = await query
    
    if (searchError) {
      console.error('Search error:', searchError)
      return NextResponse.json(
        { error: 'Failed to process unsubscribe request' },
        { status: 500 }
      )
    }
    
    if (!leads || leads.length === 0) {
      // 리드가 없어도 수신거부 기록은 남김
      const { error: logError } = await supabase
        .from('unsubscribe_logs')
        .insert({
          phone: data.phone,
          email: data.email,
          reason: data.reason,
          channels: data.channels,
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        })
      
      if (logError) {
        console.error('Log error:', logError)
      }
      
      return NextResponse.json({ success: true })
    }
    
    // 모든 해당 리드의 마케팅 수신 동의 업데이트
    for (const lead of leads) {
      const updateData: any = {}
      
      if (data.channels.all || data.channels.sms) {
        updateData.marketing_sms = false
      }
      if (data.channels.all || data.channels.email) {
        updateData.marketing_email = false
      }
      if (data.channels.all || data.channels.kakao) {
        updateData.marketing_kakao = false
      }
      
      const { error: updateError } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', lead.id)
      
      if (updateError) {
        console.error('Update error:', updateError)
      }
      
      // 수신거부 이력 저장
      await supabase
        .from('lead_consents')
        .insert({
          lead_id: lead.id,
          consent_type: 'unsubscribe',
          consent_given: false,
          consent_text: `수신거부 채널: ${Object.entries(data.channels)
            .filter(([k, v]) => v && k !== 'all')
            .map(([k]) => k.toUpperCase())
            .join(', ')}`,
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
        })
    }
    
    // 수신거부 로그 저장
    const { error: logError } = await supabase
      .from('unsubscribe_logs')
      .insert({
        phone: data.phone,
        email: data.email,
        reason: data.reason,
        channels: data.channels,
        lead_ids: leads.map(l => l.id),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        processed_at: new Date().toISOString(),
      })
    
    if (logError) {
      console.error('Log error:', logError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Unsubscribe request processed successfully',
      affected_count: leads.length,
    })
    
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET 메서드 - 수신거부 상태 확인
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const phone = searchParams.get('phone')
  const email = searchParams.get('email')
  
  if (!phone && !email) {
    return NextResponse.json(
      { error: 'Phone or email is required' },
      { status: 400 }
    )
  }
  
  const supabase = createClient()
  
  let query = supabase
    .from('leads')
    .select('marketing_sms, marketing_email, marketing_kakao')
  
  if (phone) {
    query = query.eq('phone', phone.replace(/-/g, ''))
  } else if (email) {
    query = query.eq('email', email)
  }
  
  const { data: lead, error } = await query.single()
  
  if (error || !lead) {
    return NextResponse.json({
      subscribed: {
        sms: false,
        email: false,
        kakao: false,
      },
      message: 'No subscription found',
    })
  }
  
  return NextResponse.json({
    subscribed: {
      sms: lead.marketing_sms || false,
      email: lead.marketing_email || false,
      kakao: lead.marketing_kakao || false,
    },
  })
}