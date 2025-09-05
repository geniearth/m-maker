'use client'

import { BlockType } from '../types'

interface Testimonial {
  name: string
  age?: string
  rating: number
  content: string
  date: string
  savings?: string
  image?: string
}

interface TestimonialsBlockData {
  title: string
  subtitle?: string
  testimonials: Testimonial[]
}

interface TestimonialsBlockProps {
  block: BlockType
}

export default function TestimonialsBlock({ block }: TestimonialsBlockProps) {
  const data = block.data as TestimonialsBlockData

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ))
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
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
          {data.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  {testimonial.age && (
                    <div className="text-sm text-gray-600">
                      {testimonial.age}
                    </div>
                  )}
                </div>
                <div className="text-lg">{renderStars(testimonial.rating)}</div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-4">
                "{testimonial.content}"
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{testimonial.date}</span>
                {testimonial.savings && (
                  <span className="font-semibold text-green-600">
                    {testimonial.savings}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}