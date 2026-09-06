import { useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FiltrosCanchasSidebar from "./components/FiltrosCanchasSidebar";
import CanchaCard from "./components/CanchaCard";
import CanchaCardSkeleton from "./components/CanchaCardSkeleton";
import CanchasMap from "./components/CanchasMap";
import CanchaReservaModal from "./components/CanchaReservaModal";
import {
  COMPLEJOS_CANCHAS,
  ComplejoCancha,
  FiltrosCanchas,
  FILTROS_CANCHAS_INICIALES,
} from "./canchasData";
import { canchasService } from "../../services/canchasService";
import { useEffect } from "react";
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

  const [canchasData, setCanchasData] = useState<ComplejoCancha[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCanchas = async () => {
      setLoading(true);
      // Usamos el canchasService que armó el equipo (devuelve Cancha, lo adaptamos visualmente a ComplejoCancha si es necesario)
      const data = await canchasService.getAll();

      // Adaptamos la respuesta del backend para que coincida con la interfaz que espera la UI (ComplejoCancha)
      const dataAdaptada: ComplejoCancha[] = data.map((c: any) => {
        // Adaptar formato "5 vs 5" a "FUTBOL 5"
        let tipoCancha = "FUTBOL 5";
        if (c.formato === "5 vs 5") tipoCancha = "FUTBOL 5";
        else if (c.formato === "7 vs 7") tipoCancha = "FUTBOL 7";
        else if (c.formato === "8 vs 8") tipoCancha = "FUTBOL 8";
        else if (c.formato === "9 vs 9") tipoCancha = "FUTBOL 9";
        else if (c.formato === "11 vs 11") tipoCancha = "FUTBOL 11";

        // Adaptar superficie "Sintético" a "CESPED SINTETICO"
        let supCancha = "CESPED SINTETICO";
        if (c.superficie?.toUpperCase().includes("SINTETICO")) supCancha = "CESPED SINTETICO";
        else if (c.superficie?.toUpperCase().includes("NATURAL")) supCancha = "CESPED NATURAL";
        else if (c.superficie?.toUpperCase().includes("CEMENTO")) supCancha = "CEMENTO";

        return {
        id: c.id,
        nombre: c.nombre,
        localidad: c.localidad || "Capital Federal", // Aseguramos campos requeridos
        distanciaKm: 0,
        distanciaLabel: "",
        direccion: c.direccion || "Sin dirección",
        precio: c.precioOriginal || c.precioDia || 0,
        descuento: c.descuentoLabel || "",
        descuentoMonto: c.precioOriginal && c.precioDescuento ? c.precioOriginal - c.precioDescuento : 0,
        rankingTag: "Ranking",
        rating: c.rating || 5,
        reviewsCount: 10,
        imagen: c.imagen,
        imagenes: c.imagenes || [c.imagen],
        tipo: tipoCancha as any,
        superficie: supCancha as any,
        nivel: "A",
        turnosHoy: ["14:00", "16:00", "18:00"], // TODO: traer turnos reales del backend
        servicios: c.servicios || [],
        ownerNotes: c.descripcion || "",
        highlights: c.tags || [],
        coords: { xPercent: 50, yPercent: 50, lat: 0, lng: 0 },
      }});

      // Si no viene nada del backend (o hubo un error de CORS/Fetch), canchasData quedará con los mocks porque el service tiene fallback
      setCanchasData(dataAdaptada.length > 0 ? dataAdaptada : COMPLEJOS_CANCHAS);
      setLoading(false);
    };
    fetchCanchas();
  }, []);

  const complejosFiltrados = useMemo(() => {
    // Si canchasData está vacío, usamos COMPLEJOS_CANCHAS como red de seguridad visual
    const dataSource = canchasData.length > 0 ? canchasData : COMPLEJOS_CANCHAS;
    
    return dataSource.filter((cancha) => {
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
  }, [filtros, canchasData]);

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

          {loading ? (
            <div className="canchas-grid">
              {Array.from({ length: CANCHAS_POR_PAGINA }).map((_, i) => (
                <CanchaCardSkeleton key={i} />
              ))}
            </div>
          ) : complejosVisibles.length > 0 ? (
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
