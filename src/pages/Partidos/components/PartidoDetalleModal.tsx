import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Partido } from "../partidosData";
import {
  CalendarIcon,
  CardIcon,
  CheckIcon,
  ClockIcon,
  ExternalLinkIcon,
  HouseIcon,
  LockIcon,
  ShieldCheckIcon,
  StarIcon,
} from "./icons";
import { partidosService } from "../../../services/partidosService";
import { pagosService } from "../../../services/pagosService";
import { authService } from "../../../services/authService";
import { equiposService, MiEquipoResumen } from "../../../services/equiposService";
import "./PartidoDetalleModal.css";

interface PartidoDetalleModalProps {
  partido: Partido | null;
  onClose: () => void;
}

type MetodoPago = "total" | "split";

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const PartidoDetalleModal = ({ partido, onClose }: PartidoDetalleModalProps) => {
  const navigate = useNavigate();
  const haySesion = authService.haySesion();
  const [cerrarSala, setCerrarSala] = useState(partido?.estado === "Cerrado");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("total");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [aceptaInfo, setAceptaInfo] = useState(false);
  const [infoAbierta, setInfoAbierta] = useState(false);
  const [misEquipos, setMisEquipos] = useState<MiEquipoResumen[]>([]);
  const [equipoElegidoId, setEquipoElegidoId] = useState("");

  useEffect(() => {
    if (!haySesion) return;
    equiposService.obtenerMisEquipos().then(setMisEquipos);
  }, [haySesion]);

  const handleCompartir = async () => {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}partidos?partido=${partido!.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2000);
    } catch {
      window.prompt("Copiá el link del partido:", url);
    }
  };

  const handleUnirse = async () => {
    try {
      setIsJoining(true);
      setErrorMsg("");
      await partidosService.unirse(partido!.id, equipoElegidoId);
      
      // Una vez anotado, creamos la preferencia de pago en MercadoPago
      // OJO: este precio se calcula en el frontend, asi que es manipulable
      // desde el navegador. El backend deberia recalcularlo/validarlo con el
      // partidoId antes de cobrar, no confiar en lo que mande el cliente.
      const titulo = `Inscripción al partido: ${partido?.canchaNombre}`;
      const precio = (metodoPago === "total" ? totalAPagarPorEquipo : entradaJugadorCalculada) || 3000;
      const initPoint = await pagosService.crearPreferencia(titulo, precio);
      
      // Redirigir al usuario al sandbox de MercadoPago
      window.location.href = initPoint;
      
    } catch (err: any) {
      setErrorMsg(err.message || "Error al intentar unirse o pagar el partido");
      setIsJoining(false);
    }
  };

  if (!partido) return null;

  const salaCerrada = cerrarSala;

  // El precio de la cancha es el total que pagan entre los dos equipos, asi
  // que a cada equipo le corresponde la mitad de ese costo (no el total).
  const costoCanchaPorEquipo = partido.costoCancha / 2;
  const promocionPorEquipo = partido.promocion / 2;
  const totalAPagarPorEquipo = partido.precio / 2;

  // La entrada por jugador no deberia ser un valor fijo que manda el backend:
  // se calcula repartiendo lo que le toca pagar a este equipo entre sus jugadores.
  const jugadoresPorEquipo = Math.max(1, Math.round(partido.maxJugadores / 2));
  const entradaJugadorCalculada = Math.round(totalAPagarPorEquipo / jugadoresPorEquipo / 50) * 50;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(event) => event.stopPropagation()}>
        <div className="modal-scroll">
          <div className="modal-main">
            <div className="modal-header">
              <h2>Detalles del partido</h2>
              <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
                ×
              </button>
            </div>

            <div className="modal-topinfo">
              <div className="modal-topinfo__item">
                <span className="modal-topinfo__label">
                  <CalendarIcon />
                  Fecha y hora
                </span>
                <p className="modal-topinfo__value">{partido.fechaCompleta}</p>
                <p className="modal-topinfo__hora">{partido.hora}</p>
              </div>

              <div className="modal-topinfo__item">
                <span className="modal-topinfo__label">
                  <HouseIcon />
                  Cancha
                </span>
                <p className="modal-topinfo__value">{partido.canchaNombre}</p>
                <p className="modal-topinfo__sub">{partido.canchaTipo}</p>
                <p className="modal-topinfo__sub">{partido.canchaSuperficie}</p>
              </div>

              <div className="modal-topinfo__item">
                <span className="modal-topinfo__label">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/lugar.svg`} alt="" />
                  Ubicación
                </span>
                <p className="modal-topinfo__sub">{partido.direccion}</p>
                <a
                  className="modal-maps-link"
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en maps <ExternalLinkIcon />
                </a>
              </div>

              <div className="modal-topinfo__item">
                <span className="modal-topinfo__label">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/clima.svg`} alt="" />
                  Clima
                </span>
                <p className="modal-topinfo__temp">{partido.climaTemp}°</p>
                <p className="modal-topinfo__sub">{partido.climaDescripcion}</p>
                <p className="modal-topinfo__sub">Humedad {partido.climaHumedad}%</p>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section__header">
                <span className="modal-section__title">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />
                  Alineaciones
                </span>
                <label className="modal-toggle">
                  {salaCerrada ? "Abrir sala" : "Cerrar sala"}
                  <button
                    type="button"
                    className={`modal-toggle__switch ${salaCerrada ? "is-active" : ""}`}
                    onClick={() => setCerrarSala((prev) => !prev)}
                    aria-pressed={salaCerrada}
                  >
                    <span className="modal-toggle__thumb" />
                  </button>
                </label>
              </div>

              <div className="modal-teams">
                <div className="modal-team modal-team--local">
                  <span className="modal-team__tag">LOCAL</span>
                  <div className="modal-team__body">
                    <div className="modal-team__shield modal-team__shield--local">
                      <StarIcon filled />
                    </div>
                    <div>
                      <div className="modal-team__name">
                        {partido.equipoLocalNombre}
                        <span className="modal-team__check">
                          <CheckIcon />
                        </span>
                      </div>
                      <p className="modal-team__meta">Tu equipo</p>
                    </div>
                  </div>
                  <button type="button" className="modal-team__cta">
                    Ver perfil del equipo <span>›</span>
                  </button>
                </div>

                <div className="modal-vs-circle">VS</div>

                <div className="modal-team modal-team--rival">
                  <span className="modal-team__tag modal-team__tag--muted">VISITANTE</span>
                  <div className="modal-team__body">
                    <div className="modal-team__shield modal-team__shield--empty">?</div>
                    {!haySesion ? (
                      <div>
                        <div className="modal-team__name modal-team__name--muted">
                          Iniciá sesión para unirte
                        </div>
                        <button
                          type="button"
                          className="modal-team__cta"
                          onClick={() => navigate("/login")}
                        >
                          Iniciar sesión <span>›</span>
                        </button>
                      </div>
                    ) : (
                      <div className="modal-team__seleccion">
                        <label className="modal-team__meta" htmlFor="modal-equipo-postulante">
                          Postularme con: <span className="modal-terms__obligatorio">*</span>
                        </label>
                        <select
                          id="modal-equipo-postulante"
                          className="modal-team__select"
                          value={equipoElegidoId}
                          onChange={(event) => setEquipoElegidoId(event.target.value)}
                        >
                          <option value="">Elegí un equipo…</option>
                          {misEquipos.map((equipo) => (
                            <option key={equipo.id} value={equipo.id}>
                              {equipo.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-share">
              <span>
                <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />
                Publicá este partido para que otros equipos puedan unirse
              </span>
              <button type="button" className="modal-share__btn" onClick={handleCompartir}>
                {linkCopiado ? "¡Link copiado!" : "Compartir partido"}
                <img src={`${import.meta.env.BASE_URL}assets/icons/compartir.svg`} alt="" />
              </button>
            </div>

            <div className="modal-section modal-section--last">
              <span className="modal-section__title">
                <span className="modal-warning">!</span>
                Detalles adicionales
              </span>

              <div className="modal-extra">
                <div className="modal-extra__item">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/arbitro.svg`} alt="" />
                  <div>
                    <span>Árbitro</span>
                    <strong>{partido.arbitro}</strong>
                  </div>
                </div>
                <div className="modal-extra__item">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/reloj.svg`} alt="" />
                  <div>
                    <span>Duración</span>
                    <strong>{partido.duracion}</strong>
                  </div>
                </div>
                <div className="modal-extra__item">
                  <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />
                  <div>
                    <span>Jugadores</span>
                    <strong>{partido.formato}</strong>
                  </div>
                </div>
                <div className="modal-extra__item">
                  <span className={`modal-extra__estado-dot ${salaCerrada ? "is-cerrado" : "is-abierto"}`} />
                  <div>
                    <span>Estado</span>
                    <strong className={salaCerrada ? "is-cerrado" : "is-abierto"}>
                      {salaCerrada ? "Cerrado" : "Abierto"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="modal-payment">
            <div className="modal-payment__block">
              <span className="modal-section__title">
                <img src={`${import.meta.env.BASE_URL}assets/icons/billetera.svg`} alt="" />
                Resumen de pago
              </span>

              <div className="modal-payment__row">
                <span>Costo total de la cancha (2 hs)</span>
                <strong>{formatPrecio(costoCanchaPorEquipo)}</strong>
              </div>

              {partido.promocion > 0 && (
                <div className="modal-payment__row modal-payment__row--promo">
                  <span>Promoción</span>
                  <strong>- {formatPrecio(promocionPorEquipo)}</strong>
                </div>
              )}

              <div className="modal-payment__divider" />

              <div className="modal-payment__total">
                <span>Total a pagar</span>
                <strong>{formatPrecio(totalAPagarPorEquipo)}</strong>
              </div>

              <div className="modal-payment__row">
                <span>Entrada por jugador</span>
                <strong>{formatPrecio(entradaJugadorCalculada)} c/u</strong>
              </div>
              <span className="modal-payment__tag">Máx. {partido.maxJugadores} jugadores</span>
            </div>

            <div className="modal-payment__block">
              <span className="modal-section__title">
                <CardIcon />
                Método de pago
              </span>

              <div className="modal-metodo">
                <button
                  type="button"
                  className={`modal-metodo__card ${metodoPago === "total" ? "is-active" : ""}`}
                  onClick={() => setMetodoPago("total")}
                >
                  <span className="modal-metodo__radio" />
                  <strong>Pago total</strong>
                  <p>Pagá el total del partido y confirmá tu reserva.</p>
                </button>
                <button
                  type="button"
                  className={`modal-metodo__card ${metodoPago === "split" ? "is-active" : ""}`}
                  onClick={() => setMetodoPago("split")}
                >
                  <span className="modal-metodo__radio" />
                  <strong>Split payment</strong>
                  <p>Cada jugador paga su parte.</p>
                </button>
              </div>
            </div>

            <div className="modal-info-popover-wrapper">
              <label className="modal-terms">
                <input
                  type="checkbox"
                  checked={aceptaInfo}
                  onChange={(event) => setAceptaInfo(event.target.checked)}
                />
                Acepto la{" "}
                <button
                  type="button"
                  className="modal-terms__link"
                  onClick={() => setInfoAbierta((v) => !v)}
                >
                  información importante
                </button>
                <span className="modal-terms__obligatorio">*</span>
              </label>

              {infoAbierta && (
                <div className="modal-info-popover">
                  <div className="modal-info-popover__header">
                    <span>
                      <img src={`${import.meta.env.BASE_URL}assets/icons/informacion.svg`} alt="" />
                      Información importante
                    </span>
                    <button
                      type="button"
                      onClick={() => setInfoAbierta(false)}
                      aria-label="Cerrar"
                    >
                      ×
                    </button>
                  </div>

                  <ul className="modal-info-list">
                    <li>
                      <ShieldCheckIcon />
                      Al unirte al partido, se te cobrará la entrada seleccionada. Si el partido se cancela, se te
                      reembolsará el 100%.
                    </li>
                    <li>
                      <ClockIcon />
                      Cancelación gratuita hasta 12 hs antes del inicio del partido.
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <label className="modal-terms">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(event) => setAceptaTerminos(event.target.checked)}
              />
              Acepto los <a href="#">términos y condiciones</a>
              <span className="modal-terms__obligatorio">*</span>
            </label>
            {errorMsg && <p style={{ color: "red", fontSize: "0.9rem", marginBottom: "10px" }}>{errorMsg}</p>}
            <button
              type="button"
              className="modal-cta"
              disabled={haySesion && (!aceptaTerminos || !aceptaInfo || !equipoElegidoId || isJoining)}
              onClick={haySesion ? handleUnirse : () => navigate("/login")}
            >
              <LockIcon />
              {!haySesion
                ? "Iniciar sesión para unirme"
                : isJoining
                ? "Procesando inscripción..."
                : `Unirme y pagar ${formatPrecio(
                    metodoPago === "total" ? totalAPagarPorEquipo : entradaJugadorCalculada
                  )}`}
            </button>
            <button type="button" className="modal-cancelar" onClick={onClose} disabled={isJoining}>
              Cancelar
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PartidoDetalleModal;
