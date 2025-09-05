'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Block } from './types'

// Dynamic imports for better performance
const HeroBlock = dynamic(() => import('./hero/HeroBlock'))
const FAQBlock = dynamic(() => import('./faq/FAQBlock'))
const FormBlock = dynamic(() => import('./form/FormBlock'))
const BenefitsBlock = dynamic(() => import('./benefits/BenefitsBlock'))
const ComparisonBlock = dynamic(() => import('./comparison/ComparisonBlock'))
const TestimonialsBlock = dynamic(() => import('./testimonials/TestimonialsBlock'))
const ProcessBlock = dynamic(() => import('./process/ProcessBlock'))
const UrgencyBlock = dynamic(() => import('./urgency/UrgencyBlock'))

// Placeholder components for other blocks
const PlaceholderBlock = ({ block }: { block: Block }) => (
  <div className="py-16 bg-gray-100">
    <div className="container">
      <div className="text-center">
        <p className="text-gray-500">
          {block.type.toUpperCase()} Block (Under Construction)
        </p>
        <pre className="mt-4 text-xs text-left bg-white p-4 rounded overflow-auto">
          {JSON.stringify(block.data, null, 2)}
        </pre>
      </div>
    </div>
  </div>
)

interface BlockRendererProps {
  block: Block
  editable?: boolean
  onEdit?: (blockId: string, data: any) => void
}

export default function BlockRenderer({ block, editable = false, onEdit }: BlockRendererProps) {
  const handleEdit = (data: any) => {
    if (onEdit) {
      onEdit(block.id, data)
    }
  }

  // Don't render hidden blocks unless in edit mode
  if (block.isHidden && !editable) {
    return null
  }

  switch (block.type) {
    case 'hero':
      return (
        <HeroBlock 
          block={block as any} 
          editable={editable}
          onEdit={handleEdit}
        />
      )
    
    case 'faq':
      return (
        <FAQBlock 
          block={block as any}
          editable={editable}
          onEdit={handleEdit}
        />
      )
    
    case 'form':
      return (
        <FormBlock 
          block={block as any}
          editable={editable}
          onEdit={handleEdit}
        />
      )
    
    case 'benefits':
      return <BenefitsBlock block={block as any} />
    
    case 'comparison':
      return <ComparisonBlock block={block as any} />
    
    case 'testimonials':
      return <TestimonialsBlock block={block as any} />
    
    case 'process':
      return <ProcessBlock block={block as any} />
    
    case 'urgency':
      return <UrgencyBlock block={block as any} />
    
    // Placeholder for other block types
    case 'features':
    case 'reviews':
    case 'cta':
    case 'pricing':
    case 'trust':
    case 'disclosure':
    case 'footer':
      return <PlaceholderBlock block={block} />
    
    default:
      if (editable) {
        return (
          <div className="py-8 bg-red-50 border border-red-200">
            <div className="container">
              <p className="text-red-600 text-center">
                Unknown block type: {block.type}
              </p>
            </div>
          </div>
        )
      }
      return null
  }
}