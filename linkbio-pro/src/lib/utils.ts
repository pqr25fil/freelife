import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUsername(email: string): string {
  const base = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}${random}`.toLowerCase();
}
