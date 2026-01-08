# LaunchWait 🚀

> Beautiful waitlist landing pages for startups - Create, collect, and launch in minutes.

![LaunchWait](https://img.shields.io/badge/Status-MVP-green) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Stripe](https://img.shields.io/badge/Stripe-Integrated-blue)

## 💡 Business Model

**Target**: Startups, indie hackers, and entrepreneurs who need to validate ideas and collect early adopters.

**Pricing**:
- **Free**: 1 landing page, 100 subscribers, basic analytics
- **Pro ($9/mo)**: Unlimited pages, unlimited subscribers, advanced analytics, custom domain, no branding
- **Business ($29/mo)**: Team features, API access, webhooks, white label

**Revenue Target**: 100+ Pro subscribers = $1,000+/month

## ✨ Features

- 🎨 **Beautiful Templates** - 4 professionally designed templates (Gradient, Minimal, Dark, Startup)
- 📊 **Built-in Analytics** - Track views, unique visitors, and conversion rates
- 📧 **Email Collection** - Automatic subscriber management with CSV export
- ⚡ **Instant Setup** - Create your page in under 5 minutes
- 🎯 **Customization** - Colors, content, features - all customizable
- 📱 **Responsive** - Perfect on all devices
- 🔐 **Authentication** - Secure user accounts with NextAuth.js
- 💳 **Stripe Integration** - Subscription payments and billing portal
- 👤 **Personal Account** - Manage profile, plan, and billing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd launchwait

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
launchwait/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (marketing site)
│   │   ├── editor/               # Page editor/builder
│   │   ├── dashboard/            # Analytics dashboard
│   │   ├── account/              # Personal account & billing
│   │   ├── auth/
│   │   │   ├── signin/           # Sign in page
│   │   │   └── signup/           # Sign up page
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/ # NextAuth API
│   │   │   └── stripe/           # Stripe API routes
│   │   └── p/[slug]/             # Public landing pages
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── Providers.tsx         # Auth providers
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── stripe.ts             # Stripe utilities
│   │   ├── storage.ts            # LocalStorage utilities
│   │   └── utils.ts              # Helper functions
│   └── types/
│       └── index.ts              # TypeScript types
├── .env.example                  # Environment variables template
├── public/
├── tailwind.config.ts
└── package.json
```

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Auth**: NextAuth.js (Credentials Provider)
- **Payments**: Stripe (Checkout, Billing Portal, Webhooks)
- **Storage**: LocalStorage (MVP) → Supabase/PostgreSQL (Production)

## 📈 Roadmap to $1K/month

### Phase 1: MVP ✅
- [x] Landing page builder
- [x] Email collection
- [x] Basic analytics
- [x] Template selection
- [x] CSV export

### Phase 2: Auth & Payments ✅
- [x] User authentication (NextAuth.js)
- [x] Sign up / Sign in pages
- [x] Protected routes
- [x] Stripe integration for payments
- [x] Subscription plans (Free/Pro/Business)
- [x] Billing portal
- [x] Personal account page

### Phase 3: Launch
- [ ] Deploy to Vercel
- [ ] Add Supabase for database
- [ ] Custom domain support
- [ ] Email notifications

### Phase 4: Growth
- [ ] More templates
- [ ] A/B testing
- [ ] Integrations (Mailchimp, ConvertKit)
- [ ] Referral program
- [ ] Team collaboration

## 💰 Monetization Strategy

1. **Free tier** to acquire users
2. **Pro tier ($9/mo)** for serious users:
   - Remove "Powered by LaunchWait" branding
   - Unlimited subscribers
   - Custom domain
   - Advanced analytics
3. **Business tier ($29/mo)** for agencies:
   - White label
   - API access
   - Team features

## 🚀 Deploy

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 License

MIT License - feel free to use for your own projects!

---

Built with ❤️ for the indie hacker community
