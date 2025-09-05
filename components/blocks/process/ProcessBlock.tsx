'use client'

import { BlockType } from '../types'

interface ProcessStep {
  number: string
  title: string
  description: string
  icon?: string
}

interface ProcessBlockData {
  title: string
  subtitle?: string
  steps: ProcessStep[]
}

interface ProcessBlockProps {
  block: BlockType
}

export default function ProcessBlock({ block }: ProcessBlockProps) {
  const data = block.data as ProcessBlockData

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

        <div className="relative">
          <div className="hidden md:block absolute left-0 right-0 top-12 h-0.5 bg-gray-300"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="relative z-10 bg-white">
                  <div className="w-24 h-24 mx-auto mb-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    {step.icon || step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < data.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 text-gray-400">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}