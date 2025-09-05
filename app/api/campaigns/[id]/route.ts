import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/campaigns/[id] - Get campaign details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch campaign with related data
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        templates (
          id,
          name,
          blocks,
          settings
        ),
        leads (
          id,
          name,
          phone,
          email,
          status,
          created_at
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Calculate statistics
    const stats = {
      total_leads: campaign.leads?.length || 0,
      conversion_rate: 0,
      avg_lead_score: 0,
      status_breakdown: {} as Record<string, number>,
    }

    if (campaign.leads && campaign.leads.length > 0) {
      // Calculate conversion rate
      const converted = campaign.leads.filter((l: any) => l.status === 'converted').length
      stats.conversion_rate = (converted / campaign.leads.length) * 100

      // Calculate average score
      const totalScore = campaign.leads.reduce((sum: number, l: any) => sum + (l.score || 0), 0)
      stats.avg_lead_score = totalScore / campaign.leads.length

      // Status breakdown
      campaign.leads.forEach((lead: any) => {
        stats.status_breakdown[lead.status] = (stats.status_breakdown[lead.status] || 0) + 1
      })
    }

    return NextResponse.json({
      ...campaign,
      stats,
    })
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    )
  }
}

// PUT /api/campaigns/[id] - Update campaign
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Campaign name is required' },
        { status: 400 }
      )
    }

    // Update campaign
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update({
        name: body.name,
        description: body.description,
        status: body.status,
        settings: body.settings,
        template_id: body.template_id,
        start_date: body.start_date,
        end_date: body.end_date,
        budget: body.budget,
        target_leads: body.target_leads,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Log update event
    await supabase
      .from('events')
      .insert({
        event_type: 'campaign_updated',
        event_data: {
          campaign_id: id,
          updated_by: 'admin', // In production, get from auth
          changes: Object.keys(body),
        },
      })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

// DELETE /api/campaigns/[id] - Delete campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if campaign has leads
    const { data: leads } = await supabase
      .from('leads')
      .select('id')
      .eq('campaign_id', id)
      .limit(1)

    if (leads && leads.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete campaign with existing leads. Archive it instead.' },
        { status: 400 }
      )
    }

    // Soft delete campaign
    const { error } = await supabase
      .from('campaigns')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Log deletion event
    await supabase
      .from('events')
      .insert({
        event_type: 'campaign_deleted',
        event_data: {
          campaign_id: id,
          deleted_by: 'admin', // In production, get from auth
          deleted_at: new Date().toISOString(),
        },
      })

    return NextResponse.json(
      { message: 'Campaign deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}

// POST /api/campaigns/[id]/duplicate - Duplicate campaign
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { name } = await request.json()

    // Fetch original campaign
    const { data: originalCampaign, error: fetchError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        )
      }
      throw fetchError
    }

    // Create duplicate
    const newCampaign = {
      name: name || `${originalCampaign.name} (Copy)`,
      description: originalCampaign.description,
      status: 'draft',
      settings: originalCampaign.settings,
      template_id: originalCampaign.template_id,
      start_date: null,
      end_date: null,
      budget: originalCampaign.budget,
      target_leads: originalCampaign.target_leads,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: duplicatedCampaign, error: insertError } = await supabase
      .from('campaigns')
      .insert(newCampaign)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Log duplication event
    await supabase
      .from('events')
      .insert({
        event_type: 'campaign_duplicated',
        event_data: {
          original_id: id,
          duplicate_id: duplicatedCampaign.id,
          created_by: 'admin', // In production, get from auth
        },
      })

    return NextResponse.json(duplicatedCampaign, { status: 201 })
  } catch (error) {
    console.error('Error duplicating campaign:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate campaign' },
      { status: 500 }
    )
  }
}

// PATCH /api/campaigns/[id]/status - Update campaign status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await request.json()

    const validStatuses = ['draft', 'active', 'paused', 'completed', 'archived']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    // Set start/end dates based on status
    if (status === 'active' && !updateData.start_date) {
      updateData.start_date = new Date().toISOString()
    } else if (status === 'completed' || status === 'archived') {
      updateData.end_date = new Date().toISOString()
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Log status change event
    await supabase
      .from('events')
      .insert({
        event_type: 'campaign_status_changed',
        event_data: {
          campaign_id: id,
          old_status: campaign.status,
          new_status: status,
          updated_by: 'admin', // In production, get from auth
        },
      })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error updating campaign status:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign status' },
      { status: 500 }
    )
  }
}

// GET /api/campaigns/[id]/stats - Get campaign statistics
export async function getStats(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const url = new URL(request.url)
    const period = url.searchParams.get('period') || '7d'

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Fetch leads within date range
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('campaign_id', id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())

    if (error) {
      throw error
    }

    // Calculate statistics
    const stats = {
      period,
      total_leads: leads?.length || 0,
      new_leads: 0,
      converted_leads: 0,
      conversion_rate: 0,
      avg_lead_score: 0,
      daily_breakdown: {} as Record<string, number>,
      hourly_breakdown: {} as Record<string, number>,
      source_breakdown: {} as Record<string, number>,
    }

    if (leads && leads.length > 0) {
      // Count new and converted leads
      stats.new_leads = leads.filter(l => l.status === 'new').length
      stats.converted_leads = leads.filter(l => l.status === 'converted').length
      stats.conversion_rate = (stats.converted_leads / stats.total_leads) * 100

      // Calculate average score
      const totalScore = leads.reduce((sum, l) => sum + (l.score || 0), 0)
      stats.avg_lead_score = totalScore / leads.length

      // Daily breakdown
      leads.forEach(lead => {
        const date = new Date(lead.created_at).toISOString().split('T')[0]
        stats.daily_breakdown[date] = (stats.daily_breakdown[date] || 0) + 1
      })

      // Hourly breakdown (for last 24h)
      if (period === '24h') {
        leads.forEach(lead => {
          const hour = new Date(lead.created_at).getHours()
          stats.hourly_breakdown[hour] = (stats.hourly_breakdown[hour] || 0) + 1
        })
      }

      // Source breakdown
      leads.forEach(lead => {
        const source = lead.utm_source || 'direct'
        stats.source_breakdown[source] = (stats.source_breakdown[source] || 0) + 1
      })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching campaign stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign statistics' },
      { status: 500 }
    )
  }
}