/**
 * Rate Limiter for AI Generation
 *
 * Limits users to 5 image generations per session
 * Uses localStorage for client-side tracking
 * In production, implement server-side rate limiting with Redis
 */

export interface RateLimitInfo {
  remaining: number;
  total: number;
  resetTime?: Date;
}

const RATE_LIMIT_KEY = 'zypher_ai_rate_limit';
const MAX_REQUESTS = 5;
const RESET_HOURS = 24;

interface RateLimitData {
  count: number;
  resetTime: number;
}

/**
 * Check if user can make a request
 */
export function checkRateLimit(): RateLimitInfo {
  if (typeof window === 'undefined') {
    // Server-side, allow by default
    return { remaining: MAX_REQUESTS, total: MAX_REQUESTS };
  }

  const data = getRateLimitData();

  // Check if reset time has passed
  if (Date.now() > data.resetTime) {
    // Reset the counter
    resetRateLimit();
    return { remaining: MAX_REQUESTS, total: MAX_REQUESTS, resetTime: new Date(data.resetTime) };
  }

  const remaining = Math.max(0, MAX_REQUESTS - data.count);

  return {
    remaining,
    total: MAX_REQUESTS,
    resetTime: new Date(data.resetTime)
  };
}

/**
 * Increment rate limit counter
 */
export function incrementRateLimit(): RateLimitInfo {
  if (typeof window === 'undefined') {
    return { remaining: MAX_REQUESTS - 1, total: MAX_REQUESTS };
  }

  const data = getRateLimitData();

  // Check if reset time has passed
  if (Date.now() > data.resetTime) {
    resetRateLimit();
    const newData = getRateLimitData();
    newData.count = 1;
    saveRateLimitData(newData);
    return { remaining: MAX_REQUESTS - 1, total: MAX_REQUESTS, resetTime: new Date(newData.resetTime) };
  }

  data.count += 1;
  saveRateLimitData(data);

  const remaining = Math.max(0, MAX_REQUESTS - data.count);

  return {
    remaining,
    total: MAX_REQUESTS,
    resetTime: new Date(data.resetTime)
  };
}

/**
 * Reset rate limit counter
 */
export function resetRateLimit(): void {
  if (typeof window === 'undefined') return;

  const resetTime = Date.now() + (RESET_HOURS * 60 * 60 * 1000);
  const data: RateLimitData = { count: 0, resetTime };
  saveRateLimitData(data);
}

/**
 * Get rate limit data from storage
 */
function getRateLimitData(): RateLimitData {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);

    if (!stored) {
      const resetTime = Date.now() + (RESET_HOURS * 60 * 60 * 1000);
      return { count: 0, resetTime };
    }

    return JSON.parse(stored);
  } catch {
    const resetTime = Date.now() + (RESET_HOURS * 60 * 60 * 1000);
    return { count: 0, resetTime };
  }
}

/**
 * Save rate limit data to storage
 */
function saveRateLimitData(data: RateLimitData): void {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save rate limit data:', error);
  }
}

/**
 * Get human-readable time until reset
 */
export function getTimeUntilReset(): string {
  const info = checkRateLimit();

  if (!info.resetTime) {
    return 'Unknown';
  }

  const now = Date.now();
  const reset = info.resetTime.getTime();
  const diff = reset - now;

  if (diff <= 0) {
    return 'Now';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}
