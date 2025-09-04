export type LeadStatus = 'new' | 'verified' | 'routed' | 'valid' | 'invalid' | 'duplicated'
export type ConsentType = 'privacy_required' | 'marketing_optional' | 'thirdparty_optional'
export type PayoutType = 'CPL' | 'CPA' | 'RevShare'
export type UserRole = 'admin' | 'marketer' | 'sales' | 'partner'

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          settings: Record<string, any>
          start_date: string | null
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
      }
      offers: {
        Row: {
          id: string
          name: string
          description: string | null
          payout_type: PayoutType
          payout_value: number | null
          cap_daily: number | null
          cap_monthly: number | null
          rules: Record<string, any>
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['offers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['offers']['Insert']>
      }
      leads: {
        Row: {
          id: string
          campaign_id: string | null
          offer_id: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          click_id: string | null
          sub_id: string | null
          gclid: string | null
          kclid: string | null
          nclick: string | null
          fbp: string | null
          fbc: string | null
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
          name_encrypted: string | null
          email_hash: string | null
          phone_hash: string | null
          form_payload: Record<string, any>
          otp_verified: boolean
          otp_verified_at: string | null
          score: number
          status: LeadStatus
          created_at: string
          updated_at: string
          routed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      consents: {
        Row: {
          id: string
          lead_id: string
          type: ConsentType
          version: string
          text_hash: string | null
          channel: string | null
          granted: boolean
          granted_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: Omit<Database['public']['Tables']['consents']['Row'], 'id' | 'granted_at'>
        Update: Partial<Database['public']['Tables']['consents']['Insert']>
      }
      pages: {
        Row: {
          id: string
          campaign_id: string | null
          template_id: string | null
          slug: string
          title: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          og_image: string | null
          blocks: any[]
          settings: Record<string, any>
          status: string
          published_at: string | null
          published_by: string | null
          version: number
          parent_id: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['pages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pages']['Insert']>
      }
      templates: {
        Row: {
          id: string
          name: string
          type: string
          description: string | null
          thumbnail: string | null
          blocks: any[]
          settings: Record<string, any>
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['templates']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['templates']['Insert']>
      }
      users: {
        Row: {
          id: string
          email: string
          password_hash: string | null
          name: string | null
          role: UserRole
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      lead_status: LeadStatus
      consent_type: ConsentType
      payout_type: PayoutType
      user_role: UserRole
    }
  }
}