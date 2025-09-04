export type BlockType = 
  | 'hero'
  | 'features'
  | 'comparison'
  | 'faq'
  | 'reviews'
  | 'cta'
  | 'form'
  | 'pricing'
  | 'trust'
  | 'disclosure'
  | 'footer'

export interface BaseBlock {
  id: string
  type: BlockType
  order: number
  isHidden?: boolean
  settings?: Record<string, any>
}

export interface HeroBlock extends BaseBlock {
  type: 'hero'
  data: {
    title: string
    subtitle?: string
    description?: string
    usps?: string[]
    ctaText?: string
    ctaLink?: string
    secondaryCtaText?: string
    secondaryCtaLink?: string
    backgroundImage?: string
    backgroundVideo?: string
  }
}

export interface FeaturesBlock extends BaseBlock {
  type: 'features'
  data: {
    title?: string
    subtitle?: string
    features: Array<{
      icon?: string
      title: string
      description: string
    }>
    layout?: 'grid' | 'list'
  }
}

export interface ComparisonBlock extends BaseBlock {
  type: 'comparison'
  data: {
    title?: string
    subtitle?: string
    companies: string[]
    features: Array<{
      name: string
      values: boolean[] | string[]
    }>
    highlightColumn?: number
  }
}

export interface FAQBlock extends BaseBlock {
  type: 'faq'
  data: {
    title?: string
    subtitle?: string
    items: Array<{
      question: string
      answer: string
      category?: string
    }>
    expandFirst?: boolean
  }
}

export interface ReviewsBlock extends BaseBlock {
  type: 'reviews'
  data: {
    title?: string
    subtitle?: string
    reviews: Array<{
      author: string
      role?: string
      rating: number
      content: string
      image?: string
      date?: string
    }>
    layout?: 'grid' | 'carousel' | 'masonry'
  }
}

export interface CTABlock extends BaseBlock {
  type: 'cta'
  data: {
    title: string
    subtitle?: string
    buttonText: string
    buttonLink?: string
    buttonAction?: 'link' | 'form' | 'scroll'
    backgroundImage?: string
    backgroundColor?: string
  }
}

export interface FormBlock extends BaseBlock {
  type: 'form'
  data: {
    title?: string
    subtitle?: string
    fields: Array<{
      id: string
      type: 'text' | 'email' | 'phone' | 'select' | 'radio' | 'checkbox' | 'textarea'
      label: string
      placeholder?: string
      required?: boolean
      options?: string[]
      validation?: string
    }>
    submitText?: string
    successMessage?: string
    multiStep?: boolean
    steps?: Array<{
      title: string
      fields: string[]
    }>
  }
}

export interface PricingBlock extends BaseBlock {
  type: 'pricing'
  data: {
    title?: string
    subtitle?: string
    plans: Array<{
      name: string
      price: string
      period?: string
      description?: string
      features: string[]
      highlighted?: boolean
      ctaText?: string
      ctaLink?: string
    }>
  }
}

export interface TrustBlock extends BaseBlock {
  type: 'trust'
  data: {
    title?: string
    subtitle?: string
    logos: Array<{
      name: string
      image: string
      link?: string
    }>
    badges: Array<{
      name: string
      image: string
      description?: string
    }>
  }
}

export interface DisclosureBlock extends BaseBlock {
  type: 'disclosure'
  data: {
    content: string
    position?: 'top' | 'middle' | 'bottom'
    style?: 'info' | 'warning' | 'banner'
    icon?: boolean
  }
}

export interface FooterBlock extends BaseBlock {
  type: 'footer'
  data: {
    companyName?: string
    description?: string
    links?: Array<{
      title: string
      items: Array<{
        label: string
        href: string
      }>
    }>
    copyright?: string
    socialLinks?: Array<{
      platform: string
      url: string
    }>
  }
}

export type Block = 
  | HeroBlock
  | FeaturesBlock
  | ComparisonBlock
  | FAQBlock
  | ReviewsBlock
  | CTABlock
  | FormBlock
  | PricingBlock
  | TrustBlock
  | DisclosureBlock
  | FooterBlock

export interface Page {
  id: string
  title: string
  slug: string
  blocks: Block[]
  settings: {
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    ogImage?: string
    favicon?: string
    customCss?: string
    customJs?: string
    tracking?: {
      ga4?: string
      metaPixel?: string
      kakaoPixel?: string
      naverWcs?: string
    }
  }
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}