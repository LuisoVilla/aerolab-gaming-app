/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Formats a timestamp to a readable date string
 * @param timestamp - Unix timestamp (in seconds)
 * @returns Formatted date string (e.g., "Jan 15, 2023") or "Unknown" if invalid
 */
export function formatDate(timestamp?: number): string {
  if (!timestamp) return "Unknown";
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Formats a timestamp to a full date and time string
 * @param timestamp - Unix timestamp (in seconds)
 * @returns Formatted date and time string or "Unknown" if invalid
 */
export function formatDateTime(timestamp?: number): string {
  if (!timestamp) return "Unknown";
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Gets a relative time string (e.g., "2 days ago", "1 month ago")
 * @param timestamp - Unix timestamp (in seconds)
 * @returns Relative time string or "Unknown" if invalid
 */
export function getRelativeTime(timestamp?: number): string {
  if (!timestamp) return "Unknown";
  
  const now = new Date();
  const date = new Date(timestamp * 1000);
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return `${Math.floor(diffInDays / 365)} years ago`;
}
