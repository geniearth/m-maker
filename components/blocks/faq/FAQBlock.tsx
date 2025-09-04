'use client'

import React, { useState } from 'react'
import { FAQBlock } from '../types'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQBlockProps {
  block: FAQBlock
  editable?: boolean
  onEdit?: (data: FAQBlock['data']) => void
}

export default function FAQBlockComponent({ block, editable = false, onEdit }: FAQBlockProps) {
  const { data } = block
  const [openItems, setOpenItems] = useState<number[]>(
    data.expandFirst ? [0] : []
  )

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Group items by category if categories exist
  const groupedItems = data.items.reduce((acc, item, index) => {
    const category = item.category || 'General'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push({ ...item, originalIndex: index })
    return acc
  }, {} as Record<string, any[]>)

  const categories = Object.keys(groupedItems)
  const hasCategories = data.items.some(item => item.category)

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          {data.title && (
            editable ? (
              <input
                type="text"
                value={data.title}
                onChange={(e) => onEdit?.({ ...data, title: e.target.value })}
                className="text-3xl md:text-4xl font-bold mb-4 bg-transparent border-b border-dashed border-gray-300 mx-auto text-center"
              />
            ) : (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {data.title}
              </h2>
            )
          )}

          {data.subtitle && (
            editable ? (
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => onEdit?.({ ...data, subtitle: e.target.value })}
                className="text-lg text-gray-600 bg-transparent border-b border-dashed border-gray-300 mx-auto text-center"
              />
            ) : (
              <p className="text-lg text-gray-600">
                {data.subtitle}
              </p>
            )
          )}
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {hasCategories ? (
            // Categorized view
            categories.map(category => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {category}
                </h3>
                <div className="space-y-4">
                  {groupedItems[category].map((item: any) => (
                    <FAQItem
                      key={item.originalIndex}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openItems.includes(item.originalIndex)}
                      onToggle={() => toggleItem(item.originalIndex)}
                      editable={editable}
                      onEdit={(question, answer) => {
                        if (onEdit) {
                          const newItems = [...data.items]
                          newItems[item.originalIndex] = { ...newItems[item.originalIndex], question, answer }
                          onEdit({ ...data, items: newItems })
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Simple list view
            <div className="space-y-4">
              {data.items.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openItems.includes(index)}
                  onToggle={() => toggleItem(index)}
                  editable={editable}
                  onEdit={(question, answer) => {
                    if (onEdit) {
                      const newItems = [...data.items]
                      newItems[index] = { ...newItems[index], question, answer }
                      onEdit({ ...data, items: newItems })
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Schema.org FAQ structured data */}
        {!editable && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                'mainEntity': data.items.map(item => ({
                  '@type': 'Question',
                  'name': item.question,
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': item.answer,
                  },
                })),
              }),
            }}
          />
        )}
      </div>
    </section>
  )
}

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  editable?: boolean
  onEdit?: (question: string, answer: string) => void
}

function FAQItem({ question, answer, isOpen, onToggle, editable, onEdit }: FAQItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        {editable ? (
          <input
            type="text"
            value={question}
            onChange={(e) => onEdit?.(e.target.value, answer)}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 font-medium text-gray-900 bg-transparent border-b border-dashed border-gray-300"
          />
        ) : (
          <span className="flex-1 font-medium text-gray-900">
            {question}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 ml-4" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200">
          {editable ? (
            <textarea
              value={answer}
              onChange={(e) => onEdit?.(question, e.target.value)}
              className="w-full text-gray-600 bg-transparent border border-dashed border-gray-300 p-2"
              rows={4}
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap">
              {answer}
            </p>
          )}
        </div>
      )}
    </div>
  )
}