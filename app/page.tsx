"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdown(): Countdown {
  const target = new Date("2026-05-22T22:00:00+02:00").getTime();
  const now = new Date().getTime();
  const diff = Math.max(target - now, 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function HomePage() {
  const [countdown, setCountdown] = useState<Countdown>(getCountdown());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    menu_choice: "pescado",
    allergies: "",
  });

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date("2026-05-22T22:00:00+02:00"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar la inscripción");
      }

      setMessage({
        type: "ok",
        text: "¡Inscripción enviada correctamente!"
      });

      setForm({
        name: "",
        menu_choice: "pescado",
        allergies: "",
      });
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
    <main>
      <div className="container">
        <section className="hero">
          <div className="lab-deco" />

          <span className="badge">🧪 Cena de despedida · Análisis Clínicos</span>

          <div className="hero-top">
            <div className="hero-text">
              <h1 className="hero-title">Despedimos a Nuria por todo lo alto</h1>
              <p className="hero-sub">
                Después de cerrar una etapa tan importante de la residencia, toca celebrarlo.
                Reserva tu sitio para la cena de despedida de <strong>Nuria</strong> y acompáñanos
                en una noche especial entre compañeros, risas y mucho ambiente de laboratorio.
              </p>

              <p className="small">
                <strong>{formattedDate}</strong>
              </p>
            </div>

            <div className="hero-photo-box">
              <Image
                src="/nuria.jpg"
                alt="Foto de Nuria"
                width={700}
                height={850}
                className="hero-photo"
              />
            </div>
          </div>

          <div className="mini-countdown">
            <div className="mini-count-box">
              <span className="mini-count-number">{countdown.days}</span>
              <span className="mini-count-label">días</span>
            </div>
            <div className="mini-count-box">
              <span className="mini-count-number">{countdown.hours}</span>
              <span className="mini-count-label">horas</span>
            </div>
            <div className="mini-count-box">
              <span className="mini-count-number">{countdown.minutes}</span>
              <span className="mini-count-label">min</span>
            </div>
            <div className="mini-count-box">
              <span className="mini-count-number">{countdown.seconds}</span>
              <span className="mini-count-label">seg</span>
            </div>
          </div>
        </section>

        <div className="grid grid-2">
          <section className="card">
            <h2>💶 Menú y precio</h2>
            <div className="price">45 €</div>
            <p className="small">+ 5 € de regalo para Nuria</p>

            <h3>Entrantes para compartir</h3>
            <ul className="menu-list">
              <li>Tostas de bacalao ahumado</li>
              <li>Montaditos de piquillo, espárrago y queso</li>
              <li>Croquetas caseras</li>
            </ul>

            <h3>Segundos</h3>
            <ul className="menu-list">
              <li>Merluza ría a la plancha</li>
              <li>Fideuá o arroz marinera (mínimo 2 personas)</li>
              <li>Secreto de cerdo</li>
            </ul>

            <p className="small">
              Al apuntarte marca si prefieres <strong>pescado</strong> o <strong>carne</strong>.
            </p>
          </section>

          <section className="card">
            <h2>✍️ Apúntate a la cena</h2>
            <p className="small">
              Completa tus datos y deja indicado tu menú y posibles alergias o intolerancias.
            </p>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Nombre y apellidos</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ej. Marta Bello Rego"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="menu_choice">¿Qué prefieres?</label>
                <select
                  id="menu_choice"
                  value={form.menu_choice}
                  onChange={(e) => setForm({ ...form, menu_choice: e.target.value })}
                  required
                >
                  <option value="pescado">Pescado</option>
                  <option value="carne">Carne</option>
                </select>
              </div>

              <div>
                <label htmlFor="allergies">Alergias / intolerancias</label>
                <textarea
                  id="allergies"
                  rows={4}
                  placeholder="Si no tienes, escribe: ninguna"
                  value={form.allergies}
                  onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                />
              </div>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar inscripción"}
              </button>

              {message && (
                <div className={`notice ${message.type}`}>
                  {message.text}
                </div>
              )}
            </form>
          </section>
        </div>

        <div className="grid">
          <section className="card">
            <h2>🧫 Información importante</h2>
            <p>
              El dinero lo recogen <span className="highlight">María</span> y los residentes:
              <span className="highlight"> Raquel, Cibrán y Claudia</span>.
            </p>

            <hr />

            <h3>💝 Regalo para Nuria</h3>
            <p className="small">
              Además del menú, se añadirán <strong>5 €</strong> por persona para el regalo de Nuria.
            </p>

            <p className="small">
              <strong>
                Si no vas a venir a la cena pero quieres aportar para el regalo, también puedes participar con 5 €.
              </strong>
            </p>

            <p className="small">
              Estamos recogiéndolo <strong>desde ya</strong>.
            </p>
          </section>
        </div>

        <p className="footer-note">
          Hecho con cariño para la despedida de Nuria 🩵
        </p>
      </div>
    </main>
  );
}
