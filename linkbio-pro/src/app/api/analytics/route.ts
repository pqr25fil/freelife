import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get user's pages
    const pages = await prisma.page.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    });

    const pageIds = pageId ? [pageId] : pages.map((p) => p.id);

    // Total clicks
    const totalClicks = await prisma.click.count({
      where: {
        pageId: { in: pageIds },
        createdAt: { gte: startDate },
      },
    });

    // Clicks by day
    const clicksByDay = await prisma.click.groupBy({
      by: ["createdAt"],
      where: {
        pageId: { in: pageIds },
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    // Clicks by link
    const clicksByLink = await prisma.click.groupBy({
      by: ["linkId"],
      where: {
        pageId: { in: pageIds },
        linkId: { not: null },
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    // Get link details
    const linkIds = clicksByLink.map((c) => c.linkId).filter(Boolean) as string[];
    const links = await prisma.link.findMany({
      where: { id: { in: linkIds } },
      select: { id: true, title: true, url: true },
    });

    const linkClicksWithDetails = clicksByLink.map((click) => {
      const link = links.find((l) => l.id === click.linkId);
      return {
        linkId: click.linkId,
        title: link?.title || "Unknown",
        url: link?.url || "",
        clicks: click._count,
      };
    });

    // Clicks by device
    const clicksByDevice = await prisma.click.groupBy({
      by: ["device"],
      where: {
        pageId: { in: pageIds },
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    // Clicks by country
    const clicksByCountry = await prisma.click.groupBy({
      by: ["country"],
      where: {
        pageId: { in: pageIds },
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    return NextResponse.json({
      totalClicks,
      clicksByDay: clicksByDay.map((c) => ({
        date: c.createdAt,
        clicks: c._count,
      })),
      clicksByLink: linkClicksWithDetails.sort((a, b) => b.clicks - a.clicks),
      clicksByDevice: clicksByDevice.map((c) => ({
        device: c.device || "Unknown",
        clicks: c._count,
      })),
      clicksByCountry: clicksByCountry.map((c) => ({
        country: c.country || "Unknown",
        clicks: c._count,
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
