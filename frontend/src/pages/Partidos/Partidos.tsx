import { useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import FiltrosSidebar from "./components/FiltrosSidebar";
import PartidoCard from "./components/PartidoCard";
import PartidoDetalleModal from "./components/PartidoDetalleModal";
import { FILTROS_INICIALES, Filtros, Partido, PARTIDOS } from "./partidosData";
import "./Partidos.css";

type Orden = "proximos" | "baratos" | "caros";

const PARTIDOS_POR_PAGINA = 9;

const Partidos = () => {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES);
  const [orden, setOrden] = useState<Orden>("proximos");
  const [visibles, setVisibles] = useState(PARTIDOS_POR_PAGINA);
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);

  const partidosFiltrados = useMemo(() => {
    return PARTIDOS.filter((partido) => {
      if (filtros.tipo !== "todos" && partido.tipo !== filtros.tipo) return false;
      if (partido.precio > filtros.precioMax) return false;
      if (filtros.horarios.length > 0 && !filtros.horarios.includes(partido.bloque)) return false;
      if (filtros.fechas.length > 0 && !filtros.fechas.includes(partido.fechaTag)) return false;
      if (filtros.niveles.length > 0 && !filtros.niveles.includes(partido.nivel)) return false;
      return true;
    });
  }, [filtros]);

  const partidosOrdenados = useMemo(() => {
    const copia = [...partidosFiltrados];
    if (orden === "baratos") copia.sort((a, b) => a.precio - b.precio);
    if (orden === "caros") copia.sort((a, b) => b.precio - a.precio);
    return copia;
  }, [partidosFiltrados, orden]);

  const partidosVisibles = partidosOrdenados.slice(0, visibles);

  const handleAplicarFiltros = (nuevosFiltros: Filtros) => {
    setFiltros(nuevosFiltros);
    setVisibles(PARTIDOS_POR_PAGINA);
  };

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="partidos-page">
      <Header />

      <section className="partidos-hero">
        <h1>Partidos Disponibles</h1>
        <div className="partidos-hero__actions">
          <Button variant="outline">MIS PARTIDOS</Button>
          <Button>CREAR PARTIDO</Button>
        </div>
      </section>

      <div className="partidos-layout">
        <FiltrosSidebar onAplicar={handleAplicarFiltros} />

        <div className="partidos-content">
          <div className="partidos-content__top">
            <p>
              Mostrando <strong>{partidosOrdenados.length}</strong> partidos
            </p>
            <div className="partidos-orden">
              <span>Ordenar por</span>
              <select value={orden} onChange={(event) => setOrden(event.target.value as Orden)}>
                <option value="proximos">PRÓXIMOS</option>
                <option value="baratos">MÁS BARATOS</option>
                <option value="caros">MÁS CAROS</option>
              </select>
            </div>
          </div>

          {partidosVisibles.length > 0 ? (
            <div className="partidos-grid">
              {partidosVisibles.map((partido) => (
                <PartidoCard
                  key={partido.id}
                  partido={partido}
                  favorito={favoritos.has(partido.id)}
                  onToggleFavorito={toggleFavorito}
                  onVerDetalle={setPartidoSeleccionado}
                />
              ))}
            </div>
          ) : (
            <p className="partidos-vacio">No encontramos partidos con esos filtros.</p>
          )}

          {visibles < partidosOrdenados.length && (
            <button
              type="button"
              className="partidos-cargar-mas"
              onClick={() => setVisibles((prev) => prev + PARTIDOS_POR_PAGINA)}
            >
              CARGAR MÁS PARTIDOS ⌄
            </button>
          )}
        </div>
      </div>

      <Footer />

      <PartidoDetalleModal
        key={partidoSeleccionado?.id ?? "cerrado"}
        partido={partidoSeleccionado}
        onClose={() => setPartidoSeleccionado(null)}
      />
    </div>
  );
};

export default Partidos;
