/**
 * Constants used throughout the application
 */

export const IGDB_BASE_URL = 'https://api.igdb.com/v4';

export const FILTER_OPTIONS = {
  lastAdded: 'Last Added',
  newest: 'Newest First',
  oldest: 'Oldest First'
} as const;

export const RATING_THRESHOLDS = {
  EXCELLENT: 90,
  VERY_GOOD: 80,
  GOOD: 70,
  AVERAGE: 60
} as const;

export const IMAGE_SIZES = {
  COVER_SMALL: 't_cover_small',
  COVER_BIG: 't_cover_big',
  SCREENSHOT_MED: 't_screenshot_med',
  SCREENSHOT_BIG: 't_screenshot_big',
  LOGO_MED: 't_logo_med'
} as const;

export const GAME_FIELDS = [
  'id',
  'name',
  'summary',
  'cover.url',
  'screenshots.url',
  'genres.name',
  'platforms.name',
  'first_release_date',
  'rating',
  'rating_count',
  'involved_companies.company.name',
  'involved_companies.developer',
  'involved_companies.publisher',
  'storyline',
  'slug'
].join(',');
