'use client'

import { useState } from 'react'
import {
  Save,
  Globe,
  Palette,
  Code,
  Shield,
  Bell,
  Users,
  Key,
  Database,
  Zap,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  ChevronRight,
  Check,
  X,
  Info,
  AlertCircle,
  Copy,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: any
}

const sections: SettingSection[] = [
  {
    id: 'general',
    title: '일반 설정',
    description: '기본 에디터 설정 및 환경 구성',
    icon: Monitor,
  },
  {
    id: 'tracking',
    title: '추적 픽셀',
    description: 'Google Analytics, Meta Pixel 등 추적 코드 설정',
    icon: Zap,
  },
  {
    id: 'integrations',
    title: '연동 설정',
    description: '외부 서비스 API 연동 및 웹훅 설정',
    icon: Database,
  },
  {
    id: 'notifications',
    title: '알림 설정',
    description: '이메일, SMS, 슬랙 등 알림 채널 설정',
    icon: Bell,
  },
  {
    id: 'security',
    title: '보안',
    description: '접근 권한, API 키 관리, 보안 설정',
    icon: Shield,
  },
  {
    id: 'team',
    title: '팀 관리',
    description: '팀원 초대 및 권한 관리',
    icon: Users,
  },
]

export default function EditorSettings() {
  const [activeSection, setActiveSection] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    // General
    autoSave: true,
    autoSaveInterval: 30,
    darkMode: false,
    language: 'ko',
    timezone: 'Asia/Seoul',
    
    // Tracking
    gaEnabled: false,
    gaMeasurementId: '',
    metaPixelEnabled: false,
    metaPixelId: '',
    kakaoPixelEnabled: false,
    kakaoPixelId: '',
    naverEnabled: false,
    naverWcsId: '',
    
    // Integrations
    webhookUrl: '',
    apiKey: '',
    slackWebhook: '',
    zapierEnabled: false,
    
    // Notifications
    emailNotifications: true,
    notificationEmail: '',
    smsNotifications: false,
    smsNumber: '',
    slackNotifications: false,
    
    // Security
    twoFactorAuth: false,
    ipWhitelist: '',
    apiRateLimit: 1000,
    requireHttps: true,
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 실제 구현시 API 호출
      // await fetch('/api/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // })
      
      console.log('Saving settings:', settings)
      
      setTimeout(() => {
        setIsSaving(false)
        alert('설정이 저장되었습니다.')
      }, 1000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setIsSaving(false)
    }
  }

  const handleGenerateApiKey = () => {
    const newKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setSettings({ ...settings, apiKey: newKey })
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(settings.apiKey)
    alert('API 키가 클립보드에 복사되었습니다.')
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 설정</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">자동 저장</label>
                    <p className="text-sm text-gray-500">작업 내용을 자동으로 저장합니다</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {settings.autoSave && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      자동 저장 간격 (초)
                    </label>
                    <input
                      type="number"
                      value={settings.autoSaveInterval}
                      onChange={(e) => setSettings({ ...settings, autoSaveInterval: parseInt(e.target.value) })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">다크 모드</label>
                    <p className="text-sm text-gray-500">에디터 테마를 다크 모드로 변경합니다</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">언어</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                    <option value="zh">中文</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시간대</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Asia/Seoul">서울 (GMT+9)</option>
                    <option value="Asia/Tokyo">도쿄 (GMT+9)</option>
                    <option value="America/New_York">뉴욕 (GMT-5)</option>
                    <option value="Europe/London">런던 (GMT+0)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'tracking':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">추적 픽셀 설정</h3>
              
              {/* Google Analytics */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Google Analytics 4</h4>
                      <p className="text-sm text-gray-500">웹사이트 트래픽 분석</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.gaEnabled}
                      onChange={(e) => setSettings({ ...settings, gaEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {settings.gaEnabled && (
                  <input
                    type="text"
                    value={settings.gaMeasurementId}
                    onChange={(e) => setSettings({ ...settings, gaMeasurementId: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Meta Pixel */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Meta Pixel</h4>
                      <p className="text-sm text-gray-500">Facebook 광고 성과 추적</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.metaPixelEnabled}
                      onChange={(e) => setSettings({ ...settings, metaPixelEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {settings.metaPixelEnabled && (
                  <input
                    type="text"
                    value={settings.metaPixelId}
                    onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                    placeholder="000000000000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Kakao Pixel */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Kakao Pixel</h4>
                      <p className="text-sm text-gray-500">카카오 광고 성과 추적</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.kakaoPixelEnabled}
                      onChange={(e) => setSettings({ ...settings, kakaoPixelEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {settings.kakaoPixelEnabled && (
                  <input
                    type="text"
                    value={settings.kakaoPixelId}
                    onChange={(e) => setSettings({ ...settings, kakaoPixelId: e.target.value })}
                    placeholder="카카오 픽셀 ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Naver */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">네이버 애널리틱스</h4>
                      <p className="text-sm text-gray-500">네이버 광고 성과 추적</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.naverEnabled}
                      onChange={(e) => setSettings({ ...settings, naverEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {settings.naverEnabled && (
                  <input
                    type="text"
                    value={settings.naverWcsId}
                    onChange={(e) => setSettings({ ...settings, naverWcsId: e.target.value })}
                    placeholder="네이버 WCS ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">추적 픽셀 사용 안내</p>
                  <p className="text-sm text-blue-700 mt-1">
                    추적 픽셀을 활성화하면 방문자 행동을 분석하고 광고 성과를 측정할 수 있습니다.
                    개인정보 보호 정책에 따라 사용자 동의를 받아야 합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">외부 서비스 연동</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                    placeholder="https://your-webhook-url.com/endpoint"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    리드 생성 시 이 URL로 데이터를 전송합니다
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.apiKey}
                      onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                      placeholder="API 키를 생성하세요"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      readOnly
                    />
                    <button
                      onClick={handleCopyApiKey}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={!settings.apiKey}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleGenerateApiKey}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    외부 API 연동 시 사용할 인증 키입니다
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slack Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settings.slackWebhook}
                    onChange={(e) => setSettings({ ...settings, slackWebhook: e.target.value })}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Zapier 연동</label>
                    <p className="text-sm text-gray-500">Zapier를 통해 다른 앱과 연동합니다</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.zapierEnabled}
                      onChange={(e) => setSettings({ ...settings, zapierEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900 font-medium">보안 주의사항</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    API 키와 Webhook URL은 안전하게 관리하세요. 외부에 노출되지 않도록 주의하시기 바랍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 채널 설정</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">이메일 알림</label>
                        <p className="text-sm text-gray-500">새 리드 생성 시 이메일로 알림</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {settings.emailNotifications && (
                    <input
                      type="email"
                      value={settings.notificationEmail}
                      onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                      placeholder="notification@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">SMS 알림</label>
                        <p className="text-sm text-gray-500">중요한 리드 생성 시 SMS 알림</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {settings.smsNotifications && (
                    <input
                      type="tel"
                      value={settings.smsNumber}
                      onChange={(e) => setSettings({ ...settings, smsNumber: e.target.value })}
                      placeholder="010-0000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Slack 알림</label>
                        <p className="text-sm text-gray-500">Slack 채널로 실시간 알림</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.slackNotifications}
                        onChange={(e) => setSettings({ ...settings, slackNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 조건</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                  <span className="text-sm text-gray-700">새 리드 생성 시</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                  <span className="text-sm text-gray-700">일일 리드 목표 달성 시</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">캠페인 종료 시</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">오류 발생 시</span>
                </label>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">보안 설정</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">2단계 인증</label>
                    <p className="text-sm text-gray-500">로그인 시 추가 인증을 요구합니다</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP 화이트리스트
                  </label>
                  <textarea
                    rows={3}
                    value={settings.ipWhitelist}
                    onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                    placeholder="192.168.1.1&#10;10.0.0.0/24"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    접근을 허용할 IP 주소를 한 줄에 하나씩 입력하세요
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Rate Limit (요청/시간)
                  </label>
                  <input
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => setSettings({ ...settings, apiRateLimit: parseInt(e.target.value) })}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    시간당 허용되는 최대 API 요청 수
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">HTTPS 강제</label>
                    <p className="text-sm text-gray-500">모든 연결을 HTTPS로 강제합니다</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.requireHttps}
                      onChange={(e) => setSettings({ ...settings, requireHttps: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 보안 활동</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">로그인 성공</p>
                      <p className="text-xs text-gray-500">2024-09-05 10:30 AM • 서울</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">새 기기에서 로그인</p>
                      <p className="text-xs text-gray-500">2024-09-04 3:15 PM • 부산</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <X className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">로그인 실패</p>
                      <p className="text-xs text-gray-500">2024-09-03 11:45 PM • Unknown</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">팀 멤버</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">관리자</p>
                      <p className="text-sm text-gray-500">admin@example.com</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Owner
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      K
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">김매니저</p>
                      <p className="text-sm text-gray-500">manager@example.com</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Editor
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                      L
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">이직원</p>
                      <p className="text-sm text-gray-500">staff@example.com</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    Viewer
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                팀원 초대
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">권한 설정</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-gray-700">권한</th>
                      <th className="text-center py-2 font-medium text-gray-700">Owner</th>
                      <th className="text-center py-2 font-medium text-gray-700">Editor</th>
                      <th className="text-center py-2 font-medium text-gray-700">Viewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">템플릿 편집</td>
                      <td className="text-center py-2"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                      <td className="text-center py-2"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                      <td className="text-center py-2"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">리드 관리</td>
                      <td className="text-center py-2"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                      <td className="text-center py-2"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                      <td className="text-center py-2"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">설정 변경</td>
                      <td className="text-center py-2"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                      <td className="text-center py-2"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
                      <td className="text-center py-2"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">팀원 관리</td>
                      <td className="text-center py-2"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                      <td className="text-center py-2"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
                      <td className="text-center py-2"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">에디터 설정</h1>
          <p className="text-gray-600 mt-2">에디터와 연동 서비스를 설정하고 관리하세요</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs opacity-75">{section.description}</div>
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">빠른 액션</h4>
              <div className="space-y-2">
                <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  설정 내보내기
                </button>
                <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  설정 가져오기
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {renderSectionContent()}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      설정 저장
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}