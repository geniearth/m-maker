import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServiceSupabase } from '@/lib/supabase/client'

const otpVerifySchema = z.object({
  lead_id: z.string().uuid().optional(),
  otp_id: z.string().uuid().optional(),
  code: z.string().length(6),
}).refine(data => data.lead_id || data.otp_id, {
  message: 'Either lead_id or otp_id is required',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = otpVerifySchema.parse(body)
    
    const supabase = getServiceSupabase()
    
    // Find the OTP attempt
    let query = supabase
      .from('otp_attempts')
      .select('*')
      .eq('code', validatedData.code)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (validatedData.lead_id) {
      query = query.eq('lead_id', validatedData.lead_id)
    } else if (validatedData.otp_id) {
      query = query.eq('id', validatedData.otp_id)
    }
    
    const { data: otpRecords, error: queryError } = await query
    
    if (queryError || !otpRecords || otpRecords.length === 0) {
      // Increment attempt count for rate limiting
      if (validatedData.lead_id) {
        await supabase
          .from('otp_attempts')
          .update({ attempt_count: supabase.raw('attempt_count + 1') })
          .eq('lead_id', validatedData.lead_id)
          .eq('verified', false)
      }
      
      return NextResponse.json(
        { code: 'INVALID_CODE', message: 'Invalid or expired OTP code' },
        { status: 400 }
      )
    }
    
    const otpRecord = otpRecords[0]
    
    // Check attempt count
    if (otpRecord.attempt_count >= 5) {
      return NextResponse.json(
        { code: 'LOCKED', message: 'Too many failed attempts. Please request a new OTP.' },
        { status: 400 }
      )
    }
    
    // Mark as verified
    const { error: updateError } = await supabase
      .from('otp_attempts')
      .update({ verified: true })
      .eq('id', otpRecord.id)
    
    if (updateError) {
      console.error('OTP update error:', updateError)
      return NextResponse.json(
        { code: 'SERVER_ERROR', message: 'Failed to verify OTP' },
        { status: 500 }
      )
    }
    
    // Update lead status if lead_id is present
    if (otpRecord.lead_id) {
      await supabase
        .from('leads')
        .update({ 
          otp_verified: true,
          otp_verified_at: new Date().toISOString(),
          status: 'verified',
          score: supabase.raw('LEAST(score + 20, 100)'), // Add bonus score
        })
        .eq('id', otpRecord.lead_id)
    }
    
    return NextResponse.json({
      success: true,
      verified: true,
      lead_id: otpRecord.lead_id,
      message: 'OTP verified successfully',
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          code: 'VALIDATION', 
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 422 }
      )
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: 'Internal server error' },
      { status: 500 }
    )
  }
}