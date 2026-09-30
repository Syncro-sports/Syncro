import { useState } from "react";
import {
  DeporteCancha,
  FiltrosCanchas,
  FILTROS_CANCHAS_INICIALES,
  PRECIO_MAX_CANCHAS,
  SuperficieCancha,
  TipoCancha,
  UBICACIONES_DISPONIBLES,
} from "../canchasData";
import "./FiltrosCanchasSidebar.css";

interface FiltrosCanchasSidebarProps {
  onAplicar: (filtros: FiltrosCanchas) => void;
  totalResultados: number;
}

const toggleItem = <T,>(list: T[], item: T): T[] =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

const DEPORTES_OPCIONES: DeporteCancha[] = ["Fútbol", "Futsal"];

const FORMATOS_OPCIONES: { valor: TipoCancha; label: string }[] = [
  { valor: "FUTBOL 5", label: "5 vs 5" },
  { valor: "FUTBOL 7", label: "7 vs 7" },
  { valor: "FUTBOL 8", label: "8 vs 8" },
  { valor: "FUTBOL 9", label: "9 vs 9" },
  { valor: "FUTBOL 11", label: "11 vs 11" },
];

const SUPERFICIES_OPCIONES: { valor: SuperficieCancha; label: string }[] = [
  { valor: "CESPED SINTETICO", label: "Sintético" },
  { valor: "CESPED NATURAL", label: "Césped natural" },
  { valor: "PARQUET", label: "Parquet" },
  { valor: "CEMENTO", label: "Cemento" },
];

const formatPrecio = (precio: number) =>
  precio >= PRECIO_MAX_CANCHAS ? `$${PRECIO_MAX_CANCHAS.toLocaleString("es-AR")}+` : `$${precio.toLocaleString("es-AR")}`;

const FiltrosCanchasSidebar = ({ onAplicar }: FiltrosCanchasSidebarProps) => {
  const [deporte, setDeporte] = useState<DeporteCancha[]>(FILTROS_CANCHAS_INICIALES.deporte);
  const [tipos, setTipos] = useState<TipoCancha[]>(FILTROS_CANCHAS_INICIALES.tipos);
  const [superficies, setSuperficies] = useState<SuperficieCancha[]>(
    FILTROS_CANCHAS_INICIALES.superficies
  );
  const [precioMax, setPrecioMax] = useState(FILTROS_CANCHAS_INICIALES.precioMax);
  const [soloTechada, setSoloTechada] = useState(FILTROS_CANCHAS_INICIALES.soloTechada);
  const [soloCompetitiva, setSoloCompetitiva] = useState(FILTROS_CANCHAS_INICIALES.soloCompetitiva);
  const [soloIluminada, setSoloIluminada] = useState(FILTROS_CANCHAS_INICIALES.soloIluminada);
  const [soloReplay, setSoloReplay] = useState(FILTROS_CANCHAS_INICIALES.soloReplay);
  const [ubicacion, setUbicacion] = useState<string>(FILTROS_CANCHAS_INICIALES.ubicacion);

  const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);
  const [busquedaUbicacion, setBusquedaUbicacion] = useState("");

  const aplicarFiltros = () => {
    onAplicar({
      deporte,
      tipos,
      superficies,
      precioMax,
      soloTechada,
      soloCompetitiva,
      soloIluminada,
      soloReplay,
      ubicacion,
    });
  };

  const limpiarFiltros = () => {
    setDeporte(FILTROS_CANCHAS_INICIALES.deporte);
    setTipos(FILTROS_CANCHAS_INICIALES.tipos);
    setSuperficies(FILTROS_CANCHAS_INICIALES.superficies);
    setPrecioMax(FILTROS_CANCHAS_INICIALES.precioMax);
    setSoloTechada(FILTROS_CANCHAS_INICIALES.soloTechada);
    setSoloCompetitiva(FILTROS_CANCHAS_INICIALES.soloCompetitiva);
    setSoloIluminada(FILTROS_CANCHAS_INICIALES.soloIluminada);
    setSoloReplay(FILTROS_CANCHAS_INICIALES.soloReplay);
    setUbicacion(FILTROS_CANCHAS_INICIALES.ubicacion);
    onAplicar(FILTROS_CANCHAS_INICIALES);
  };

  const ubicacionActual = UBICACIONES_DISPONIBLES.find((u) => u.id === ubicacion);
  const zonasFiltradas = UBICACIONES_DISPONIBLES.filter(
    (u) => u.id !== "todas" && u.label.toLowerCase().includes(busquedaUbicacion.toLowerCase())
  );

  return (
    <aside className="filtros">
      <div className="filtros__header">
        <h2>Filtros</h2>
        <button type="button" className="filtros__clear" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>

      <div className="filtros__group">
        <label className="filtros__titulo">Deporte</label>
        <div className="filtros__chips">
          {DEPORTES_OPCIONES.map((opcion) => (
            <button
              key={opcion}
              type="button"
              className={`filtros__chip ${deporte.includes(opcion) ? "is-active" : ""}`}
              onClick={() => setDeporte((prev) => toggleItem(prev, opcion))}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros__group">
        <label className="filtros__titulo">Formato</label>
        <div className="filtros__chips">
          {FORMATOS_OPCIONES.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={`filtros__chip ${tipos.includes(opcion.valor) ? "is-active" : ""}`}
              onClick={() => setTipos((prev) => toggleItem(prev, opcion.valor))}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros__group">
        <label className="filtros__titulo">Superficie</label>
        <div className="filtros__chips">
          {SUPERFICIES_OPCIONES.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={`filtros__chip ${superficies.includes(opcion.valor) ? "is-active" : ""}`}
              onClick={() => setSuperficies((prev) => toggleItem(prev, opcion.valor))}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros__divider" />

      <div className="filtros__group">
        <label className="filtros__titulo" htmlFor="filtro-canchas-precio">
          Precio máximo
        </label>
        <input
          id="filtro-canchas-precio"
          type="range"
          min={0}
          max={PRECIO_MAX_CANCHAS}
          step={5000}
          value={precioMax}
          onChange={(e) => setPrecioMax(Number(e.target.value))}
        />
        <div className="filtros__range-labels">
          <span>$0</span>
          <span>{formatPrecio(precioMax)}</span>
        </div>
      </div>

      <div className="filtros__divider" />

      <div className="filtros__group">
        <label className="filtros__titulo">Características</label>
        <div className="filtros__chips">
          <button
            type="button"
            className={`filtros__chip filtros__chip--icon ${soloTechada ? "is-active" : ""}`}
            onClick={() => setSoloTechada((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l9-8 9 8" />
              <path d="M5 10v10h14V10" />
            </svg>
            Techada
          </button>
          <button
            type="button"
            className={`filtros__chip filtros__chip--icon ${soloCompetitiva ? "is-active" : ""}`}
            onClick={() => setSoloCompetitiva((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 21h8M12 17v4M17 4h4v3a5 5 0 0 1-5 5M7 4H3v3a5 5 0 0 0 5 5m0-8h8v5a4 4 0 0 1-8 0V4z" />
            </svg>
            Apta Competitivo
          </button>
          <button
            type="button"
            className={`filtros__chip filtros__chip--icon ${soloIluminada ? "is-active" : ""}`}
            onClick={() => setSoloIluminada((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            Iluminada
          </button>
          <button
            type="button"
            className={`filtros__chip filtros__chip--icon ${soloReplay ? "is-active" : ""}`}
            onClick={() => setSoloReplay((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
            Con Replay
          </button>
        </div>
      </div>

      <div className="filtros__divider" />

      <button
        type="button"
        className="filtros__ubicacion"
        onClick={() => setModalUbicacionAbierto(true)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>
          {ubicacion === "todas" ? "Elegir ubicación" : ubicacionActual?.label || "Elegir ubicación"}
        </span>
      </button>

      <div className="filtros__divider" />

      <button type="button" className="filtros__aplicar" onClick={aplicarFiltros}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Aplicar y buscar
      </button>

      {modalUbicacionAbierto && (
        <div
          className="filtro-ubicacion-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalUbicacionAbierto(false);
          }}
        >
          <div className="filtro-ubicacion-modal">
            <div className="filtro-ubicacion-modal__header">
              <h3>Elegir ubicación</h3>
              <button
                type="button"
                className="filtro-ubicacion-modal__cerrar"
                onClick={() => setModalUbicacionAbierto(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="filtro-ubicacion-modal__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar zona..."
                value={busquedaUbicacion}
                onChange={(e) => setBusquedaUbicacion(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="filtro-ubicacion-modal__actual"
              onClick={() => {
                setUbicacion("todas");
                setModalUbicacionAbierto(false);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
              Todas las zonas
            </button>

            <p className="filtro-ubicacion-modal__sublabel">Zonas disponibles</p>
            <div className="filtro-ubicacion-modal__lista">
              {zonasFiltradas.map((zona) => (
                <button
                  key={zona.id}
                  type="button"
                  className={`filtro-ubicacion-modal__item ${ubicacion === zona.id ? "is-selected" : ""}`}
                  onClick={() => setUbicacion(zona.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {zona.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="filtro-ubicacion-modal__confirmar"
              onClick={() => setModalUbicacionAbierto(false)}
            >
              Confirmar ubicación
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default FiltrosCanchasSidebar;
