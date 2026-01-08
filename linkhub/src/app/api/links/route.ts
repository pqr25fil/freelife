import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Get all links for current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const links = await prisma.link.findMany({
      where: { userId: session.userId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error("Get links error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// Create new link
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { title, url, icon } = await request.json();

    if (!title || !url) {
      return NextResponse.json(
        { error: "Название и URL обязательны" },
        { status: 400 }
      );
    }

    // Check link limit for free users
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user?.isPro) {
      const linkCount = await prisma.link.count({
        where: { userId: session.userId },
      });
      if (linkCount >= 5) {
        return NextResponse.json(
          { error: "Лимит ссылок достигнут. Обновитесь до Pro для безлимитных ссылок." },
          { status: 403 }
        );
      }
    }

    // Get max order
    const maxOrder = await prisma.link.findFirst({
      where: { userId: session.userId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const link = await prisma.link.create({
      data: {
        title,
        url,
        icon,
        order: (maxOrder?.order ?? -1) + 1,
        userId: session.userId,
      },
    });

    return NextResponse.json({ link });
  } catch (error) {
    console.error("Create link error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
