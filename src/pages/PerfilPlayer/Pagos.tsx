import { useState } from "react";
import { Link } from "react-router-dom";
import { PlayerCard } from "./components/StatCardPlayer";
import { CalendarIcon } from "./components/icons";
import { PAGOS_PENDIENTES, HISTORIAL_PAGOS, RESUMEN_PAGOS } from "./pagosData";
import "./Pagos.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const Pagos = () => {
  return (
    <div className="player-pagos">
      <div className="player-pago__title-row">
        <h1>Pagos</h1>
      </div>
      <div className="player-pagos__layout">
        <div className="player-pagos__main">
          <section className="player-pagos__section">
            <div className="player-pagos__section-title">
              <h2>Pagos pendientes</h2>
              <Link to="#" className="player-pagos__link">
                Ver más →
              </Link>
              {/*<button type="button" className="player-pagos__link-btn">
                Ver más →
              </button>*/}
            </div>

            <div className="player-pagos__list">
              {PAGOS_PENDIENTES.map((item) => (
                <PlayerCard key={item.id} className="card-pago-pendiente">
                  <div className="card-pago-pendiente__img-wrap">
                    <img src={item.imagen} alt={item.complejo} />
                    <span
                      className={`badge badge--${item.tipoTag.toLowerCase()}`}
                    >
                      {item.tipoTag}
                    </span>
                  </div>

                  <div className="card-pago-pendiente__info">
                    <span className="info__row">
                      <CalendarIcon />
                      {item.fecha}
                    </span>
                    <h3 className="info__complejo">{item.complejo}</h3>
                    <span className="info__row">
                      <img
                        src={`${ICON_BASE}/lugar.svg`}
                        alt=""
                        className="info__icon"
                      />
                      {item.ubicacion}
                    </span>
                    <span className="info__row">
                      <img
                        src={`${ICON_BASE}/escudo-green.svg`}
                        alt=""
                        className="info__icon"
                      />
                      {item.rival}
                    </span>
                  </div>

                  <div className="card-pago-pendiente__progreso">
                    <span className="card-pago-pendiente__progreso-label">
                      <img
                        src={`${import.meta.env.BASE_URL}assets/icons/equipos-dashboard.svg`}
                        alt=""
                        className="info__icon"
                      />
                      Pago de equipo
                    </span>
                    <strong>
                      {item.pagados} / {item.totalIntegrantes} Pagado
                    </strong>

                    <div className="card-pago-pendiente__bar">
                      <div
                        className="card-pago-pendiente__bar-fill"
                        style={{
                          width: `${(item.pagados / item.totalIntegrantes) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="card-pago-pendiente__vencimiento">
                      {item.vencimiento}
                    </span>
                  </div>

                  <div className="card-pago-pendiente__monto-wrap">
                    <span className="card-pago-pendiente__monto-label">
                      Tu cantidad
                    </span>
                    <span className="card-pago-pendiente__monto">
                      $
                      {item.montoIndividual.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <button type="button" className="card-pago-pendiente__btn">
                      Ver detalles
                      <img
                        src={`${import.meta.env.BASE_URL}assets/icons/flecha.svg`}
                        alt=""
                        className="player-pagos__link-icon"
                      />
                    </button>
                  </div>
                </PlayerCard>
              ))}
            </div>
          </section>

          <section className="player-pagos__section">
            <div className="player-pagos__section-title">
              <h2>Historial de pagos</h2>
              <Link to="#" className="player-pagos__link">
                Ver historial completo →
              </Link>
            </div>

            <div className="player-pagos__historial-list">
              {HISTORIAL_PAGOS.map((item) => (
                <PlayerCard key={item.id} className="card-historial-item">
                  <img
                    src={item.imagen}
                    alt={item.complejo}
                    className="card-historial-item__img"
                  />

                  <div className="card-historial-item__detalles">
                    <span className="info__row">
                      <CalendarIcon />
                      {item.fecha}
                    </span>
                    <strong>{item.complejo}</strong>
                    {item.rival && (
                      <span className="info__row">
                        <img
                          src={`${ICON_BASE}/escudo-green.svg`}
                          alt=""
                          className="info__icon"
                        />
                        {item.rival}
                      </span>
                    )}
                  </div>

                  <div className="card-historial-item__col">
                    <span className="col-label">Tipo</span>
                    <span className="col-value">{item.tipo}</span>
                  </div>

                  <div className="card-historial-item__col">
                    <span className="col-label">Cantidad</span>
                    <span className="col-value">
                      $
                      {item.monto.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="card-historial-item__col">
                    <span className="col-label">
                      Persona que realizó el pago
                    </span>
                    <span className="col-value">{item.pagador}</span>
                  </div>
                </PlayerCard>
              ))}
            </div>
          </section>
        </div>

        <div className="player-pagos__sidebar">
          <PlayerCard className="sidebar-card">
            <span className="sidebar-card__title">Total disponible</span>
            <strong className="sidebar-card__amount">
              $
              {RESUMEN_PAGOS.totalDisponible.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </PlayerCard>

          <PlayerCard className="sidebar-card">
            <span className="sidebar-card__title">Total pendiente</span>
            <strong className="sidebar-card__amount">
              $
              {RESUMEN_PAGOS.totalPendiente.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </strong>
            <span className="sidebar-card__sub">
              {RESUMEN_PAGOS.cantidadPendientes} pagos
            </span>
          </PlayerCard>

          <PlayerCard className="sidebar-card sidebar-card__summary">
            <h3>
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/pagos.svg`}
                alt=""
                className="info__icon"
              />
              Suma de pagos
            </h3>
            <div className="summary-row">
              <span>Total pagado</span>
              <span className="green">
                $
                {RESUMEN_PAGOS.totalPagado.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="summary-row">
              <span>Pendiente</span>
              <span className="orange">
                $
                {RESUMEN_PAGOS.totalPendiente.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="summary-row">
              <span>Reembolsado</span>
              <span className="green">
                $
                {RESUMEN_PAGOS.reembolsado.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="summary-row">
              <span>Cantidad de pagos</span>
              <span>{RESUMEN_PAGOS.cantidadTotalPagos}</span>
            </div>
          </PlayerCard>

          <PlayerCard className="sidebar-card sidebar-card__help">
            <h3 className="title">¿Necesitas ayuda?</h3>
            <p>
              ¿Tienes problemas realizando un pago? Contacta con nuestro soporte
              técnico y te daremos una solución
            </p>
          </PlayerCard>

          <PlayerCard className="sidebar-card sidebar-card__info">
            <h3 className="title">Pagos de equipo</h3>
            <p>
              Puedes acceder a los montos pagados por equipo y ver quienes
              faltan por pagar accediendo al botón "Ver detalles" en el panel de
              "pagos pendientes", o accediendo a la pestaña "Ver reservas".
            </p>
          </PlayerCard>
        </div>
      </div>
    </div>
  );
};

export default Pagos;
