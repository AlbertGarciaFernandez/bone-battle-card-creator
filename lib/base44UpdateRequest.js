export async function createPendingCardUpdateRequest({ baseUrl, appId, apiKey, entityName, payload, fetchImpl = fetch }) {
    const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/api/apps/${appId}/entities/${entityName}`, {
        method: 'POST',
        headers: { api_key: apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    let body;
    try { body = await response.json(); } catch { body = null; }
    return { ok: response.ok, status: response.status, body };
}
