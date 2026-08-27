import { useState } from "react";
import { ComplejoCancha } from "../canchasData";
import {
  CalendarIcon,
  CardIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  DepositBagIcon,
  ExternalLinkIcon,
  LockIcon,
  MapPinIcon,
  NotesIcon,
  PitchIcon,
  ReceiptIcon,
  renderChipIcon,
  ShareIcon,
  StarIcon,
  UserIcon,
} from "./icons";
import "./CanchaReservaModal.css";

interface CanchaReservaModalProps {
  cancha: ComplejoCancha | null;
  turnoInicial?: string | null;
  onClose: () => void;
  onConfirmar: (detalles: {
    canchaId: number;
    nombre: string;
    fecha: string;
    hora: string;
    total: number;
    senia: number;
  }) => void;
}

const formatPrecio = (precio: number) => `$ ${precio.toLocaleString("es-AR")}`;

const DIAS_STRIP = [
  { label: "Hoy", diaNum: "14", mes: "JUL", full: "Hoy, 14 de Julio" },
  { label: "Mar", diaNum: "15", mes: "JUL", full: "Martes, 15 de Julio" },
  { label: "Mié", diaNum: "16", mes: "JUL", full: "Miércoles, 16 de Julio" },
  { label: "Jue", diaNum: "17", mes: "JUL", full: "Jueves, 17 de Julio" },
  { label: "Vie", diaNum: "18", mes: "JUL", full: "Viernes, 18 de Julio" },
  { label: "Sáb", diaNum: "19", mes: "JUL", full: "Sábado, 19 de Julio" },
  { label: "Dom", diaNum: "20", mes: "JUL", full: "Domingo, 20 de Julio" },
];

const TODOS_LOS_TURNOS = [
  { hora: "08:00", disponible: true },
  { hora: "09:00", disponible: true },
  { hora: "10:00", disponible: true },
  { hora: "11:00", disponible: true },
  { hora: "12:00", disponible: false },
  { hora: "13:00", disponible: false },
  { hora: "14:00", disponible: true },
  { hora: "15:00", disponible: true },
  { hora: "16:00", disponible: true },
  { hora: "17:00", disponible: true },
  { hora: "18:00", disponible: true },
  { hora: "19:00", disponible: false },
  { hora: "20:00", disponible: true },
  { hora: "21:00", disponible: true },
  { hora: "22:00", disponible: true },
  { hora: "23:00", disponible: false },
  { hora: "00:00", disponible: false },
  { hora: "01:00", disponible: false },
];

const CanchaReservaModal = ({
  cancha,
  turnoInicial,
  onClose,
  onConfirmar,
}: CanchaReservaModalProps) => {
  if (!cancha) return null;

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const imagenes =
    cancha.imagenes && cancha.imagenes.length > 0
      ? cancha.imagenes
      : [cancha.imagen];

  const [selectedDiaIndex, setSelectedDiaIndex] = useState(0);
  const [selectedTurno, setSelectedTurno] = useState<string>(
    turnoInicial || "18:00"
  );

  const [tipoReserva, setTipoReserva] = useState<"private" | "matchmaking">(
    "private"
  );
  const [metodoPago, setMetodoPago] = useState<"full" | "split">("full");
  const [aceptaPolitica, setAceptaPolitica] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  const basePrice = cancha.precio || 40000;
  const promoDiscount = cancha.descuentoMonto || 8000;
  const finalPrice = Math.max(0, basePrice - promoDiscount);
  const deposit = Math.round(finalPrice * 0.3);
  const estimatedPerPlayer = Math.round(finalPrice / 8);

  const handlePrevImg = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    setCurrentImgIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const handleShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleConfirm = () => {
    setReservaConfirmada(true);
    setTimeout(() => {
      onConfirmar({
        canchaId: cancha.id,
        nombre: cancha.nombre,
        fecha: DIAS_STRIP[selectedDiaIndex].full,
        hora: selectedTurno,
        total: finalPrice,
        senia: deposit,
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="crm-overlay" onClick={onClose}>
      <div
        className="crm-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="crm-close-btn"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <CloseIcon />
        </button>

        {reservaConfirmada ? (
          <div className="crm-success-state">
            <div className="crm-success-icon">
              <CheckIcon />
            </div>
            <h2>¡Reserva Confirmada!</h2>
            <p>
              Tu turno para <strong>{cancha.nombre}</strong> el{" "}
              <strong>{DIAS_STRIP[selectedDiaIndex].full}</strong> a las{" "}
              <strong>{selectedTurno} hs</strong> fue registrado exitosamente.
            </p>
          </div>
        ) : (
          <div className="crm-layout">
            <div className="crm-col-left">
              <div className="crm-header">
                <div className="crm-title-row">
                  <h1 className="crm-title">{cancha.nombre}</h1>
                  <div className="crm-rating-badge">
                    <span>{cancha.rating.toFixed(1)}</span>
                    <StarIcon filled />
                  </div>
                  <span className="crm-reviews">
                    ({cancha.reviewsCount || 128} opiniones)
                  </span>
                </div>

                <div className="crm-location-row">
                  <div className="crm-location-text">
                    <MapPinIcon />
                    <span>{cancha.direccion}</span>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="crm-maps-btn"
                  >
                    <span>Ver en Google Maps</span>
                    <ExternalLinkIcon />
                  </a>
                </div>
              </div>

              <div className="crm-gallery">
                <img
                  src={imagenes[currentImgIndex]}
                  alt={`Foto de ${cancha.nombre}`}
                  className="crm-gallery-img"
                />
                <button
                  type="button"
                  className="crm-gallery-arrow crm-gallery-arrow--left"
                  onClick={handlePrevImg}
                  aria-label="Foto anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="crm-gallery-arrow crm-gallery-arrow--right"
                  onClick={handleNextImg}
                  aria-label="Foto siguiente"
                >
                  ›
                </button>
                <div className="crm-gallery-dots">
                  {imagenes.map((_, i) => (
                    <span
                      key={i}
                      className={`crm-gallery-dot ${
                        i === currentImgIndex ? "crm-gallery-dot--active" : ""
                      }`}
                      onClick={() => setCurrentImgIndex(i)}
                    />
                  ))}
                </div>
              </div>

              <div className="crm-section">
                <div className="crm-section-header">
                  <CalendarIcon />
                  <h3>Fechas y horarios disponibles</h3>
                </div>

                <div className="crm-dates-strip">
                  {DIAS_STRIP.map((dia, idx) => {
                    const isSelected = selectedDiaIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`crm-date-card ${
                          isSelected ? "crm-date-card--selected" : ""
                        }`}
                        onClick={() => setSelectedDiaIndex(idx)}
                      >
                        <span className="crm-date-label">{dia.label}</span>
                        <span className="crm-date-num">{dia.diaNum}</span>
                        <span className="crm-date-month">{dia.mes}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="crm-date-arrow-btn"
                    aria-label="Ver más fechas"
                  >
                    ›
                  </button>
                </div>

                <div className="crm-time-grid">
                  {TODOS_LOS_TURNOS.map((turno) => {
                    const isSelected = selectedTurno === turno.hora;
                    if (!turno.disponible) {
                      return (
                        <div
                          key={turno.hora}
                          className="crm-time-pill crm-time-pill--disabled"
                        >
                          {turno.hora}
                        </div>
                      );
                    }
                    return (
                      <button
                        key={turno.hora}
                        type="button"
                        className={`crm-time-pill crm-time-pill--available ${
                          isSelected ? "crm-time-pill--selected" : ""
                        }`}
                        onClick={() => setSelectedTurno(turno.hora)}
                      >
                        {turno.hora}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="crm-section">
                <div className="crm-section-header">
                  <PitchIcon />
                  <h3>Detalles de la Cancha</h3>
                </div>
                <div className="crm-chips-grid">
                  {cancha.servicios.map((srv, index) => (
                    <span key={index} className="crm-chip">
                      <span className="crm-chip__icon">{renderChipIcon(srv)}</span>
                      <span>{srv}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="crm-section">
                <div className="crm-section-header">
                  <NotesIcon />
                  <h3>Notas del Complejo</h3>
                </div>
                <div className="crm-notes-box">
                  <p>{cancha.ownerNotes}</p>
                </div>
              </div>

              <div className="crm-section">
                <div className="crm-section-header">
                  <StarIcon filled={false} />
                  <h3>Destacados del Complejo</h3>
                </div>
                <div className="crm-highlights-grid">
                  {cancha.highlights.map((hl, index) => (
                    <span key={index} className="crm-highlight-tag">
                      <span className="crm-highlight-tag__icon">{renderChipIcon(hl)}</span>
                      <span>{hl}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="crm-col-right">
              <div className="crm-summary-card">
                <div className="crm-summary-header">
                  <ReceiptIcon />
                  <h4>Resumen de la Reserva</h4>
                </div>

                <div className="crm-summary-row">
                  <span>Precio Base (2 horas)</span>
                  <strong>{formatPrecio(basePrice)}</strong>
                </div>

                {promoDiscount > 0 && (
                  <div className="crm-summary-row crm-summary-row--discount">
                    <span>Descuento Promoción</span>
                    <strong>- {formatPrecio(promoDiscount)}</strong>
                  </div>
                )}

                <div className="crm-summary-divider" />

                <div className="crm-summary-row crm-summary-row--final">
                  <span>Precio Final</span>
                  <strong className="crm-final-price-tag">
                    {formatPrecio(finalPrice)}
                  </strong>
                </div>

                <div className="crm-summary-sub">
                  <span>
                    Precio estimado por jugador <span className="crm-info-icon">ⓘ</span>
                  </span>
                  <span>{formatPrecio(estimatedPerPlayer)}</span>
                </div>
              </div>

              <div className="crm-panel-section">
                <div className="crm-panel-header">
                  <UserIcon />
                  <h5>Tipo de Reserva</h5>
                </div>

                <div className="crm-radio-options">
                  <div
                    className={`crm-radio-card ${
                      tipoReserva === "private" ? "crm-radio-card--selected" : ""
                    }`}
                    onClick={() => setTipoReserva("private")}
                  >
                    <span className="crm-custom-radio">
                      <span className="crm-custom-radio__inner" />
                    </span>
                    <div className="crm-radio-card__body">
                      <strong>Partido Privado</strong>
                      <p>Alquilá la cancha completa para tu equipo.</p>
                    </div>
                  </div>

                  <div
                    className={`crm-radio-card ${
                      tipoReserva === "matchmaking"
                        ? "crm-radio-card--selected"
                        : ""
                    }`}
                    onClick={() => setTipoReserva("matchmaking")}
                  >
                    <span className="crm-custom-radio">
                      <span className="crm-custom-radio__inner" />
                    </span>
                    <div className="crm-radio-card__body">
                      <strong>Matchmaking</strong>
                      <p>Te encontramos rival o jugadores para completar.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="crm-panel-section">
                <div className="crm-panel-header">
                  <DepositBagIcon />
                  <h5>Seña Requerida</h5>
                </div>
                <div className="crm-deposit-box">
                  <span>30% de Seña</span>
                  <strong>{formatPrecio(deposit)}</strong>
                </div>
              </div>

              <div className="crm-panel-section">
                <div className="crm-panel-header">
                  <CardIcon />
                  <h5>Método de Pago</h5>
                </div>

                <div className="crm-radio-options">
                  <div
                    className={`crm-radio-card ${
                      metodoPago === "full" ? "crm-radio-card--selected" : ""
                    }`}
                    onClick={() => setMetodoPago("full")}
                  >
                    <span className="crm-custom-radio">
                      <span className="crm-custom-radio__inner" />
                    </span>
                    <div className="crm-radio-card__body">
                      <strong>Pago Total</strong>
                      <p>Pagá el total ahora y asegurá tu turno al instante.</p>
                    </div>
                  </div>

                  <div
                    className={`crm-radio-card ${
                      metodoPago === "split" ? "crm-radio-card--selected" : ""
                    }`}
                    onClick={() => setMetodoPago("split")}
                  >
                    <span className="crm-custom-radio">
                      <span className="crm-custom-radio__inner" />
                    </span>
                    <div className="crm-radio-card__body">
                      <strong>Pago Dividido</strong>
                      <p>Dividí el pago entre los integrantes de tu equipo.</p>
                    </div>
                  </div>
                </div>

                <div className="crm-notice-box">
                  <ClockIcon />
                  <p>
                    Tus compañeros tienen hasta 12 horas para abonar su parte.
                    De lo contrario, la reserva se cancelará automáticamente.
                  </p>
                </div>
              </div>

              <div className="crm-actions-group">
                <button
                  type="button"
                  className="crm-btn-confirm"
                  onClick={handleConfirm}
                  disabled={!aceptaPolitica}
                >
                  <span>Confirmar y Pagar</span>
                  <LockIcon />
                </button>

                <button
                  type="button"
                  className="crm-btn-cancel"
                  onClick={onClose}
                >
                  Cancelar
                </button>

                <label className="crm-policy-check">
                  <input
                    type="checkbox"
                    checked={aceptaPolitica}
                    onChange={(e) => setAceptaPolitica(e.target.checked)}
                  />
                  <span>
                    Acepto las{" "}
                    <a href="#cancellation" onClick={(e) => e.preventDefault()}>
                      políticas de cancelación
                    </a>
                    .
                  </span>
                </label>

                <button
                  type="button"
                  className="crm-share-link"
                  onClick={handleShareLink}
                >
                  <ShareIcon />
                  <span>
                    {copiedLink ? "¡Enlace copiado al portapapeles!" : "Compartir enlace de reserva"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanchaReservaModal;
