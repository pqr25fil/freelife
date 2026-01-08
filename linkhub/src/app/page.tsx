import Link from "next/link";
import { Link2, Zap, BarChart3, Palette, CheckCircle, ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LinkHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-white/80 hover:text-white transition-colors"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="bg-white text-purple-900 px-4 py-2 rounded-full font-medium hover:bg-white/90 transition-all"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white/90 text-sm">Уже 10,000+ пользователей</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Все ваши ссылки
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              в одном месте
            </span>
          </h1>
          
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Создайте красивую страницу со всеми вашими важными ссылками. 
            Идеально для Instagram, TikTok, YouTube и любых социальных сетей.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105"
            >
              Создать бесплатно
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Узнать больше
            </Link>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-sm mx-auto border border-white/20">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">@username</h3>
              <p className="text-white/60 text-sm mb-6">Дизайнер • Блогер • Креатор</p>
              
              <div className="space-y-3">
                {["Мой сайт", "YouTube канал", "Telegram"].map((link, i) => (
                  <div
                    key={i}
                    className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-white font-medium hover:bg-white/30 transition-all cursor-pointer"
                  >
                    {link}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Всё что вам нужно
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Мощные инструменты для создания идеальной страницы с ссылками
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Link2,
                title: "Неограниченные ссылки",
                description: "Добавляйте сколько угодно ссылок на свою страницу",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Palette,
                title: "Красивые темы",
                description: "Выбирайте из множества стильных тем оформления",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: BarChart3,
                title: "Аналитика кликов",
                description: "Отслеживайте статистику переходов по ссылкам",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Zap,
                title: "Быстрая настройка",
                description: "Создайте страницу за 2 минуты без навыков дизайна",
                color: "from-green-500 to-emerald-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Простые тарифы
            </h2>
            <p className="text-xl text-gray-600">
              Начните бесплатно, обновитесь когда будете готовы
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Идеально для начала</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/месяц</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "До 5 ссылок",
                  "3 базовые темы",
                  "Персональный URL",
                  "Базовая аналитика",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all"
              >
                Начать бесплатно
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                ПОПУЛЯРНЫЙ
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-white/80 mb-6">Для серьёзных креаторов</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">$5</span>
                <span className="text-white/80">/месяц</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Безлимитные ссылки",
                  "Все премиум темы",
                  "Расширенная аналитика",
                  "Приоритетная поддержка",
                  "Убрать брендинг LinkHub",
                  "Кастомный домен (скоро)",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-white text-purple-600 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all"
              >
                Получить Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Присоединяйтесь к тысячам креаторов, которые уже используют LinkHub
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105"
          >
            Создать свой LinkHub
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">LinkHub</span>
            </div>
            <p className="text-gray-400">
              © 2025 LinkHub. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
