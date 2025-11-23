const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function asset(path: string) {
    if (!path) return `${BASE_PATH}`;
    // ensure leading slash
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_PATH}${p}`;
}

export function absoluteAsset(path: string) {
    const relative = asset(path);
    try {
        // If SITE_URL is already absolute, new URL will work
        return new URL(relative, SITE_URL).toString();
    } catch {
        return `${SITE_URL.replace(/\/$/, '')}${relative}`;
    }
}

export const BASE = BASE_PATH;
export const SITE = SITE_URL;
