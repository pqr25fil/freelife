import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession, PLANS, stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe не настроен. Добавьте STRIPE_SECRET_KEY в переменные окружения.' },
        { status: 500 }
      )
    }

    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const { plan } = await request.json()

    if (!plan || !['PRO', 'UNLIMITED'].includes(plan)) {
      return NextResponse.json(
        { error: 'Неверный тариф' },
        { status: 400 }
      )
    }

    const planConfig = PLANS[plan as keyof typeof PLANS]
    
    if (!planConfig.priceId) {
      return NextResponse.json(
        { error: 'Тариф не настроен. Добавьте STRIPE_PRO_PRICE_ID и STRIPE_UNLIMITED_PRICE_ID в переменные окружения.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    const checkoutSession = await createCheckoutSession(
      user.id,
      user.email,
      planConfig.priceId,
      plan
    )

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Произошла ошибка при создании сессии оплаты' },
      { status: 500 }
    )
  }
}
