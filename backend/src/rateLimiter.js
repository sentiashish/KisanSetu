export function createRateLimiter(limit, windowMs) {
  const attemptsByKey = new Map();

  return (key) => {
    const now = Date.now();
    const recentAttempts = (attemptsByKey.get(key) || [])
      .filter((timestamp) => now - timestamp < windowMs);

    if (recentAttempts.length >= limit) {
      attemptsByKey.set(key, recentAttempts);
      return true;
    }

    recentAttempts.push(now);
    attemptsByKey.set(key, recentAttempts);
    return false;
  };
}