import { useEffect, useState } from "react";
import { PartidoHistorial, TipoPartido } from "./HistorialData";
import { reservasService } from "../../services/reservasService";
import "./Historial.css";

const FILTROS: Array<"Todos" | TipoPartido> = ["Todos", "Competitivo", "Amistoso", "Privada"];

function SkeletonFila() {
  return (
    <article className="player-card player-historial__fila player-historial__fila--skeleton">
      <div className="player-historial__skeleton" style={{ width: "5.5rem" }} />
      <div className="player-historial__skeleton" />
      <div className="player-historial__skeleton" />
      <div className="player-historial__skeleton" />
      <div className="player-historial__skeleton" style={{ width: "4rem" }} />
      <div className="player-historial__skeleton" style={{ width: "5.5rem" }} />
    </article>
  );
}

// "15 de mayo de 2026 · 10:00 – 11:00" -> { dia: "15 de mayo de 2026", horario: "10:00 – 11:00" }
const partirFecha = (fecha: string) => {
  const [dia, horario] = fecha.split(" · ");
  return { dia, horario: horario ?? "" };
};

const Historial = () => {
  const [partidos, setPartidos] = useState<PartidoHistorial[]>([]);
  const [filtroActivo, setFiltroActivo] = useState<"Todos" | TipoPartido>("Todos");
  const [cargando, setCargando] = useState(true);
  const [mostrarAviso, setMostrarAviso] = useState(false);

  useEffect(() => {
    const cargarHistorial = async () => {
      setCargando(true);
      // Reservas confirmadas cuya fecha + hora de fin ya pasaron (la mas reciente primero)
      const { partidos: data, esMock, esDemo } = await reservasService.obtenerHistorial();
      setPartidos(data);
      // El aviso solo aparece si fallo la conexion; con la cuenta demo no hace falta
      setMostrarAviso(esMock && !esDemo);
      setCargando(false);
    };

    cargarHistorial();
  }, []);

  const partidosFiltrados =
    filtroActivo === "Todos" ? partidos : partidos.filter((partido) => partido.tipo === filtroActivo);

  return (
    <div className="pj">
      {mostrarAviso && (
        <p className="player-historial__aviso">
          Estás viendo datos de ejemplo porque no se pudo conectar con el servidor.
        </p>
      )}

      <div className="pj-tabs">
        {FILTROS.map((filtro) => (
          <button
            key={filtro}
            type="button"
            className={`player-historial__tab ${filtroActivo === filtro ? "is-active" : ""}`}
            onClick={() => setFiltroActivo(filtro)}
          >
            {filtro}
          </button>
        ))}
      </div>

      <section className="player-historial__lista">
        {!cargando && partidosFiltrados.length > 0 && (
          <div className="player-historial__fila player-historial__encabezado">
            <span>Tipo</span>
            <span>Fecha y horario</span>
            <span>Lugar</span>
            <span>Rival</span>
            <span className="player-historial__centro">Resultado</span>
            <span />
          </div>
        )}

        {cargando ? (
          <>
            <SkeletonFila />
            <SkeletonFila />
            <SkeletonFila />
          </>
        ) : partidosFiltrados.length > 0 ? (
          partidosFiltrados.map((partido) => {
            const { dia, horario } = partirFecha(partido.fecha);
            const hayMarcador = partido.marcadorLocal !== undefined && partido.marcadorVisitante !== undefined;
            return (
              <article key={partido.id} className="player-card player-historial__fila">
                <span className={`pj-chip ${partido.tipo === "Competitivo" ? "" : "pj-chip--muted"}`}>{partido.tipo}</span>

                <div>
                  <div className="player-historial__t">{dia}</div>
                  {horario && <div className="player-historial__s">{horario}</div>}
                </div>

                <div>
                  <div className="player-historial__t">{partido.complejo}</div>
                  {partido.direccion && <div className="player-historial__s">{partido.direccion}</div>}
                </div>

                <div className={`player-historial__t ${partido.rival ? "" : "player-historial__t--tenue"}`}>
                  {partido.rival || "Sin rival"}
                </div>

                <div className={`player-historial__resultado ${hayMarcador ? "" : "player-historial__resultado--tenue"}`}>
                  {hayMarcador ? `${partido.marcadorLocal} - ${partido.marcadorVisitante}` : "Finalizado"}
                </div>

                <button type="button" className="pj-btn pj-btn--ghost pj-btn--sm">
                  Ver detalles
                </button>
              </article>
            );
          })
        ) : (
          <div className="player-card player-historial__vacio">
            {partidos.length === 0 ? "Todavía no tenés partidos finalizados." : "No hay partidos para el filtro seleccionado."}
          </div>
        )}
      </section>

      <p className="pj-foot">
        ¿Tuviste un problema con un partido? <button type="button">Contactar soporte</button>
      </p>
    </div>
  );
};

export default Historial;
