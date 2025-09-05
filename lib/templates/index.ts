export * from './types'
export { insuranceTemplate } from './insurance-template'
export { reviewTemplate } from './review-template'
export { promotionTemplate } from './promotion-template'

import { Template } from './types'
import { insuranceTemplate } from './insurance-template'
import { reviewTemplate } from './review-template'
import { promotionTemplate } from './promotion-template'

export const templates: Template[] = [
  insuranceTemplate,
  reviewTemplate,
  promotionTemplate,
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find(template => template.id === id)
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return templates.filter(template => template.category === category)
}