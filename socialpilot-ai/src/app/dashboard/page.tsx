import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPlanLimits } from '@/lib/stripe'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      generations: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  // Check if we need to reset generations (monthly reset)
  const now = new Date()
  const resetDate = new Date(user.generationsResetAt)
  const monthDiff = (now.getFullYear() - resetDate.getFullYear()) * 12 + (now.getMonth() - resetDate.getMonth())
  
  let currentGenerations = user.generationsCount
  
  if (monthDiff >= 1) {
    // Reset generations count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        generationsCount: 0,
        generationsResetAt: now,
      },
    })
    currentGenerations = 0
  }

  const planLimits = getPlanLimits(user.plan)
  const totalGenerations = await prisma.generation.count({
    where: { userId: user.id },
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <DashboardClient 
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          generationsCount: currentGenerations,
          stripeCustomerId: user.stripeCustomerId,
          stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.toISOString() || null,
        }}
        planLimits={planLimits}
        totalGenerations={totalGenerations}
        recentGenerations={user.generations.map(g => ({
          id: g.id,
          platform: g.platform,
          contentType: g.contentType,
          tone: g.tone,
          topic: g.topic,
          content: g.content,
          createdAt: g.createdAt.toISOString(),
        }))}
      />

      <Footer />
    </main>
  )
}
