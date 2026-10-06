import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { reservasService } from "../../../services/reservasService";
import { abrirVentanaPago, irAMercadoPago, TEXTOS_ESPERA } from "../../../services/mercadoPago";
import { canchasService, TurnoDisponible } from "../../../services/canchasService";
import { participantesService } from "../../../services/participantesReserva";
import { ComplejoCancha } from "../canchasData";
import JugadoresReserva, { aParticipantes, seleccionInicial, SeleccionJugadores } from "./JugadoresReserva";
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

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Los próximos 7 días a partir de hoy, para que el selector siempre muestre fechas vigentes.
const generarDias = () => {
  const hoy = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
    const dia = d.getDate();
    const mes = MESES[d.getMonth()];
    return {
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
      label: i === 0 ? "Hoy" : DIAS_CORTOS[d.getDay()],
      diaNum: String(dia),
      mes: mes.slice(0, 3).toUpperCase(),
      full: `${i === 0 ? "Hoy" : DIAS_SEMANA[d.getDay()]}, ${dia} de ${mes}`,
    };
  });
};

const DIAS_STRIP = generarDias();

// Los ids de canchas reales son de Mongo (24 caracteres hexadecimales); los de ejemplo son numeros
const esIdReal = (id: string | number): boolean => /^[0-9a-f]{24}$/i.test(String(id));

// "FUTBOL 7" -> 7 jugadores por equipo. La cancha completa es el doble.
const jugadoresPorEquipo = (tipo: string): number => {
  const n = parseInt(tipo.replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 5;
};

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

  const navigate = useNavigate();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const imagenes =
    cancha.imagenes && cancha.imagenes.length > 0
      ? cancha.imagenes
      : [cancha.imagen];
  // Las flechas y los puntos de la galeria solo aparecen si hay mas de una foto
  const hayVariasFotos = imagenes.length > 1;

  const [selectedDiaIndex, setSelectedDiaIndex] = useState(0);
  const [selectedTurno, setSelectedTurno] = useState<string>(
    turnoInicial || "18:00"
  );

  const [metodoPago, setMetodoPago] = useState<"full" | "split">("full");

  // Horarios reales del dia elegido. Si no se pueden traer (o la cancha es de ejemplo),
  // se usa la grilla de ejemplo.
  const [turnosReales, setTurnosReales] = useState<TurnoDisponible[] | null>(null);
  const [cargandoTurnos, setCargandoTurnos] = useState(false);

  useEffect(() => {
    if (!esIdReal(cancha.id)) {
      setTurnosReales(null);
      return;
    }
    let activo = true;
    setCargandoTurnos(true);
    canchasService
      .disponibilidad(cancha.id, DIAS_STRIP[selectedDiaIndex].iso)
      .then((turnos) => activo && setTurnosReales(turnos))
      .catch(() => activo && setTurnosReales(null))
      .finally(() => activo && setCargandoTurnos(false));
    return () => {
      activo = false;
    };
  }, [cancha.id, selectedDiaIndex]);

  // Los horarios de hoy que ya pasaron no se pueden reservar
  const ahora = new Date();
  const yaPaso = (hora: string) => selectedDiaIndex === 0 && Number(hora.slice(0, 2)) <= ahora.getHours();

  // El pago dividido (cuotas) necesita al menos 24 horas de anticipacion: con ese metodo, los
  // horarios mas cercanos se marcan como no disponibles en vez de rechazarse al pagar.
  const bloqueadoPorDivision = (hora: string) =>
    metodoPago === "split" &&
    new Date(`${DIAS_STRIP[selectedDiaIndex].iso}T${hora}:00`).getTime() < Date.now() + 24 * 60 * 60 * 1000;

  const turnosBase = turnosReales
    ? turnosReales.map((t) => ({ hora: t.horaInicio, disponible: t.disponible && !yaPaso(t.horaInicio) }))
    : TODOS_LOS_TURNOS;

  const turnos = turnosBase.map((t) => ({
    ...t,
    bloqueadoDivision: t.disponible && bloqueadoPorDivision(t.hora),
  }));
  const hayBloqueadosPorDivision = turnos.some((t) => t.bloqueadoDivision);

  // Si el horario elegido deja de estar libre (otro dia, o pago dividido), se pasa al primero que lo este
  useEffect(() => {
    const elegido = turnos.find((t) => t.hora === selectedTurno);
    if (!elegido || !elegido.disponible || elegido.bloqueadoDivision) {
      const primero = turnos.find((t) => t.disponible && !t.bloqueadoDivision);
      setSelectedTurno(primero ? primero.hora : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnosReales, metodoPago, selectedDiaIndex]);

  const turnoSeleccionado = turnosReales?.find((t) => t.horaInicio === selectedTurno);

  const [tipoReserva, setTipoReserva] = useState<"private" | "matchmaking">(
    "private"
  );
  // Solo en matchmaking: el partido que se busca es competitivo o amistoso (obligatorio)
  const [tipoPartido, setTipoPartido] = useState<"Competitivo" | "Amistoso" | null>(null);
  const [seleccionJugadores, setSeleccionJugadores] = useState<SeleccionJugadores>(seleccionInicial);
  const [aceptaPolitica, setAceptaPolitica] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);
  const [procesando, setProcesando] = useState(false);
  // Indice del texto que se muestra mientras se confirma la reserva
  const [textoProceso, setTextoProceso] = useState(0);

  useEffect(() => {
    if (!procesando) return;
    setTextoProceso(0);
    const id = setInterval(() => setTextoProceso((i) => Math.min(i + 1, TEXTOS_ESPERA.length - 1)), 2200);
    return () => clearInterval(id);
  }, [procesando]);
  const [errorReserva, setErrorReserva] = useState<string | null>(null);
  // Link de Mercado Pago de la reserva ya creada (para volver a abrirlo si el navegador bloqueo la pestaña)
  const [pagoUrl, setPagoUrl] = useState<string | null>(null);

  const tieneCoordenadas = cancha.coords.lat !== 0 || cancha.coords.lng !== 0;
  const urlMapa = `https://www.google.com/maps/search/?api=1&query=${
    tieneCoordenadas
      ? `${cancha.coords.lat},${cancha.coords.lng}`
      : encodeURIComponent(cancha.direccion || cancha.localidad || cancha.nombre)
  }`;

  // Si hay horarios reales, el precio sale del turno elegido (tarifa de dia o de noche)
  const basePrice = turnoSeleccionado?.precioLista ?? (cancha.precio || 40000);
  const promoDiscount = turnoSeleccionado?.descuentoAplicado ?? (cancha.descuentoMonto || 0);
  const finalPrice = Math.max(0, basePrice - promoDiscount);

  // Cuanto se paga ahora segun el tipo de reserva y la forma de pago:
  //  - dividido (privado o matchmaking): tu parte = cancha / todos los jugadores del formato
  //  - total + matchmaking: la mitad de la cancha, que es lo que le toca a tu equipo
  //  - total + privado: la cancha completa
  const jugadoresEquipo = jugadoresPorEquipo(cancha.tipo);
  const jugadoresTotales = jugadoresEquipo * 2;
  const estimatedPerPlayer = Math.round(finalPrice / jugadoresTotales);
  const mitadCancha = Math.round(finalPrice / 2);
  const esDividido = metodoPago === "split";
  // Se elige quienes juegan cuando hay cuotas que repartir: en matchmaking (tu mitad de la
  // cancha) o en un partido privado con pago dividido (toda la cancha).
  const pideJugadores = tipoReserva === "matchmaking" || esDividido;
  const cupoJugadores = tipoReserva === "matchmaking" ? jugadoresEquipo : jugadoresTotales;
  const deposit = esDividido ? estimatedPerPlayer : tipoReserva === "matchmaking" ? mitadCancha : finalPrice;
  const explicacionPorJugador = `Es el precio del turno dividido entre los ${jugadoresTotales} jugadores de la cancha (fútbol ${jugadoresEquipo}). Es un valor estimado: el monto final lo calcula Syncro al confirmar la reserva.`;
  const etiquetaPago = esDividido ? "Tu parte" : tipoReserva === "matchmaking" ? "Total de tu equipo" : "Cancha completa";
  const detallePago = esDividido
    ? `1 de ${jugadoresTotales} jugadores (fútbol ${jugadoresEquipo}). Tus compañeros pagan la suya.`
    : tipoReserva === "matchmaking"
      ? "La mitad de la cancha: el equipo rival paga la otra mitad."
      : "Pagás todo el turno.";

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

  const turnoElegido = turnos.find((t) => t.hora === selectedTurno);
  const turnoLibre = Boolean(turnoElegido?.disponible && !turnoElegido.bloqueadoDivision);

  // Campos obligatorios: sin ellos no se puede confirmar. El equipo se exige cuando hay
  // que repartir cuotas y hay sesion (sin sesion el boton lleva al login).
  const equipoPendiente = pideJugadores && authService.haySesion() && !seleccionJugadores.equipoId;
  const faltantes = [
    !turnoLibre ? "un día y horario disponible" : null,
    tipoReserva === "matchmaking" && !tipoPartido ? "el tipo de partido" : null,
    equipoPendiente ? "tu equipo" : null,
    !aceptaPolitica ? "aceptar las políticas de cancelación" : null,
  ].filter((x): x is string => x !== null);

  const handleConfirm = async () => {
    // Canchas de ejemplo (sin backend): se mantiene la confirmacion de demostracion
    if (!esIdReal(cancha.id)) {
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
      return;
    }

    if (!authService.haySesion()) {
      onClose();
      navigate("/login");
      return;
    }

    // Reserva real: crea la reserva y abre Mercado Pago en otra pestaña.
    // La pestaña se abre ahora, con el clic, porque despues el navegador la bloquearia.
    const ventana = abrirVentanaPago();
    setProcesando(true);
    setErrorReserva(null);
    try {
      const { reservaId, initPoint } = await reservasService.reservarYPagar({
        canchaId: cancha.id,
        fecha: DIAS_STRIP[selectedDiaIndex].iso,
        horaInicio: selectedTurno,
        tipoReserva,
        metodoPago,
      });
      // TODO(back): el backend todavia no recibe quienes juegan; se recuerda en este navegador
      // TODO(back): tampoco recibe el tipo de partido (competitivo/amistoso); se manda cuando POST /reservas lo acepte
      if (pideJugadores) {
        participantesService.guardar(reservaId, {
          ...aParticipantes(seleccionJugadores, cupoJugadores),
          ...(tipoReserva === "matchmaking" && tipoPartido ? { tipoPartido } : {}),
        });
      }
      irAMercadoPago(ventana, initPoint);
      setPagoUrl(initPoint);
    } catch (err) {
      ventana?.close();
      setErrorReserva(err instanceof Error ? err.message : "No se pudo completar la reserva");
    } finally {
      setProcesando(false);
    }
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

        {procesando && (
          <div className="crm-procesando" role="status" aria-live="polite">
            <div className="crm-procesando__caja">
              <div className="crm-pelota" aria-hidden="true">
                <div className="crm-pelota__escena">
                  <div className="crm-pelota__sombra" />
                  <div className="crm-pelota__rebote">
                    <svg className="crm-pelota__balon" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="47" fill="#fff" stroke="#0b0e12" strokeWidth="3" />
                      <polygon points="50,29 70,44 62,67 38,67 30,44" fill="#0b0e12" />
                      <path
                        d="M50 29V4M70 44L95 36M62 67L78 92M38 67L22 92M30 44L5 36"
                        stroke="#0b0e12"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="crm-pelota__piso" />
              </div>
              <h3>Confirmando los datos de tu reserva</h3>
              <p>En unos segundos se abrirá Mercado Pago para que realices el pago y termines de reservar.</p>
              <span className="crm-procesando__paso" key={textoProceso}>
                {TEXTOS_ESPERA[textoProceso]}
              </span>
            </div>
          </div>
        )}

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
        ) : pagoUrl ? (
          <div className="crm-success-state">
            <div className="crm-success-icon">
              <CheckIcon />
            </div>
            <h2>Reserva creada</h2>
            <p>
              Completá el pago en Mercado Pago: lo abrimos en otra pestaña. Si no se abrió, usá el botón. Tu turno queda
              reservado unos minutos hasta que pagues.
            </p>
            <a className="crm-btn-confirm" href={pagoUrl} target="_blank" rel="noopener noreferrer">
              <span>Abrir Mercado Pago</span>
            </a>
            <button
              type="button"
              className="crm-btn-cancel"
              onClick={() => {
                onClose();
                navigate("/perfil-jugador/reservas");
              }}
            >
              Ver mis reservas
            </button>
          </div>
        ) : (
          <div className="crm-layout">
            <div className="crm-col-left">
              <div className="crm-header">
                <div className="crm-title-row">
                  <h1 className="crm-title">{cancha.nombre}</h1>
                  {cancha.rating != null && (
                    <div className="crm-rating-badge">
                      <span>{cancha.rating.toFixed(1)}</span>
                      <StarIcon filled />
                    </div>
                  )}
                  {cancha.reviewsCount > 0 && (
                    <span className="crm-reviews">
                      ({cancha.reviewsCount} opiniones)
                    </span>
                  )}
                </div>

                {!esIdReal(cancha.id) && (
                  <p className="crm-demo-aviso">
                    Cancha de ejemplo: no hay conexión con el servidor, así que la reserva no se crea de verdad.
                  </p>
                )}

                <div className="crm-format-row">
                  <span className="crm-format-tag">{cancha.tipo}</span>
                  <span className="crm-format-info">
                    {jugadoresEquipo} vs {jugadoresEquipo} · {jugadoresTotales} jugadores en total
                  </span>
                </div>

                <div className="crm-location-row">
                  <div className="crm-location-text">
                    <MapPinIcon />
                    <span>{cancha.direccion || cancha.localidad || "Ubicación a confirmar"}</span>
                  </div>
                  <a
                    href={urlMapa}
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
                {hayVariasFotos && (
                  <>
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
                  </>
                )}
              </div>

              <div className="crm-section">
                <div className="crm-section-header">
                  <CalendarIcon />
                  <h3>
                    Fechas y horarios disponibles <span className="crm-req" aria-label="obligatorio">*</span>
                  </h3>
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

                {cargandoTurnos && !turnosReales && <p className="crm-time-estado">Cargando horarios...</p>}
                {turnosReales && !turnos.some((t) => t.disponible) && (
                  <p className="crm-time-estado">No quedan horarios disponibles para este día.</p>
                )}

                {hayBloqueadosPorDivision && (
                  <p className="crm-time-estado">
                    Con pago dividido solo se puede reservar con más de 24 horas de anticipación. Para jugar antes,
                    elegí "Pago total".
                  </p>
                )}

                <div className="crm-time-grid" aria-busy={cargandoTurnos}>
                  {turnos.map((turno) => {
                    const isSelected = selectedTurno === turno.hora;
                    if (!turno.disponible || turno.bloqueadoDivision) {
                      return (
                        <div
                          key={turno.hora}
                          className="crm-time-pill crm-time-pill--disabled"
                          title={turno.bloqueadoDivision ? "Con pago dividido se reserva con más de 24 horas de anticipación" : "Horario no disponible"}
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

              {tipoReserva === "matchmaking" && (
                <div className="crm-section">
                  <div className="crm-section-header">
                    <PitchIcon />
                    <h3>
                      Tipo de partido <span className="crm-req" aria-label="obligatorio">*</span>
                    </h3>
                  </div>
                  <div className="crm-radio-options">
                    {(["Competitivo", "Amistoso"] as const).map((tipo) => (
                      <div
                        key={tipo}
                        className={`crm-radio-card ${tipoPartido === tipo ? "crm-radio-card--selected" : ""}`}
                        onClick={() => setTipoPartido(tipo)}
                        role="radio"
                        aria-checked={tipoPartido === tipo}
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setTipoPartido(tipo)}
                      >
                        <span className="crm-custom-radio">
                          <span className="crm-custom-radio__inner" />
                        </span>
                        <div className="crm-radio-card__body">
                          <strong>{tipo}</strong>
                          <p>
                            {tipo === "Competitivo"
                              ? "Buscás un rival para jugar un partido competitivo."
                              : "Buscás un rival para jugar un partido amistoso."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pideJugadores && (
                <JugadoresReserva
                  cupo={cupoJugadores}
                  esMatchmaking={tipoReserva === "matchmaking"}
                  valor={seleccionJugadores}
                  onChange={setSeleccionJugadores}
                />
              )}

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

              {cancha.ownerNotes?.trim() && (
                <div className="crm-section">
                  <div className="crm-section-header">
                    <NotesIcon />
                    <h3>Notas del Complejo</h3>
                  </div>
                  <div className="crm-notes-box">
                    <p>{cancha.ownerNotes}</p>
                  </div>
                </div>
              )}

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
                  <span>Precio del turno</span>
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
                    Precio estimado por jugador{" "}
                    <span className="crm-info-icon" tabIndex={0} aria-label={explicacionPorJugador}>
                      ⓘ
                      <span className="crm-tooltip" role="tooltip">
                        {explicacionPorJugador}
                      </span>
                    </span>
                  </span>
                  <span>{formatPrecio(estimatedPerPlayer)}</span>
                </div>
              </div>

              <div className="crm-panel-section">
                <div className="crm-panel-header">
                  <UserIcon />
                  <h5>
                    Tipo de Reserva <span className="crm-req" aria-label="obligatorio">*</span>
                  </h5>
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
                      <p>Publicamos tu partido para que otro equipo se postule como rival.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="crm-panel-section">
                <div className="crm-panel-header">
                  <CardIcon />
                  <h5>
                    Método de Pago <span className="crm-req" aria-label="obligatorio">*</span>
                  </h5>
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
                      <p>{tipoReserva === "matchmaking" ? "Pagá la mitad de la cancha, la parte de tu equipo." : "Pagá toda la cancha y asegurá tu turno al instante."}</p>
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
                      <p>{`Cada jugador paga su parte (1 de ${jugadoresTotales}).`}</p>
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

              <div className="crm-panel-section">
                <div className="crm-panel-header">
                  <DepositBagIcon />
                  <h5>{esDividido ? "Seña Requerida" : "Total a pagar"}</h5>
                </div>
                <div className="crm-deposit-box">
                  <span>{etiquetaPago}</span>
                  <strong>{formatPrecio(deposit)}</strong>
                </div>
                <p className="crm-deposit-note">{detallePago}</p>
              </div>

              <div className="crm-actions-group">
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
                  className="crm-btn-confirm"
                  onClick={handleConfirm}
                  disabled={faltantes.length > 0 || procesando}
                >
                  <span>{procesando ? "Abriendo Mercado Pago..." : "Confirmar y Pagar"}</span>
                  <LockIcon />
                </button>
                <p className={`crm-requisitos ${faltantes.length ? "crm-requisitos--falta" : ""}`}>
                  {faltantes.length ? `Falta completar: ${faltantes.join(", ")}.` : "* Campos obligatorios completos."}
                </p>
                {errorReserva && (
                  <p className="crm-error" role="alert">
                    {errorReserva}
                  </p>
                )}

                <button
                  type="button"
                  className="crm-btn-cancel"
                  onClick={onClose}
                >
                  Cancelar
                </button>
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
