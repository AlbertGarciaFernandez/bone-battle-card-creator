import test from 'node:test';
import assert from 'node:assert/strict';
import { createPendingCardUpdateRequest } from './base44UpdateRequest.js';

test('posts a pending review request to a separate entity without modifying Card', async () => {
    let calledUrl;
    let calledOptions;
    const payload = {
        status: 'pending', oldCardNumber: 'BB-12345', name: 'Rex',
        cardData: { action: 'update', oldCardNumber: 'BB-12345', name: 'Rex', gear: { rubber: 5 }, kinks: { toys: 2 } },
    };
    const result = await createPendingCardUpdateRequest({
        baseUrl: 'https://example.base44.app/',
        appId: 'app-123',
        apiKey: 'test-key',
        entityName: 'CardUpdateRequest',
        payload,
        fetchImpl: async (url, options) => {
            calledUrl = url;
            calledOptions = options;
            return { ok: true, status: 201, json: async () => ({ id: 'request-1' }) };
        },
    });

    assert.equal(calledUrl, 'https://example.base44.app/api/apps/app-123/entities/CardUpdateRequest');
    assert.equal(calledOptions.method, 'POST');
    assert.deepEqual(JSON.parse(calledOptions.body), payload);
    assert.deepEqual(result, { ok: true, status: 201, body: { id: 'request-1' } });
});
