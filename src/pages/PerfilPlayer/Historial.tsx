import { useEffect, useState } from "react";
import { PartidoHistorial, TipoPartido } from "./HistorialData";
import { apiClient } from "../../services/apiClient";
import "./Historial.css";

const FILTROS: Array<"Todos" | TipoPartido> = ["Todos", "Competitivo", "Amistoso"];

function SkeletonCard() {
  return (
    <article className="player-match-card skeleton-card">
      <div className="skeleton-box skeleton-thumb" />
      <div className="player-match-card__details">
        <div className="skeleton-box skeleton-line skeleton-line--short" />
        <div className="skeleton-box skeleton-line skeleton-line--title" />
        <div className="skeleton-box skeleton-line" />
        <div className="skeleton-box skeleton-line skeleton-line--short" />
      </div>
      <div className="player-match-card__score-block">
        <div className="skeleton-box skeleton-score" />
      </div>
      <div className="player-match-card__actions">
        <div className="skeleton-box skeleton-btn" />
        <div className="skeleton-box skeleton-btn-small" />
      </div>
    </article>
  );
}

const Historial = () => {
  const [partidos, setPartidos] = useState<PartidoHistorial[]>([]);
  const [filtroActivo, setFiltroActivo] = useState<"Todos" | TipoPartido>("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setCargando(true);
        setError(null);
        // ------------------------------para encontar + rapido----------------------
        // cuando me lo pasen (al link) lo pongo aqui, no te olvides gi del futuro xd
        const data = await apiClient.get<PartidoHistorial[]>("/ruta-del-back");
        // --------------------------------------------------------------------------
        setPartidos(data);
      } catch (err) {
        console.error("Hubo un problema con la petición:", err);
        setError(err instanceof Error ? err.message : "No se pudo cargar el historial.");
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, []);

  const partidosFiltrados =
    filtroActivo === "Todos"
      ? partidos
      : partidos.filter((partido) => partido.tipo === filtroActivo);

  return (
    <div className="player-historial">
      <header className="player-historial__header">
        <h1>Historial</h1>
      </header>

      <div className="player-historial__filters">
        {FILTROS.map((filtro) => (
          <button
            key={filtro}
            type="button"
            className={`player-filter-btn ${filtroActivo === filtro ? "is-active" : ""}`}
            onClick={() => setFiltroActivo(filtro)}
          >
            {filtro}
          </button>
        ))}
      </div>

      <section className="player-historial__list">
        {cargando ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : error ? (
          <div className="player-historial__empty" style={{ borderLeft: "4px solid #ff4444" }}>
            <p style={{ color: "#ff4444", fontWeight: 600, margin: "0 0 0.5rem 0" }}>Ups, tuvimos un problema.</p>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        ) : partidosFiltrados.length > 0 ? (
          partidosFiltrados.map((partido) => (
            <article key={partido.id} className="player-match-card">
              <div className="player-match-card__thumb">
                <div className="player-match-card__thumb-bg" />
                <span className={`player-match-card__tag player-match-card__tag--${partido.tipo.toLowerCase()}`}>
                  {partido.tipo}
                </span>
              </div>

              <div className="player-match-card__details">
                <p className="player-match-card__meta">{partido.fecha}</p>
                <h3 className="player-match-card__title">{partido.complejo}</h3>
                <p className="player-match-card__meta">{partido.direccion}</p>
                <p className="player-match-card__meta">Rival: <strong>{partido.rival}</strong></p>
              </div>

              <div className="player-match-card__score-block">
                <span className="player-match-card__score-text">
                  {partido.marcadorLocal} - {partido.marcadorVisitante}
                </span>
              </div>

              <div className="player-match-card__actions">
                <button className="player-btn-details">Ver detalles</button>
                <button className="player-btn-report">Reportar un problema</button>
              </div>
            </article>
          ))
        ) : (
          <div className="player-historial__empty">
            No hay partidos para el filtro seleccionado.
          </div>
        )}
      </section>

      <section className="player-historial__support">
        <p>¿Tuviste un problema con alguno de tus partidos?</p>
        <button type="button" className="player-btn-support">Contactar soporte</button>
      </section>

      <button type="button" className="player-historial__see-all">
        Ver todos los partidos
      </button>
    </div>
  );
};

export default Historial;