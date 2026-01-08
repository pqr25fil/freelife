import Link from "next/link";
import { Link2, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
          <Link2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white/70 mb-8">
          Пользователь не найден
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white text-purple-900 px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-all"
        >
          <Home className="w-4 h-4" />
          На главную
        </Link>
      </div>
    </div>
  );
}
