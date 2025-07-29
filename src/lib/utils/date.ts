// src/lib/utils/date.ts

export function formatDateMMDDYYYY(timestamp: number): string {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp * 1000);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}
