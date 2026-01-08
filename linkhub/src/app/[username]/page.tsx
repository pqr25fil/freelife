import { prisma } from "@/lib/db";
import { getTheme } from "@/lib/themes";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import clsx from "clsx";
import ProfileClient from "./ProfileClient";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { name: true, bio: true, username: true },
  });

  if (!user) {
    return { title: "Пользователь не найден" };
  }

  return {
    title: `${user.name || user.username} | LinkHub`,
    description: user.bio || `Ссылки пользователя @${user.username}`,
    openGraph: {
      title: `${user.name || user.username} | LinkHub`,
      description: user.bio || `Ссылки пользователя @${user.username}`,
      type: "profile",
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      avatar: true,
      theme: true,
      isPro: true,
    },
  });

  if (!user) {
    notFound();
  }

  const links = await prisma.link.findMany({
    where: { userId: user.id, isActive: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      url: true,
      icon: true,
    },
  });

  const theme = getTheme(user.theme);

  return (
    <ProfileClient
      user={user}
      links={links}
      theme={theme}
    />
  );
}
