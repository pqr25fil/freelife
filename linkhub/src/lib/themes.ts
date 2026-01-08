export interface Theme {
  id: string;
  name: string;
  isPro: boolean;
  background: string;
  cardBg: string;
  cardText: string;
  cardBorder?: string;
  cardHover: string;
  textColor: string;
  buttonStyle?: string;
}

export const themes: Theme[] = [
  {
    id: "default",
    name: "Classic White",
    isPro: false,
    background: "bg-gray-100",
    cardBg: "bg-white",
    cardText: "text-gray-900",
    cardBorder: "border border-gray-200",
    cardHover: "hover:bg-gray-50 hover:shadow-lg",
    textColor: "text-gray-900",
  },
  {
    id: "dark",
    name: "Dark Mode",
    isPro: false,
    background: "bg-gray-900",
    cardBg: "bg-gray-800",
    cardText: "text-white",
    cardBorder: "border border-gray-700",
    cardHover: "hover:bg-gray-700 hover:shadow-lg",
    textColor: "text-white",
  },
  {
    id: "gradient-sunset",
    name: "Sunset Gradient",
    isPro: false,
    background: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    cardBg: "bg-white/90 backdrop-blur-sm",
    cardText: "text-gray-900",
    cardHover: "hover:bg-white hover:shadow-xl",
    textColor: "text-white",
  },
  {
    id: "gradient-ocean",
    name: "Ocean Blue",
    isPro: true,
    background: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600",
    cardBg: "bg-white/90 backdrop-blur-sm",
    cardText: "text-gray-900",
    cardHover: "hover:bg-white hover:shadow-xl",
    textColor: "text-white",
  },
  {
    id: "gradient-forest",
    name: "Forest Green",
    isPro: true,
    background: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600",
    cardBg: "bg-white/90 backdrop-blur-sm",
    cardText: "text-gray-900",
    cardHover: "hover:bg-white hover:shadow-xl",
    textColor: "text-white",
  },
  {
    id: "gradient-candy",
    name: "Candy Pink",
    isPro: true,
    background: "bg-gradient-to-br from-pink-400 via-rose-500 to-red-500",
    cardBg: "bg-white/90 backdrop-blur-sm",
    cardText: "text-gray-900",
    cardHover: "hover:bg-white hover:shadow-xl",
    textColor: "text-white",
  },
  {
    id: "neon",
    name: "Neon Nights",
    isPro: true,
    background: "bg-black",
    cardBg: "bg-gray-900 border-2 border-purple-500",
    cardText: "text-purple-400",
    cardHover: "hover:border-pink-500 hover:text-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]",
    textColor: "text-purple-400",
  },
  {
    id: "minimal",
    name: "Minimal",
    isPro: true,
    background: "bg-white",
    cardBg: "bg-transparent border-2 border-gray-900",
    cardText: "text-gray-900",
    cardHover: "hover:bg-gray-900 hover:text-white",
    textColor: "text-gray-900",
  },
  {
    id: "glass",
    name: "Glassmorphism",
    isPro: true,
    background: "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500",
    cardBg: "bg-white/20 backdrop-blur-md border border-white/30",
    cardText: "text-white",
    cardHover: "hover:bg-white/30 hover:shadow-xl",
    textColor: "text-white",
  },
];

export function getTheme(id: string): Theme {
  return themes.find((t) => t.id === id) || themes[0];
}
