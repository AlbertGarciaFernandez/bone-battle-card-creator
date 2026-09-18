const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export const checkRateLimit = (
    key: string,
    max = MAX_REQUESTS,
    windowMs = WINDOW_MS
): boolean => {
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
        hits.set(key, recent);
        return false;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) {
        for (const [k, v] of hits) {
            if (v.every((t) => now - t >= windowMs)) hits.delete(k);
        }
    }
    return true;
};

export const getClientIp = (req: Request): string =>
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
