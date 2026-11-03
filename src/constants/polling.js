/**
 * How often lists check the server for changes (see hooks/usePolling.js). The backend has
 * no real-time channel, so pages ask again every few seconds.
 * `maxIntervalMs` is the slowest the check gets after repeated server errors
 * (the wait doubles after each error and goes back to normal after a success).
 */
export const POLLING = {
  customers: { intervalMs: 15_000, maxIntervalMs: 120_000 },
};
