import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Partido, esPartidoMock } from "../partidosData";
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
import { equiposService, MiEquipo } from "../../../services/equiposService";
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
  const [misEquipos, setMisEquipos] = useState<MiEquipo[]>([]);
  const [equipoElegidoId, setEquipoElegidoId] = useState("");
  const [fotoLocalRota, setFotoLocalRota] = useState(false);

  useEffect(() => {
    setFotoLocalRota(false);
  }, [partido]);

  useEffect(() => {
    if (!haySesion || !partido) return;
    setEquipoElegidoId("");
    equiposService.obtenerMisEquipos().then(res => setMisEquipos(res.equipos));
  }, [haySesion, partido]);

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
      // Se valida antes de unirse para no dejar al usuario anotado sin poder pagar.
      if (metodoPago !== "total") {
        // El pago por entrada individual (split) usa otro endpoint del backend
        // (/entradas/:id/adquirir) y todavia no esta conectado.
        throw new Error("El pago por jugador todavía no está disponible. Elegí pagar el total.");
      }
      const inscripcion = await partidosService.unirse(partido!.id, equipoElegidoId);

      // Los importes que se muestran en este modal son solo informativos: al
      // backend le mandamos unicamente el id de la reserva y el tipo de pago,
      // y es el quien calcula cuanto se cobra.
      // TODO(back): confirmar que "unirse" devuelve el reservaId a pagar.
      const reservaId: string | undefined = inscripcion?.reservaId;
      if (!reservaId) {
        throw new Error("No se pudo obtener la reserva a pagar. Intentá de nuevo más tarde.");
      }
      const initPoint = await pagosService.crearPreferencia(reservaId, "total");

      // Redirigir al usuario al sandbox de MercadoPago
      window.location.href = initPoint;
      
    } catch (err: any) {
      setErrorMsg(err.message || "Error al intentar unirse o pagar el partido");
      setIsJoining(false);
    }
  };

  if (!partido) return null;

  // TODO(back): el partido real todavia no trae equipoLocalId. Mientras tanto,
  // usamos el nombre como respaldo para que el boton siempre lleve al detalle
  // (hoy el detalle de equipos esta en modo mock y acepta cualquier valor).
  const handleVerEquipoLocal = () => {
    navigate(`/equipos/${encodeURIComponent(partido.equipoLocalId ?? partido.equipoLocalNombre)}`);
  };

  const salaCerrada = cerrarSala;

  // Estos importes son solo informativos: el cobro real lo calcula el backend
  // a partir de la reserva (ver pagosService).
  // El costo de la cancha es el total del turno: se le descuenta la promocion,
  // lo que queda se reparte a partes iguales entre los dos equipos, y lo que le
  // toca a cada equipo se divide entre sus jugadores.
  const totalConPromocion = partido.costoCancha - partido.promocion;
  const totalAPagarPorEquipo = totalConPromocion / 2;
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
                    <div
                      className={`modal-team__shield modal-team__shield--local ${
                        partido.equipoLocalFoto && !fotoLocalRota ? "modal-team__shield--foto" : ""
                      }`}
                    >
                      {partido.equipoLocalFoto && !fotoLocalRota ? (
                        <img
                          src={partido.equipoLocalFoto}
                          alt={partido.equipoLocalNombre}
                          onError={() => setFotoLocalRota(true)}
                        />
                      ) : (
                        <StarIcon filled />
                      )}
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
                  <button type="button" className="modal-team__cta" onClick={handleVerEquipoLocal}>
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
                          <option value="">
                            {misEquipos.length === 0 ? "No tenés equipos para postularte" : "Elegí un equipo…"}
                          </option>
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
                  <img src={`${import.meta.env.BASE_URL}assets/icons/torneos.svg`} alt="" />
                  <div>
                    <span>Tipo de partido</span>
                    <strong>{partido.tipo}</strong>
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
                <span>Costo total de la cancha ({partido.duracion})</span>
                <strong>{formatPrecio(partido.costoCancha)}</strong>
              </div>

              {partido.promocion > 0 && (
                <div className="modal-payment__row modal-payment__row--promo">
                  <span>Promoción</span>
                  <strong>- {formatPrecio(partido.promocion)}</strong>
                </div>
              )}

              <div className="modal-payment__divider" />

              <div className="modal-payment__total">
                <span>Total a pagar por tu equipo</span>
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
