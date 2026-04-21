import { NextResponse, type NextRequest } from 'next/server';
import { createCspHeader, createNonce } from './lib/csp.mjs';

export function proxy(request: NextRequest) {
  const nonce = createNonce();
  const cspHeader = createCspHeader(nonce, {
    isDevelopment: process.env.NODE_ENV !== 'production',
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Content-Security-Policy', cspHeader);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
