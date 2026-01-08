"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ExternalLink,
  GripVertical,
  BarChart3,
  Settings,
  LogOut,
  Copy,
  Check,
  Eye,
  Sparkles,
  Link2,
  MousePointerClick,
  CreditCard,
  Crown,
} from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

interface Page {
  id: string;
  username: string;
  title: string;
  bio?: string;
  avatar?: string;
  theme: string;
  links: Link[];
  _count: { clicks: number };
}

interface User {
  id: string;
  plan: string;
  stripeSubscriptionId: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"links" | "appearance" | "analytics">("links");

  // New link form
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [addingLink, setAddingLink] = useState(false);

  // Edit page form
  const [editTitle, setEditTitle] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editTheme, setEditTheme] = useState("default");

  // Analytics
  const [analytics, setAnalytics] = useState<{
    totalClicks: number;
    clicksByLink: { linkId: string; title: string; clicks: number }[];
  } | null>(null);

  const fetchPage = useCallback(async () => {
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      if (data.length > 0) {
        setPage(data[0]);
        setEditTitle(data[0].title);
        setEditBio(data[0].bio || "");
        setEditUsername(data[0].username);
        setEditTheme(data[0].theme);
      }
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics?days=30");
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchPage();
      fetchAnalytics();
      fetchUser();
    }
  }, [status, router, fetchPage, fetchAnalytics, fetchUser]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page || !newLinkTitle || !newLinkUrl) return;

    setAddingLink(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: page.id,
          title: newLinkTitle,
          url: newLinkUrl.startsWith("http") ? newLinkUrl : `https://${newLinkUrl}`,
        }),
      });

      if (res.ok) {
        setNewLinkTitle("");
        setNewLinkUrl("");
        fetchPage();
      }
    } catch (error) {
      console.error("Error adding link:", error);
    } finally {
      setAddingLink(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await fetch(`/api/links?id=${linkId}`, { method: "DELETE" });
      fetchPage();
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleToggleLink = async (link: Link) => {
    try {
      await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: link.id, isActive: !link.isActive }),
      });
      fetchPage();
    } catch (error) {
      console.error("Error toggling link:", error);
    }
  };

  const handleSavePage = async () => {
    if (!page) return;

    setSaving(true);
    try {
      await fetch("/api/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: page.id,
          title: editTitle,
          bio: editBio,
          username: editUsername,
          theme: editTheme,
        }),
      });
      fetchPage();
    } catch (error) {
      console.error("Error saving page:", error);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (!page) return;
    navigator.clipboard.writeText(`${window.location.origin}/${page.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const themes = [
    { id: "default", name: "Default", gradient: "from-violet-600 to-indigo-600", pro: false },
    { id: "sunset", name: "Sunset", gradient: "from-orange-500 to-pink-500", pro: false },
    { id: "ocean", name: "Ocean", gradient: "from-cyan-500 to-blue-600", pro: false },
    { id: "forest", name: "Forest", gradient: "from-green-500 to-emerald-600", pro: true },
    { id: "dark", name: "Dark", gradient: "from-gray-800 to-gray-900", pro: true },
    { id: "candy", name: "Candy", gradient: "from-pink-400 to-purple-500", pro: true },
  ];

  const isPro = user?.plan === "pro" || user?.plan === "business";

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">LinkBio Pro</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Plan Badge */}
            {user && user.plan !== "free" && (
              <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                <Crown className="w-3 h-3" />
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
              </div>
            )}
            
            {page && (
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : `linkbio.pro/${page.username}`}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/${page?.username}`, "_blank")}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Link href="/dashboard/billing">
              <Button variant="ghost" size="sm">
                <CreditCard className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Upgrade Banner for Free Users */}
        {user && user.plan === "free" && (
          <div className="mb-6 p-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8" />
              <div>
                <p className="font-bold">Upgrade to Pro</p>
                <p className="text-sm text-violet-200">Remove branding, custom themes, advanced analytics</p>
              </div>
            </div>
            <Link href="/dashboard/billing">
              <Button variant="secondary" className="bg-white text-violet-600 hover:bg-violet-50">
                Upgrade Now — $5/mo
              </Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <MousePointerClick className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Clicks</p>
                  <p className="text-2xl font-bold">{analytics?.totalClicks || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Link2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Links</p>
                  <p className="text-2xl font-bold">
                    {page?.links.filter((l) => l.isActive).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">CTR</p>
                  <p className="text-2xl font-bold">
                    {page?.links.length && analytics?.totalClicks
                      ? `${((analytics.totalClicks / page.links.length) * 10).toFixed(1)}%`
                      : "0%"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "links" ? "default" : "outline"}
            onClick={() => setActiveTab("links")}
          >
            <Link2 className="w-4 h-4 mr-2" />
            Links
          </Button>
          <Button
            variant={activeTab === "appearance" ? "default" : "outline"}
            onClick={() => setActiveTab("appearance")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Appearance
          </Button>
          <Button
            variant={activeTab === "analytics" ? "default" : "outline"}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div>
            {activeTab === "links" && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Link Form */}
                  <form onSubmit={handleAddLink} className="space-y-3 p-4 bg-gray-50 rounded-xl">
                    <Input
                      placeholder="Link title"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                    />
                    <Input
                      placeholder="URL (e.g., https://example.com)"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                    />
                    <Button type="submit" className="w-full" disabled={addingLink}>
                      <Plus className="w-4 h-4 mr-2" />
                      {addingLink ? "Adding..." : "Add Link"}
                    </Button>
                  </form>

                  {/* Links List */}
                  <div className="space-y-3">
                    {page?.links.map((link) => (
                      <div
                        key={link.id}
                        className={`p-4 bg-white border-2 rounded-xl flex items-center gap-3 ${
                          link.isActive ? "border-gray-100" : "border-gray-100 opacity-50"
                        }`}
                      >
                        <GripVertical className="w-5 h-5 text-gray-300 cursor-grab" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{link.title}</p>
                          <p className="text-sm text-gray-500 truncate">{link.url}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleLink(link)}
                        >
                          <Eye className={`w-4 h-4 ${link.isActive ? "text-green-500" : "text-gray-300"}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(link.url, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}

                    {page?.links.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Link2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No links yet. Add your first link above!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Customize Your Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 bg-gray-100 rounded-l-xl text-sm text-gray-500">
                        linkbio.pro/
                      </span>
                      <Input
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell visitors about yourself..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {themes.map((theme) => {
                        const isLocked = theme.pro && !isPro;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => !isLocked && setEditTheme(theme.id)}
                            disabled={isLocked}
                            className={`p-3 rounded-xl border-2 transition-all relative ${
                              editTheme === theme.id
                                ? "border-violet-500 ring-2 ring-violet-500/20"
                                : "border-gray-100 hover:border-gray-200"
                            } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                          >
                            {isLocked && (
                              <div className="absolute top-1 right-1 bg-violet-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                PRO
                              </div>
                            )}
                            <div className={`h-8 rounded-lg bg-gradient-to-r ${theme.gradient} mb-2`} />
                            <p className="text-xs font-medium">{theme.name}</p>
                          </button>
                        );
                      })}
                    </div>
                    {!isPro && (
                      <p className="text-xs text-gray-500 mt-2">
                        <Link href="/dashboard/billing" className="text-violet-600 hover:underline">
                          Upgrade to Pro
                        </Link>{" "}
                        to unlock all themes
                      </p>
                    )}
                  </div>

                  <Button onClick={handleSavePage} className="w-full" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "analytics" && (
              <Card>
                <CardHeader>
                  <CardTitle>Link Performance (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.clicksByLink.map((item) => (
                      <div key={item.linkId} className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
                              style={{
                                width: `${
                                  analytics.totalClicks
                                    ? (item.clicks / analytics.totalClicks) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          {item.clicks} clicks
                        </span>
                      </div>
                    ))}

                    {(!analytics?.clicksByLink || analytics.clicksByLink.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No click data yet. Share your page to start tracking!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-sm font-medium text-gray-500 mb-4">Live Preview</p>
              <div className="bg-gray-900 rounded-3xl p-3 shadow-2xl">
                <div className="bg-white rounded-2xl overflow-hidden" style={{ height: "600px" }}>
                  <iframe
                    src={`/${page?.username}`}
                    className="w-full h-full border-0"
                    title="Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
