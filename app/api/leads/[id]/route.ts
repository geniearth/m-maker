import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/leads/[id] - Get lead details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch lead with related data
    const { data: lead, error } = await supabase
      .from('leads')
      .select(`
        *,
        campaigns (
          id,
          name,
          status
        ),
        consents (
          id,
          consent_type,
          consent_value,
          consent_date
        ),
        events (
          id,
          event_type,
          event_data,
          created_at
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

// PUT /api/leads/[id] - Update lead
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Extract lead fields (excluding relations)
    const {
      campaigns,
      consents,
      events,
      ...leadData
    } = body

    // Update lead
    const { data: lead, error } = await supabase
      .from('leads')
      .update({
        ...leadData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Log update event
    await supabase
      .from('events')
      .insert({
        lead_id: id,
        event_type: 'lead_updated',
        event_data: {
          updated_fields: Object.keys(leadData),
          updated_by: 'admin', // In production, get from auth
        },
      })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

// DELETE /api/leads/[id] - Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if lead exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Soft delete by updating status
    const { error } = await supabase
      .from('leads')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      throw error
    }

    // Log deletion event
    await supabase
      .from('events')
      .insert({
        lead_id: id,
        event_type: 'lead_deleted',
        event_data: {
          deleted_by: 'admin', // In production, get from auth
          deleted_at: new Date().toISOString(),
        },
      })

    return NextResponse.json(
      { message: 'Lead deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}

// POST /api/leads/[id]/notes - Add note to lead
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { note } = await request.json()

    if (!note) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      )
    }

    // Check if lead exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, notes')
      .eq('id', id)
      .single()

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Append new note
    const existingNotes = existingLead.notes || []
    const newNote = {
      id: Date.now().toString(),
      content: note,
      created_at: new Date().toISOString(),
      created_by: 'admin', // In production, get from auth
    }

    const updatedNotes = [...existingNotes, newNote]

    // Update lead with new note
    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update({
        notes: updatedNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Log note addition event
    await supabase
      .from('events')
      .insert({
        lead_id: id,
        event_type: 'note_added',
        event_data: newNote,
      })

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error('Error adding note:', error)
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    )
  }
}