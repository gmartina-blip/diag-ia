"use client";

import { useState } from "react";
import { QUIZZES, BU_META, type BUKey } from "@/data/quizzes";

// ── Types ──────────────────────────────────────────────────────────────────
type Screen = "landing" | "quiz" | "score" | "form" | "results";

interface Lead {
  name: string;
  email: string;
  company: string;
  role: string;
  bu: BUKey;
  score: number;
  tier: string;
  answers: number[];
  timestamp: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getTier(score: number) {
  if (score < 35) return { label: "Etapa Inicial", color: "#dc2626", cls: "bg-red-50 border-red-300" };
  if (score < 55) return { label: "En Desarrollo", color: "#d97706", cls: "bg-yellow-50 border-yellow-300" };
  if (score < 75) return { label: "En Progreso",   color: "#1a56db", cls: "bg-blue-50 border-blue-300" };
  return           { label: "Avanzado",            color: "#059669", cls: "bg-green-50 border-green-300" };
}

function calcScore(bu: BUKey, answers: number[]) {
  const quiz = QUIZZES[bu];
  const total = quiz.questions.reduce((sum, q, i) => {
    const a = answers[i] ?? 0;
    return sum + q.options[a].score;
  }, 0);
  return Math.round((total / (quiz.questions.length * 4)) * 100);
}

function getTierRec(bu: BUKey, score: number) {
  const r = QUIZZES[bu].recs;
  if (score < 35) return r.low;
  if (score < 55) return r.mid;
  if (score < 75) return r.high;
  return r.max;
}

// ── BU Selector Card ───────────────────────────────────────────────────────
const BU_ICONS: Record<BUKey, string> = {
  fintech:   "💳",
  docsign:   "✍️",
  ai:        "🤖",
  insurtech: "🏛️",
};

const BU_DESCS: Record<BUKey, string> = {
  fintech:   "Pagos digitales, procesamiento y compliance",
  docsign:   "Gestión documental y flujos de firma electrónica",
  ai:        "Desarrollo de IA y software a medida",
  insurtech: "Digitalización de seguros y gobierno electrónico",
};

// ── Score Ring SVG ─────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative inline-flex">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="50" fill="none" strokeWidth="8"
          strokeLinecap="round" stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-gray-400">/100</span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Home() {
  const [screen, setScreen]       = useState<Screen>("landing");
  const [selectedBU, setSelectedBU] = useState<BUKey | null>(null);
  const [currentQ, setCurrentQ]   = useState(0);
  const [answers, setAnswers]     = useState<number[]>([]);
  const [score, setScore]         = useState(0);
  const [lead, setLead]           = useState<Lead | null>(null);

  // Form state
  const [fname,    setFname]    = useState("");
  const [flastname,setFlastname]= useState("");
  const [femail,   setFemail]   = useState("");
  const [fcompany, setFcompany] = useState("");
  const [frole,    setFrole]    = useState("");

  const formValid = fname && flastname && femail.includes("@") && fcompany && frole;

  function goTo(s: Screen) { setScreen(s); }

  function startQuiz() {
    setCurrentQ(0);
    setAnswers([]);
    goTo("quiz");
  }

  function selectOption(i: number) {
    const next = [...answers];
    next[currentQ] = i;
    setAnswers(next);
  }

  function nextQuestion() {
    if (!selectedBU) return;
    if (currentQ < QUIZZES[selectedBU].questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const s = calcScore(selectedBU, answers);
      setScore(s);
      goTo("score");
    }
  }

  function submitLead() {
    if (!selectedBU) return;
    const tier = getTier(score);
    const newLead: Lead = {
      name: `${fname} ${flastname}`,
      email: femail,
      company: fcompany,
      role: frole,
      bu: selectedBU,
      score,
      tier: tier.label,
      answers,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setLead(newLead);

    // 👉 Aquí va tu webhook / Supabase. Por ahora: console.log
    console.log("[Diag.IA] Lead capturado:", newLead);

// Guardar en Supabase
const { supabase } = await import('@/lib/supabase');
await supabase.from('leads').insert({
  name: newLead.name,
  email: newLead.email,
  company: newLead.company,
  role: newLead.role,
  bu: newLead.bu,
  score: newLead.score,
  tier: newLead.tier,
});

    // Para enviar a un webhook real, descomentá esto:
    // fetch("https://hook.make.com/TU_WEBHOOK_ID", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(newLead),
    // });

    goTo("results");
  }

  const quiz     = selectedBU ? QUIZZES[selectedBU] : null;
  const question = quiz ? quiz.questions[currentQ] : null;
  const tier     = getTier(score);
  const pct      = quiz ? Math.round(((currentQ + 1) / quiz.questions.length) * 100) : 0;

  // ── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="font-bold text-[15px] tracking-tight">
          Diag<span className="text-blue-600">.</span>IA
        </span>
        <span className="text-[10px] font-medium uppercase tracking-widest bg-blue-50 text-blue-700 px-2 py-1 rounded">
          Piloto MVP
        </span>
      </header>

      <main className="max-w-lg mx-auto px-6 py-8">

        {/* ── PANTALLA 1: Landing ── */}
        {screen === "landing" && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Herramienta de diagnóstico empresarial
            </p>
            <h1 className="text-2xl font-bold leading-tight tracking-tight mb-3">
              ¿Qué frena tu<br />transformación digital?
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Respondé 5 preguntas y recibí tu puntaje de madurez digital con un
              plan estratégico personalizado para tu unidad de negocio.
            </p>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Seleccioná tu área
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {(Object.keys(BU_META) as BUKey[]).map((bu) => {
                const meta = BU_META[bu];
                const selected = selectedBU === bu;
                return (
                  <button
                    key={bu}
                    onClick={() => setSelectedBU(bu)}
                    className={`relative text-left p-4 rounded-xl border transition-all ${
                      selected
                        ? "border-2"
                        : "border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    style={selected ? { borderColor: meta.color } : {}}
                  >
                    <span className="text-2xl block mb-2">{BU_ICONS[bu]}</span>
                    <span className="block text-[13px] font-semibold text-gray-800 mb-1">
                      {meta.name}
                    </span>
                    <span className="block text-[11px] text-gray-400 leading-snug">
                      {BU_DESCS[bu]}
                    </span>
                    <span
                      className="absolute top-2 right-2 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                      style={{ background: meta.color + "18", color: meta.color }}
                    >
                      {meta.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={startQuiz}
              disabled={!selectedBU}
              className="w-full py-3 rounded-lg bg-blue-600 text-white text-sm font-medium
                         disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Iniciar diagnóstico de 5 preguntas →
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-3">
              Menos de 3 minutos · Sin compromiso
            </p>
          </div>
        )}

        {/* ── PANTALLA 2: Quiz ── */}
        {screen === "quiz" && quiz && question && selectedBU && (
          <div>
            {/* BU chip */}
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: BU_META[selectedBU].color }}
              />
              <span className="text-[13px] text-gray-500">{BU_META[selectedBU].name}</span>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                <span>Pregunta {currentQ + 1} de {quiz.questions.length}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, background: BU_META[selectedBU].color }}
                />
              </div>
            </div>

            <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
              {question.category}
            </p>
            <h2 className="text-[17px] font-bold leading-snug text-gray-900 mb-5">
              {question.text}
            </h2>

            <div className="flex flex-col gap-2 mb-6">
              {question.options.map((opt, i) => {
                const sel = answers[currentQ] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg border text-[13px] transition-all ${
                      sel
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                        sel ? "bg-blue-600 border-blue-600" : "border-gray-300"
                      }`}
                    >
                      {sel && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                    </span>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                className={`px-5 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-500
                            hover:bg-gray-50 transition-colors ${currentQ === 0 ? "invisible" : ""}`}
              >
                ← Atrás
              </button>
              <button
                onClick={nextQuestion}
                disabled={answers[currentQ] === undefined}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-[13px] font-medium
                           disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── PANTALLA 3: Score (bloqueada) ── */}
        {screen === "score" && (
          <div>
            <div className="flex flex-col items-center py-8">
              <ScoreRing score={score} color={tier.color} />
              <h2 className="text-xl font-bold mt-4 mb-2">{tier.label}</h2>
              <p className="text-sm text-gray-500 text-center leading-relaxed max-w-xs">
                {score < 35
                  ? "Hay oportunidades significativas de digitalización. Un sprint enfocado de 90 días puede transformar tus operaciones."
                  : score < 55
                  ? "Buenas bases con brechas claras. Inversiones priorizadas en 2 o 3 áreas generarán retornos compuestos."
                  : score < 75
                  ? "Madurez por encima del promedio. La diferenciación competitiva viene de ajuste fino e innovación."
                  : "Operaciones de clase mundial. Enfocáte en aprovechar tus capacidades como diferenciador de mercado."}
              </p>
            </div>

            {/* Gated content */}
            <div className="relative rounded-xl border border-gray-200 bg-gray-50 p-5 overflow-hidden">
              <p className="text-[13px] text-gray-400 leading-relaxed blur-sm select-none pointer-events-none">
                ✦ Prioridad 1: Acción inmediata requerida — ganancia estimada del 40% en eficiencia
                en 90 días. ✦ Prioridad 2: Implementar scoring en tiempo real. El sistema actual
                genera una tasa de falsos positivos del 23%...
              </p>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-xl gap-2 p-4">
                <span className="text-2xl">🔒</span>
                <p className="text-[14px] font-semibold text-center">Desbloqueá tu Hoja de Ruta Estratégica</p>
                <p className="text-[12px] text-gray-500 text-center">
                  Completá tus datos para recibir las recomendaciones personalizadas
                </p>
                <button
                  onClick={() => goTo("form")}
                  className="mt-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors"
                >
                  Ver informe completo →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PANTALLA 4: Formulario ── */}
        {screen === "form" && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Casi listo
            </p>
            <h2 className="text-xl font-bold tracking-tight mb-1">
              Obtené tu informe de diagnóstico completo
            </h2>
            <p className="text-[13px] text-gray-500 mb-6">
              Tu hoja de ruta personalizada llegará a tu casilla de correo.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Nombre *</label>
                <input
                  type="text" placeholder="Ana" value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Apellido *</label>
                <input
                  type="text" placeholder="García" value={flastname}
                  onChange={(e) => setFlastname(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[12px] font-medium text-gray-500 mb-1">Email corporativo *</label>
              <input
                type="email" placeholder="ana@empresa.com" value={femail}
                onChange={(e) => setFemail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Empresa *</label>
                <input
                  type="text" placeholder="Mi Empresa S.A." value={fcompany}
                  onChange={(e) => setFcompany(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Cargo *</label>
                <input
                  type="text" placeholder="CTO" value={frole}
                  onChange={(e) => setFrole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-4 mb-4 leading-relaxed">
              Al enviar, aceptás recibir comunicaciones relevantes. Sin spam.
            </p>

            <button
              onClick={submitLead}
              disabled={!formValid}
              className="w-full py-3 rounded-lg bg-blue-600 text-white text-sm font-medium
                         disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Enviar mi informe de diagnóstico →
            </button>
          </div>
        )}

        {/* ── PANTALLA 5: Resultados completos ── */}
        {screen === "results" && lead && selectedBU && quiz && (
          <div>
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-xl font-bold mb-2">Tu informe está listo</h2>
              <p className="text-sm text-gray-500">
                ¡Gracias {lead.name.split(" ")[0]}! Aquí está tu diagnóstico completo de{" "}
                {BU_META[selectedBU].name}.
              </p>
            </div>

            <hr className="border-gray-100 my-5" />

            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Análisis por dimensión
            </p>
            <div className="flex flex-col gap-2 mb-5">
              {quiz.dimensions.map((dim, i) => {
                const a = answers[i] ?? 0;
                const dimPct = Math.round((quiz.questions[i].options[a].score / 4) * 100);
                const c = dimPct < 35 ? "#dc2626" : dimPct < 55 ? "#d97706" : dimPct < 75 ? "#1a56db" : "#059669";
                return (
                  <div key={dim} className="border border-gray-100 rounded-lg px-3 py-2.5">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12px] font-medium text-gray-700">{dim}</span>
                      <span className="text-[12px] font-semibold" style={{ color: c }}>{dimPct}%</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${dimPct}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="border-gray-100 my-5" />

            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Recomendaciones estratégicas
            </p>
            <div className={`rounded-xl p-4 border mb-3 ${tier.cls}`}>
              <p className="text-[12px] font-semibold mb-1">{tier.label} — Acción prioritaria</p>
              <p className="text-[12px] leading-relaxed text-gray-700">
                {getTierRec(selectedBU, score)}
              </p>
            </div>
            <div className="rounded-xl p-4 border bg-blue-50 border-blue-200">
              <p className="text-[12px] font-semibold mb-1">Próximo paso</p>
              <p className="text-[12px] leading-relaxed text-gray-700">
                Agendá una sesión estratégica de 30 minutos con nuestro equipo de{" "}
                {BU_META[selectedBU].name} para trazar tu hoja de ruta de transformación de 90 días.
              </p>
            </div>

            <hr className="border-gray-100 my-5" />

            <button
              onClick={() => {
                setScreen("landing");
                setSelectedBU(null);
                setAnswers([]);
                setCurrentQ(0);
                setFname(""); setFlastname(""); setFemail(""); setFcompany(""); setFrole("");
              }}
              className="w-full py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Iniciar nuevo diagnóstico →
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
