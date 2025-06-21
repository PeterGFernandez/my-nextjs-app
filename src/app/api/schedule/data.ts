// Shared Schedule and Event types and in-memory data
export interface Event {
  id: string;
  title: string;
  time: string;
}

export interface Schedule {
  id: string;
  title: string;
  date: string;
  events?: Event[];
}

export const schedules: Schedule[] = [];
