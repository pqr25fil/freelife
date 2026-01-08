import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { links } = body; // Array of { id, order }

    // Update all links in a transaction
    await prisma.$transaction(
      links.map((link: { id: string; order: number }) =>
        prisma.link.update({
          where: { id: link.id },
          data: { order: link.order },
        })
      )
    );

    return NextResponse.json({ message: "Links reordered" });
  } catch (error) {
    console.error("Error reordering links:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
