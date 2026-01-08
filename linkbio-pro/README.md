# 🔗 LinkBio Pro

**Современная альтернатива Linktree** — SaaS-платформа для создания персональных страниц со ссылками.

![LinkBio Pro](https://via.placeholder.com/800x400/7c3aed/ffffff?text=LinkBio+Pro)

## 💰 Бизнес-модель

| План | Цена | Целевая аудитория |
|------|------|-------------------|
| Free | $0/мес | Новые пользователи |
| Pro | $5/мес | Креаторы, блогеры |
| Business | $15/мес | Компании, команды |

**Путь к $1000/месяц:**
- 200 Pro подписчиков ($5 × 200 = $1000)
- или 67 Business подписчиков ($15 × 67 = $1005)
- или комбинация

## ✨ Функционал

### Бесплатный план
- ✅ Неограниченные ссылки
- ✅ 3 готовые темы
- ✅ Базовая аналитика
- ✅ Мобильная оптимизация
- ⚠️ Брендинг LinkBio Pro

### Pro план ($5/мес)
- ✅ Всё из Free
- ✅ Убрать брендинг
- ✅ 6+ кастомных тем
- ✅ Расширенная аналитика
- ✅ Приоритетная поддержка

### Business план ($15/мес)
- ✅ Всё из Pro
- ✅ Свой домен
- ✅ Командная работа
- ✅ API доступ
- ✅ Выделенная поддержка

## 🛠 Технологии

- **Frontend:** Next.js 16, React, TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (Prisma ORM)
- **Auth:** NextAuth.js
- **Payments:** Stripe
- **UI Components:** Radix UI, Lucide Icons

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd linkbio-pro
npm install
```

### 2. Настройка окружения

```bash
cp .env.example .env
```

Заполни `.env`:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-super-secret-key-change-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (получи на https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_BUSINESS_PRICE_ID="price_..."
```

### 3. Инициализация базы данных

```bash
npx prisma migrate dev
```

### 4. Запуск

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

## 💳 Настройка Stripe

### 1. Создай аккаунт Stripe
Зарегистрируйся на [stripe.com](https://stripe.com)

### 2. Получи API ключи
- Перейди в [Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys)
- Скопируй Secret key в `STRIPE_SECRET_KEY`

### 3. Создай продукты
В [Dashboard → Products](https://dashboard.stripe.com/test/products):

**Pro Plan:**
- Name: "Pro"
- Price: $5/month (recurring)
- Скопируй Price ID в `STRIPE_PRO_PRICE_ID`

**Business Plan:**
- Name: "Business"
- Price: $15/month (recurring)
- Скопируй Price ID в `STRIPE_BUSINESS_PRICE_ID`

### 4. Настрой Webhook
В [Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks):

- Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
- Events to send:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Скопируй Signing secret в `STRIPE_WEBHOOK_SECRET`

### 5. Тестирование локально
```bash
# Установи Stripe CLI
brew install stripe/stripe-cli/stripe

# Логин
stripe login

# Форвардинг вебхуков
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Используй тестовую карту: `4242 4242 4242 4242`

## 📁 Структура проекта

```
linkbio-pro/
├── prisma/
│   └── schema.prisma      # Схема БД с Stripe полями
├── src/
│   ├── app/
│   │   ├── (auth)/        # Login, Register
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       ├── page.tsx     # Главный дашборд
│   │   │       └── billing/     # Управление подпиской
│   │   ├── (public)/      # Публичные профили
│   │   ├── api/
│   │   │   ├── stripe/    # Stripe endpoints
│   │   │   │   ├── checkout/
│   │   │   │   ├── webhook/
│   │   │   │   └── portal/
│   │   │   └── ...
│   │   └── pricing/       # Страница цен
│   ├── components/ui/     # UI компоненты
│   └── lib/
│       ├── auth.ts        # NextAuth конфиг
│       ├── prisma.ts      # Prisma клиент
│       ├── stripe.ts      # Stripe конфиг и планы
│       └── utils.ts
└── public/
```

## 📊 API Endpoints

### Stripe
- `POST /api/stripe/checkout` — Создать checkout сессию
- `POST /api/stripe/webhook` — Обработка Stripe событий
- `POST /api/stripe/portal` — Открыть Customer Portal

### Аутентификация
- `POST /api/auth/register` — Регистрация
- `POST /api/auth/[...nextauth]` — NextAuth

### Данные
- `GET/PUT /api/pages` — Страницы пользователя
- `POST/PUT/DELETE /api/links` — Ссылки
- `GET /api/analytics` — Статистика
- `GET /api/user` — Данные пользователя

## 🎨 Темы

| Тема | Доступность |
|------|-------------|
| Default | Free |
| Sunset | Free |
| Ocean | Free |
| Forest | Pro |
| Dark | Pro |
| Candy | Pro |

## 🔒 Безопасность

- ✅ Пароли хешируются с bcrypt
- ✅ JWT токены для сессий
- ✅ CSRF защита через NextAuth
- ✅ Stripe Webhook signature verification
- ✅ Валидация входных данных

## 🚀 Деплой

### Vercel (рекомендуется)
```bash
npm install -g vercel
vercel
```

Не забудь добавить все переменные окружения в Vercel Dashboard.

### Важно для продакшена
1. Замени SQLite на PostgreSQL
2. Используй реальные Stripe ключи (не test)
3. Настрой кастомный домен
4. Включи Stripe production mode

## 📈 Маркетинг

### Каналы привлечения
1. **Product Hunt** — запуск продукта
2. **Twitter/X** — контент для креаторов
3. **TikTok/Instagram** — демо видео
4. **SEO** — "linktree alternative", "link in bio"
5. **Партнёрская программа** — 20% комиссия

### Конверсия
- Free → Pro: ~5-10%
- Целевой показатель: 2000 free users → 200 pro

## 📝 Roadmap

- [x] Базовый функционал
- [x] Stripe интеграция
- [x] Аналитика
- [x] Темы
- [ ] Email уведомления
- [ ] Кастомные домены
- [ ] QR коды
- [ ] Виджеты (YouTube, Spotify)
- [ ] A/B тестирование
- [ ] Мобильное приложение

## 📄 Лицензия

MIT License

---

**Готов к запуску! 🚀**

Для вопросов: support@linkbio.pro
