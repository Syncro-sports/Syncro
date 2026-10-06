import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EquipoCard from "./components/EquipoCard";
import CrearEquipoModal from "../../components/CrearEquipoModal";
import { equiposService } from "../../services/equiposService";
import { usePlayerData } from "./PlayerDataContext";
import { MAX_EQUIPOS, SolicitudIngreso } from "./equiposData";
import "./Equipos.css";

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
  // Reales si el backend responde, de ejemplo si no (lo decide PlayerDataContext)
  const { equipos, solicitudes, equiposMock, cargandoEquipos, recargarEquipos } = usePlayerData();
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [errorSolicitud, setErrorSolicitud] = useState<string | null>(null);
  // Solicitudes ya resueltas en pantalla (en modo ejemplo no hay nada que recargar)
  const [resueltas, setResueltas] = useState<string[]>([]);
  const solicitudesVisibles = solicitudes.filter((s) => !resueltas.includes(s.id));

  const ocupadas = equipos.length;
  const disponibles = Math.max(0, MAX_EQUIPOS - ocupadas);
  const proximos = equipos.filter((e) => e.proximoPartido);

  const handleExplorarEquipos = () => navigate(RUTA_EXPLORAR_EQUIPOS);
  const handleVerEquipo = (id: string) => navigate(rutaDetalleEquipo(id));
  const handleCrearEquipo = () => setMostrarCrear(true);
  const irASolicitudes = () => solicitudesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const resolverSolicitud = async (solicitud: SolicitudIngreso, accion: "ACEPTAR" | "RECHAZAR") => {
    setErrorSolicitud(null);
    if (equiposMock || !solicitud.usuarioId) {
      setResueltas((prev) => [...prev, solicitud.id]);
      return;
    }
    try {
      await equiposService.responderSolicitud(solicitud.equipoId, solicitud.usuarioId, accion);
      await recargarEquipos();
    } catch (err) {
      setErrorSolicitud(err instanceof Error ? err.message : "No se pudo responder la solicitud");
    }
  };

  if (cargandoEquipos) {
    return (
      <div className="pj" aria-busy="true">
        <p className="pj-row__sub">Cargando tus equipos...</p>
      </div>
    );
  }

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

      {(proximos.length > 0 || solicitudesVisibles.length > 0) && (
        <div className={`player-equipos__duo ${solicitudesVisibles.length === 0 ? "player-equipos__duo--solo" : ""}`}>
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

          {solicitudesVisibles.length > 0 && (
            <section className="player-card pj-card" ref={solicitudesRef}>
              <div className="pj-card__head">
                <h3>Solicitudes para unirse a tus equipos</h3>
                <span className="pj-pill pj-pill--alert">{solicitudesVisibles.length} {solicitudesVisibles.length === 1 ? "nueva" : "nuevas"}</span>
              </div>
              <div>
                {solicitudesVisibles.map((solicitud) => (
                  <div className="pj-row" key={solicitud.id}>
                    <div className="player-equipos__avatar">{solicitud.iniciales}</div>
                    <div className="pj-row__main">
                      <div className="pj-row__title">
                        {solicitud.nombre} <span className="player-equipos__req-equipo">→ {solicitud.equipoNombre}</span>
                      </div>
                      <div className="pj-row__sub">“{solicitud.mensaje}”</div>
                    </div>
                    <div className="player-equipos__req-botones">
                      <button type="button" className="pj-btn pj-btn--primary pj-btn--sm" onClick={() => resolverSolicitud(solicitud, "ACEPTAR")}>
                        Aceptar
                      </button>
                      <button type="button" className="pj-btn pj-btn--ghost pj-btn--sm" onClick={() => resolverSolicitud(solicitud, "RECHAZAR")}>
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pj-card__foot">
                <span className="pj-row__sub">
                  {errorSolicitud ?? "Solo el capitán y el creador del equipo ven las solicitudes."}
                </span>
              </div>
            </section>
          )}
        </div>
      )}

      {mostrarCrear && (
        <CrearEquipoModal
          onClose={() => setMostrarCrear(false)}
          onCreado={(equipoCreado) => {
            setMostrarCrear(false);
            recargarEquipos();
            navigate(rutaDetalleEquipo(equipoCreado.id));
          }}
        />
      )}
    </div>
  );
};

export default Equipos;
