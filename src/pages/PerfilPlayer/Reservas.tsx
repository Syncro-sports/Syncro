import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlayerCard } from "./components/StatCardPlayer";
import ReservaDetalle from "./components/ReservaDetalle";
import { CalendarIcon, ClockIcon } from "./components/icons";
import { usePlayerData } from "./PlayerDataContext";
import "./Reservas.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const Reservas = () => {
  const { reservas, cargando, recargar } = usePlayerData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtro, setFiltro] = useState<"proximas" | "pendientes">("proximas");

  // El detalle se abre en el mismo espacio de la lista (tambien desde el Dashboard: ?reserva=<id>)
  const seleccionadaId = searchParams.get("reserva");
  const seleccionada = reservas.find((r) => r.id === seleccionadaId);

  const pendientes = reservas.filter((r) => r.estado === "pendiente" || r.pagoBadge?.tono === "pendiente");
  const reservasFiltradas = filtro === "proximas" ? reservas : pendientes;

  const abrirDetalle = (id: string) => setSearchParams({ reserva: id });
  const cerrarDetalle = () => setSearchParams({});

  if (seleccionada) {
    return (
      <ReservaDetalle
        reserva={seleccionada}
        onVolver={cerrarDetalle}
        onCancelada={() => {
          cerrarDetalle();
          recargar();
        }}
      />
    );
  }

  return (
    <div className="pj">
      <div className="pj-head">
        <div className="player-reservas__tabs">
          <button
            type="button"
            className={`player-reservas__tab ${filtro === "proximas" ? "is-active" : ""}`}
            onClick={() => setFiltro("proximas")}
          >
            Próximas
            <span className="player-reservas__tab-count">{reservas.length}</span>
          </button>
          <button
            type="button"
            className={`player-reservas__tab ${filtro === "pendientes" ? "is-active" : ""}`}
            onClick={() => setFiltro("pendientes")}
          >
            Pendientes de pago
            <span className="player-reservas__tab-count">{pendientes.length}</span>
          </button>
        </div>

        <Link to="/canchas" className="pj-btn pj-btn--primary pj-btn--sm">
          Reservar una cancha
        </Link>
      </div>

      <div className="player-reservas__list">
        {cargando && <PlayerCard className="player-reservas__vacio">Cargando tus reservas...</PlayerCard>}

        {!cargando && reservasFiltradas.length === 0 && (
          <PlayerCard className="player-reservas__vacio">
            {filtro === "proximas"
              ? "No tenés reservas próximas por el momento."
              : "No tenés reservas pendientes de pago."}
          </PlayerCard>
        )}

        {!cargando &&
          reservasFiltradas.map((reserva) => (
            <PlayerCard className="player-reserva-card" key={reserva.id}>
              <div className="player-reserva-card__imagen-wrap">
                <img src={reserva.imagen} alt="" />
                <span className="player-reserva-card__tag">{reserva.tipo}</span>
              </div>

              <div className="player-reserva-card__nombre">
                <span className="player-reserva-card__complejo">{reserva.complejo}</span>
                {reserva.direccion && (
                  <span className="player-reserva-card__direccion">
                    <img src={`${ICON_BASE}/lugar.svg`} alt="" className="player-reserva-card__direccion-icon" />
                    {reserva.direccion}
                  </span>
                )}
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
                  <img src={`${ICON_BASE}/escudo-green.svg`} alt="" />
                  {reserva.rival}
                </span>
              </div>

              <div className="player-reserva-card__right">
                {reserva.pagoBadge && (
                  <span className={`player-reserva-card__pago player-reserva-card__pago--${reserva.pagoBadge.tono}`}>
                    <i />
                    {reserva.pagoBadge.texto}
                  </span>
                )}
                <button type="button" className="player-reserva-card__btn" onClick={() => abrirDetalle(reserva.id)}>
                  Ver detalles →
                </button>
              </div>
            </PlayerCard>
          ))}
      </div>

      <p className="pj-nota">
        Ordenadas por fecha: la más próxima primero. Podés modificar o cancelar tus reservas hasta 12 hs antes del
        inicio, sin cargo.
      </p>
    </div>
  );
};

export default Reservas;
