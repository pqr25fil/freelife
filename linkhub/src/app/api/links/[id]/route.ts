import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Update link
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Check ownership
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link || link.userId !== session.userId) {
      return NextResponse.json({ error: "Ссылка не найдена" }, { status: 404 });
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        title: data.title,
        url: data.url,
        icon: data.icon,
        isActive: data.isActive,
        order: data.order,
      },
    });

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error("Update link error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// Delete link
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link || link.userId !== session.userId) {
      return NextResponse.json({ error: "Ссылка не найдена" }, { status: 404 });
    }

    await prisma.link.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete link error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
