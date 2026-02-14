export async function apiRequest(endpoint: string, options: RequestInit = {}, orgId?: string) {
    const baseUrl = "http://localhost:5000";
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    const headers = new Headers(options.headers || {});

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
