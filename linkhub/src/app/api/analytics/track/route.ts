import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { type, username, linkId } = await request.json();

    if (!type || !username) {
      return NextResponse.json({ error: "Недостаточно данных" }, { status: 400 });
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    // Get user agent info (simplified)
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";

    // Simple device detection
    let device = "desktop";
    if (/mobile/i.test(userAgent)) device = "mobile";
    else if (/tablet/i.test(userAgent)) device = "tablet";

    // Simple browser detection
    let browser = "other";
    if (/chrome/i.test(userAgent)) browser = "chrome";
    else if (/firefox/i.test(userAgent)) browser = "firefox";
    else if (/safari/i.test(userAgent)) browser = "safari";
    else if (/edge/i.test(userAgent)) browser = "edge";

    await prisma.analytics.create({
      data: {
        type,
        device,
        browser,
        referer,
        userId: user.id,
        linkId: linkId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track analytics error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
