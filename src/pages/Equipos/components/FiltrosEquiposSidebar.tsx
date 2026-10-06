import { useState } from "react";
import { FiltrosEquipos, FILTROS_EQUIPOS_INICIALES, NivelEquipo, SexoEquipo } from "../equiposData";
// Mismo diseño que el panel de filtros de Canchas: comparten estilos
import "../../Canchas/components/FiltrosCanchasSidebar.css";

interface FiltrosEquiposSidebarProps {
  onAplicar: (filtros: FiltrosEquipos) => void;
  // Zonas reales: las que cargaron los equipos al crearse (el backend filtra por texto exacto)
  zonas: string[];
}

const toggleItem = <T,>(list: T[], item: T): T[] =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

const NIVELES_OPCIONES: { valor: NivelEquipo; label: string }[] = [
  { valor: "A", label: "Nivel A" },
  { valor: "B", label: "Nivel B" },
  { valor: "C", label: "Nivel C" },
];

const SEXOS_OPCIONES: { valor: SexoEquipo; label: string }[] = [
  { valor: "MASCULINO", label: "Masculino" },
  { valor: "FEMENINO", label: "Femenino" },
  { valor: "MIXTO", label: "Mixto" },
];

const IconoPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const FiltrosEquiposSidebar = ({ onAplicar, zonas }: FiltrosEquiposSidebarProps) => {
  const [niveles, setNiveles] = useState<NivelEquipo[]>(FILTROS_EQUIPOS_INICIALES.niveles);
  const [sexos, setSexos] = useState<SexoEquipo[]>(FILTROS_EQUIPOS_INICIALES.sexos);
  const [ubicacion, setUbicacion] = useState<string>(FILTROS_EQUIPOS_INICIALES.ubicacion);

  const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);
  const [busquedaUbicacion, setBusquedaUbicacion] = useState("");

  const aplicarFiltros = () => onAplicar({ niveles, sexos, ubicacion });

  const limpiarFiltros = () => {
    setNiveles(FILTROS_EQUIPOS_INICIALES.niveles);
    setSexos(FILTROS_EQUIPOS_INICIALES.sexos);
    setUbicacion(FILTROS_EQUIPOS_INICIALES.ubicacion);
    onAplicar(FILTROS_EQUIPOS_INICIALES);
  };

  const zonasFiltradas = zonas.filter((z) => z.toLowerCase().includes(busquedaUbicacion.toLowerCase()));

  return (
    <aside className="filtros">
      <div className="filtros__header">
        <h2>Filtros</h2>
        <button type="button" className="filtros__clear" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>

      <div className="filtros__group">
        <label className="filtros__titulo">Nivel</label>
        <div className="filtros__chips">
          {NIVELES_OPCIONES.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={`filtros__chip ${niveles.includes(opcion.valor) ? "is-active" : ""}`}
              onClick={() => setNiveles((prev) => toggleItem(prev, opcion.valor))}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros__group">
        <label className="filtros__titulo">Género</label>
        <div className="filtros__chips">
          {SEXOS_OPCIONES.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={`filtros__chip ${sexos.includes(opcion.valor) ? "is-active" : ""}`}
              onClick={() => setSexos((prev) => toggleItem(prev, opcion.valor))}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros__divider" />

      <button type="button" className="filtros__ubicacion" onClick={() => setModalUbicacionAbierto(true)}>
        <IconoPin />
        <span>{ubicacion || "Elegir ubicación"}</span>
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
                aria-label="Cerrar"
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
                setUbicacion("");
                setModalUbicacionAbierto(false);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
              Todas las zonas
            </button>

            <p className="filtro-ubicacion-modal__sublabel">Zonas con equipos</p>
            <div className="filtro-ubicacion-modal__lista">
              {zonasFiltradas.length === 0 && (
                <p className="filtro-ubicacion-modal__sublabel">No hay zonas que coincidan.</p>
              )}
              {zonasFiltradas.map((zona) => (
                <button
                  key={zona}
                  type="button"
                  className={`filtro-ubicacion-modal__item ${ubicacion === zona ? "is-selected" : ""}`}
                  onClick={() => setUbicacion(zona)}
                >
                  <IconoPin />
                  {zona}
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

export default FiltrosEquiposSidebar;
