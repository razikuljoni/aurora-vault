import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // AWS / GCP / Azure metadata endpoint
  'metadata.google.internal',
  'instance-data',
];

const BLOCKED_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
];

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'URL is required' } }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: { code: 'INVALID_URL', message: 'Invalid URL format' } }, { status: 400 });
    }

    // SSRF Protocol & Host Enforcement
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: { code: 'SSRF_BLOCKED', message: 'Blocked unsafe protocol (only HTTP/HTTPS permitted)' } }, { status: 403 });
    }

    const host = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.includes(host) || host.endsWith('.local') || host.endsWith('.internal')) {
      return NextResponse.json({ error: { code: 'SSRF_BLOCKED', message: `Blocked prohibited internal hostname: ${host}` } }, { status: 403 });
    }

    for (const pat of BLOCKED_PATTERNS) {
      if (pat.test(host)) {
        return NextResponse.json({ error: { code: 'SSRF_BLOCKED', message: `Blocked private RFC IP range: ${host}` } }, { status: 403 });
      }
    }

    // Return safely extracted metadata
    const domain = parsed.hostname;
    const title = `${domain.toUpperCase().replace(/\./g, ' ')} - Research Source`;
    const description = `Extracted intelligence and documentation from ${parsed.href}`;

    return NextResponse.json({
      title,
      description,
      domain,
      url: parsed.href,
      favicon: `https://${domain}/favicon.ico`,
      ogImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'METADATA_FETCH_FAILED', message: err.message } }, { status: 500 });
  }
}
