-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types
CREATE TYPE lead_status AS ENUM ('new', 'verified', 'routed', 'valid', 'invalid', 'duplicated');
CREATE TYPE consent_type AS ENUM ('privacy_required', 'marketing_optional', 'thirdparty_optional');
CREATE TYPE payout_type AS ENUM ('CPL', 'CPA', 'RevShare');
CREATE TYPE user_role AS ENUM ('admin', 'marketer', 'sales', 'partner');

-- Campaigns table
CREATE TABLE campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(255),
    settings JSONB DEFAULT '{}',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- Offers table
CREATE TABLE offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    payout_type payout_type NOT NULL,
    payout_value DECIMAL(10, 2),
    cap_daily INTEGER,
    cap_monthly INTEGER,
    rules JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- Leads table
CREATE TABLE leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id),
    offer_id UUID REFERENCES offers(id),
    
    -- UTM parameters
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    
    -- Tracking IDs
    click_id VARCHAR(255),
    sub_id VARCHAR(255),
    gclid VARCHAR(255),
    kclid VARCHAR(255),
    nclick VARCHAR(255),
    fbp VARCHAR(255),
    fbc VARCHAR(255),
    
    -- User data
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    
    -- Form data (encrypted)
    name_encrypted TEXT,
    email_hash VARCHAR(64),
    phone_hash VARCHAR(64),
    form_payload JSONB DEFAULT '{}',
    
    -- Verification
    otp_verified BOOLEAN DEFAULT false,
    otp_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Scoring and status
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    status lead_status DEFAULT 'new',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    routed_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_offer_id (offer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email_phone (email_hash, phone_hash)
);

-- Consents table
CREATE TABLE consents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    type consent_type NOT NULL,
    version VARCHAR(20) NOT NULL,
    text_hash VARCHAR(64),
    channel VARCHAR(50),
    granted BOOLEAN NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    
    -- Indexes
    INDEX idx_lead_id (lead_id),
    INDEX idx_type (type),
    INDEX idx_granted_at (granted_at)
);

-- Pages table (for landing pages)
CREATE TABLE pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id),
    template_id UUID,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    og_image VARCHAR(500),
    
    -- Page content
    blocks JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    
    -- Publishing
    status VARCHAR(50) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    published_by UUID,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    parent_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    
    -- Indexes
    INDEX idx_slug (slug),
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_status (status)
);

-- Templates table
CREATE TABLE templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- insurance, review, generic
    description TEXT,
    thumbnail VARCHAR(500),
    blocks JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- Postbacks table
CREATE TABLE postbacks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partner VARCHAR(100) NOT NULL,
    endpoint VARCHAR(500),
    method VARCHAR(10) DEFAULT 'POST',
    headers JSONB DEFAULT '{}',
    payload JSONB DEFAULT '{}',
    response JSONB,
    status INTEGER,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_partner (partner),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Webhook logs table
CREATE TABLE webhook_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    target VARCHAR(100) NOT NULL,
    url VARCHAR(500),
    method VARCHAR(10) DEFAULT 'POST',
    headers JSONB DEFAULT '{}',
    body JSONB DEFAULT '{}',
    response TEXT,
    status INTEGER,
    error TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_target (target),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Clicks table (for tracking)
CREATE TABLE clicks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id),
    offer_id UUID REFERENCES offers(id),
    click_id VARCHAR(255) UNIQUE,
    params JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_click_id (click_id),
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_created_at (created_at)
);

-- Users table (for admin)
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    role user_role DEFAULT 'marketer',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
);

-- Disclosures table
CREATE TABLE disclosures (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    version VARCHAR(20) NOT NULL,
    position VARCHAR(20) DEFAULT 'bottom',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campaign-Offer relationships
CREATE TABLE campaign_offers (
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    PRIMARY KEY (campaign_id, offer_id)
);

-- Lead routing rules
CREATE TABLE routing_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    priority INTEGER DEFAULT 0,
    conditions JSONB DEFAULT '{}',
    actions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lead duplicates tracking
CREATE TABLE lead_duplicates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    original_lead_id UUID REFERENCES leads(id),
    duplicate_lead_id UUID,
    match_type VARCHAR(50),
    match_score DECIMAL(3, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OTP attempts tracking
CREATE TABLE otp_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id),
    channel VARCHAR(20) NOT NULL,
    code VARCHAR(10),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempt_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_lead_id (lead_id),
    INDEX idx_expires_at (expires_at)
);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to all tables with updated_at
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_disclosures_updated_at BEFORE UPDATE ON disclosures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_routing_rules_updated_at BEFORE UPDATE ON routing_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;