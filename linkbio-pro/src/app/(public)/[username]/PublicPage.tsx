"use client";

import { useEffect } from "react";
import { ExternalLink, Sparkles } from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
}

interface Page {
  id: string;
  username: string;
  title: string;
  bio?: string | null;
  avatar?: string | null;
  theme: string;
  links: Link[];
  user: { plan: string };
}

const themes: Record<string, { bg: string; card: string; text: string; gradient: string }> = {
  default: {
    bg: "from-violet-100 via-white to-indigo-100",
    card: "bg-white hover:bg-violet-50 border-violet-100 hover:border-violet-200",
    text: "text-gray-900",
    gradient: "from-violet-600 to-indigo-600",
  },
  sunset: {
    bg: "from-orange-100 via-white to-pink-100",
    card: "bg-white hover:bg-orange-50 border-orange-100 hover:border-orange-200",
    text: "text-gray-900",
    gradient: "from-orange-500 to-pink-500",
  },
  ocean: {
    bg: "from-cyan-100 via-white to-blue-100",
    card: "bg-white hover:bg-cyan-50 border-cyan-100 hover:border-cyan-200",
    text: "text-gray-900",
    gradient: "from-cyan-500 to-blue-600",
  },
  forest: {
    bg: "from-green-100 via-white to-emerald-100",
    card: "bg-white hover:bg-green-50 border-green-100 hover:border-green-200",
    text: "text-gray-900",
    gradient: "from-green-500 to-emerald-600",
  },
  dark: {
    bg: "from-gray-900 via-gray-800 to-gray-900",
    card: "bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-gray-600",
    text: "text-white",
    gradient: "from-gray-600 to-gray-700",
  },
  candy: {
    bg: "from-pink-100 via-white to-purple-100",
    card: "bg-white hover:bg-pink-50 border-pink-100 hover:border-pink-200",
    text: "text-gray-900",
    gradient: "from-pink-400 to-purple-500",
  },
};

export default function PublicPage({ page }: { page: Page }) {
  const theme = themes[page.theme] || themes.default;

  useEffect(() => {
    // Track page view
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId: page.id }),
    }).catch(() => {});
  }, [page.id]);

  const handleLinkClick = async (linkId: string, url: string) => {
    // Track link click
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId: page.id, linkId }),
    }).catch(() => {});

    // Open link
    window.open(url, "_blank");
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Avatar & Profile */}
        <div className="text-center mb-8">
          <div
            className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white text-3xl font-bold shadow-xl`}
          >
            {page.avatar ? (
              <img
                src={page.avatar}
                alt={page.title}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              page.title.charAt(0).toUpperCase()
            )}
          </div>
          <h1 className={`mt-4 text-2xl font-bold ${theme.text}`}>{page.title}</h1>
          {page.bio && (
            <p className={`mt-2 ${theme.text} opacity-70`}>{page.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {page.links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className={`w-full p-4 rounded-2xl border-2 ${theme.card} transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-between group`}
            >
              <span className={`font-medium ${theme.text}`}>{link.title}</span>
              <ExternalLink
                className={`w-5 h-5 ${theme.text} opacity-40 group-hover:opacity-100 transition-opacity`}
              />
            </button>
          ))}
        </div>

        {/* Branding */}
        {page.user.plan === "free" && (
          <div className="mt-12 text-center">
            <a
              href="/"
              className={`inline-flex items-center gap-2 text-sm ${theme.text} opacity-50 hover:opacity-100 transition-opacity`}
            >
              <Sparkles className="w-4 h-4" />
              Create your own with LinkBio Pro
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
