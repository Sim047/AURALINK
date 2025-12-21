// frontend/src/components/GlobalSearch.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Search, Users, Calendar, Trophy, ShoppingBag, Stethoscope, Hash, X } from "lucide-react";

const API = (import.meta as any).env?.VITE_API_URL || "";

interface GlobalSearchProps {
  token: string;
  onNavigate?: (view: string) => void;
  onViewProfile?: (user: any) => void;
}

type ResultItem = {
  type: "user" | "event" | "other" | "service" | "product" | "post";
  id: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  raw?: any;
};

export default function GlobalSearch({ token, onNavigate, onViewProfile }: GlobalSearchProps) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    if (!debouncedQ || debouncedQ.trim().length < 2) {
      setResults([]);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        // Parallel fetches (keep light; filter client-side)
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const [usersRes, eventsRes, postsRes, servicesRes, marketRes] = await Promise.all([
          axios.get(`${API}/api/users/all`, { params: { search: debouncedQ, limit: 20 }, headers }),
          axios.get(`${API}/api/events`, { headers }),
          axios.get(`${API}/api/posts`, { params: { limit: 20 }, headers }),
          axios.get(`${API}/api/services`, { params: { limit: 20 }, headers }),
          axios.get(`${API}/api/marketplace`, { params: { limit: 20 }, headers }),
        ]);

        const users: ResultItem[] = (usersRes.data || []).slice(0, 20).map((u: any) => ({
          type: "user",
          id: u._id,
          title: u.username,
          subtitle: (u.status) || (u.username ? `@${u.username}` : ""),
          avatarUrl: u.avatar,
          raw: u,
        }));

        const events: ResultItem[] = ((eventsRes.data?.events) || (eventsRes.data || [])).filter((e: any) =>
          textMatch(debouncedQ, [e.title, e.sport, e.location?.city, e.location?.venue])
        ).slice(0, 20).map((e: any) => ({
          type: "event",
          id: e._id,
          title: e.title,
          subtitle: [e.sport, e.location?.city].filter(Boolean).join(" · "),
          raw: e,
        }));

        const other: ResultItem[] = (postsRes.data?.posts || postsRes.data || []).filter((p: any) =>
          textMatch(debouncedQ, [p.title, p.caption, Array.isArray(p.tags) ? p.tags.join(" ") : p.tags])
        ).slice(0, 20).map((p: any) => ({
          type: "other",
          id: p._id,
          title: p.title || p.caption || "Post",
          subtitle: p.tags ? (Array.isArray(p.tags) ? p.tags.join(", ") : p.tags) : undefined,
          raw: p,
        }));

        const services: ResultItem[] = (servicesRes.data?.services || servicesRes.data || []).filter((s: any) =>
          textMatch(debouncedQ, [s.title, s.category, s.description])
        ).slice(0, 20).map((s: any) => ({
          type: "service",
          id: s._id,
          title: s.title,
          subtitle: [s.category, s.location?.city].filter(Boolean).join(" · "),
          raw: s,
        }));

        const products: ResultItem[] = (marketRes.data?.items || marketRes.data || []).filter((m: any) =>
          textMatch(debouncedQ, [m.title, m.category, m.description])
        ).slice(0, 20).map((m: any) => ({
          type: "product",
          id: m._id,
          title: m.title,
          subtitle: [m.category, m.price ? `${m.price} ${m.currency || ""}` : undefined].filter(Boolean).join(" · "),
          raw: m,
        }));

        const combined: ResultItem[] = [...users, ...events, ...other, ...services, ...products].slice(0, 50);
        setResults(combined);
      } catch (err) {
        console.error("GlobalSearch error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedQ, token]);

  function handleOpen() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 10);
  }
  function handleClose() {
    setOpen(false);
    setQ("");
    setResults([]);
  }

  function handleSelect(item: ResultItem) {
    switch (item.type) {
      case "user":
        if (onNavigate) onNavigate("all-users");
        onViewProfile && onViewProfile(item.raw);
        break;
      case "event":
        localStorage.setItem("auralink-discover-category", "sports");
        onNavigate && onNavigate("discover");
        break;
      case "other":
        localStorage.setItem("auralink-discover-category", "other");
        onNavigate && onNavigate("discover");
        break;
      case "service":
        localStorage.setItem("auralink-discover-category", "services");
        onNavigate && onNavigate("discover");
        break;
      case "product":
        localStorage.setItem("auralink-discover-category", "marketplace");
        onNavigate && onNavigate("discover");
        break;
    }
    handleClose();
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-2 px-4 py-3 rounded-xl themed-card hover:shadow-md transition-all"
        aria-expanded={open}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search everything… users, events, posts, services</span>
      </button>

      {/* Overlay */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border p-4 z-20 themed-card" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-theme-secondary" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type to search across the app…"
              className="flex-1 input rounded-lg"
            />
            <button className="p-2 rounded-lg border" style={{ borderColor: 'var(--border)' }} onClick={handleClose}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-theme-secondary mb-2">{loading ? "Searching…" : `${results.length} results`}</div>

          {results.length === 0 ? (
            <div className="text-theme-secondary text-sm">No matches</div>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-1">
              {results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => handleSelect(r)}
                  className="w-full text-left p-3 rounded-lg themed-card hover:shadow-sm flex items-center gap-3"
                >
                  {iconFor(r.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-heading truncate">{r.title}</div>
                    {r.subtitle && (
                      <div className="text-xs text-theme-secondary truncate">{r.subtitle}</div>
                    )}
                  </div>
                  <div className="text-xs px-2 py-1 rounded-md border" style={{ borderColor: 'var(--border)' }}>{labelFor(r.type)}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function textMatch(q: string, fields: any[]) {
  const s = String(q).toLowerCase();
  return fields.some((f) => String(f || "").toLowerCase().includes(s));
}

function iconFor(type: ResultItem["type"]) {
  const cls = "w-5 h-5 text-theme-secondary";
  switch (type) {
    case "user": return <Users className={cls} />;
    case "event": return <Trophy className={cls} />;
    case "other": return <Calendar className={cls} />;
    case "service": return <Stethoscope className={cls} />;
    case "product": return <ShoppingBag className={cls} />;
    case "post": return <Hash className={cls} />;
    default: return <Search className={cls} />;
  }
}

function labelFor(type: ResultItem["type"]) {
  switch (type) {
    case "user": return "User";
    case "event": return "Event";
    case "other": return "Other Event";
    case "service": return "Service";
    case "product": return "Marketplace";
    case "post": return "Post";
    default: return "Result";
  }
}
