export function getApiUrl() {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return "http://localhost:5000";
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://logimatch-ai-1.onrender.com";
}

export async function apiRequest(endpoint: string, options: RequestInit = {}, orgId?: string) {
    const baseUrl = getApiUrl();
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    const headers = new Headers(options.headers || {});

    // Automatically set Content-Type for JSON bodies
    if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Inject Organization ID if available
    if (orgId) {
        headers.set('X-Organization-ID', orgId);
    } else {
        // Fallback for demo purposes if no org is selected
        headers.set('X-Organization-ID', 'org_demo_123');
    }

    const res = await fetch(url, {
        ...options,
        headers
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown Error' }));
        throw new Error(error.error || `HTTP error! status: ${res.status}`);
    }

    return res.json();
}
