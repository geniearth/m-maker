'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeroBlock } from '../types'
import { ArrowRight, Check } from 'lucide-react'

interface HeroBlockProps {
  block: HeroBlock
  editable?: boolean
  onEdit?: (data: HeroBlock['data']) => void
}

export default function HeroBlockComponent({ block, editable = false, onEdit }: HeroBlockProps) {
  const { data } = block

  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={data.backgroundImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
      )}
      
      {data.backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 w-full h-full object-cover"
        >
          <source src={data.backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Content */}
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-3xl">
          {editable ? (
            <input
              type="text"
              value={data.title}
              onChange={(e) => onEdit?.({ ...data, title: e.target.value })}
              className="text-4xl md:text-6xl font-bold mb-6 bg-transparent border-b border-dashed border-white/50 text-white w-full"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              {data.title}
            </h1>
          )}

          {data.subtitle && (
            editable ? (
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => onEdit?.({ ...data, subtitle: e.target.value })}
                className="text-2xl md:text-3xl mb-4 bg-transparent border-b border-dashed border-white/30 text-white/90 w-full"
              />
            ) : (
              <h2 className="text-2xl md:text-3xl mb-4 text-white/90">
                {data.subtitle}
              </h2>
            )
          )}

          {data.description && (
            editable ? (
              <textarea
                value={data.description}
                onChange={(e) => onEdit?.({ ...data, description: e.target.value })}
                className="text-lg md:text-xl mb-8 bg-transparent border border-dashed border-white/30 text-white/80 w-full p-2"
                rows={3}
              />
            ) : (
              <p className="text-lg md:text-xl mb-8 text-white/80">
                {data.description}
              </p>
            )
          )}

          {/* USPs */}
          {data.usps && data.usps.length > 0 && (
            <ul className="mb-8 space-y-2">
              {data.usps.map((usp, index) => (
                <li key={index} className="flex items-center text-white/90">
                  <Check className="h-5 w-5 mr-2 text-green-400" />
                  {editable ? (
                    <input
                      type="text"
                      value={usp}
                      onChange={(e) => {
                        const newUsps = [...data.usps!]
                        newUsps[index] = e.target.value
                        onEdit?.({ ...data, usps: newUsps })
                      }}
                      className="bg-transparent border-b border-dashed border-white/30"
                    />
                  ) : (
                    <span>{usp}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            {data.ctaText && (
              editable ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.ctaText}
                    onChange={(e) => onEdit?.({ ...data, ctaText: e.target.value })}
                    className="px-4 py-2 bg-white/20 border border-white/30 text-white"
                    placeholder="CTA Text"
                  />
                  <input
                    type="text"
                    value={data.ctaLink || ''}
                    onChange={(e) => onEdit?.({ ...data, ctaLink: e.target.value })}
                    className="px-4 py-2 bg-white/20 border border-white/30 text-white"
                    placeholder="CTA Link"
                  />
                </div>
              ) : (
                <Link
                  href={data.ctaLink || '#form'}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {data.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )
            )}

            {data.secondaryCtaText && (
              editable ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.secondaryCtaText}
                    onChange={(e) => onEdit?.({ ...data, secondaryCtaText: e.target.value })}
                    className="px-4 py-2 bg-white/20 border border-white/30 text-white"
                    placeholder="Secondary CTA Text"
                  />
                  <input
                    type="text"
                    value={data.secondaryCtaLink || ''}
                    onChange={(e) => onEdit?.({ ...data, secondaryCtaLink: e.target.value })}
                    className="px-4 py-2 bg-white/20 border border-white/30 text-white"
                    placeholder="Secondary CTA Link"
                  />
                </div>
              ) : (
                <Link
                  href={data.secondaryCtaLink || '#'}
                  className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  {data.secondaryCtaText}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}