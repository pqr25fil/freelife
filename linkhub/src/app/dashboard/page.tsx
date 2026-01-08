"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Link2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  BarChart3,
  Eye,
  MousePointer,
  LogOut,
  Palette,
  GripVertical,
  Save,
  X,
  Loader2,
  Copy,
  Check,
  Crown,
  CreditCard,
  Settings,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { themes, getTheme } from "@/lib/themes";
import clsx from "clsx";

// Component to handle search params with Suspense
function StripeCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      toast.success("🎉 Добро пожаловать в Pro! Ваша подписка активирована.");
      router.replace("/dashboard");
    } else if (canceled === "true") {
      toast.error("Оплата отменена");
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  return null;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  theme: string;
  isPro: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeCurrentPeriodEnd?: string;
}

interface Analytics {
  totalViews: number;
  totalClicks: number;
  clicksPerLink: { linkId: string; title: string; clicks: number }[];
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>}>
      <StripeCallback />
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"links" | "appearance" | "analytics" | "subscription">("links");
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, linksRes, analyticsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/links"),
        fetch("/api/analytics"),
      ]);

      if (!userRes.ok) {
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      const linksData = await linksRes.json();
      const analyticsData = await analyticsRes.json();

      setUser(userData.user);
      setLinks(linksData.links || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка при оплате");
      setUpgradeLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка");
      setUpgradeLoading(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast.error("Заполните все поля");
      return;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLink),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setLinks([...links, data.link]);
      setNewLink({ title: "", url: "" });
      setShowAddForm(false);
      toast.success("Ссылка добавлена");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка добавления");
    }
  };

  const handleUpdateLink = async (id: string, data: Partial<Link>) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Ошибка обновления");
      }

      setLinks(links.map((l) => (l.id === id ? { ...l, ...data } : l)));
      setEditingLink(null);
      toast.success("Сохранено");
    } catch (error) {
      toast.error("Ошибка обновления");
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Удалить эту ссылку?")) return;

    try {
      await fetch(`/api/links/${id}`, { method: "DELETE" });
      setLinks(links.filter((l) => l.id !== id));
      toast.success("Ссылка удалена");
    } catch (error) {
      toast.error("Ошибка удаления");
    }
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error);
      }

      setUser(result.user);
      toast.success("Профиль обновлён");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка обновления");
    }
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${user?.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Ссылка скопирована!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LinkHub</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {user?.isPro && (
                <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-sm font-medium">
                  <Crown className="w-3.5 h-3.5" />
                  Pro
                </div>
              )}
              <button
                onClick={copyProfileLink}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">/{user?.username}</span>
              </button>
              <a
                href={`/${user?.username}`}
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Открыть</span>
              </a>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {[
                  { id: "links", label: "Ссылки", icon: Link2 },
                  { id: "appearance", label: "Внешний вид", icon: Palette },
                  { id: "analytics", label: "Аналитика", icon: BarChart3 },
                  { id: "subscription", label: "Подписка", icon: CreditCard },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={clsx(
                      "flex items-center gap-2 px-6 py-4 font-medium transition-colors",
                      activeTab === tab.id
                        ? "text-purple-600 border-b-2 border-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Links Tab */}
                {activeTab === "links" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Ваши ссылки ({links.length}
                        {!user?.isPro && "/5"})
                      </h2>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Добавить
                      </button>
                    </div>

                    {/* Add Link Form */}
                    {showAddForm && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4 border-2 border-dashed border-gray-300">
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Название (напр. Мой YouTube)"
                            value={newLink.title}
                            onChange={(e) =>
                              setNewLink({ ...newLink, title: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          />
                          <input
                            type="url"
                            placeholder="URL (напр. https://youtube.com/@channel)"
                            value={newLink.url}
                            onChange={(e) =>
                              setNewLink({ ...newLink, url: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddLink}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              <Save className="w-4 h-4" />
                              Сохранить
                            </button>
                            <button
                              onClick={() => setShowAddForm(false)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              <X className="w-4 h-4" />
                              Отмена
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Links List */}
                    <div className="space-y-3">
                      {links.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>У вас пока нет ссылок</p>
                          <p className="text-sm">Добавьте первую ссылку!</p>
                        </div>
                      ) : (
                        links.map((link) => (
                          <div
                            key={link.id}
                            className={clsx(
                              "bg-white border rounded-xl p-4 flex items-center gap-4 transition-all",
                              link.isActive
                                ? "border-gray-200 hover:border-gray-300"
                                : "border-gray-200 opacity-50"
                            )}
                          >
                            <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />

                            {editingLink === link.id ? (
                              <div className="flex-1 space-y-2">
                                <input
                                  type="text"
                                  defaultValue={link.title}
                                  id={`title-${link.id}`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                  type="url"
                                  defaultValue={link.url}
                                  id={`url-${link.id}`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      const title = (
                                        document.getElementById(
                                          `title-${link.id}`
                                        ) as HTMLInputElement
                                      ).value;
                                      const url = (
                                        document.getElementById(
                                          `url-${link.id}`
                                        ) as HTMLInputElement
                                      ).value;
                                      handleUpdateLink(link.id, { title, url });
                                    }}
                                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm"
                                  >
                                    Сохранить
                                  </button>
                                  <button
                                    onClick={() => setEditingLink(null)}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
                                  >
                                    Отмена
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 truncate">
                                    {link.title}
                                  </h3>
                                  <p className="text-sm text-gray-500 truncate">
                                    {link.url}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={link.isActive}
                                      onChange={(e) =>
                                        handleUpdateLink(link.id, {
                                          isActive: e.target.checked,
                                        })
                                      }
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                  </label>
                                  <button
                                    onClick={() => setEditingLink(link.id)}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLink(link.id)}
                                    className="p-2 text-gray-500 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === "appearance" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      Настройка профиля
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Имя
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.name || ""}
                          onBlur={(e) =>
                            handleUpdateProfile({ name: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Био
                        </label>
                        <textarea
                          defaultValue={user?.bio || ""}
                          onBlur={(e) =>
                            handleUpdateProfile({ bio: e.target.value })
                          }
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                          placeholder="Расскажите о себе..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Тема оформления
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {themes.map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() =>
                                handleUpdateProfile({ theme: theme.id })
                              }
                              disabled={theme.isPro && !user?.isPro}
                              className={clsx(
                                "relative p-4 rounded-xl border-2 transition-all text-left",
                                user?.theme === theme.id
                                  ? "border-purple-600 ring-2 ring-purple-100"
                                  : "border-gray-200 hover:border-gray-300",
                                theme.isPro && !user?.isPro && "opacity-50"
                              )}
                            >
                              <div
                                className={clsx(
                                  "w-full h-12 rounded-lg mb-2",
                                  theme.background
                                )}
                              />
                              <p className="font-medium text-gray-900 text-sm">
                                {theme.name}
                              </p>
                              {theme.isPro && (
                                <span className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                                  PRO
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      Статистика
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                        <Eye className="w-8 h-8 mb-2 opacity-80" />
                        <p className="text-3xl font-bold">
                          {analytics?.totalViews || 0}
                        </p>
                        <p className="text-white/80">Просмотров профиля</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                        <MousePointer className="w-8 h-8 mb-2 opacity-80" />
                        <p className="text-3xl font-bold">
                          {analytics?.totalClicks || 0}
                        </p>
                        <p className="text-white/80">Кликов по ссылкам</p>
                      </div>
                    </div>

                    {analytics?.clicksPerLink &&
                      analytics.clicksPerLink.length > 0 && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3">
                            Клики по ссылкам
                          </h3>
                          <div className="space-y-2">
                            {analytics.clicksPerLink.map((item) => (
                              <div
                                key={item.linkId}
                                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                              >
                                <span className="text-gray-700">
                                  {item.title}
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {item.clicks} кликов
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {!user?.isPro && (
                      <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">
                          Расширенная аналитика
                        </h3>
                        <p className="text-white/80 mb-4">
                          Обновитесь до Pro для детальной статистики: география
                          посетителей, устройства, источники трафика и многое
                          другое.
                        </p>
                        <button 
                          onClick={handleUpgrade}
                          disabled={upgradeLoading}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
                        >
                          {upgradeLoading ? "Загрузка..." : "Получить Pro за $5/мес"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Subscription Tab */}
                {activeTab === "subscription" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      Управление подпиской
                    </h2>

                    {user?.isPro ? (
                      <div className="space-y-6">
                        {/* Pro Status Card */}
                        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-2xl p-6 text-white">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                              <Crown className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">LinkHub Pro</h3>
                              <p className="text-white/80">Подписка активна</p>
                            </div>
                          </div>
                          
                          {user.stripeCurrentPeriodEnd && (
                            <p className="text-white/80 mb-4">
                              Следующее списание:{" "}
                              <span className="font-semibold text-white">
                                {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString("ru-RU", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </p>
                          )}

                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={handleManageSubscription}
                              disabled={upgradeLoading}
                              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                              <Settings className="w-4 h-4" />
                              {upgradeLoading ? "Загрузка..." : "Управление подпиской"}
                            </button>
                          </div>
                        </div>

                        {/* Pro Features */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">
                            Ваши Pro преимущества
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {[
                              "Безлимитные ссылки",
                              "Все премиум темы",
                              "Расширенная аналитика",
                              "Приоритетная поддержка",
                              "Без брендинга LinkHub",
                              "Кастомный домен (скоро)",
                            ].map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-gray-700">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Upgrade Card */}
                        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 text-white text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Crown className="w-9 h-9" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">
                            Обновитесь до Pro
                          </h3>
                          <p className="text-white/80 mb-6 max-w-md mx-auto">
                            Разблокируйте все возможности LinkHub и выделитесь среди конкурентов
                          </p>
                          
                          <div className="text-4xl font-bold mb-6">
                            $5<span className="text-lg font-normal text-white/80">/месяц</span>
                          </div>

                          <button
                            onClick={handleUpgrade}
                            disabled={upgradeLoading}
                            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all disabled:opacity-50"
                          >
                            {upgradeLoading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Загрузка...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5" />
                                Получить Pro
                              </>
                            )}
                          </button>
                        </div>

                        {/* Features List */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">
                            Что входит в Pro
                          </h3>
                          <div className="space-y-3">
                            {[
                              { title: "Безлимитные ссылки", desc: "Добавляйте сколько угодно ссылок" },
                              { title: "Все премиум темы", desc: "Доступ к 9 эксклюзивным темам" },
                              { title: "Расширенная аналитика", desc: "Детальная статистика посетителей" },
                              { title: "Без брендинга", desc: "Уберите логотип LinkHub" },
                              { title: "Приоритетная поддержка", desc: "Быстрые ответы на ваши вопросы" },
                            ].map((feature, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{feature.title}</p>
                                  <p className="text-sm text-gray-600">{feature.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">
                            Часто задаваемые вопросы
                          </h3>
                          <div className="space-y-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-900">Как отменить подписку?</p>
                              <p className="text-gray-600">Вы можете отменить подписку в любой момент через панель управления. Доступ сохранится до конца оплаченного периода.</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Какие способы оплаты принимаются?</p>
                              <p className="text-gray-600">Мы принимаем все основные банковские карты через защищённую систему Stripe.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Предпросмотр
              </h3>
              <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-xl">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  <ProfilePreview user={user} links={links} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePreview({ user, links }: { user: User | null; links: Link[] }) {
  const theme = getTheme(user?.theme || "default");
  const activeLinks = links.filter((l) => l.isActive);

  return (
    <div className={clsx("min-h-[500px] p-6", theme.background)}>
      <div className="text-center mb-6">
        <div
          className={clsx(
            "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold",
            theme.cardBg,
            theme.cardText
          )}
        >
          {user?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <h2 className={clsx("text-xl font-bold", theme.textColor)}>
          @{user?.username}
        </h2>
        {user?.bio && (
          <p className={clsx("text-sm mt-1 opacity-80", theme.textColor)}>
            {user.bio}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {activeLinks.map((link) => (
          <div
            key={link.id}
            className={clsx(
              "block w-full px-4 py-3 rounded-xl text-center font-medium transition-all link-card",
              theme.cardBg,
              theme.cardText,
              theme.cardBorder,
              theme.cardHover
            )}
          >
            {link.title}
          </div>
        ))}
      </div>

      {!user?.isPro && (
        <div className="mt-8 text-center">
          <a
            href="/"
            className={clsx("text-sm opacity-60", theme.textColor)}
          >
            Powered by LinkHub
          </a>
        </div>
      )}
    </div>
  );
}
