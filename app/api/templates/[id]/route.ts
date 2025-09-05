import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/templates/[id] - Get template details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if it's a predefined template
    if (id === 'insurance') {
      const { insuranceTemplate } = await import('@/lib/templates/insurance-template')
      return NextResponse.json(insuranceTemplate)
    } else if (id === 'review') {
      const { reviewTemplate } = await import('@/lib/templates/review-template')
      return NextResponse.json(reviewTemplate)
    } else if (id === 'promotion') {
      const { promotionTemplate } = await import('@/lib/templates/promotion-template')
      return NextResponse.json(promotionTemplate)
    }

    // Fetch from database
    const { data: template, error } = await supabase
      .from('templates')
      .select(`
        *,
        campaigns (
          id,
          name,
          status
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// PUT /api/templates/[id] - Update template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.blocks) {
      return NextResponse.json(
        { error: 'Name and blocks are required' },
        { status: 400 }
      )
    }

    // Update template
    const { data: template, error } = await supabase
      .from('templates')
      .update({
        name: body.name,
        description: body.description,
        blocks: body.blocks,
        settings: body.settings,
        category: body.category,
        tags: body.tags,
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Log update event
    await supabase
      .from('events')
      .insert({
        event_type: 'template_updated',
        event_data: {
          template_id: id,
          updated_by: 'admin', // In production, get from auth
          changes: {
            name: body.name,
            blocks_count: body.blocks.length,
          },
        },
      })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE /api/templates/[id] - Delete template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if template is being used by campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('template_id', id)
      .limit(1)

    if (campaigns && campaigns.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete template that is being used by campaigns' },
        { status: 400 }
      )
    }

    // Soft delete template
    const { error } = await supabase
      .from('templates')
      .update({
        status: 'archived',
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Log deletion event
    await supabase
      .from('events')
      .insert({
        event_type: 'template_deleted',
        event_data: {
          template_id: id,
          deleted_by: 'admin', // In production, get from auth
          deleted_at: new Date().toISOString(),
        },
      })

    return NextResponse.json(
      { message: 'Template archived successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}

// POST /api/templates/[id]/duplicate - Duplicate template
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { name } = await request.json()

    // Fetch original template
    const { data: originalTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
      throw fetchError
    }

    // Create duplicate
    const newTemplate = {
      name: name || `${originalTemplate.name} (Copy)`,
      description: originalTemplate.description,
      blocks: originalTemplate.blocks,
      settings: originalTemplate.settings,
      category: originalTemplate.category,
      tags: originalTemplate.tags,
      status: 'draft',
      usage_count: 0,
      conversion_rate: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: duplicatedTemplate, error: insertError } = await supabase
      .from('templates')
      .insert(newTemplate)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Log duplication event
    await supabase
      .from('events')
      .insert({
        event_type: 'template_duplicated',
        event_data: {
          original_id: id,
          duplicate_id: duplicatedTemplate.id,
          created_by: 'admin', // In production, get from auth
        },
      })

    return NextResponse.json(duplicatedTemplate, { status: 201 })
  } catch (error) {
    console.error('Error duplicating template:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate template' },
      { status: 500 }
    )
  }
}

// PATCH /api/templates/[id]/publish - Publish/unpublish template
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { publish } = await request.json()

    const newStatus = publish ? 'active' : 'draft'

    const { data: template, error } = await supabase
      .from('templates')
      .update({
        status: newStatus,
        published_at: publish ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Log publish event
    await supabase
      .from('events')
      .insert({
        event_type: publish ? 'template_published' : 'template_unpublished',
        event_data: {
          template_id: id,
          status: newStatus,
          updated_by: 'admin', // In production, get from auth
        },
      })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error updating template status:', error)
    return NextResponse.json(
      { error: 'Failed to update template status' },
      { status: 500 }
    )
  }
}