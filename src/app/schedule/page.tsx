"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Schedule {
  id: string;
  title: string;
  date: string;
}

export default function SchedulePage() {
  return (
    <SessionProvider>
      <SchedulePageContent />
    </SessionProvider>
  );
}

function SchedulePageContent() {
  const { data: session, status } = useSession();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ id?: string; title: string; date: string }>({ title: "", date: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchSchedules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  // Helper to get access_token from session (with type guard)
  function getAccessToken(): string | undefined {
    if (session && typeof session === 'object' && 'access_token' in session) {
      return (session as { access_token?: string }).access_token;
    }
    return undefined;
  }

  async function fetchSchedules() {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      const accessToken = getAccessToken();
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
      const res = await fetch("/api/schedule", { headers });
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const data = await res.json();
      setSchedules(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/schedule/${editingId}` : "/api/schedule";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const accessToken = getAccessToken();
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({ title: form.title, date: form.date }),
      });
      if (!res.ok) throw new Error("Failed to save schedule");
      setForm({ title: "", date: "" });
      setEditingId(null);
      fetchSchedules();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this schedule?")) return;
    setError(null);
    try {
      const headers: Record<string, string> = {};
      const accessToken = getAccessToken();
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
      const res = await fetch(`/api/schedule/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete schedule");
      fetchSchedules();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function startEdit(s: Schedule) {
    setForm({ title: s.title, date: s.date });
    setEditingId(s.id);
  }

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please sign in to manage schedules.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 8 }}>
      <h1>Schedules</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          required
          style={{ marginRight: 8 }}
        />
        <input
          type="date"
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          required
          style={{ marginRight: 8 }}
        />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: "", date: "" }); }}>Cancel</button>}
      </form>
      {loading ? (
        <div>Loading schedules...</div>
      ) : (
        <ul>
          {schedules.map(s => (
            <li key={s.id} style={{ marginBottom: 12 }}>
              <b>{s.title}</b> ({s.date})
              <button style={{ marginLeft: 8 }} onClick={() => startEdit(s)}>Edit</button>
              <button style={{ marginLeft: 8 }} onClick={() => handleDelete(s.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
