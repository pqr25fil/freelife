"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Link2 } from "lucide-react";
import clsx from "clsx";
import type { Theme } from "@/lib/themes";

interface User {
  id: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  theme: string;
  isPro: boolean;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string | null;
}

interface Props {
  user: User;
  links: Link[];
  theme: Theme;
}

export default function ProfileClient({ user, links, theme }: Props) {
  // Track page view
  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "view",
        username: user.username,
      }),
    }).catch(() => {});
  }, [user.username]);

  const handleLinkClick = (linkId: string) => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "click",
        username: user.username,
        linkId,
      }),
    }).catch(() => {});
  };

  return (
    <div className={clsx("min-h-screen", theme.background)}>
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || user.username}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/20"
            />
          ) : (
            <div
              className={clsx(
                "w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold",
                theme.cardBg,
                theme.cardText
              )}
            >
              {user.name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
            </div>
          )}
          <h1 className={clsx("text-2xl font-bold mb-1", theme.textColor)}>
            {user.name || `@${user.username}`}
          </h1>
          {user.name && (
            <p className={clsx("text-sm opacity-70 mb-2", theme.textColor)}>
              @{user.username}
            </p>
          )}
          {user.bio && (
            <p className={clsx("text-sm opacity-80 max-w-xs mx-auto", theme.textColor)}>
              {user.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id)}
              className={clsx(
                "block w-full px-6 py-4 rounded-xl text-center font-medium transition-all link-card",
                theme.cardBg,
                theme.cardText,
                theme.cardBorder,
                theme.cardHover
              )}
            >
              {link.title}
            </a>
          ))}
        </div>

        {links.length === 0 && (
          <div className={clsx("text-center py-12 opacity-60", theme.textColor)}>
            <p>Пользователь пока не добавил ссылки</p>
          </div>
        )}

        {/* Footer */}
        {!user.isPro && (
          <div className="mt-12 text-center">
            <a
              href="/"
              className={clsx(
                "inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity",
                theme.textColor
              )}
            >
              <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-violet-500 rounded flex items-center justify-center">
                <Link2 className="w-3 h-3 text-white" />
              </div>
              Создано с LinkHub
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
