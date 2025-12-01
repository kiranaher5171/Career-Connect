import { NextResponse } from 'next/server';
import crypto from 'crypto';

export function middleware(req) {
  // Generate a nonce for each request
  const nonce = crypto.randomBytes(16).toString('base64');

  // Define the CSP header with the dynamically generated nonce
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self' data: blob: font:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\n/g, '').trim(); // Remove line breaks and trim any spaces

  // Create a response object
  const res = NextResponse.next();

  // Set the CSP header
  res.headers.set('Content-Security-Policy', csp);

  // Optionally pass the nonce to the response if needed elsewhere
  req.nextUrl.searchParams.set('nonce', nonce);

  // Make sure the CSP header is properly set and no other headers are overriding it
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');

  return res;
}
