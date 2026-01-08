import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pages = await prisma.page.findMany({
      where: { userId: session.user.id },
      include: {
        links: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { clicks: true },
        },
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, bio, avatar, theme, username } = body;

    // Check if page belongs to user
    const existingPage = await prisma.page.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Check if username is taken by another page
    if (username && username !== existingPage.username) {
      const usernameTaken = await prisma.page.findUnique({
        where: { username },
      });
      if (usernameTaken) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        bio,
        avatar,
        theme,
        username,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
