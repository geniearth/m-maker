import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServiceSupabase } from '@/lib/supabase/client'
import crypto from 'crypto'

const otpRequestSchema = z.object({
  phone: z.string().regex(/^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/).optional(),
  email: z.string().email().optional(),
  lead_id: z.string().uuid().optional(),
}).refine(data => data.phone || data.email, {
  message: 'Either phone or email is required',
})

function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendSMSOTP(phone: string, code: string): Promise<boolean> {
  // TODO: Integrate with SMS service (Twilio, Aligo, etc.)
  console.log(`Sending OTP ${code} to ${phone}`)
  return true
}

async function sendEmailOTP(email: string, code: string): Promise<boolean> {
  // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
  console.log(`Sending OTP ${code} to ${email}`)
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = otpRequestSchema.parse(body)
    
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const supabase = getServiceSupabase()
    
    // Check recent attempts from this IP
    const fiveMinutesAgo = new Date()
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)
    
    const { data: recentAttempts, error: attemptError } = await supabase
      .from('otp_attempts')
      .select('id')
      .gte('created_at', fiveMinutesAgo.toISOString())
      .eq('ip_address', ip)
    
    if (!attemptError && recentAttempts && recentAttempts.length >= 3) {
      return NextResponse.json(
        { code: 'RATE_LIMIT', message: 'Too many OTP requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Generate OTP code
    const code = generateOTPCode()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 3) // 3 minutes expiry
    
    // Store OTP attempt
    const otpData = {
      lead_id: validatedData.lead_id || null,
      channel: validatedData.phone ? 'sms' : 'email',
      code,
      expires_at: expiresAt.toISOString(),
      ip_address: ip,
    }
    
    const { data: otpRecord, error: insertError } = await supabase
      .from('otp_attempts')
      .insert(otpData)
      .select('id')
      .single()
    
    if (insertError) {
      console.error('OTP insert error:', insertError)
      return NextResponse.json(
        { code: 'SERVER_ERROR', message: 'Failed to generate OTP' },
        { status: 500 }
      )
    }
    
    // Send OTP
    let sent = false
    if (validatedData.phone) {
      sent = await sendSMSOTP(validatedData.phone, code)
    } else if (validatedData.email) {
      sent = await sendEmailOTP(validatedData.email, code)
    }
    
    if (!sent) {
      return NextResponse.json(
        { code: 'SEND_ERROR', message: 'Failed to send OTP' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      otp_id: otpRecord.id,
      expires_in: 180, // seconds
      message: `OTP sent to ${validatedData.phone || validatedData.email}`,
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