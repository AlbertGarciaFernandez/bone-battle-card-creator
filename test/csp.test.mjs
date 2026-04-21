import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { createCspHeader } from '../lib/csp.mjs';

function getDirective(csp, name) {
  return csp
    .split(';')
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith(`${name} `));
}

test('production CSP allows Next inline scripts by nonce without eval', () => {
  const csp = createCspHeader('abc123', { isDevelopment: false });
  const scriptSrc = getDirective(csp, 'script-src');

  assert.equal(scriptSrc, "script-src 'self' 'nonce-abc123'");
  assert.doesNotMatch(scriptSrc, /'unsafe-inline'/);
  assert.doesNotMatch(scriptSrc, /'unsafe-eval'/);
});

test('development CSP allows HMR eval and websocket connections', () => {
  const csp = createCspHeader('dev456', { isDevelopment: true });
  const scriptSrc = getDirective(csp, 'script-src');
  const connectSrc = getDirective(csp, 'connect-src');

  assert.equal(scriptSrc, "script-src 'self' 'nonce-dev456' 'unsafe-eval'");
  assert.match(connectSrc, /ws:/);
  assert.match(connectSrc, /wss:/);
});

test('home page opts into dynamic rendering so Next can inject request nonces', async () => {
  const pageSource = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8');

  assert.match(pageSource, /export const dynamic = ['"]force-dynamic['"]/);
});
