'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { 
  Sparkles, 
  CreditCard, 
  History, 
  Settings,
  LogOut,
  Crown,
  Zap,
  ArrowRight,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Instagram,
  Calendar,
  Loader2
} from 'lucide-react'

interface DashboardClientProps {
  user: {
    id: string
    name: string | null
    email: string
    plan: string
    generationsCount: number
    stripeCustomerId: string | null
    stripeCurrentPeriodEnd: string | null
  }
  planLimits: {
    name: string
    generations: number
  }
  totalGenerations: number
  recentGenerations: Array<{
    id: string
    platform: string
    contentType: string
    tone: string
    topic: string
    content: string
    createdAt: string
  }>
}

const platformIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
}

const platformColors = {
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  instagram: '#E4405F',
}

export default function DashboardClient({ 
  user, 
  planLimits, 
  totalGenerations,
  recentGenerations 
}: DashboardClientProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const [isLoadingCheckout, setIsLoadingCheckout] = useState<string | null>(null)

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setIsLoadingPortal(false)
    }
  }

  const handleUpgrade = async (plan: 'PRO' | 'UNLIMITED') => {
    setIsLoadingCheckout(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(data.error)
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoadingCheckout(null)
    }
  }

  const generationsUsed = user.generationsCount
  const generationsLimit = planLimits.generations
  const generationsPercent = generationsLimit === Infinity 
    ? 0 
    : Math.min((generationsUsed / generationsLimit) * 100, 100)

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Привет, {user.name || 'Пользователь'}! 👋
            </h1>
            <p className="text-gray-500 mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Link
              href="/generate"
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Генерировать
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Plan Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Текущий тариф</h3>
              {user.plan === 'PRO' && <Zap className="w-5 h-5 text-primary-500" />}
              {user.plan === 'UNLIMITED' && <Crown className="w-5 h-5 text-yellow-500" />}
            </div>
            <p className="text-2xl font-bold text-gray-900">{planLimits.name}</p>
            {user.stripeCurrentPeriodEnd && (
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                До {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString('ru-RU')}
              </p>
            )}
            {user.plan !== 'UNLIMITED' && (
              <button
                onClick={() => handleUpgrade(user.plan === 'FREE' ? 'PRO' : 'UNLIMITED')}
                disabled={isLoadingCheckout !== null}
                className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                {isLoadingCheckout ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <>
                    Улучшить тариф
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Generations Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Генерации в этом месяце</h3>
              <Sparkles className="w-5 h-5 text-accent-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {generationsUsed}
              <span className="text-lg font-normal text-gray-400">
                /{generationsLimit === Infinity ? '∞' : generationsLimit}
              </span>
            </p>
            {generationsLimit !== Infinity && (
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                    style={{ width: `${generationsPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Total Generations Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Всего создано</h3>
              <History className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalGenerations}</p>
            <p className="text-sm text-gray-500 mt-1">постов за всё время</p>
          </div>
        </div>

        {/* Subscription Management */}
        {user.stripeCustomerId && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Управление подпиской</h3>
                  <p className="text-sm text-gray-500">Изменить способ оплаты или отменить подписку</p>
                </div>
              </div>
              <button
                onClick={handleManageSubscription}
                disabled={isLoadingPortal}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center"
              >
                {isLoadingPortal ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                Настройки
              </button>
            </div>
          </div>
        )}

        {/* Upgrade Cards (for free users) */}
        {user.plan === 'FREE' && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-6 h-6" />
                <h3 className="text-xl font-bold">Pro</h3>
              </div>
              <p className="text-3xl font-bold mb-2">990₽<span className="text-lg font-normal opacity-80">/мес</span></p>
              <ul className="space-y-2 mb-4 text-sm opacity-90">
                <li>✓ 100 генераций в месяц</li>
                <li>✓ Все типы контента</li>
                <li>✓ История генераций</li>
              </ul>
              <button
                onClick={() => handleUpgrade('PRO')}
                disabled={isLoadingCheckout !== null}
                className="w-full py-2.5 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                {isLoadingCheckout === 'PRO' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Выбрать Pro'
                )}
              </button>
            </div>

            <div className="bg-gradient-to-br from-accent-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-6 h-6" />
                <h3 className="text-xl font-bold">Unlimited</h3>
              </div>
              <p className="text-3xl font-bold mb-2">2490₽<span className="text-lg font-normal opacity-80">/мес</span></p>
              <ul className="space-y-2 mb-4 text-sm opacity-90">
                <li>✓ Безлимитные генерации</li>
                <li>✓ Приоритетная поддержка</li>
                <li>✓ API доступ</li>
              </ul>
              <button
                onClick={() => handleUpgrade('UNLIMITED')}
                disabled={isLoadingCheckout !== null}
                className="w-full py-2.5 bg-white text-accent-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                {isLoadingCheckout === 'UNLIMITED' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Выбрать Unlimited'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Recent Generations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <History className="w-5 h-5 mr-2 text-gray-400" />
              Последние генерации
            </h2>
          </div>
          
          {recentGenerations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentGenerations.map((gen) => {
                const PlatformIcon = platformIcons[gen.platform as keyof typeof platformIcons] || Sparkles
                const platformColor = platformColors[gen.platform as keyof typeof platformColors] || '#6B7280'
                
                return (
                  <div key={gen.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <PlatformIcon className="w-4 h-4" style={{ color: platformColor }} />
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {gen.platform}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500 capitalize">
                            {gen.contentType}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-400">
                            {new Date(gen.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          Тема: <span className="text-gray-700">{gen.topic}</span>
                        </p>
                        <p className="text-gray-800 line-clamp-3 whitespace-pre-wrap">
                          {gen.content}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(gen.id, gen.content)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0"
                        title="Скопировать"
                      >
                        {copiedId === gen.id ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">У вас пока нет генераций</p>
              <Link
                href="/generate"
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-full hover:shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Создать первый пост
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
