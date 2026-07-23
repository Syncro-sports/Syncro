import { useState } from "react";
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
import "./PartidoDetalleModal.css";

interface PartidoDetalleModalProps {
  partido: Partido | null;
  onClose: () => void;
}

type MetodoPago = "total" | "split";

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const PartidoDetalleModal = ({ partido, onClose }: PartidoDetalleModalProps) => {
  const [cerrarSala, setCerrarSala] = useState(partido?.estado === "Cerrado");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("total");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  if (!partido) return null;

  const salaCerrada = cerrarSala;
  const tieneRival = Boolean(partido.equipoVisitanteNombre);

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
                  Cerrar sala
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
                    <div className="modal-team__shield modal-team__shield--empty">
                      {tieneRival ? partido.equipoVisitanteNombre?.charAt(0) : "?"}
                    </div>
                    <div>
                      <div className="modal-team__name modal-team__name--muted">
                        {tieneRival ? partido.equipoVisitanteNombre : "A la espera de rival"}
                      </div>
                      <p className="modal-team__meta">
                        {tieneRival ? "Equipo confirmado" : "Un equipo se unirá pronto"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-share">
              <span>
                <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />
                Publicá este partido para que otros equipos puedan unirse
              </span>
              <button type="button" className="modal-share__btn">
                Compartir partido
                <img src={`${import.meta.env.BASE_URL}assets/icons/compartir.svg`} alt="" />
              </button>
            </div>

            <div className="modal-section">
              <span className="modal-section__title">
                <img src={`${import.meta.env.BASE_URL}assets/icons/estadistica.svg`} alt="" />
                Información del rival
              </span>

              <div className="modal-rival">
                <div className="modal-rival__team">
                  <div className="modal-team__shield modal-team__shield--empty">{tieneRival ? partido.equipoVisitanteNombre?.charAt(0) : "?"}</div>
                  <div>
                    <strong>{tieneRival ? partido.equipoVisitanteNombre : "Sin rival confirmado"}</strong>
                    <p>
                      {tieneRival
                        ? "Equipo confirmado para este partido."
                        : "Cuando un equipo se una, podrás ver su información, ranking y estadísticas."}
                    </p>
                  </div>
                </div>

                <div className="modal-rival__stat">
                  <span>Ranking estimado</span>
                  <strong>{partido.rankingEstimado ? `${partido.rankingEstimado} pts` : "-- pts"}</strong>
                </div>
                <div className="modal-rival__stat">
                  <span>Partidos jugados</span>
                  <strong>{partido.partidosJugados ?? "--"}</strong>
                </div>
                <div className="modal-rival__stat">
                  <span>Nivel</span>
                  <strong>{partido.nivelRival ?? "--"}</strong>
                </div>
              </div>
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
                <span>Total a pagar</span>
                <strong>{formatPrecio(partido.precio)}</strong>
              </div>

              <div className="modal-payment__row">
                <span>Entrada por jugador</span>
                <strong>{formatPrecio(partido.entradaJugador)} c/u</strong>
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

            <div className="modal-payment__block">
              <span className="modal-section__title">
                <img src={`${import.meta.env.BASE_URL}assets/icons/informacion.svg`} alt="" />
                Información importante
              </span>

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
              <label className="modal-terms">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(event) => setAceptaTerminos(event.target.checked)}
              />
              Acepto los <a href="#">términos y condiciones</a>
            </label>
            <button type="button" className="modal-cta" disabled={!aceptaTerminos}>
              <LockIcon />
              Unirme y pagar {formatPrecio(partido.entradaJugador)}
            </button>
            <button type="button" className="modal-cancelar" onClick={onClose}>
              Cancelar
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PartidoDetalleModal;
