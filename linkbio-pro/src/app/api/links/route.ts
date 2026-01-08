import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pageId, title, url, icon } = body;

    // Verify page belongs to user
    const page = await prisma.page.findFirst({
      where: { id: pageId, userId: session.user.id },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Get max order
    const maxOrder = await prisma.link.aggregate({
      where: { pageId },
      _max: { order: true },
    });

    const link = await prisma.link.create({
      data: {
        pageId,
        title,
        url,
        icon,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
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
    const { id, title, url, icon, isActive, order } = body;

    // Verify link belongs to user's page
    const link = await prisma.link.findFirst({
      where: {
        id,
        page: { userId: session.user.id },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        title,
        url,
        icon,
        isActive,
        order,
      },
    });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Link ID required" }, { status: 400 });
    }

    // Verify link belongs to user's page
    const link = await prisma.link.findFirst({
      where: {
        id,
        page: { userId: session.user.id },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await prisma.link.delete({ where: { id } });

    return NextResponse.json({ message: "Link deleted" });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
