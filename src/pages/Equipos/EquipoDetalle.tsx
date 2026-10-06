import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderHost from "../../components/HeaderHost";
import HeaderPlayer from "../../components/HeaderPlayer";
import Footer from "../../components/Footer";
import { equiposService, EquipoDetalle as EquipoDetalleDTO, PartidoHistorial, ResultadoPartido } from "../../services/equiposService";
import { authService } from "../../services/authService";
import "./EquipoDetalle.css";

const ShieldStarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2.6 20 5.4v6.1c0 5-3.4 8.6-8 9.9-4.6-1.3-8-4.9-8-9.9V5.4L12 2.6Z"
      fill="#05070B"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="m12 8 1.15 2.33 2.57.37-1.86 1.81.44 2.56L12 13.85l-2.3 1.22.44-2.56-1.86-1.81 2.57-.37L12 8Z"
      fill="currentColor"
    />
  </svg>
);

const resultLabel: Record<ResultadoPartido, string> = {
  VICTORIA: "Victoria",
  EMPATE: "Empate",
  DERROTA: "Derrota",
};

const generoLabel: Record<string, string> = {
  MASCULINO: "Masculino",
  FEMENINO: "Femenino",
  MIXTO: "Mixto",
};

const getInitials = (n: string): string =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

const formatFecha = (iso: string): string => {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return iso;
  return fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
};

// El header depende del rol: el host ve el suyo, el jugador el suyo y sin sesión el público.
const HeaderSegunRol = () => {
  const rol = authService.haySesion() ? authService.obtenerRol() : null;
  if (rol === "HOST") return <HeaderHost />;
  if (rol === "JUGADOR") return <HeaderPlayer />;
  return <Header />;
};

// ---------------------------------------------------------------------------
// Medidas de los paneles: tienen un alto fijo (lo que queda de pantalla) para que
// la vista no cambie de tamaño; lo que no entra se pagina o se muestra en un modal.
// ---------------------------------------------------------------------------
const ALTO_PANELES_MIN = 440;
const ALTO_PANELES_MAX = 760;
const JUGADOR_FILA_ALTO = 58;
const PAGER_ALTO = 56;
const PARTIDO_FILA_ALTO = 76;
const PARTIDOS_GAP = 14;
const VER_TODO_ALTO = 52;

// Alto del panel = espacio libre desde donde empieza hasta el borde inferior de la ventana
const useAltoPaneles = (ref: RefObject<HTMLElement>): number => {
  const [alto, setAlto] = useState(560);

  useLayoutEffect(() => {
    const calcular = () => {
      const el = ref.current;
      if (!el) return;
      const arriba = el.getBoundingClientRect().top + window.scrollY;
      const libre = window.innerHeight - arriba - 28;
      setAlto(Math.min(ALTO_PANELES_MAX, Math.max(ALTO_PANELES_MIN, Math.round(libre))));
    };
    calcular();
    window.addEventListener("resize", calcular);
    const observador = new ResizeObserver(calcular);
    observador.observe(document.body);
    return () => {
      window.removeEventListener("resize", calcular);
      observador.disconnect();
    };
  }, [ref]);

  return alto;
};

// Alto disponible de un contenedor, para saber cuantas filas entran
const useAltoContenedor = (ref: RefObject<HTMLElement>): number => {
  const [alto, setAlto] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setAlto(el.clientHeight);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, [ref]);

  return alto;
};

const PartidoFila = ({ nombreEquipo, m }: { nombreEquipo: string; m: PartidoHistorial }) => (
  <article className="match-row">
    <div className="match-row__equipos">
      <div className="match-equipo">
        <ShieldStarIcon size={30} />
        <span className="match-equipo__nombre">{nombreEquipo}</span>
      </div>
      <div className="match-score">
        <span className="match-score__fecha">{formatFecha(m.fecha)}</span>
        <span className="match-score__value">
          {m.golesFavor} - {m.golesContra}
        </span>
      </div>
      <div className="match-equipo">
        <ShieldStarIcon size={30} />
        <span className="match-equipo__nombre">{m.rivalNombre}</span>
      </div>
    </div>
    <span className={`resultado-badge resultado-badge--${m.resultado.toLowerCase()}`}>{resultLabel[m.resultado]}</span>
  </article>
);

const HistorialCompletoModal = ({ equipo, onClose }: { equipo: EquipoDetalleDTO; onClose: () => void }) => (
  <div className="historial-modal" onClick={onClose}>
    <div
      className="historial-modal__caja"
      role="dialog"
      aria-modal="true"
      aria-label="Historial completo"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="historial-modal__header">
        <h3 className="panel__title">Historial completo</h3>
        <button type="button" className="historial-modal__cerrar" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>
      <div className="historial-modal__lista">
        {equipo.historial.map((m, idx) => (
          <PartidoFila key={m.idPartido ?? idx} nombreEquipo={equipo.nombre} m={m} />
        ))}
      </div>
    </div>
  </div>
);

interface PanelesEquipoProps {
  equipo: EquipoDetalleDTO;
  streak: ResultadoPartido[];
  panelesRef: RefObject<HTMLElement>;
  alto: number;
}

const PanelesEquipo = ({ equipo, streak, panelesRef, alto }: PanelesEquipoProps) => {
  // --- Jugadores: paginados con los que entran en el alto disponible ---
  const jugadoresRef = useRef<HTMLDivElement>(null);
  const altoJugadores = useAltoContenedor(jugadoresRef);
  const [paginaJugadores, setPaginaJugadores] = useState(0);

  const totalJugadores = equipo.jugadores.length;
  let porPagina = Math.max(1, Math.floor(altoJugadores / JUGADOR_FILA_ALTO));
  if (totalJugadores > porPagina) {
    porPagina = Math.max(1, Math.floor((altoJugadores - PAGER_ALTO) / JUGADOR_FILA_ALTO));
  }
  const totalPaginas = Math.max(1, Math.ceil(totalJugadores / porPagina));
  const paginaActual = Math.min(paginaJugadores, totalPaginas - 1);
  const jugadoresVisibles = equipo.jugadores.slice(paginaActual * porPagina, paginaActual * porPagina + porPagina);

  // --- Historial: los partidos que entran; el resto va en "Ver historial completo" ---
  const partidosRef = useRef<HTMLDivElement>(null);
  const altoPartidos = useAltoContenedor(partidosRef);
  const [verTodo, setVerTodo] = useState(false);

  const totalPartidos = equipo.historial.length;
  const entran = (alturaUtil: number) =>
    Math.max(1, Math.floor((alturaUtil + PARTIDOS_GAP) / (PARTIDO_FILA_ALTO + PARTIDOS_GAP)));
  let partidosVisibles = entran(altoPartidos);
  const hayMas = totalPartidos > partidosVisibles;
  if (hayMas) partidosVisibles = entran(altoPartidos - VER_TODO_ALTO - PARTIDOS_GAP);

  return (
    <section className="paneles" ref={panelesRef} style={{ ["--paneles-alto" as string]: `${alto}px` }}>
      <section className="panel">
        <div className="panel__header">
          <h3 className="panel__title panel__title--center">Historial de partidos</h3>
        </div>

        {streak.length > 0 && (
          <div className="streak">
            <span className="streak__label">Racha actual:</span>
            <ul className="streak__dots">
              {streak.map((resultado, idx) => (
                <li
                  key={idx}
                  className={`streak__dot streak__dot--${resultado.toLowerCase()}`}
                  title={resultLabel[resultado]}
                />
              ))}
            </ul>
            <span className="streak__window">Ultimos 30 dias</span>
          </div>
        )}

        <div className="matches" ref={partidosRef}>
          {totalPartidos === 0 && <p className="equipo-detalle__estado">Este equipo todavía no jugó partidos.</p>}
          {equipo.historial.slice(0, partidosVisibles).map((m, idx) => (
            <PartidoFila key={m.idPartido ?? idx} nombreEquipo={equipo.nombre} m={m} />
          ))}
          {hayMas && (
            <button type="button" className="ver-historial" onClick={() => setVerTodo(true)}>
              Ver historial completo ({totalPartidos})
            </button>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel__header">
          <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" width={27} height={27} />
          <h3 className="panel__title">Jugadores</h3>
          <span className="panel__count">
            {equipo.jugadoresCant}/{equipo.cupoMaximo}
          </span>
        </div>

        <div className="jugadores" ref={jugadoresRef}>
          {jugadoresVisibles.map((p) => (
            <div className="jugador-row" key={p.id}>
              <span className="jugador-avatar">
                {p.fotoPerfil ? <img src={p.fotoPerfil} alt={p.nombre} /> : getInitials(p.nombre)}
              </span>
              <span className="jugador-nombre">
                {p.nombre}
                {p.esCapitan && (
                  <span className="jugador-captain" title="Capitan">
                    C
                  </span>
                )}
              </span>
              <span className="jugador-posicion">{p.posicion ?? "-"}</span>
            </div>
          ))}

          {totalPaginas > 1 && (
            <div className="pager" role="navigation" aria-label="Paginación de jugadores">
              <button
                type="button"
                className="pager__btn"
                onClick={() => setPaginaJugadores(Math.max(0, paginaActual - 1))}
                disabled={paginaActual === 0}
                aria-label="Página anterior"
              >
                ‹
              </button>
              <span className="pager__info">
                {paginaActual + 1} / {totalPaginas}
              </span>
              <button
                type="button"
                className="pager__btn"
                onClick={() => setPaginaJugadores(Math.min(totalPaginas - 1, paginaActual + 1))}
                disabled={paginaActual >= totalPaginas - 1}
                aria-label="Página siguiente"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </section>

      {verTodo && <HistorialCompletoModal equipo={equipo} onClose={() => setVerTodo(false)} />}
    </section>
  );
};

// Esqueleto de carga: misma estructura y mismo alto que la vista real, para que no salte
const EquipoSkeleton = () => {
  const panelesRef = useRef<HTMLElement>(null);
  const alto = useAltoPaneles(panelesRef);

  return (
    <>
      <section className="seccion-perfil" aria-busy="true" aria-label="Cargando equipo">
        <div className="equipo-card">
          <div className="equipo-card__body">
            <div className="eq-skel eq-skel--crest" />
            <div className="equipo-card__main eq-skel__col">
              <div className="eq-skel eq-skel--titulo" />
              <div className="eq-skel eq-skel--linea" style={{ width: "70%" }} />
              <div className="eq-skel eq-skel--linea" style={{ width: "45%" }} />
            </div>
            <div className="eq-skel eq-skel--boton" />
          </div>
        </div>
      </section>

      <section className="paneles" ref={panelesRef} style={{ ["--paneles-alto" as string]: `${alto}px` }}>
        <section className="panel">
          <div className="eq-skel eq-skel--panel-titulo" />
          <div className="eq-skel__col eq-skel__col--filas">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="eq-skel eq-skel--fila-partido" />
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="eq-skel eq-skel--panel-titulo" />
          <div className="eq-skel__col eq-skel__col--filas">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="eq-skel__jugador">
                <div className="eq-skel eq-skel--avatar" />
                <div className="eq-skel eq-skel--linea" style={{ width: `${55 + ((i * 13) % 30)}%` }} />
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
};

export default function EquipoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Se recalcula en cada render (no es una constante de módulo), para que si el usuario
  // inicia sesión sin recargar la página, la vista lo detecte igual.
  const usuarioInicioSesion = authService.haySesion();

  const panelesRef = useRef<HTMLElement>(null);
  const altoPaneles = useAltoPaneles(panelesRef);

  const [equipo, setEquipo] = useState<EquipoDetalleDTO | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado de la solicitud: lo manejamos acá para no depender de recargar todo el equipo tras enviarla
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [errorSolicitud, setErrorSolicitud] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let activo = true;
    setCargando(true);
    setError(null);

    equiposService
      .obtenerPorId(id)
      .then((datos) => {
        if (activo) setEquipo(datos);
      })
      .catch((err) => {
        if (activo) setError(err instanceof Error ? err.message : "No se pudo cargar el equipo");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  const handleSolicitar = async () => {
    if (!id) return;

    if (!usuarioInicioSesion) {
      navigate(`/login?redirect=/equipos/${id}`);
      return;
    }

    setEnviandoSolicitud(true);
    setErrorSolicitud(null);
    try {
      await equiposService.solicitarIngreso(id);
      setSolicitudEnviada(true);
    } catch (err) {
      setErrorSolicitud(err instanceof Error ? err.message : "No se pudo enviar la solicitud");
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  if (cargando) {
    return (
      <div className="syncro-scope page">
        <HeaderSegunRol />
        <EquipoSkeleton />
        <Footer />
      </div>
    );
  }

  if (error || !equipo) {
    return (
      <div className="syncro-scope page">
        <HeaderSegunRol />
        <p className="equipo-detalle__estado equipo-detalle__estado--error">
          {error ?? "No encontramos este equipo"}
        </p>
        <Footer />
      </div>
    );
  }

  // Racha: últimos 30 días, orden del más viejo al más nuevo para leerla de izquierda a derecha
  const streak = [...equipo.racha].reverse();

  // Qué muestra el botón, según si hay sesión y el estado del viewer
  const viewer = equipo.viewer;
  let ctaLabel = "Solicitar entrar";
  let ctaDisabled = false;

  if (solicitudEnviada || viewer?.solicitudPendiente) {
    ctaLabel = "Solicitud enviada";
    ctaDisabled = true;
  } else if (viewer?.esMiembro) {
    ctaLabel = "Ya sos parte del equipo";
    ctaDisabled = true;
  } else if (usuarioInicioSesion && viewer && !viewer.puedeSolicitar) {
    ctaLabel = "No podés solicitar entrar";
    ctaDisabled = true;
  } else if (!usuarioInicioSesion) {
    ctaLabel = "Iniciar sesión para solicitar";
  }

  return (
    <div className="syncro-scope page">
      <HeaderSegunRol />
      <section className="seccion-perfil">
        <div className="equipo-card">
          <div className="equipo-card__backdrop" />
          <div className="equipo-card__body">
            <div className="equipo-card__crest">
              {equipo.fotoPerfil ? (
                <img src={equipo.fotoPerfil} alt={equipo.nombre} />
              ) : (
                <ShieldStarIcon size={92} />
              )}
            </div>
            <div className="equipo-card__main">
              <div className="equipo-card__heading-row">
                <h2 className="equipo-card__nombre">{equipo.nombre}</h2>
                <span className="equipo-card__torneos">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/torneos.svg`} alt="" width={27} height={27} />
                  <span>{equipo.puntos}</span>
                </span>
              </div>
              {equipo.descripcion && <p className="equipo-card__descripcion">{equipo.descripcion}</p>}
              <div className="equipo-card__meta">
                <span className="equipo-card__meta-item">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/lugar.svg`} alt="" width={27} height={27} />
                  {equipo.ubicacion}
                </span>
                <span className="equipo-card__meta-item">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/remera-local.svg`} alt="" width={27} height={27} />
                  {generoLabel[equipo.sexo] ?? equipo.sexo}
                </span>
                <button
                  className="button-primary equipo-card__cta"
                  type="button"
                  onClick={handleSolicitar}
                  disabled={ctaDisabled || enviandoSolicitud}
                >
                  {enviandoSolicitud ? "Enviando..." : ctaLabel}
                </button>
              </div>
              {errorSolicitud && <p className="equipo-card__error">{errorSolicitud}</p>}
            </div>
          </div>
        </div>
      </section>

      <PanelesEquipo equipo={equipo} streak={streak} panelesRef={panelesRef} alto={altoPaneles} />
      <Footer />
    </div>
  );
}
