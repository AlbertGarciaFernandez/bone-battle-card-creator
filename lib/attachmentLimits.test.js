import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_EMAIL_ATTACHMENTS_BYTES, addAttachmentBytes } from './attachmentLimits.js';

test('adds attachment bytes while staying under the total limit', () => {
  const result = addAttachmentBytes(1024, 2048);

  assert.deepEqual(result, { total: 3072, error: null });
});

test('returns a clear error when attachments exceed the total limit', () => {
  const result = addAttachmentBytes(MAX_EMAIL_ATTACHMENTS_BYTES - 1, 2);

  assert.equal(result.total, MAX_EMAIL_ATTACHMENTS_BYTES + 1);
  assert.equal(result.error, 'Attachments exceed the total size limit.');
});
