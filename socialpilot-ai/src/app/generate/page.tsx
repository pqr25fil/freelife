'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  Sparkles, 
  Twitter, 
  Linkedin, 
  Instagram,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Lightbulb,
  MessageSquare,
  List,
  HelpCircle,
  AlertCircle,
  Crown
} from 'lucide-react'
import clsx from 'clsx'

type Platform = 'twitter' | 'linkedin' | 'instagram'
type ContentType = 'post' | 'thread' | 'list' | 'question'
type Tone = 'professional' | 'casual' | 'humorous' | 'inspiring'

const platforms = [
  { id: 'twitter' as Platform, name: 'Twitter / X', icon: Twitter, color: '#1DA1F2' },
  { id: 'linkedin' as Platform, name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'instagram' as Platform, name: 'Instagram', icon: Instagram, color: '#E4405F' },
]

const contentTypes = [
  { id: 'post' as ContentType, name: 'Пост', icon: MessageSquare, description: 'Стандартный пост' },
  { id: 'thread' as ContentType, name: 'Thread', icon: List, description: 'Серия постов' },
  { id: 'list' as ContentType, name: 'Список', icon: Lightbulb, description: 'Пост-список' },
  { id: 'question' as ContentType, name: 'Вопрос', icon: HelpCircle, description: 'Вовлекающий вопрос' },
]

const tones = [
  { id: 'professional' as Tone, name: 'Профессиональный' },
  { id: 'casual' as Tone, name: 'Разговорный' },
  { id: 'humorous' as Tone, name: 'С юмором' },
  { id: 'inspiring' as Tone, name: 'Вдохновляющий' },
]

export default function GeneratePage() {
  const { data: session, status } = useSession()
  const [platform, setPlatform] = useState<Platform>('twitter')
  const [contentType, setContentType] = useState<ContentType>('post')
  const [tone, setTone] = useState<Tone>('professional')
  const [topic, setTopic] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generationsLeft, setGenerationsLeft] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  // Fetch user's remaining generations on mount
  useEffect(() => {
    if (session?.user) {
      // User is logged in, generations will be tracked on server
      setGenerationsLeft(null) // Will be updated after first generation
    } else if (status === 'unauthenticated') {
      // Guest user
      const stored = localStorage.getItem('guestGenerations')
      const guestGens = stored ? parseInt(stored) : 0
      setGenerationsLeft(Math.max(0, 3 - guestGens)) // 3 free generations for guests
    }
  }, [session, status])

  const handleGenerate = async () => {
    if (!topic.trim()) return
    
    setIsLoading(true)
    setError(null)
    setLimitReached(false)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, contentType, tone, topic }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (data.limitReached) {
          setLimitReached(true)
        }
        setError(data.error || 'Произошла ошибка')
        return
      }

      setGeneratedContent(data.content)
      
      if (data.generationsLeft !== undefined && data.generationsLeft !== null) {
        setGenerationsLeft(data.generationsLeft)
      }

      // Track guest generations
      if (!session?.user) {
        const stored = localStorage.getItem('guestGenerations')
        const guestGens = stored ? parseInt(stored) : 0
        localStorage.setItem('guestGenerations', String(guestGens + 1))
        setGenerationsLeft(Math.max(0, 2 - guestGens)) // Update remaining
      }
    } catch {
      setError('Произошла ошибка при генерации. Попробуйте ещё раз.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Генератор <span className="gradient-text">AI-контента</span>
            </h1>
            <p className="text-xl text-gray-600">
              Создавайте вирусный контент для социальных сетей за секунды
            </p>
            
            {/* Status Badge */}
            <div className="mt-4 flex items-center justify-center gap-4">
              {session?.user ? (
                <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generationsLeft !== null 
                    ? `Осталось генераций: ${generationsLeft}`
                    : 'Генерации сохраняются в историю'
                  }
                </div>
              ) : status === 'unauthenticated' ? (
                <div className="inline-flex items-center px-4 py-2 bg-yellow-50 rounded-full text-yellow-700 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Гостевой режим: {generationsLeft ?? 3} генераций
                  <Link href="/register" className="ml-2 underline font-medium">
                    Зарегистрируйтесь
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          {/* Limit Reached Banner */}
          {limitReached && (
            <div className="mb-8 p-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl text-white">
              <div className="flex items-start gap-4">
                <Crown className="w-8 h-8 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Лимит генераций исчерпан</h3>
                  <p className="text-white/90 mb-4">
                    Вы достигли лимита генераций на этот месяц. 
                    Обновите тариф, чтобы продолжить создавать контент.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center px-6 py-2.5 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Посмотреть тарифы
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Настройки</h2>
              
              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Платформа
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={clsx(
                        'flex flex-col items-center p-4 rounded-xl border-2 transition-all',
                        platform === p.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <p.icon 
                        className="w-6 h-6 mb-2" 
                        style={{ color: platform === p.id ? p.color : '#9CA3AF' }}
                      />
                      <span className={clsx(
                        'text-xs font-medium',
                        platform === p.id ? 'text-primary-700' : 'text-gray-600'
                      )}>
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Тип контента
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {contentTypes.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setContentType(ct.id)}
                      className={clsx(
                        'flex items-center p-3 rounded-xl border-2 transition-all',
                        contentType === ct.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <ct.icon className={clsx(
                        'w-5 h-5 mr-3',
                        contentType === ct.id ? 'text-primary-600' : 'text-gray-400'
                      )} />
                      <div className="text-left">
                        <p className={clsx(
                          'text-sm font-medium',
                          contentType === ct.id ? 'text-primary-700' : 'text-gray-700'
                        )}>
                          {ct.name}
                        </p>
                        <p className="text-xs text-gray-500">{ct.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Тон
                </label>
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={clsx(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all',
                        tone === t.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Тема поста
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Например: Как увеличить продуктивность на удалёнке"
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Error Message */}
              {error && !limitReached && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim() || limitReached}
                className={clsx(
                  'w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center',
                  isLoading || !topic.trim() || limitReached
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg hover:shadow-primary-500/30'
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Сгенерировать
                  </>
                )}
              </button>

              {/* Login prompt for guests */}
              {!session?.user && status === 'unauthenticated' && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  <Link href="/login" className="text-primary-600 hover:underline font-medium">
                    Войдите
                  </Link>
                  {' '}чтобы сохранять генерации и получить больше лимитов
                </p>
              )}
            </div>

            {/* Right Panel - Output */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Результат</h2>
                {generatedContent && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleRegenerate}
                      disabled={isLoading || limitReached}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Сгенерировать заново"
                    >
                      <RefreshCw className={clsx('w-5 h-5', isLoading && 'animate-spin')} />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Скопировать"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {generatedContent ? (
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 min-h-[400px]">
                  <div className="flex items-center gap-2 mb-4">
                    {platform === 'twitter' && <Twitter className="w-5 h-5 text-[#1DA1F2]" />}
                    {platform === 'linkedin' && <Linkedin className="w-5 h-5 text-[#0A66C2]" />}
                    {platform === 'instagram' && <Instagram className="w-5 h-5 text-[#E4405F]" />}
                    <span className="text-sm font-medium text-gray-600">
                      {platforms.find(p => p.id === platform)?.name}
                    </span>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {generatedContent}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                  <Sparkles className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg">Ваш контент появится здесь</p>
                  <p className="text-sm mt-2">Заполните форму слева и нажмите &quot;Сгенерировать&quot;</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Советы для лучших результатов
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary-600 font-semibold">1</span>
                </div>
                <p className="text-gray-600 text-sm">
                  <strong>Будьте конкретны</strong> — чем точнее тема, тем лучше результат. Вместо &quot;маркетинг&quot; напишите &quot;email-маркетинг для e-commerce&quot;.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary-600 font-semibold">2</span>
                </div>
                <p className="text-gray-600 text-sm">
                  <strong>Экспериментируйте</strong> — пробуйте разные типы контента и тона для одной темы. Списки обычно получают больше engagement.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary-600 font-semibold">3</span>
                </div>
                <p className="text-gray-600 text-sm">
                  <strong>Редактируйте</strong> — добавьте личный опыт и уникальные детали. AI даёт отличную основу, но ваш голос делает контент особенным.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
