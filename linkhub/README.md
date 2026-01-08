# 🔗 LinkHub - Link-in-Bio Service

![LinkHub](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

**LinkHub** — это сервис для создания красивой страницы со всеми вашими ссылками. Аналог Linktree с возможностью монетизации.

## 💰 Бизнес-модель

- **Free** ($0/мес): до 5 ссылок, 3 базовые темы, базовая аналитика
- **Pro** ($5/мес): безлимит ссылок, все темы, расширенная аналитика, без брендинга

**Целевой доход**: 200 Pro пользователей = $1,000/мес

## ✨ Функционал

- 🔗 Создание страницы с ссылками
- 🎨 9 красивых тем оформления
- 📊 Аналитика просмотров и кликов
- 👤 Персональный URL (linkhub.app/username)
- 📱 Адаптивный дизайн
- 🔒 JWT аутентификация

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd linkhub
npm install
```

### 2. Настройка базы данных

```bash
npx prisma generate
npx prisma db push
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 📁 Структура проекта

```
linkhub/
├── prisma/
│   └── schema.prisma      # Схема базы данных
├── src/
│   ├── app/
│   │   ├── api/           # API роуты
│   │   │   ├── auth/      # Аутентификация
│   │   │   ├── links/     # CRUD ссылок
│   │   │   ├── analytics/ # Аналитика
│   │   │   └── user/      # Профиль
│   │   ├── dashboard/     # Панель управления
│   │   ├── login/         # Страница входа
│   │   ├── register/      # Регистрация
│   │   ├── [username]/    # Публичный профиль
│   │   └── page.tsx       # Landing page
│   └── lib/
│       ├── auth.ts        # JWT аутентификация
│       ├── db.ts          # Prisma клиент
│       └── themes.ts      # Темы оформления
└── package.json
```

## 🛠 Технологии

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite + Prisma ORM
- **Auth**: JWT (jose + bcryptjs)
- **Icons**: Lucide React

## 🎨 Доступные темы

| Тема | Тип |
|------|-----|
| Classic White | Free |
| Dark Mode | Free |
| Sunset Gradient | Free |
| Ocean Blue | Pro |
| Forest Green | Pro |
| Candy Pink | Pro |
| Neon Nights | Pro |
| Minimal | Pro |
| Glassmorphism | Pro |

## 📈 Маркетинг и монетизация

### Каналы привлечения:
1. **SEO** — оптимизация под запросы "link in bio", "linktree alternative"
2. **Product Hunt** — запуск с акцией (первый месяц Pro бесплатно)
3. **Twitter/X** — посты про продуктивность для креаторов
4. **Instagram** — таргет на инфлюенсеров
5. **TikTok** — короткие видео с демо

### Конверсия в Pro:
- Ограничение 5 ссылок стимулирует апгрейд
- Pro темы видны в превью, но недоступны
- Watermark "Powered by LinkHub" убирается только в Pro

## 🔮 Roadmap

- [ ] Интеграция Stripe для оплаты
- [ ] Кастомные домены
- [ ] Расширенная аналитика (география, устройства)
- [ ] Интеграция с соцсетями
- [ ] Шедулинг ссылок
- [ ] A/B тестирование

## 📄 Лицензия

MIT

---

Сделано с ❤️ для $1k/мес стартапа
