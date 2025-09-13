// Chooses the backend base URL in a predictable way.
// Priority:
// 1) Explicit env override (VITE_API_URL)
// 2) Hostname-based inference for staging/prod
// 3) Local dev: same-origin to leverage Vite proxy 
// 4) Same-origin fallback (works with reverse proxies)
export function pickApiBase(): string {
  const override = (import.meta.env as any).VITE_API_URL as string | undefined;
  if (override && override.trim()) return override.replace(/\/$/, '');

  const { protocol, hostname, port } = window.location;
  const origin = `${protocol}//${hostname}${port ? `:${port}` : ''}`;

  // Common patterns — tweak to match your domains if needed.
  if (/^staging[.-]/i.test(hostname)) {
    // e.g., staging.example.com -> api-staging.example.com
    const base = hostname.replace(/^staging[.-]/i, '');
    return `https://api-staging.${base}`;
  }
  if (/^app[.-]/i.test(hostname)) {
    // e.g., app.example.com -> api.example.com
    const base = hostname.replace(/^app[.-]/i, '');
    return `https://api.${base}`;
  }

  // Local dev: keep same-origin so /api hits the Vite proxy.
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return origin;
  }

  // Fallback: same-origin works when a reverse proxy exposes /api.
  return origin;
}