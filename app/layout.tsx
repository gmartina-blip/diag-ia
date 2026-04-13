import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diag.IA — Diagnóstico de Madurez Digital",
  description:
    "Respondé 5 preguntas y recibí tu puntaje de madurez digital con un plan estratégico personalizado.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
