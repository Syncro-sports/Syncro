import { useState } from "react";
import { Bloque, FechaTag, Filtros, FILTROS_INICIALES, Nivel } from "../partidosData";
import "./FiltrosSidebar.css";

interface FiltrosSidebarProps {
  onAplicar: (filtros: Filtros) => void;
}

const toggleValor = <T,>(lista: T[], valor: T): T[] =>
  lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];

const formatPrecio = (precio: number) => (precio >= 100000 ? "$100.000+" : `$${precio.toLocaleString("es-AR")}`);

const HORARIOS_OPCIONES: { valor: Bloque; label: string }[] = [
  { valor: "manana", label: "Mañana" },
  { valor: "tarde", label: "Tarde" },
  { valor: "noche", label: "Noche" },
];

const FECHAS_OPCIONES: { valor: FechaTag; label: string }[] = [
  { valor: "hoy", label: "Hoy" },
  { valor: "manana", label: "Mañana" },
  { valor: "semana", label: "Esta semana" },
  { valor: "finde", label: "Finde" },
];

const NIVELES_OPCIONES: Nivel[] = ["Principiante", "Intermedio", "Avanzado", "Profesional"];

const ZONAS_FRECUENTES = ["Caseros", "San Isidro", "Vicente López", "Olivos", "Martínez"];

const FiltrosSidebar = ({ onAplicar }: FiltrosSidebarProps) => {
  const [tipo, setTipo] = useState<Filtros["tipo"]>(FILTROS_INICIALES.tipo);
  const [precioMax, setPrecioMax] = useState(FILTROS_INICIALES.precioMax);
  const [horarios, setHorarios] = useState<Bloque[]>(FILTROS_INICIALES.horarios);
  const [fechas, setFechas] = useState<FechaTag[]>(FILTROS_INICIALES.fechas);
  const [niveles, setNiveles] = useState<Nivel[]>(FILTROS_INICIALES.niveles);

  const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string | null>(null);
  const [busquedaUbicacion, setBusquedaUbicacion] = useState("");

  const aplicarFiltros = () => {
    onAplicar({ tipo, precioMax, horarios, fechas, niveles });
  };

  const limpiarFiltros = () => {
    setTipo(FILTROS_INICIALES.tipo);
    setPrecioMax(FILTROS_INICIALES.precioMax);
    setHorarios(FILTROS_INICIALES.horarios);
    setFechas(FILTROS_INICIALES.fechas);
    setNiveles(FILTROS_INICIALES.niveles);
    onAplicar(FILTROS_INICIALES);
  };

  const zonasFiltradas = ZONAS_FRECUENTES.filter((zona) =>
    zona.toLowerCase().includes(busquedaUbicacion.toLowerCase())
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
        <label className="filtros__titulo" htmlFor="filtro-tipo">
          Tipo de partido
        </label>
        <select
          id="filtro-tipo"
          value={tipo}
          onChange={(event) => setTipo(event.target.value as Filtros["tipo"])}
        >
          <option value="todos">Todos los tipos</option>
          <option value="Competitivo">Competitivo</option>
          <option value="Amistoso">Amistoso</option>
        </select>
      </div>

      <div className="filtros__group">
        <label className="filtros__titulo" htmlFor="filtro-precio">
          Precio máximo
        </label>
        <input
          id="filtro-precio"
          type="range"
          min={0}
          max={100000}
          step={5000}
          value={precioMax}
          onChange={(event) => setPrecioMax(Number(event.target.value))}
        />
        <div className="filtros__range-labels">
          <span>$0</span>
          <span>{formatPrecio(precioMax)}</span>
        </div>
      </div>

      <button
        type="button"
        className="filtros__ubicacion"
        onClick={() => setModalUbicacionAbierto(true)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{ubicacionSeleccionada || "Elegir ubicación"}</span>
      </button>

      <div className="filtros__divider" />

      <div className="filtros__group">
        <label className="filtros__titulo">Horario</label>
        <div className="filtros__chips">
          {HORARIOS_OPCIONES.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={`filtros__chip ${horarios.includes(opcion.valor) ? "is-active" : ""}`}
              onClick={() => setHorarios((prev) => toggleValor(prev, opcion.valor))}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros__group">
        <label className="filtros__titulo">Fecha</label>
        <div className="filtros__chips">
          {FECHAS_OPCIONES.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={`filtros__chip ${fechas.includes(opcion.valor) ? "is-active" : ""}`}
              onClick={() => setFechas((prev) => toggleValor(prev, opcion.valor))}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros__group">
        <label className="filtros__titulo">Nivel</label>
        <div className="filtros__chips">
          {NIVELES_OPCIONES.map((opcion) => (
            <button
              key={opcion}
              type="button"
              className={`filtros__chip ${niveles.includes(opcion) ? "is-active" : ""}`}
              onClick={() => setNiveles((prev) => toggleValor(prev, opcion))}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros__divider" />

      <button type="button" className="filtros__aplicar" onClick={aplicarFiltros}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Aplicar filtros
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
                placeholder="Buscar barrio o localidad..."
                value={busquedaUbicacion}
                onChange={(e) => setBusquedaUbicacion(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="filtro-ubicacion-modal__actual"
              onClick={() => {
                setUbicacionSeleccionada("Mi ubicación actual");
                setModalUbicacionAbierto(false);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
              Usar mi ubicación actual
            </button>

            <p className="filtro-ubicacion-modal__sublabel">Zonas frecuentes</p>
            <div className="filtro-ubicacion-modal__lista">
              {zonasFiltradas.map((zona) => (
                <button
                  key={zona}
                  type="button"
                  className={`filtro-ubicacion-modal__item ${ubicacionSeleccionada === zona ? "is-selected" : ""}`}
                  onClick={() => setUbicacionSeleccionada(zona)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
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

export default FiltrosSidebar;
