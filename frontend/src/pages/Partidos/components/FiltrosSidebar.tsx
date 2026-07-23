import { useState } from "react";
import { Bloque, FechaTag, Filtros, FILTROS_INICIALES, Nivel, TipoPartido } from "../partidosData";
import { CalendarIcon } from "./icons";
import "./FiltrosSidebar.css";

interface FiltrosSidebarProps {
  onAplicar: (filtros: Filtros) => void;
}

const toggleValor = <T,>(lista: T[], valor: T): T[] =>
  lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];

const formatPrecio = (precio: number) => (precio >= 100000 ? "$100.000+" : `$${precio.toLocaleString("es-AR")}`);

const FiltrosSidebar = ({ onAplicar }: FiltrosSidebarProps) => {
  const [tipo, setTipo] = useState<Filtros["tipo"]>(FILTROS_INICIALES.tipo);
  const [precioMax, setPrecioMax] = useState(FILTROS_INICIALES.precioMax);
  const [horarios, setHorarios] = useState<Bloque[]>(FILTROS_INICIALES.horarios);
  const [fechas, setFechas] = useState<FechaTag[]>(FILTROS_INICIALES.fechas);
  const [niveles, setNiveles] = useState<Nivel[]>(FILTROS_INICIALES.niveles);

  const aplicarFiltros = () => {
    onAplicar({ tipo, precioMax, horarios, fechas, niveles });
  };

  return (
    <aside className="filtros">
      <div className="filtros__header">
        <img src={`${import.meta.env.BASE_URL}assets/icons/filtro.svg`} alt="" />
        <h2>Filtros</h2>
      </div>

      <div className="filtros__group">
        <label htmlFor="filtro-tipo">Tipo de partido</label>
        <select
          id="filtro-tipo"
          value={tipo}
          onChange={(event) => setTipo(event.target.value as Filtros["tipo"])}
        >
          <option value="todos">TODOS LOS TIPOS</option>
          <option value="Competitivo">COMPETITIVO</option>
          <option value="Amistoso">AMISTOSO</option>
        </select>
      </div>

      <div className="filtros__group">
        <label htmlFor="filtro-precio">Precio</label>
        <span className="filtros__sublabel">Rango de precio</span>
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

      <div className="filtros__group">
        <label>Horarios</label>
        {(
          [
            { valor: "manana" as Bloque, label: "Mañana" },
            { valor: "tarde" as Bloque, label: "Tarde" },
            { valor: "noche" as Bloque, label: "Noche" },
          ]
        ).map((opcion) => (
          <label className="filtros__checkbox" key={opcion.valor}>
            <input
              type="checkbox"
              checked={horarios.includes(opcion.valor)}
              onChange={() => setHorarios((prev) => toggleValor(prev, opcion.valor))}
            />
            {opcion.label}
          </label>
        ))}
      </div>

      <div className="filtros__group">
        <label className="filtros__label-icon">
          <CalendarIcon />
          Fechas
        </label>
        <div className="filtros__date-input">
          <input type="date" aria-label="Seleccionar fecha" />
        </div>
        {(
          [
            { valor: "hoy" as FechaTag, label: "Hoy" },
            { valor: "manana" as FechaTag, label: "Mañana" },
            { valor: "semana" as FechaTag, label: "Esta semana" },
            { valor: "finde" as FechaTag, label: "Este finde" },
          ]
        ).map((opcion) => (
          <label className="filtros__checkbox" key={opcion.valor}>
            <input
              type="checkbox"
              checked={fechas.includes(opcion.valor)}
              onChange={() => setFechas((prev) => toggleValor(prev, opcion.valor))}
            />
            {opcion.label}
          </label>
        ))}
      </div>

      <div className="filtros__group">
        <label>Niveles</label>
        {(
          ["Principiante", "Intermedio", "Avanzado", "Profesional"] as Nivel[]
        ).map((opcion) => (
          <label className="filtros__checkbox" key={opcion}>
            <input
              type="checkbox"
              checked={niveles.includes(opcion)}
              onChange={() => setNiveles((prev) => toggleValor(prev, opcion))}
            />
            {opcion}
          </label>
        ))}
      </div>

      <button type="button" className="filtros__ubicacion">
        <img src={`${import.meta.env.BASE_URL}assets/icons/lugar.svg`} alt="" />
        UBICACIÓN
      </button>

      <button type="button" className="filtros__aplicar" onClick={aplicarFiltros}>
        APLICAR FILTROS
        <img src={`${import.meta.env.BASE_URL}assets/icons/lupa.svg`} alt="" />
      </button>
    </aside>
  );
};

export default FiltrosSidebar;
