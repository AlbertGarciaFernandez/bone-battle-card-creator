export function createNonce() {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);

  let value = '';
  for (const byte of bytes) {
    value += String.fromCharCode(byte);
  }

  return btoa(value);
}

export function createCspHeader(nonce, { isDevelopment = false } = {}) {
  const scriptSources = [`'self'`, `'nonce-${nonce}'`];
  const connectSources = [`'self'`, 'https:', 'blob:'];

  if (isDevelopment) {
    scriptSources.push(`'unsafe-eval'`);
    connectSources.push('ws:', 'wss:');
  }

  return [
    `default-src 'self'`,
    `script-src ${scriptSources.join(' ')}`,
    `script-src-elem ${scriptSources.join(' ')}`,
    `script-src-attr 'none'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' https://fonts.gstatic.com`,
    `connect-src ${connectSources.join(' ')}`,
    `frame-src 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join('; ');
}
