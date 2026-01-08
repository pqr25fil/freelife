import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown,
  ArrowRight,
  HelpCircle
} from 'lucide-react'

const plans = [
  {
    name: 'Бесплатно',
    description: 'Попробуйте возможности SocialPilot AI',
    price: '0',
    period: 'навсегда',
    features: [
      '5 генераций в месяц',
      'Все платформы (Twitter, LinkedIn, Instagram)',
      'Базовые типы контента',
      '3 тона голоса',
    ],
    limitations: [
      'Нет истории генераций',
      'Базовая поддержка',
    ],
    cta: 'Начать бесплатно',
    ctaLink: '/generate',
    popular: false,
    icon: Sparkles,
    gradient: 'from-gray-500 to-gray-600',
  },
  {
    name: 'Pro',
    description: 'Для активных создателей контента',
    price: '990',
    period: 'в месяц',
    features: [
      '100 генераций в месяц',
      'Все платформы',
      'Все типы контента',
      'Все тона голоса',
      'История генераций',
      'Приоритетная поддержка',
      'Экспорт в разных форматах',
    ],
    limitations: [],
    cta: 'Выбрать Pro',
    ctaLink: '/generate',
    popular: true,
    icon: Zap,
    gradient: 'from-primary-500 to-accent-500',
  },
  {
    name: 'Unlimited',
    description: 'Для агентств и команд',
    price: '2490',
    period: 'в месяц',
    features: [
      'Безлимитные генерации',
      'Все платформы',
      'Все типы контента',
      'Все тона голоса',
      'История генераций',
      'Приоритетная поддержка 24/7',
      'Экспорт в разных форматах',
      'API доступ',
      'Пользовательские шаблоны',
      'До 5 пользователей',
    ],
    limitations: [],
    cta: 'Выбрать Unlimited',
    ctaLink: '/generate',
    popular: false,
    icon: Crown,
    gradient: 'from-purple-500 to-pink-500',
  },
]

const faqs = [
  {
    question: 'Как работает бесплатный тариф?',
    answer: 'Вы получаете 5 бесплатных генераций каждый месяц. Этого достаточно, чтобы попробовать сервис и понять, подходит ли он вам. Генерации не накапливаются — каждый месяц счётчик обновляется.',
  },
  {
    question: 'Могу ли я отменить подписку в любой момент?',
    answer: 'Да, вы можете отменить подписку в любое время. Доступ к платным функциям сохранится до конца оплаченного периода.',
  },
  {
    question: 'Какие способы оплаты вы принимаете?',
    answer: 'Мы принимаем банковские карты (Visa, Mastercard, МИР), а также оплату через ЮMoney и СБП.',
  },
  {
    question: 'Есть ли скидки при годовой оплате?',
    answer: 'Да! При оплате за год вы получаете 2 месяца бесплатно. Это экономия 17% по сравнению с месячной оплатой.',
  },
  {
    question: 'Что такое API доступ в тарифе Unlimited?',
    answer: 'API доступ позволяет интегрировать SocialPilot AI в ваши собственные приложения, автоматизировать процессы и создавать контент программно.',
  },
  {
    question: 'Можно ли добавить больше пользователей в тариф Unlimited?',
    answer: 'Да, за дополнительную плату можно добавить больше пользователей. Свяжитесь с нами для получения индивидуального предложения.',
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Простые и прозрачные <span className="gradient-text">цены</span>
          </h1>
          <p className="text-xl text-gray-600">
            Начните бесплатно, переходите на платный тариф когда будете готовы.
            <br />Никаких скрытых платежей.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative rounded-3xl p-8 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-2xl shadow-primary-500/30 scale-105' 
                    : 'bg-white border-2 border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full">
                      Популярный
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.popular ? 'bg-white/20' : `bg-gradient-to-br ${plan.gradient}`
                  }`}>
                    <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-white'}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price === '0' ? 'Бесплатно' : `${plan.price}₽`}
                    </span>
                    {plan.price !== '0' && (
                      <span className={plan.popular ? 'text-white/80' : 'text-gray-500'}>
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-white' : 'text-green-500'
                      }`} />
                      <span className={plan.popular ? 'text-white/90' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-start gap-3 opacity-60">
                      <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-center">—</span>
                      <span className={plan.popular ? 'text-white/70' : 'text-gray-400'}>
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-4 rounded-xl font-semibold text-center transition-all ${
                    plan.popular
                      ? 'bg-white text-primary-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/30'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="inline w-5 h-5 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            14 дней гарантия возврата денег
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Попробуйте SocialPilot AI без риска. Если в течение 14 дней вы решите, 
            что сервис вам не подходит — мы вернём деньги без вопросов.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Часто задаваемые <span className="gradient-text">вопросы</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Готовы начать создавать вирусный контент?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Присоединяйтесь к тысячам создателей контента, которые уже экономят время с SocialPilot AI
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
          >
            Попробовать бесплатно
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
