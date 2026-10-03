import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderHost from "../../components/HeaderHost";
import Footer from "../../components/Footer";
import { equiposService, EquipoDetalle as EquipoDetalleDTO, ResultadoPartido } from "../../services/equiposService";
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

export default function EquipoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Se recalcula en cada render (no es una constante de módulo), para que si el usuario
  // inicia sesión sin recargar la página, la vista lo detecte igual.
  const usuarioInicioSesion = authService.haySesion();

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
        {usuarioInicioSesion ? <HeaderHost /> : <Header />}
        <p className="equipo-detalle__estado">Cargando equipo...</p>
        <Footer />
      </div>
    );
  }

  if (error || !equipo) {
    return (
      <div className="syncro-scope page">
        {usuarioInicioSesion ? <HeaderHost /> : <Header />}
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
      {usuarioInicioSesion ? <HeaderHost /> : <Header />}
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

      <section className="paneles">
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

          <div className="matches">
            {equipo.historial.length === 0 && (
              <p className="equipo-detalle__estado">Este equipo todavía no jugó partidos.</p>
            )}
            {equipo.historial.map((m, idx) => (
              <article className="match-row" key={m.idPartido ?? idx}>
                <div className="match-row__equipos">
                  <div className="match-equipo">
                    <ShieldStarIcon size={30} />
                    <span className="match-equipo__nombre">{equipo.nombre}</span>
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
                <span className={`resultado-badge resultado-badge--${m.resultado.toLowerCase()}`}>
                  {resultLabel[m.resultado]}
                </span>
              </article>
            ))}
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
          <div className="jugadores">
            {equipo.jugadores.map((p) => (
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
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
}
