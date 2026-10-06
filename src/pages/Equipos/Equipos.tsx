import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FiltrosEquiposSidebar from "./components/FiltrosEquiposSidebar";
import EquipoCard from "./components/EquipoCard";
import CrearEquipoModal from "../../components/CrearEquipoModal";
import { authService } from "../../services/authService";
import { equiposService, Equipo, ListarEquiposFiltros } from "../../services/equiposService";
import { FiltrosEquipos, FILTROS_EQUIPOS_INICIALES } from "./equiposData";
import "./Equipos.css";

type OrdenEquipos = NonNullable<ListarEquiposFiltros["orden"]>;
const EQUIPOS_POR_PAGINA = 9;

const Equipos = () => {
  const navigate = useNavigate();
  const haySesion = authService.haySesion();

  const [filtros, setFiltros] = useState<FiltrosEquipos>(FILTROS_EQUIPOS_INICIALES);
  const [orden, setOrden] = useState<OrdenEquipos>("recientes");
  // Se vuelve a montar el panel de filtros al reestablecer, para que limpie su estado interno
  const [versionFiltros, setVersionFiltros] = useState(0);
  const [zonas, setZonas] = useState<string[]>([]);
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
      orden,
      pagina: paginaAPedir,
      limite: EQUIPOS_POR_PAGINA,
      nivel: filtros.niveles.length ? filtros.niveles : undefined,
      sexo: filtros.sexos.length ? filtros.sexos : undefined,
      ubicacion: filtros.ubicacion || undefined,
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

  // Zonas reales para el filtro: las ubicaciones distintas que cargaron los equipos existentes.
  // El backend limita cada pagina a 50 equipos, asi que se recorren hasta 5 paginas.
  useEffect(() => {
    let activo = true;
    const cargarZonas = async () => {
      const vistas = new Set<string>();
      try {
        let paginaZonas = 1;
        let totalPaginasZonas = 1;
        while (paginaZonas <= totalPaginasZonas && paginaZonas <= 5) {
          const datos = await equiposService.listar({ limite: 50, pagina: paginaZonas });
          datos.equipos.forEach((eq) => eq.ubicacion?.trim() && vistas.add(eq.ubicacion.trim()));
          totalPaginasZonas = datos.totalPaginas;
          paginaZonas += 1;
        }
      } catch {
        // si falla, el panel queda sin zonas para elegir
      }
      if (activo) setZonas(Array.from(vistas).sort((a, b) => a.localeCompare(b, "es")));
    };
    cargarZonas();
    return () => {
      activo = false;
    };
  }, []);

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
        <FiltrosEquiposSidebar key={versionFiltros} onAplicar={handleAplicarFiltros} zonas={zonas} />

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
                <option value="recientes">MÁS RECIENTES</option>
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
                onClick={() => {
                  setFiltros(FILTROS_EQUIPOS_INICIALES);
                  setVersionFiltros((v) => v + 1);
                }}
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
