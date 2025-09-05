export interface Template {
  id: string
  name: string
  description: string
  category: 'insurance' | 'review' | 'promotion'
  thumbnail?: string
  blocks: any[] // BlockType[] from components/blocks/types
  settings: TemplateSettings
}

export interface TemplateSettings {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  borderRadius: 'none' | 'sm' | 'md' | 'lg'
  spacing: 'compact' | 'normal' | 'relaxed'
}

export const defaultTemplateSettings: TemplateSettings = {
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  fontFamily: 'Pretendard',
  borderRadius: 'md',
  spacing: 'normal',
}