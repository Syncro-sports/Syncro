import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EquipoCard, { type Equipo } from "./components/EquipoCard";
import { EQUIPOS_MOCK, MAX_EQUIPOS, SOLICITUDES_MOCK } from "./equiposData";
import "./Equipos.css";

// Exportado para que equiposService.ts sepa si el dominio "equipos" ya esta
// conectado al backend, y no muestre datos reales en el detalle mientras la
// lista siga en modo mock (evita la inconsistencia lista-mock/detalle-real)
export const backendConectado = false;

const equiposReal: Equipo[] = [];

// Listado publico con todos los equipos de la plataforma
const RUTA_EXPLORAR_EQUIPOS = "/equipos";
const rutaDetalleEquipo = (id: string) => `/equipos/${id}`;

// "24 May 2025" -> { dia: "24", mes: "May" }
const partirFecha = (fecha: string) => {
  const [dia = "", mes = ""] = fecha.split(" ");
  return { dia, mes };
};

const Equipos = () => {
  const navigate = useNavigate();
  const solicitudesRef = useRef<HTMLDivElement>(null);
  const equipos = backendConectado ? equiposReal : EQUIPOS_MOCK;
  // TODO(back): aceptar/rechazar = PATCH /equipos/:id/solicitudes/:usuarioId { accion }
  const [solicitudes, setSolicitudes] = useState(backendConectado ? [] : SOLICITUDES_MOCK);

  const ocupadas = equipos.length;
  const disponibles = Math.max(0, MAX_EQUIPOS - ocupadas);
  const proximos = equipos.filter((e) => e.proximoPartido);

  const handleExplorarEquipos = () => navigate(RUTA_EXPLORAR_EQUIPOS);
  const handleVerEquipo = (id: string) => navigate(rutaDetalleEquipo(id));
  const handleCrearEquipo = () => {};
  const irASolicitudes = () => solicitudesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const resolverSolicitud = (id: string) => setSolicitudes((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="pj">
      <div className="pj-head">
        <div className="player-equipos__slots">
          <div className="player-equipos__slots-bar">
            {Array.from({ length: MAX_EQUIPOS }).map((_, i) => (
              <i key={i} className={i < ocupadas ? "on" : ""} />
            ))}
          </div>
          <span>
            <strong>
              {ocupadas} de {MAX_EQUIPOS}
            </strong>{" "}
            equipos
            {disponibles > 0 && ` · te ${disponibles === 1 ? "queda 1 lugar" : `quedan ${disponibles} lugares`}`}
          </span>
        </div>

        <div className="pj-head__actions">
          <button type="button" className="pj-btn pj-btn--ghost pj-btn--sm" onClick={handleExplorarEquipos}>
            Explorar equipos
          </button>
          <button type="button" className="pj-btn pj-btn--primary pj-btn--sm" onClick={handleCrearEquipo}>
            + Crear equipo
          </button>
        </div>
      </div>

      <div className="player-equipos__grid">
        {equipos.map((equipo) => (
          <EquipoCard key={equipo.id} equipo={equipo} onVerEquipo={handleVerEquipo} onVerSolicitudes={irASolicitudes} />
        ))}

        {disponibles > 0 && (
          <div className="player-card player-equipos__libre">
            <span className="player-equipos__plus">+</span>
            <h3>{disponibles === 1 ? "Te queda 1 lugar" : `Te quedan ${disponibles} lugares`}</h3>
            <p>Unite a un equipo que busque jugadores o creá el tuyo y armá tu plantel.</p>
            <div className="player-equipos__libre-botones">
              <button type="button" className="pj-btn pj-btn--ghost pj-btn--sm" onClick={handleExplorarEquipos}>
                Explorar equipos
              </button>
              <button type="button" className="pj-btn pj-btn--primary pj-btn--sm" onClick={handleCrearEquipo}>
                + Crear equipo
              </button>
            </div>
          </div>
        )}
      </div>

      {(proximos.length > 0 || solicitudes.length > 0) && (
        <div className={`player-equipos__duo ${solicitudes.length === 0 ? "player-equipos__duo--solo" : ""}`}>
          {proximos.length > 0 && (
            <section className="player-card pj-card">
              <div className="pj-card__head">
                <h3>Próximos partidos de tus equipos</h3>
              </div>
              <div>
                {proximos.map((equipo) => {
                  const { dia, mes } = partirFecha(equipo.proximoPartido!.fecha);
                  return (
                    <div className="pj-row" key={equipo.id}>
                      <div className="pj-date">
                        <b>{dia}</b>
                        <small>{mes}</small>
                      </div>
                      <div className="pj-row__main">
                        <div className="pj-row__title">{equipo.nombre}</div>
                        <div className="pj-row__sub">{equipo.proximoPartido!.hora}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pj-card__foot">
                <button type="button" className="pj-link" onClick={() => navigate("/perfil-jugador/reservas")}>
                  Ver mis reservas →
                </button>
              </div>
            </section>
          )}

          {solicitudes.length > 0 && (
            <section className="player-card pj-card" ref={solicitudesRef}>
              <div className="pj-card__head">
                <h3>Solicitudes para unirse a tus equipos</h3>
                <span className="pj-pill pj-pill--alert">{solicitudes.length} {solicitudes.length === 1 ? "nueva" : "nuevas"}</span>
              </div>
              <div>
                {solicitudes.map((solicitud) => (
                  <div className="pj-row" key={solicitud.id}>
                    <div className="player-equipos__avatar">{solicitud.iniciales}</div>
                    <div className="pj-row__main">
                      <div className="pj-row__title">
                        {solicitud.nombre} <span className="player-equipos__req-equipo">→ {solicitud.equipoNombre}</span>
                      </div>
                      <div className="pj-row__sub">“{solicitud.mensaje}”</div>
                    </div>
                    <div className="player-equipos__req-botones">
                      <button type="button" className="pj-btn pj-btn--primary pj-btn--sm" onClick={() => resolverSolicitud(solicitud.id)}>
                        Aceptar
                      </button>
                      <button type="button" className="pj-btn pj-btn--ghost pj-btn--sm" onClick={() => resolverSolicitud(solicitud.id)}>
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pj-card__foot">
                <span className="pj-row__sub">Solo el capitán y el creador del equipo ven las solicitudes.</span>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Equipos;
