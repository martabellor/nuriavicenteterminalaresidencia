"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo iniciar sesión");
      }

      setMessage({ type: "ok", text: "Acceso correcto" });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error inesperado"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="centered">
      <section className="card login-card">
        <span className="badge">🔐 Acceso administradora</span>
        <h1>Panel privado</h1>
        <p className="small">
          Solo la administradora puede entrar y descargar la lista de asistentes.
        </p>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {message && (
            <div className={`notice ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
