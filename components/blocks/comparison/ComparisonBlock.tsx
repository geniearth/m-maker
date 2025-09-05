'use client'

import { BlockType } from '../types'

interface ComparisonFeature {
  text: string
  value: string
  positive?: boolean
  negative?: boolean
}

interface ComparisonColumn {
  title: string
  highlight?: boolean
  badge?: string
  features: ComparisonFeature[]
}

interface ComparisonBlockData {
  title: string
  subtitle?: string
  columns: ComparisonColumn[]
}

interface ComparisonBlockProps {
  block: BlockType
}

export default function ComparisonBlock({ block }: ComparisonBlockProps) {
  const data = block.data as ComparisonBlockData

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-lg text-gray-600">{data.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.columns.map((column, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden ${
                column.highlight
                  ? 'ring-2 ring-blue-500 shadow-xl'
                  : 'border border-gray-200'
              }`}
            >
              <div
                className={`p-6 text-center ${
                  column.highlight
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gray-50'
                }`}
              >
                {column.badge && (
                  <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold bg-yellow-400 text-gray-900 rounded-full">
                    {column.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold">{column.title}</h3>
              </div>

              <div className="p-6 bg-white">
                {column.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-700">{feature.text}</span>
                    <span
                      className={`font-semibold ${
                        feature.positive
                          ? 'text-green-600'
                          : feature.negative
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {feature.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}