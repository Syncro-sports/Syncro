import { useState } from "react";
import { Link } from "react-router-dom";
import { PlayerCard } from "./components/StatCardPlayer";
import { CalendarIcon, ClockIcon, BallIcon } from "./components/icons";
import { datosReservas } from "./reservasData";
import "./Reservas.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const Reservas = () => {
  const [filtro, setFiltro] = useState<"confirmada" | "pendiente">("confirmada");

  const confirmadas = datosReservas.reservas.filter((r) => r.estado === "confirmada");
  const pendientes = datosReservas.reservas.filter((r) => r.estado === "pendiente");
  const reservasFiltradas = filtro === "confirmada" ? confirmadas : pendientes;

  return (
    <div className="player-reservas">
      <div className="player-reservas__title-row">
        <h1>Mis reservas</h1>
      </div>

      <div className="player-reservas__toolbar">
        <div className="player-reservas__tabs">
          <button
            type="button"
            className={`player-reservas__tab ${filtro === "confirmada" ? "is-active" : ""}`}
            onClick={() => setFiltro("confirmada")}
          >
            Confirmadas
            <span className="player-reservas__tab-count">{confirmadas.length}</span>
          </button>
          <button
            type="button"
            className={`player-reservas__tab ${filtro === "pendiente" ? "is-active" : ""}`}
            onClick={() => setFiltro("pendiente")}
          >
            Pendientes
            <span className="player-reservas__tab-count">{pendientes.length}</span>
          </button>
        </div>

        <button type="button" className="player-reservas__calendar-btn">
          <CalendarIcon />
          Añadir al calendario
        </button>
      </div>

      <div className="player-reservas__layout">
        <div className="player-reservas__list">
          {reservasFiltradas.length === 0 && (
            <PlayerCard className="player-reservas__vacio">
              No tenés reservas {filtro === "confirmada" ? "confirmadas" : "pendientes"} por el momento.
            </PlayerCard>
          )}

          {reservasFiltradas.map((reserva) => (
            <PlayerCard className="player-reserva-card" key={reserva.id}>
              <div className="player-reserva-card__imagen-wrap">
                <img src={reserva.imagen} alt="" />
                <span className="player-reserva-card__tag">{reserva.tipo}</span>
              </div>

              <div className="player-reserva-card__nombre">
                <span className="player-reserva-card__complejo">{reserva.complejo}</span>
                <span className="player-reserva-card__direccion">
                  <img src={`${ICON_BASE}/lugar.svg`} alt="" className="player-reserva-card__direccion-icon" />
                  {reserva.direccion}
                </span>
              </div>

              <div className="player-reserva-card__info">
                <span className="player-reserva-card__row">
                  <CalendarIcon />
                  {reserva.fecha}
                </span>
                <span className="player-reserva-card__row">
                  <ClockIcon />
                  {reserva.hora}
                </span>
                <span className="player-reserva-card__row">
                  <BallIcon />
                  {reserva.deporte}
                </span>
                <span className="player-reserva-card__row">
                  <img src={`${ICON_BASE}/escudo-green.svg`} alt="" />
                  {reserva.rival}
                </span>
              </div>

              <button type="button" className="player-reserva-card__btn">
                Ver detalles →
              </button>
            </PlayerCard>
          ))}

          {reservasFiltradas.length > 0 && (
            <Link to="/perfil-jugador/historial" className="player-reservas__ver-todas">
              Ver todas las reservas →
            </Link>
          )}
        </div>

        <div>Sidebar (próximo paso)</div>
      </div>
    </div>
  );
};

export default Reservas;