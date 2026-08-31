import { useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FiltrosEquiposSidebar from "./components/FiltrosEquiposSidebar";
import EquipoCard from "./components/EquipoCard";
import { EQUIPOS, Equipo, FiltrosEquipos, FILTROS_EQUIPOS_INICIALES } from "./equiposData";
import "./Equipos.css";

type OrdenEquipos = "tipos" | "puntos" | "nombre";
const EQUIPOS_POR_PAGINA = 9;

const Equipos = () => {
  const [filtros, setFiltros] = useState<FiltrosEquipos>(FILTROS_EQUIPOS_INICIALES);
  const [orden, setOrden] = useState<OrdenEquipos>("tipos");
  const [visibles, setVisibles] = useState<number>(EQUIPOS_POR_PAGINA);

  const equiposFiltrados = useMemo(() => {
    return EQUIPOS.filter((equipo: Equipo) => {
      if (filtros.tipos.length > 0 && !filtros.tipos.includes(equipo.tipo)) {
        return false;
      }
      if (
        filtros.superficies.length > 0 &&
        !filtros.superficies.includes(equipo.superficie)
      ) {
        return false;
      }
      if (filtros.niveles.length > 0 && !filtros.niveles.includes(equipo.nivel)) {
        return false;
      }
      if (filtros.ubicacion !== "todas") {
        const matchUbicacion = equipo.ubicacion
          .toLowerCase()
          .replace(/\s+/g, "-")
          .includes(filtros.ubicacion.replace(/\s+/g, "-"));
        if (!matchUbicacion) return false;
      }
      return true;
    });
  }, [filtros]);

  const equiposOrdenados = useMemo(() => {
    const lista = [...equiposFiltrados];
    if (orden === "puntos") {
      lista.sort((a, b) => b.puntos - a.puntos);
    } else if (orden === "nombre") {
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === "tipos") {
      lista.sort((a, b) => a.tipo.localeCompare(b.tipo));
    }
    return lista;
  }, [equiposFiltrados, orden]);

  const equiposVisibles = equiposOrdenados.slice(0, visibles);

  const handleAplicarFiltros = (nuevosFiltros: FiltrosEquipos) => {
    setFiltros(nuevosFiltros);
    setVisibles(EQUIPOS_POR_PAGINA);
  };

  return (
    <div className="equipos-page">
      <Header />

      <section className="equipos-hero">
        <h1 className="equipos-hero__title">Equipos Disponibles</h1>
      </section>

      <div className="equipos-layout">
        <FiltrosEquiposSidebar onAplicar={handleAplicarFiltros} />

        <div className="equipos-content">
          <div className="equipos-content__top">
            <p className="equipos-content__count">
              Mostrando los <strong>{equiposOrdenados.length}</strong> equipos
            </p>
            <div className="equipos-orden">
              <span>Ordenar por</span>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as OrdenEquipos)}
                className="equipos-orden__select"
                aria-label="Ordenar equipos"
              >
                <option value="tipos">TIPOS</option>
                <option value="puntos">MÁS PUNTOS</option>
                <option value="nombre">NOMBRE</option>
              </select>
            </div>
          </div>

          {equiposVisibles.length > 0 ? (
            <div className="equipos-grid">
              {equiposVisibles.map((equipo) => (
                <EquipoCard key={equipo.id} equipo={equipo} />
              ))}
            </div>
          ) : (
            <div className="equipos-vacio">
              <p>No se encontraron equipos con los filtros seleccionados.</p>
              <button
                type="button"
                className="equipos-vacio__btn"
                onClick={() => setFiltros(FILTROS_EQUIPOS_INICIALES)}
              >
                Reestablecer filtros
              </button>
            </div>
          )}

          {visibles < equiposOrdenados.length && (
            <button
              type="button"
              className="equipos-cargar-mas"
              onClick={() => setVisibles((prev) => prev + EQUIPOS_POR_PAGINA)}
            >
              CARGAR MÁS EQUIPOS ⌄
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Equipos;
