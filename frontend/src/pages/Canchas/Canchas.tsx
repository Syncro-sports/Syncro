import { useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FiltrosCanchasSidebar from "./components/FiltrosCanchasSidebar";
import CanchaCard from "./components/CanchaCard";
import CanchasMap from "./components/CanchasMap";
import CanchaReservaModal from "./components/CanchaReservaModal";
import {
  COMPLEJOS_CANCHAS,
  ComplejoCancha,
  FiltrosCanchas,
  FILTROS_CANCHAS_INICIALES,
} from "./canchasData";
import "./Canchas.css";

type OrdenCanchas = "tipos" | "baratos" | "caros" | "rating" | "distancia";

const CANCHAS_POR_PAGINA = 6;

const Canchas = () => {
  const [filtros, setFiltros] = useState<FiltrosCanchas>(FILTROS_CANCHAS_INICIALES);
  const [orden, setOrden] = useState<OrdenCanchas>("tipos");
  const [visibles, setVisibles] = useState<number>(CANCHAS_POR_PAGINA);
  const [canchaModal, setCanchaModal] = useState<ComplejoCancha | null>(null);
  const [turnoModal, setTurnoModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const complejosFiltrados = useMemo(() => {
    return COMPLEJOS_CANCHAS.filter((cancha) => {
      if (filtros.tipos.length > 0 && !filtros.tipos.includes(cancha.tipo)) {
        return false;
      }
      if (
        filtros.superficies.length > 0 &&
        !filtros.superficies.includes(cancha.superficie)
      ) {
        return false;
      }
      if (filtros.niveles.length > 0 && !filtros.niveles.includes(cancha.nivel)) {
        return false;
      }
      if (filtros.ubicacion !== "todas") {
        const matchUbicacion = cancha.localidad
          .toLowerCase()
          .replace(/\s+/g, "-")
          .includes(filtros.ubicacion.replace(/\s+/g, "-"));
        if (!matchUbicacion) return false;
      }
      return true;
    });
  }, [filtros]);

  const complejosOrdenados = useMemo(() => {
    const lista = [...complejosFiltrados];
    if (orden === "baratos") {
      lista.sort((a, b) => a.precio - b.precio);
    } else if (orden === "caros") {
      lista.sort((a, b) => b.precio - a.precio);
    } else if (orden === "rating") {
      lista.sort((a, b) => b.rating - a.rating);
    } else if (orden === "distancia") {
      lista.sort((a, b) => a.distanciaKm - b.distanciaKm);
    } else if (orden === "tipos") {
      lista.sort((a, b) => a.tipo.localeCompare(b.tipo));
    }
    return lista;
  }, [complejosFiltrados, orden]);

  const complejosVisibles = complejosOrdenados.slice(0, visibles);

  const handleAplicarFiltros = (nuevosFiltros: FiltrosCanchas) => {
    setFiltros(nuevosFiltros);
    setVisibles(CANCHAS_POR_PAGINA);
  };

  const handleReservar = (cancha: ComplejoCancha, turno?: string) => {
    setCanchaModal(cancha);
    setTurnoModal(turno || null);
  };

  const handleVerDetalle = (cancha: ComplejoCancha) => {
    setCanchaModal(cancha);
    setTurnoModal(null);
  };

  const handleConfirmarReserva = (detalles: {
    nombre: string;
    fecha: string;
    hora: string;
  }) => {
    setToastMessage(
      `¡Reserva confirmada en ${detalles.nombre} para ${detalles.fecha} a las ${detalles.hora} hs!`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="canchas-page">
      <Header />

      <section className="canchas-hero">
        <h1 className="canchas-hero__title">Canchas Disponibles</h1>
      </section>

      <div className="canchas-layout">
        <FiltrosCanchasSidebar
          onAplicar={handleAplicarFiltros}
          totalResultados={complejosOrdenados.length}
        />

        <div className="canchas-content">
          <div className="canchas-content__top">
            <p className="canchas-content__count">
              Mostrando los <strong>{complejosOrdenados.length}</strong> complejos
            </p>
            <div className="canchas-orden">
              <span>Ordenar por</span>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as OrdenCanchas)}
                className="canchas-orden__select"
                aria-label="Ordenar canchas"
              >
                <option value="tipos">TIPOS</option>
                <option value="baratos">MÁS BARATOS</option>
                <option value="caros">MÁS CAROS</option>
                <option value="rating">MEJOR VALORADAS</option>
                <option value="distancia">MÁS CERCANAS</option>
              </select>
            </div>
          </div>

          {complejosVisibles.length > 0 ? (
            <div className="canchas-grid">
              {complejosVisibles.map((cancha) => (
                <CanchaCard
                  key={cancha.id}
                  cancha={cancha}
                  onReservar={handleReservar}
                  onVerDetalle={handleVerDetalle}
                />
              ))}
            </div>
          ) : (
            <div className="canchas-vacio">
              <p>No se encontraron canchas con los filtros seleccionados.</p>
              <button
                type="button"
                className="canchas-vacio__btn"
                onClick={() => setFiltros(FILTROS_CANCHAS_INICIALES)}
              >
                Reestablecer filtros
              </button>
            </div>
          )}

          {visibles < complejosOrdenados.length && (
            <button
              type="button"
              className="canchas-cargar-mas"
              onClick={() => setVisibles((prev) => prev + CANCHAS_POR_PAGINA)}
            >
              CARGAR MÁS CANCHAS ⌄
            </button>
          )}
        </div>
      </div>

      <CanchasMap
        complejos={complejosFiltrados.length > 0 ? complejosFiltrados : COMPLEJOS_CANCHAS}
        onSelectComplejo={handleVerDetalle}
      />

      <CanchaReservaModal
        key={canchaModal?.id ?? "cerrado"}
        cancha={canchaModal}
        turnoInicial={turnoModal}
        onClose={() => setCanchaModal(null)}
        onConfirmar={handleConfirmarReserva}
      />

      {toastMessage && (
        <div className="canchas-toast" role="status">
          <span>{toastMessage}</span>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Canchas;
