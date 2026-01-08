import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicPage from "./PublicPage";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserPage({ params }: Props) {
  const { username } = await params;

  const page = await prisma.page.findUnique({
    where: { username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      user: {
        select: { plan: true },
      },
    },
  });

  if (!page || !page.isPublished) {
    notFound();
  }

  return <PublicPage page={page} />;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;

  const page = await prisma.page.findUnique({
    where: { username },
    select: { title: true, bio: true },
  });

  if (!page) {
    return { title: "Not Found" };
  }

  return {
    title: `${page.title} | LinkBio Pro`,
    description: page.bio || `Check out ${page.title}'s links`,
  };
}
