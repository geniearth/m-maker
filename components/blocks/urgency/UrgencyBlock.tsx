'use client'

import { BlockType } from '../types'
import { useState, useEffect } from 'react'

interface UrgencyBlockData {
  title: string
  subtitle?: string
  benefits?: string[]
  deadline?: string
  remainingSpots?: number
  countdownTimer?: boolean
}

interface UrgencyBlockProps {
  block: BlockType
}

export default function UrgencyBlock({ block }: UrgencyBlockProps) {
  const data = block.data as UrgencyBlockData
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (data.deadline && data.countdownTimer) {
      const timer = setInterval(() => {
        const deadline = new Date(data.deadline!).getTime()
        const now = new Date().getTime()
        const distance = deadline - now

        if (distance < 0) {
          setTimeLeft('종료됨')
          clearInterval(timer)
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24))
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          )
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          )
          setTimeLeft(`${days}일 ${hours}시간 ${minutes}분`)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [data.deadline, data.countdownTimer])

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-red-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-red-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            {data.title}
          </h2>

          {data.subtitle && (
            <p className="text-lg text-gray-700 mb-6 text-center">
              {data.subtitle}
            </p>
          )}

          {data.benefits && data.benefits.length > 0 && (
            <ul className="mb-6 space-y-2">
              {data.benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start text-gray-700"
                >
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {data.deadline && (
              <div className="text-center">
                <div className="text-sm text-gray-600">마감 기한</div>
                <div className="text-xl font-bold text-red-600">
                  {data.countdownTimer && timeLeft
                    ? timeLeft
                    : data.deadline}
                </div>
              </div>
            )}

            {data.remainingSpots && (
              <div className="text-center">
                <div className="text-sm text-gray-600">남은 인원</div>
                <div className="text-xl font-bold text-blue-600">
                  {data.remainingSpots}명
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <a
              href="#form"
              className="inline-block px-8 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors animate-pulse"
            >
              지금 바로 신청하기
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}