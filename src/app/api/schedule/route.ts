import { NextRequest, NextResponse } from 'next/server';
import { Schedule, schedules } from './data';

export async function GET() {
  // Return all schedules
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
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
