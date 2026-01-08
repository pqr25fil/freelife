export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateRandomColor(): string {
  const colors = [
    '#0ea5e9', // sky
    '#d946ef', // fuchsia
    '#f97316', // orange
    '#10b981', // emerald
    '#6366f1', // indigo
    '#ec4899', // pink
    '#14b8a6', // teal
    '#8b5cf6', // violet
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(content: string, filename: string, type: string = 'text/csv'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
