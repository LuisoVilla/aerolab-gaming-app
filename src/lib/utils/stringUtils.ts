/**
 * Utility functions for string manipulation and formatting
 */

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

/**
 * Converts a string to a URL-friendly slug
 * @param str - The string to convert
 * @returns URL-friendly slug
 */
export function createSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Formats a rating from 0-100 to a more readable format
 * @param rating - Rating value (0-100)
 * @returns Formatted rating string
 */
export function formatRating(rating?: number): string {
  if (!rating) return 'Not rated';
  if (rating >= 90) return `${rating}/100 (Excellent)`;
  if (rating >= 80) return `${rating}/100 (Very Good)`;
  if (rating >= 70) return `${rating}/100 (Good)`;
  if (rating >= 60) return `${rating}/100 (Average)`;
  return `${rating}/100 (Below Average)`;
}
