import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FiltrosEquiposSidebar from "./components/FiltrosEquiposSidebar";
import EquipoCard from "./components/EquipoCard";
import CrearEquipoModal from "../../components/CrearEquipoModal";
import { authService } from "../../services/authService";
import { equiposService, Equipo, ListarEquiposFiltros } from "../../services/equiposService";
import { FiltrosEquipos, FILTROS_EQUIPOS_INICIALES, UBICACIONES_DISPONIBLES } from "./equiposData";
import "./Equipos.css";

type OrdenEquipos = "tipos" | "puntos" | "nombre";
const EQUIPOS_POR_PAGINA = 9;

// El sidebar sigue mandando el id de la zona ("lomas", "lanus"...), pero el backend filtra
// "ubicacion" por texto exacto contra lo que el equipo cargó al crearse (ej: "Lomas de Zamora").
// Mapeamos al label de la zona, que es lo más parecido a ese texto libre que tenemos hoy.
const ubicacionParaBackend = (id: string): string | undefined => {
  if (id === "todas") return undefined;
  const zona = UBICACIONES_DISPONIBLES.find((u) => u.id === id);
  return zona?.label;
};

// El dropdown de orden no cambió de opciones (se mantiene el diseño), pero "tipos" no existe
// como criterio de orden en el backend: lo mapeamos al más parecido, que es "recientes".
const ordenParaBackend = (orden: OrdenEquipos): ListarEquiposFiltros["orden"] =>
  orden === "tipos" ? "recientes" : orden;

const Equipos = () => {
  const navigate = useNavigate();
  const haySesion = authService.haySesion();

  const [filtros, setFiltros] = useState<FiltrosEquipos>(FILTROS_EQUIPOS_INICIALES);
  const [orden, setOrden] = useState<OrdenEquipos>("tipos");
  const [mostrarCrear, setMostrarCrear] = useState(false);

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trae una página del backend real. Si "acumular" es true, la suma a lo que ya había
  // (botón "cargar más"); si no, reemplaza todo (primer load o cambio de filtros/orden).
  const cargarPagina = async (paginaAPedir: number, acumular: boolean) => {
    acumular ? setCargandoMas(true) : setCargando(true);
    setError(null);

    const query: ListarEquiposFiltros = {
      orden: ordenParaBackend(orden),
      pagina: paginaAPedir,
      limite: EQUIPOS_POR_PAGINA,
      ubicacion: ubicacionParaBackend(filtros.ubicacion),
      // tipos/superficies/niveles quedan sin mandar: el modelo real de Equipo no tiene esos
      // campos (viven en Cancha), así que esos checkboxes todavía no filtran nada.
    };

    try {
      const datos = await equiposService.listar(query);
      setEquipos((prev) => (acumular ? [...prev, ...datos.equipos] : datos.equipos));
      setPagina(datos.pagina);
      setTotalPaginas(datos.totalPaginas);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los equipos");
    } finally {
      acumular ? setCargandoMas(false) : setCargando(false);
    }
  };

  useEffect(() => {
    cargarPagina(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros, orden]);

  const handleAplicarFiltros = (nuevosFiltros: FiltrosEquipos) => {
    setFiltros(nuevosFiltros);
  };

  // Sin sesión no hay con qué crear el equipo (el backend exige JUGADOR logueado):
  // mandamos a login en vez de abrir un modal que va a fallar al enviarlo.
  const handleCrearEquipo = () => {
    if (!haySesion) {
      navigate("/login?redirect=/equipos");
      return;
    }
    setMostrarCrear(true);
  };

  return (
    <div className="equipos-page">
      <Header />

      <section className="equipos-hero">
        <div className="equipos-hero__left">
          <h1 className="equipos-hero__title">Equipos Disponibles</h1>
          <p className="equipos-hero__count">
            Mostrando los <strong>{equipos.length}</strong> equipos
          </p>
        </div>

        <button type="button" className="equipos-hero__crear-btn" onClick={handleCrearEquipo}>
          + Crear equipo
        </button>
      </section>

      <div className="equipos-layout">
        <FiltrosEquiposSidebar onAplicar={handleAplicarFiltros} />

        <div className="equipos-content">
          <div className="equipos-content__top">
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

          {cargando && <p className="equipos-estado">Cargando equipos...</p>}

          {!cargando && error && <p className="equipos-estado equipos-estado--error">{error}</p>}

          {!cargando && !error && equipos.length > 0 && (
            <div className="equipos-grid">
              {equipos.map((equipo) => (
                <EquipoCard key={equipo.id} equipo={equipo} />
              ))}
            </div>
          )}

          {!cargando && !error && equipos.length === 0 && (
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

          {!cargando && !error && pagina < totalPaginas && (
            <button
              type="button"
              className="equipos-cargar-mas"
              onClick={() => cargarPagina(pagina + 1, true)}
              disabled={cargandoMas}
            >
              {cargandoMas ? "CARGANDO..." : "CARGAR MÁS EQUIPOS ⌄"}
            </button>
          )}
        </div>
      </div>

      {mostrarCrear && (
        <CrearEquipoModal
          onClose={() => setMostrarCrear(false)}
          onCreado={(equipoCreado) => {
            setMostrarCrear(false);
            navigate(`/equipos/${equipoCreado.id}`);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default Equipos;
