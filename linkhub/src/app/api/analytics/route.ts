import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Get analytics for current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Get total views
    const totalViews = await prisma.analytics.count({
      where: { userId: session.userId, type: "view" },
    });

    // Get total clicks
    const totalClicks = await prisma.analytics.count({
      where: { userId: session.userId, type: "click" },
    });

    // Get views for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentViews = await prisma.analytics.groupBy({
      by: ["createdAt"],
      where: {
        userId: session.userId,
        type: "view",
        createdAt: { gte: sevenDaysAgo },
      },
      _count: true,
    });

    // Get clicks per link
    const clicksPerLink = await prisma.analytics.groupBy({
      by: ["linkId"],
      where: {
        userId: session.userId,
        type: "click",
        linkId: { not: null },
      },
      _count: true,
    });

    // Get link details for clicks
    const links = await prisma.link.findMany({
      where: { userId: session.userId },
      select: { id: true, title: true },
    });

    const linkClicksWithDetails = clicksPerLink.map((item) => {
      const link = links.find((l) => l.id === item.linkId);
      return {
        linkId: item.linkId,
        title: link?.title || "Удалённая ссылка",
        clicks: item._count,
      };
    });

    return NextResponse.json({
      totalViews,
      totalClicks,
      clicksPerLink: linkClicksWithDetails,
      viewsOverTime: recentViews,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
