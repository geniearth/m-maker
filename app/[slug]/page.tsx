import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { createClient } from '@supabase/supabase-js'

// Dynamic imports for blocks
const HeroBlock = dynamic(() => import('@/components/blocks/HeroBlock'))
const BenefitsBlock = dynamic(() => import('@/components/blocks/BenefitsBlock'))
const ComparisonBlock = dynamic(() => import('@/components/blocks/ComparisonBlock'))
const TestimonialsBlock = dynamic(() => import('@/components/blocks/TestimonialsBlock'))
const ProcessBlock = dynamic(() => import('@/components/blocks/ProcessBlock'))
const UrgencyBlock = dynamic(() => import('@/components/blocks/UrgencyBlock'))
const FormBlock = dynamic(() => import('@/components/blocks/FormBlock'))
const DisclosureBlock = dynamic(() => import('@/components/blocks/DisclosureBlock'))

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map block types to components
const blockComponents: Record<string, any> = {
  hero: HeroBlock,
  benefits: BenefitsBlock,
  comparison: ComparisonBlock,
  testimonials: TestimonialsBlock,
  process: ProcessBlock,
  urgency: UrgencyBlock,
  form: FormBlock,
  disclosure: DisclosureBlock,
}

interface PageData {
  id: string
  slug: string
  name: string
  description: string
  blocks: Array<{
    id: string
    type: string
    content: any
    settings: any
    visible: boolean
  }>
  settings: {
    theme?: string
    primaryColor?: string
    fontFamily?: string
    customCss?: string
    seo?: {
      title?: string
      description?: string
      keywords?: string
      ogImage?: string
    }
  }
  campaign_id?: string
  template_id?: string
  status: string
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pageData = await getPageData(params.slug)
  
  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }

  const seo = pageData.settings?.seo || {}
  
  return {
    title: seo.title || pageData.name || 'Landing Page',
    description: seo.description || pageData.description || 'Welcome to our landing page',
    keywords: seo.keywords || '',
    openGraph: {
      title: seo.title || pageData.name,
      description: seo.description || pageData.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  }
}

// Fetch page data from database or predefined templates
async function getPageData(slug: string): Promise<PageData | null> {
  try {
    // Check predefined demo pages
    if (slug === 'demo-insurance') {
      const { insuranceTemplate } = await import('@/lib/templates/insurance-template')
      return {
        id: 'demo-insurance',
        slug: 'demo-insurance',
        name: insuranceTemplate.name,
        description: insuranceTemplate.description,
        blocks: insuranceTemplate.blocks,
        settings: insuranceTemplate.settings,
        status: 'active',
      }
    } else if (slug === 'demo-review') {
      const { reviewTemplate } = await import('@/lib/templates/review-template')
      return {
        id: 'demo-review',
        slug: 'demo-review',
        name: reviewTemplate.name,
        description: reviewTemplate.description,
        blocks: reviewTemplate.blocks,
        settings: reviewTemplate.settings,
        status: 'active',
      }
    } else if (slug === 'demo-promotion') {
      const { promotionTemplate } = await import('@/lib/templates/promotion-template')
      return {
        id: 'demo-promotion',
        slug: 'demo-promotion',
        name: promotionTemplate.name,
        description: promotionTemplate.description,
        blocks: promotionTemplate.blocks,
        settings: promotionTemplate.settings,
        status: 'active',
      }
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('landing_pages')
      .select(`
        *,
        campaigns (
          id,
          name,
          status
        ),
        templates (
          id,
          name,
          blocks,
          settings
        )
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      console.error('Page not found:', slug, error)
      return null
    }

    // If page uses a template, merge template data
    if (data.template_id && data.templates) {
      return {
        ...data,
        blocks: data.blocks || data.templates.blocks,
        settings: { ...data.templates.settings, ...data.settings },
      }
    }

    return data
  } catch (error) {
    console.error('Error fetching page data:', error)
    return null
  }
}

// Track page view
async function trackPageView(pageId: string, slug: string) {
  try {
    await supabase.from('events').insert({
      event_type: 'page_view',
      event_data: {
        page_id: pageId,
        slug,
        timestamp: new Date().toISOString(),
        user_agent: 'server-side', // In production, get from headers
      },
    })
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

export default async function LandingPage({ params }: { params: { slug: string } }) {
  const pageData = await getPageData(params.slug)

  if (!pageData) {
    notFound()
  }

  // Track page view
  await trackPageView(pageData.id, params.slug)

  // Apply custom settings
  const { theme = 'light', primaryColor = '#3b82f6', fontFamily = 'Pretendard', customCss } = pageData.settings

  return (
    <>
      {/* Custom styles */}
      {(primaryColor || fontFamily || customCss) && (
        <style jsx global>{`
          :root {
            --primary-color: ${primaryColor};
          }
          body {
            font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          ${customCss || ''}
        `}</style>
      )}

      {/* Page content */}
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-gray-900">
          {/* Render blocks */}
          {pageData.blocks
            .filter(block => block.visible !== false)
            .map(block => {
              const BlockComponent = blockComponents[block.type]
              
              if (!BlockComponent) {
                console.warn(`Unknown block type: ${block.type}`)
                return null
              }

              return (
                <BlockComponent
                  key={block.id}
                  content={block.content}
                  settings={block.settings}
                  campaignId={pageData.campaign_id}
                  pageSlug={params.slug}
                />
              )
            })}

          {/* Always include disclosure at the bottom if not already present */}
          {!pageData.blocks.some(b => b.type === 'disclosure') && (
            <DisclosureBlock
              content={{}}
              settings={{}}
              campaignId={pageData.campaign_id}
              pageSlug={params.slug}
            />
          )}
        </div>
      </div>

      {/* Tracking pixels - only render if IDs are configured */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
      )}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        />
      )}
    </>
  )
}