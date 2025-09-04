import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServiceSupabase } from '@/lib/supabase/client'
import { generateUUID, hashString } from '@/lib/utils'
import crypto from 'crypto'

// Lead validation schema
const leadCreateSchema = z.object({
  campaign_id: z.string().uuid(),
  offer_id: z.string().uuid(),
  utm: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    content: z.string().optional(),
    term: z.string().optional(),
  }).optional(),
  tracking: z.object({
    click_id: z.string().optional(),
    sub_id: z.string().optional(),
    gclid: z.string().optional(),
    kclid: z.string().optional(),
    nclick: z.string().optional(),
    fbp: z.string().optional(),
    fbc: z.string().optional(),
  }).optional(),
  form: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().optional(),
    phone: z.string().regex(/^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/),
    answers: z.record(z.any()).optional(),
  }),
  consents: z.array(z.object({
    type: z.enum(['privacy_required', 'marketing_optional', 'thirdparty_optional']),
    channel: z.string().optional(),
    version: z.string(),
    granted: z.boolean(),
  })),
})

// Encrypt PII data
function encryptData(text: string): string {
  const algorithm = 'aes-256-gcm'
  const key = Buffer.from(process.env.ENCRYPTION_KEY || 'default-key-for-dev', 'hex')
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
}

// Hash email/phone for duplicate detection
function hashPII(value: string): string {
  return crypto.createHash('sha256').update(value.toLowerCase()).digest('hex')
}

// Check for duplicates
async function checkDuplicate(emailHash: string | null, phoneHash: string): Promise<boolean> {
  const supabase = getServiceSupabase()
  
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data, error } = await supabase
    .from('leads')
    .select('id')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .or(`email_hash.eq.${emailHash},phone_hash.eq.${phoneHash}`)
    .limit(1)
  
  return !error && data && data.length > 0
}

// Calculate lead score
function calculateLeadScore(data: any): number {
  let score = 50 // Base score
  
  // Add points for completeness
  if (data.form.email) score += 10
  if (data.form.answers && Object.keys(data.form.answers).length > 0) {
    score += Math.min(Object.keys(data.form.answers).length * 5, 20)
  }
  
  // Add points for tracking
  if (data.tracking?.gclid || data.tracking?.kclid) score += 10
  
  // Add points for consent
  const marketingConsent = data.consents.find((c: any) => 
    c.type === 'marketing_optional' && c.granted
  )
  if (marketingConsent) score += 10
  
  return Math.min(score, 100)
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const clientId = request.headers.get('X-Client-Id')
    if (!clientId || clientId !== process.env.NEXT_PUBLIC_CLIENT_ID) {
      return NextResponse.json(
        { code: 'UNAUTHORIZED', message: 'Invalid client ID' },
        { status: 401 }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = leadCreateSchema.parse(body)
    
    // Get client info
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''
    
    // Hash PII for duplicate detection
    const emailHash = validatedData.form.email ? 
      hashPII(validatedData.form.email) : null
    const phoneHash = hashPII(validatedData.form.phone)
    
    // Check for duplicates
    const isDuplicate = await checkDuplicate(emailHash, phoneHash)
    if (isDuplicate) {
      return NextResponse.json(
        { code: 'DUPLICATE', message: 'Duplicate lead detected within 30 days' },
        { status: 409 }
      )
    }
    
    // Encrypt name
    const nameEncrypted = encryptData(validatedData.form.name)
    
    // Calculate lead score
    const score = calculateLeadScore(validatedData)
    
    // Prepare lead data
    const leadData = {
      campaign_id: validatedData.campaign_id,
      offer_id: validatedData.offer_id,
      utm_source: validatedData.utm?.source || null,
      utm_medium: validatedData.utm?.medium || null,
      utm_campaign: validatedData.utm?.campaign || null,
      utm_content: validatedData.utm?.content || null,
      utm_term: validatedData.utm?.term || null,
      click_id: validatedData.tracking?.click_id || null,
      sub_id: validatedData.tracking?.sub_id || null,
      gclid: validatedData.tracking?.gclid || null,
      kclid: validatedData.tracking?.kclid || null,
      nclick: validatedData.tracking?.nclick || null,
      fbp: validatedData.tracking?.fbp || null,
      fbc: validatedData.tracking?.fbc || null,
      user_agent: userAgent,
      ip_address: ip,
      referrer,
      name_encrypted: nameEncrypted,
      email_hash: emailHash,
      phone_hash: phoneHash,
      form_payload: validatedData.form.answers || {},
      score,
      status: 'new' as const,
    }
    
    // Insert lead
    const supabase = getServiceSupabase()
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select('id')
      .single()
    
    if (leadError) {
      console.error('Lead insert error:', leadError)
      return NextResponse.json(
        { code: 'SERVER_ERROR', message: 'Failed to create lead' },
        { status: 500 }
      )
    }
    
    // Insert consents
    const consentsData = validatedData.consents.map(consent => ({
      lead_id: lead.id,
      type: consent.type,
      channel: consent.channel || null,
      version: consent.version,
      granted: consent.granted,
      text_hash: hashString(consent.version), // Hash version as proxy for text
      ip_address: ip,
      user_agent: userAgent,
    }))
    
    const { error: consentError } = await supabase
      .from('consents')
      .insert(consentsData)
    
    if (consentError) {
      console.error('Consent insert error:', consentError)
    }
    
    // TODO: Trigger tracking events (GA4, Meta Pixel, etc.)
    // TODO: Trigger webhooks/routing
    
    return NextResponse.json({
      lead_id: lead.id,
      status: 'new',
      score,
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

export async function GET(request: NextRequest) {
  // Admin endpoint to retrieve leads
  // TODO: Add authentication check
  
  const searchParams = request.nextUrl.searchParams
  const campaign_id = searchParams.get('campaign_id')
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  
  const supabase = getServiceSupabase()
  
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (campaign_id) {
    query = query.eq('campaign_id', campaign_id)
  }
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error, count } = await query
  
  if (error) {
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
  
  return NextResponse.json({
    data,
    total: count,
    limit,
    offset,
  })
}