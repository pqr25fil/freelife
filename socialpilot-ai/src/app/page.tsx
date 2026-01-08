import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  Clock, 
  Globe,
  CheckCircle,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  Star
} from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by GPT-4 & Claude AI
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Создавайте <span className="gradient-text">вирусный контент</span>
              <br />за секунды
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              AI-генератор контента для Twitter, LinkedIn и Instagram. 
              Экономьте 10+ часов в неделю на создании постов, которые увеличивают охваты.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/generate"
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 flex items-center"
              >
                Попробовать бесплатно
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
              >
                Посмотреть цены
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="ml-3">2,500+ пользователей</span>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="ml-2">4.9/5 рейтинг</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-3xl" />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Twitter</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">LinkedIn</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">Instagram</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-400 mb-2 text-sm">Ваша тема:</p>
                  <p className="text-gray-800">Как увеличить продуктивность на удалёнке</p>
                </div>
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 border border-primary-100">
                  <p className="text-primary-600 mb-2 text-sm flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" /> Сгенерированный пост:
                  </p>
                  <p className="text-gray-800">
                    🚀 5 секретов продуктивности на удалёнке, которые изменили мою жизнь:
                    <br /><br />
                    1️⃣ Правило 2 минут — делай сразу<br />
                    2️⃣ Блоки глубокой работы по 90 минут<br />
                    3️⃣ Отдельное рабочее пространство<br />
                    4️⃣ &quot;Ритуал закрытия&quot; рабочего дня<br />
                    5️⃣ Еженедельный обзор достижений
                    <br /><br />
                    Какой совет вы добавите? 👇
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">Создавайте контент для всех популярных платформ</p>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700">
              <Twitter className="w-8 h-8 text-[#1DA1F2]" />
              <span className="font-medium">Twitter / X</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Linkedin className="w-8 h-8 text-[#0A66C2]" />
              <span className="font-medium">LinkedIn</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Instagram className="w-8 h-8 text-[#E4405F]" />
              <span className="font-medium">Instagram</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Всё, что нужно для <span className="gradient-text">вирусного контента</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Мощные инструменты AI для создания контента, который привлекает внимание и генерирует engagement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Мгновенная генерация</h3>
              <p className="text-gray-600">
                Создавайте посты за секунды. Просто введите тему — AI сделает остальное.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Разные форматы</h3>
              <p className="text-gray-600">
                Threads, списки, истории, вопросы — выбирайте формат, который работает для вашей аудитории.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Высокий engagement</h3>
              <p className="text-gray-600">
                Контент оптимизирован для алгоритмов платформ и вовлечения аудитории.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Экономия времени</h3>
              <p className="text-gray-600">
                Сэкономьте 10+ часов в неделю на создании контента. Фокусируйтесь на бизнесе.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Мультиязычность</h3>
              <p className="text-gray-600">
                Создавайте контент на русском, английском и других языках для глобальной аудитории.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Адаптация стиля</h3>
              <p className="text-gray-600">
                AI адаптируется под ваш уникальный голос и тон коммуникации с аудиторией.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Как это работает</h2>
            <p className="text-xl text-gray-400">Три простых шага до вирусного контента</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Выберите платформу</h3>
              <p className="text-gray-400">
                Twitter, LinkedIn или Instagram — выберите, где будете публиковать
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Введите тему</h3>
              <p className="text-gray-400">
                Опишите, о чём хотите написать — AI поймёт контекст
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Получите контент</h3>
              <p className="text-gray-400">
                Готовый пост за секунды — редактируйте и публикуйте
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Что говорят <span className="gradient-text">наши пользователи</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Алексей Петров",
                role: "Маркетолог",
                text: "Экономлю минимум 5 часов в неделю. Посты получаются качественными, engagement вырос на 40%!",
              },
              {
                name: "Мария Иванова",
                role: "SMM-специалист",
                text: "Раньше мучилась с идеями для постов. Теперь генерирую 10 вариантов за минуту и выбираю лучший.",
              },
              {
                name: "Дмитрий Козлов",
                role: "Предприниматель",
                text: "Отличный инструмент для тех, кто не умеет писать. AI создаёт посты лучше, чем я сам.",
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400" />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Готовы создавать вирусный контент?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Присоединяйтесь к 2,500+ пользователям, которые уже экономят время с SocialPilot AI
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:shadow-xl transition-all duration-300"
            >
              Начать бесплатно
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <p className="mt-6 text-white/60 text-sm">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              5 бесплатных генераций • Без карты
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
