import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { themes } from "@/lib/themes";

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const data = await request.json();
    const { name, bio, avatar, theme } = data;

    // Check if theme is valid and if pro theme is selected by free user
    if (theme) {
      const selectedTheme = themes.find((t) => t.id === theme);
      if (!selectedTheme) {
        return NextResponse.json({ error: "Тема не найдена" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      });

      if (selectedTheme.isPro && !user?.isPro) {
        return NextResponse.json(
          { error: "Эта тема доступна только для Pro пользователей" },
          { status: 403 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        bio,
        avatar,
        theme,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        theme: true,
        isPro: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
