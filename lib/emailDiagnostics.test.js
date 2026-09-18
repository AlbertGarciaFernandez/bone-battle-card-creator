import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEmailDiagnostics } from './emailDiagnostics.js';

test('builds public resend diagnostics with id, recipients, and attachment sizes', () => {
  const diagnostics = buildEmailDiagnostics({
    resendData: { id: 'email_123' },
    to: ['albert@example.com', 'joker@example.com'],
    attachments: [
      { filename: 'pup.jpg', content: Buffer.from('image-bytes') },
      { filename: 'card.json', content: Buffer.from('{"ok":true}').toString('base64') },
    ],
  });

  assert.deepEqual(diagnostics, {
    id: 'email_123',
    to: ['albert@example.com', 'joker@example.com'],
    attachments: [
      { filename: 'pup.jpg', bytes: 11 },
      { filename: 'card.json', bytes: 16 },
    ],
  });
});

test('uses null id when resend does not return one', () => {
  const diagnostics = buildEmailDiagnostics({ resendData: null, to: [], attachments: [] });

  assert.equal(diagnostics.id, null);
});
