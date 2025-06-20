import { NextRequest, NextResponse } from 'next/server';
import { Schedule, schedules } from './data';
import { verifyAccessToken } from './token';

async function withAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || undefined;
  try {
    await verifyAccessToken(authHeader);
    return null;
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || undefined;
  let tokenPayload: unknown;
  try {
    tokenPayload = await verifyAccessToken(authHeader);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Type guard for tokenPayload
  function isTokenPayload(obj: unknown): obj is { scope?: string; aud?: string } {
    return typeof obj === 'object' && obj !== null && ('scope' in obj || 'aud' in obj);
  }

  if (!isTokenPayload(tokenPayload)) {
    return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
  }

  // Check for required scope
  const scopes = (tokenPayload.scope || '').split(' ');
  if (!scopes.includes('schedule::read')) {
    return NextResponse.json({ error: 'Forbidden: missing schedule::read scope' }, { status: 403 });
  }

  // Check for correct audience (aud can be a string or array)
  const aud = tokenPayload.aud;
  const hasAudience = Array.isArray(aud)
    ? aud.includes('org.my-nextjs-app.schedule')
    : aud === 'org.my-nextjs-app.schedule';
  if (!hasAudience) {
    return NextResponse.json({ error: 'Forbidden: invalid audience' }, { status: 403 });
  }

  // Return all schedules
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth) return auth;
  const { title, time } = await req.json();
  if (!title || !time) {
    return NextResponse.json({ error: 'Missing title or time' }, { status: 400 });
  }
  const id = Math.random().toString(36).substr(2, 9);
  const schedule: Schedule = { id, title, time };
  schedules.push(schedule);
  return NextResponse.json(schedule, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth) return auth;
  const { id, title, time } = await req.json();
  if (!id || !title || !time) {
    return NextResponse.json({ error: 'Missing id, title, or time' }, { status: 400 });
  }
  const idx = schedules.findIndex((s: Schedule) => s.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
  }
  schedules[idx] = { id, title, time };
  return NextResponse.json(schedules[idx]);
}

export async function DELETE(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth) return auth;
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const idx = schedules.findIndex((s: Schedule) => s.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
  }
  const removed = schedules.splice(idx, 1);
  return NextResponse.json(removed[0]);
}
