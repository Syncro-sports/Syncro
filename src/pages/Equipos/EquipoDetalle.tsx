import { useMemo, useState } from "react";
import Header from "../../components/Header";
import HeaderHost from "../../components/HeaderHost";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import "./EquipoDetalle.css";

import React from "react";

const ShieldStarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2.6 20 5.4v6.1c0 5-3.4 8.6-8 9.9-4.6-1.3-8-4.9-8-9.9V5.4L12 2.6Z"
      fill="#05070B"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="m12 8 1.15 2.33 2.57.37-1.86 1.81.44 2.56L12 13.85l-2.3 1.22.44-2.56-1.86-1.81 2.57-.37L12 8Z"
      fill="currentColor"
    />
  </svg>
);

const data = {
  equipo: {
    nombre: "Scaloneta",
    torneos: 125,
    descripcion:
      "Somos un equipo de amigos que busca ser competitivos y medirse con los mejores equipos de zona sur",
    lugar: "Banfield",
    genero: "Masculino",
    ctaLabel: "Solicitar entrar",
  },
  streakLabel: "Racha actual:",
  streakWindowLabel: "Ultimos 30 dias",
  streak: [
    { id: "s1", resultado: "empate" },
    { id: "s2", resultado: "derrota" },
    { id: "s3", resultado: "victoria" },
  ],
  tituloHistorial: "Historial de partidos",
  Historial: [
    {
      id: "m1",
      fecha: "12/07",
      equipoLocalNombre: "Scaloneta",
      equipoRivalNombre: "Chelicos",
      puntosLocal: 2,
      puntosRival: 2,
      resultado: "empate",
    },
    {
      id: "m2",
      fecha: "05/07",
      equipoLocalNombre: "Scaloneta",
      equipoRivalNombre: "Tallarines",
      puntosLocal: 1,
      puntosRival: 6,
      resultado: "derrota",
    },
    {
      id: "m3",
      fecha: "12/06",
      equipoLocalNombre: "Scaloneta",
      equipoRivalNombre: "Fernet FC",
      puntosLocal: 7,
      puntosRival: 6,
      resultado: "victoria",
    },
  ],
  tituloJugadores: "Jugadores",
  jugadoresCant: 7,
  jugadoresCap: 15,
  jugadores: [
    { id: "p1", nombre: "Nahuen Perez", posicion: "ARQ", esCapitan: false },
    { id: "p2", nombre: "Jose Lopez", posicion: "DEF", esCapitan: false },
    { id: "p3", nombre: "Juan Cruz Herrera", posicion: "DEF", esCapitan: false },
    { id: "p4", nombre: "Martin Ceballos", posicion: "DEF", esCapitan: false },
    { id: "p5", nombre: "Martin Puentes", posicion: "MED", esCapitan: false },
    { id: "p6", nombre: "Lucas Rodriguez", posicion: "MED", esCapitan: true },
    { id: "p7", nombre: "Mauro Lombardo", posicion: "DEL", esCapitan: false },
  ],
} as const;

const resultLabel: Record<"victoria" | "empate" | "derrota", string> = {
  victoria: "Victoria",
  empate: "Empate",
  derrota: "Derrota",
};

const getInitials = (n: string): string =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

const usuarioInicioSesion = Boolean(localStorage.getItem("token"));    

export default function EquipoProfilePreview() {
  return (
    <div className="syncro-scope page">
      {usuarioInicioSesion ? <HeaderHost /> : <Header />}
      <section className="seccion-perfil">
        <div className="equipo-card">
          <div className="equipo-card__backdrop" />
          <div className="equipo-card__body">
            <div className="equipo-card__crest">
              <ShieldStarIcon size={92} />
            </div>
            <div className="equipo-card__main">
              <div className="equipo-card__heading-row">
                <h2 className="equipo-card__nombre">{data.equipo.nombre}</h2>
                <span className="equipo-card__torneos">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/torneos.svg`} alt="" width={27} height={27} />
                  <span>{data.equipo.torneos}</span>
                </span>
              </div>
              <p className="equipo-card__descripcion">
                {data.equipo.descripcion}
              </p>
              <div className="equipo-card__meta">
                <span className="equipo-card__meta-item">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/lugar.svg`} alt="" width={27} height={27} />
                  {data.equipo.lugar}
                </span>
                <span className="equipo-card__meta-item">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/remera-local.svg`} alt="" width={27} height={27} />
                  {data.equipo.genero}
                </span>
                <button
                  className="button-primary equipo-card__cta"
                  type="button"
                >
                  {data.equipo.ctaLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="paneles">
        <section className="panel">
          <div className="panel__header">
            <h3 className="panel__title panel__title--center">
              {data.tituloHistorial}
            </h3>
          </div>
          <div className="streak">
            <span className="streak__label">{data.streakLabel}</span>
            <ul className="streak__dots">
              {data.streak.map((s) => (
                <li
                  key={s.id}
                  className={`streak__dot streak__dot--${s.resultado}`}
                  title={resultLabel[s.resultado]}
                />
              ))}
            </ul>
            <span className="streak__window">{data.streakWindowLabel}</span>
          </div>
          <div className="matches">
            {data.Historial.map((m) => (
              <article className="match-row" key={m.id}>
                <div className="match-row__equipos">
                  <div className="match-equipo">
                    <ShieldStarIcon size={30} />
                    <span className="match-equipo__nombre">
                      {m.equipoLocalNombre}
                    </span>
                  </div>
                  <div className="match-score">
                    <span className="match-score__fecha">{m.fecha}</span>
                    <span className="match-score__value">
                      {m.puntosLocal} - {m.puntosRival}
                    </span>
                  </div>
                  <div className="match-equipo">
                    <ShieldStarIcon size={30} />
                    <span className="match-equipo__nombre">
                      {m.equipoRivalNombre}
                    </span>
                  </div>
                </div>
                <span className={`resultado-badge resultado-badge--${m.resultado}`}>
                  {resultLabel[m.resultado]}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" width={27} height={27} />
            <h3 className="panel__title">{data.tituloJugadores}</h3>
            <span className="panel__count">
              {data.jugadoresCant}/{data.jugadoresCap}
            </span>
          </div>
          <div className="jugadores">
            {data.jugadores.map((p) => (
              <div className="jugador-row" key={p.id}>
                <span className="jugador-avatar">{getInitials(p.nombre)}</span>
                <span className="jugador-nombre">
                  {p.nombre}
                  {p.esCapitan && (
                    <span className="jugador-captain" title="Capitan">
                      C
                    </span>
                  )}
                </span>
                <span className="jugador-posicion">{p.posicion}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
}
