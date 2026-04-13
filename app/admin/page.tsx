"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Panel de administración — /admin
//
// Para una demo funcional, los leads se pasan vía localStorage.
// En producción, reemplazá el useEffect por un fetch a Supabase o tu API.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { BU_META, type BUKey } from "@/data/quizzes";
import Link from "next/link";

interface Lead {
  name: string;
  email: string;
  company: string;
  role: string;
  bu: BUKey;
  score: number;
  tier: string;
  timestamp: string;
}

function getTierColor(score: number) {
  if (score < 35) return "#dc2626";
  if (score < 55) return "#d97706";
  if (score < 75) return "#1a56db";
  return "#059669";
}

export default function AdminPage() {
  const [leads, setLeads]   = useState<Lead[]>([]);
  const [tab, setTab]       = useState<"leads" | "stats">("leads");
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd]       = useState("");
  const [error, setError]   = useState("");

  // Contraseña simple para demo — cambiála por NextAuth en producción
  const DEMO_PASSWORD = "demo2024";

  function login() {
    if (pwd === DEMO_PASSWORD) {
      setAuthed(true);
      loadLeads();
    } else {
      setError("Contraseña incorrecta");
    }
  }

  async function loadLeads() {
  const { supabase } = await import('@/lib/supabase');
  const { data } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (data) setLeads(data as Lead[]);
}

  useEffect(() => {
    if (authed) loadLeads();
  }, [authed]);

  const avg = leads.length
    ? Math.round(leads.reduce((a, l) => a + l.score, 0) / leads.length)
    : 0;

  const buCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.bu] = (acc[l.bu] || 0) + 1;
    return acc;
  }, {});

  // ── Login ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8">
          <h1 className="text-xl font-bold mb-1">Panel de administración</h1>
          <p className="text-sm text-gray-500 mb-6">Ingresá la contraseña de acceso.</p>
          <label className="block text-[12px] font-medium text-gray-500 mb-1">Contraseña</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] mb-2 focus:outline-none focus:border-blue-500"
          />
          {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}
          <button
            onClick={login}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Ingresar
          </button>
          <p className="text-center text-[11px] text-gray-400 mt-4">
            Contraseña de demo: <code className="bg-gray-100 px-1 rounded">demo2024</code>
          </p>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="font-bold text-[15px] tracking-tight">
          Diag<span className="text-blue-600">.</span>IA
          <span className="ml-2 text-[11px] font-normal text-gray-400">/ Admin</span>
        </span>
        <Link
          href="/"
          className="text-[13px] text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Volver a la app
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 mb-6">
          {(["leads", "stats"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-[13px] border-b-2 transition-colors ${
                tab === t
                  ? "border-blue-600 text-blue-600 font-medium"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "leads" ? "Leads capturados" : "Estadísticas"}
            </button>
          ))}
        </div>

        {/* ── Tab: Leads ── */}
        {tab === "leads" && (
          <>
            <h2 className="text-xl font-bold mb-1">
              {leads.length} lead{leads.length !== 1 ? "s" : ""} capturado{leads.length !== 1 ? "s" : ""}
            </h2>
            <p className="text-[13px] text-gray-400 mb-5">Todos los envíos del diagnóstico</p>

            {leads.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                Sin leads aún. Completá un diagnóstico en la app para ver datos aquí.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Nombre", "Email", "Empresa", "Cargo", "Unidad", "Puntaje", "Nivel", "Hora"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l, i) => {
                      const meta = BU_META[l.bu];
                      const color = getTierColor(l.score);
                      return (
                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{l.name}</td>
                          <td className="px-4 py-3 text-gray-500">{l.email}</td>
                          <td className="px-4 py-3">{l.company}</td>
                          <td className="px-4 py-3 text-gray-500">{l.role}</td>
                          <td className="px-4 py-3">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
                              style={{ background: meta.color + "18", color: meta.color }}
                            >
                              {meta.tag}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                              style={{ background: color + "18", color }}
                            >
                              {l.score}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{l.tier}</td>
                          <td className="px-4 py-3 text-gray-400">{l.timestamp}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── Tab: Stats ── */}
        {tab === "stats" && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[11px] text-gray-500 mb-1">Total leads</p>
                <p className="text-2xl font-medium">{leads.length}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[11px] text-gray-500 mb-1">Puntaje promedio</p>
                <p className="text-2xl font-medium">{leads.length ? `${avg}/100` : "—"}</p>
              </div>
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Leads por unidad de negocio
            </p>
            {Object.entries(buCounts).map(([bu, count]) => {
              const meta = BU_META[bu as BUKey];
              const pct = Math.round((count / leads.length) * 100);
              return (
                <div key={bu} className="flex items-center gap-3 mb-3 text-[13px]">
                  <span className="w-20 text-gray-500">{meta.tag}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: meta.color }}
                    />
                  </div>
                  <span className="w-4 text-right text-gray-500">{count}</span>
                </div>
              );
            })}
            {leads.length === 0 && (
              <p className="text-[13px] text-gray-400">Sin datos aún.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
