import { useState } from "react";
import { ComplejoCancha } from "../canchasData";
import { StarIcon } from "./icons";
import "./CanchaCard.css";

interface CanchaCardProps {
  cancha: ComplejoCancha;
  onReservar: (cancha: ComplejoCancha, turnoSeleccionado?: string) => void;
  onVerDetalle: (cancha: ComplejoCancha) => void;
}

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const CanchaCard = ({ cancha, onReservar, onVerDetalle }: CanchaCardProps) => {
  const [selectedTurno, setSelectedTurno] = useState<string | null>(
    cancha.turnosHoy[0] || "14:00"
  );

  const handleTurnoClick = (e: React.MouseEvent, turno: string) => {
    e.stopPropagation();
    setSelectedTurno(turno === selectedTurno ? null : turno);
  };

  const handleReservarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReservar(cancha, selectedTurno || cancha.turnosHoy[0]);
  };

  const handleVerTodoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVerDetalle(cancha);
  };

  return (
    <article className="cancha-card" onClick={() => onVerDetalle(cancha)}>
      <div className="cancha-card__image-container">
        <img
          src={cancha.imagen}
          alt={`Cancha de ${cancha.nombre}`}
          className="cancha-card__image"
          loading="lazy"
        />

        <div className="cancha-card__badges-left">
          {cancha.descuento && (
            <span className="cancha-card__badge-tag">{cancha.descuento}</span>
          )}
          <span className="cancha-card__badge-tag">Ranking</span>
        </div>

        <div className="cancha-card__badge-rating">
          <StarIcon filled />
          <span>{cancha.rating.toFixed(1).replace(".", ",")}</span>
        </div>
      </div>

      <div className="cancha-card__body">
        <div className="cancha-card__info-header">
          <h3 className="cancha-card__title">{cancha.nombre}</h3>
          <p className="cancha-card__location">
            <img
              src={`${import.meta.env.BASE_URL}assets/icons/lugar.svg`}
              alt=""
              className="cancha-card__location-icon"
            />
            <span>
              {cancha.localidad} ({cancha.distanciaLabel})
            </span>
          </p>
        </div>

        <div className="cancha-card__divider" />

        <div className="cancha-card__price-box">
          <span className="cancha-card__price-val">
            {formatPrecio(cancha.precio)}
          </span>
          <img
            src={`${import.meta.env.BASE_URL}assets/icons/billetera.svg`}
            alt=""
            className="cancha-card__wallet-img"
          />
        </div>

        <div className="cancha-card__divider" />

        <div className="cancha-card__turnos-section">
          <div className="cancha-card__turnos-header">
            <span className="cancha-card__turnos-label">Turnos hoy</span>
            <button
              type="button"
              className="cancha-card__ver-todo"
              onClick={handleVerTodoClick}
            >
              Ver Todo
            </button>
          </div>

          <div className="cancha-card__turnos-row">
            {cancha.turnosHoy.slice(0, 4).map((turno) => {
              const isSelected = selectedTurno === turno;
              return (
                <button
                  key={turno}
                  type="button"
                  className={`cancha-card__turno-btn ${
                    isSelected ? "cancha-card__turno-btn--selected" : ""
                  }`}
                  onClick={(e) => handleTurnoClick(e, turno)}
                >
                  {turno}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="cancha-card__btn-reservar"
          onClick={handleReservarClick}
        >
          RESERVAR
        </button>
      </div>
    </article>
  );
};

export default CanchaCard;
