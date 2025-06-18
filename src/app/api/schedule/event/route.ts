import { NextRequest, NextResponse } from 'next/server';
import { Schedule, Event, schedules } from '../data';

// Helper to find schedule by id
function findSchedule(scheduleId: string): Schedule | undefined {
  return schedules.find(s => s.id === scheduleId);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const scheduleId = searchParams.get('scheduleId');
  if (!scheduleId) {
    return NextResponse.json({ error: 'Missing scheduleId' }, { status: 400 });
  }
  const schedule = findSchedule(scheduleId);
  if (!schedule) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
  }
  return NextResponse.json(schedule.events || []);
}

export async function POST(req: NextRequest) {
  const { scheduleId, title, time } = await req.json();
  if (!scheduleId || !title || !time) {
    return NextResponse.json({ error: 'Missing scheduleId, title, or time' }, { status: 400 });
  }
  const schedule = findSchedule(scheduleId);
  if (!schedule) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
  }
  if (!schedule.events) schedule.events = [];
  const id = Math.random().toString(36).substr(2, 9);
  const event: Event = { id, title, time };
  schedule.events.push(event);
  return NextResponse.json(event, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { scheduleId, id, title, time } = await req.json();
  if (!scheduleId || !id || !title || !time) {
    return NextResponse.json({ error: 'Missing scheduleId, id, title, or time' }, { status: 400 });
  }
  const schedule = findSchedule(scheduleId);
  if (!schedule || !schedule.events) {
    return NextResponse.json({ error: 'Schedule or events not found' }, { status: 404 });
  }
  const idx = schedule.events.findIndex(e => e.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  schedule.events[idx] = { id, title, time };
  return NextResponse.json(schedule.events[idx]);
}

export async function DELETE(req: NextRequest) {
  const { scheduleId, id } = await req.json();
  if (!scheduleId || !id) {
    return NextResponse.json({ error: 'Missing scheduleId or id' }, { status: 400 });
  }
  const schedule = findSchedule(scheduleId);
  if (!schedule || !schedule.events) {
    return NextResponse.json({ error: 'Schedule or events not found' }, { status: 404 });
  }
  const idx = schedule.events.findIndex(e => e.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  const removed = schedule.events.splice(idx, 1);
  return NextResponse.json(removed[0]);
}
