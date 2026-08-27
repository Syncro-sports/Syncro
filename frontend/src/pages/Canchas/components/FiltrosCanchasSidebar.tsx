import { useState } from "react";
import {
  FiltrosCanchas,
  FILTROS_CANCHAS_INICIALES,
  NivelCancha,
  SuperficieCancha,
  TipoCancha,
  UBICACIONES_DISPONIBLES,
} from "../canchasData";
import "./FiltrosCanchasSidebar.css";

interface FiltrosCanchasSidebarProps {
  onAplicar: (filtros: FiltrosCanchas) => void;
  totalResultados: number;
}

const TIPOS_OPCIONES: TipoCancha[] = [
  "FUTBOL 5",
  "FUTBOL 7",
  "FUTBOL 8",
  "FUTBOL 9",
  "FUTBOL 11",
];

const SUPERFICIES_OPCIONES: SuperficieCancha[] = [
  "CESPED SINTETICO",
  "CESPED NATURAL",
  "CEMENTO",
];

const NIVELES_OPCIONES: NivelCancha[] = ["A", "B", "C"];

const toggleItem = <T,>(list: T[], item: T): T[] => {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
};

const FiltrosCanchasSidebar = ({ onAplicar }: FiltrosCanchasSidebarProps) => {
  const [tipos, setTipos] = useState<TipoCancha[]>(FILTROS_CANCHAS_INICIALES.tipos);
  const [superficies, setSuperficies] = useState<SuperficieCancha[]>(
    FILTROS_CANCHAS_INICIALES.superficies
  );
  const [niveles, setNiveles] = useState<NivelCancha[]>(FILTROS_CANCHAS_INICIALES.niveles);
  const [ubicacion, setUbicacion] = useState<string>(FILTROS_CANCHAS_INICIALES.ubicacion);

  const aplicarFiltros = () => {
    onAplicar({
      tipos,
      superficies,
      niveles,
      ubicacion,
    });
  };

  return (
    <aside className="filtros">
      <div className="filtros__header">
        <img src={`${import.meta.env.BASE_URL}assets/icons/filtro.svg`} alt="" />
        <h2>Filtros</h2>
      </div>

      <div className="filtros__group">
        <label>Tipos</label>
        {TIPOS_OPCIONES.map((tipo) => (
          <label className="filtros__checkbox" key={tipo}>
            <input
              type="checkbox"
              checked={tipos.includes(tipo)}
              onChange={() => setTipos((prev) => toggleItem(prev, tipo))}
            />
            {tipo}
          </label>
        ))}
      </div>

      <div className="filtros__group">
        <label>Superficies</label>
        {SUPERFICIES_OPCIONES.map((sup) => (
          <label className="filtros__checkbox" key={sup}>
            <input
              type="checkbox"
              checked={superficies.includes(sup)}
              onChange={() => setSuperficies((prev) => toggleItem(prev, sup))}
            />
            {sup}
          </label>
        ))}
      </div>

      <div className="filtros__group">
        <label>Niveles</label>
        {NIVELES_OPCIONES.map((nivel) => (
          <label className="filtros__checkbox" key={nivel}>
            <input
              type="checkbox"
              checked={niveles.includes(nivel)}
              onChange={() => setNiveles((prev) => toggleItem(prev, nivel))}
            />
            {nivel}
          </label>
        ))}
      </div>

      <div className="filtros__group">
        <label htmlFor="filtro-canchas-ubicacion">Ubicación</label>
        <select
          id="filtro-canchas-ubicacion"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        >
          {UBICACIONES_DISPONIBLES.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <button type="button" className="filtros__aplicar" onClick={aplicarFiltros}>
        APLICAR Y BUSCAR
        <img src={`${import.meta.env.BASE_URL}assets/icons/lupa.svg`} alt="" />
      </button>
    </aside>
  );
};

export default FiltrosCanchasSidebar;
