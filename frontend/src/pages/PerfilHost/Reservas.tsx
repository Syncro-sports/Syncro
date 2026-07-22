import { useMemo, useState } from "react";
import { HostCard } from "./components/StatCard";
import { BallIcon, CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, UserIcon } from "./components/icons";
import HourGrid from "./components/HourGrid";
import { CANCHAS_RESERVAS, DIAS_SEMANA, HORAS_RESERVAS, Reserva, RESERVAS } from "./reservasData";
import "./Reservas.css";

type Vista = "dia" | "semana" | "mes";

const MESES_ABREV = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const HORA_MIN = 6;
const HORA_MAX = 24;

const addDias = (fecha: Date, dias: number) => {
  const copia = new Date(fecha);
  copia.setDate(copia.getDate() + dias);
  return copia;
};

const formatRangoSemana = (lunes: Date) => {
  const domingo = addDias(lunes, 6);
  const mesInicio = MESES_ABREV[lunes.getMonth()];
  const mesFin = MESES_ABREV[domingo.getMonth()];
  return `${mesInicio} ${lunes.getDate()} - ${mesFin} ${domingo.getDate()} ${domingo.getFullYear()}`;
};

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const Reservas = () => {
  const [vista, setVista] = useState<Vista>("semana");
  const [semanaInicio, setSemanaInicio] = useState(new Date(2026, 5, 15));
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(CANCHAS_RESERVAS[0]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva>(RESERVAS[0]);

  const reservasVisibles = useMemo(
    () => RESERVAS.filter((reserva) => reserva.cancha === canchaSeleccionada),
    [canchaSeleccionada]
  );

  return (
    <div className="host-reservas">
      <h1 className="host-reservas__title">Reservas y calendario</h1>

      <div className="host-reservas__controls">
        <div className="host-view-tabs">
          {(["dia", "semana", "mes"] as Vista[]).map((opcion) => (
            <button
              key={opcion}
              type="button"
              className={vista === opcion ? "is-active" : ""}
              onClick={() => setVista(opcion)}
            >
              {opcion === "dia" ? "Día" : opcion === "semana" ? "Semana" : "Mes"}
            </button>
          ))}
        </div>

        <div className="host-week-nav">
          <button type="button" onClick={() => setSemanaInicio((prev) => addDias(prev, -7))} aria-label="Semana anterior">
            <ChevronLeftIcon />
          </button>
          <span>{formatRangoSemana(semanaInicio)}</span>
          <button type="button" onClick={() => setSemanaInicio((prev) => addDias(prev, 7))} aria-label="Semana siguiente">
            <ChevronRightIcon />
          </button>
        </div>

        <div className="host-cancha-select">
          <select value={canchaSeleccionada} onChange={(event) => setCanchaSeleccionada(event.target.value)}>
            {CANCHAS_RESERVAS.map((cancha) => (
              <option key={cancha} value={cancha}>
                {cancha}
              </option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>
      </div>

      <div className="host-reservas__layout">
        <HostCard className="host-week">
          <h2>Reservas activas (hoy)</h2>

          {vista !== "semana" ? (
            <p className="host-week__placeholder">
              Vista de {vista === "dia" ? "día" : "mes"} — próximamente.
            </p>
          ) : (
            <>
              <div className="host-week__header">
                <span />
                <div className="host-week__hours">
                  {HORAS_RESERVAS.map((hora) => (
                    <span key={hora}>{hora}</span>
                  ))}
                </div>
              </div>

              <div className="host-week__body">
                <div className="host-week__gridlines">
                  <HourGrid count={HORAS_RESERVAS.length} />
                </div>

                {DIAS_SEMANA.map((dia) => (
                  <div className="host-week__row" key={dia}>
                    <span className="host-week__day">{dia}</span>
                    <div className="host-week__track">
                      {reservasVisibles
                        .filter((reserva) => reserva.dia === dia)
                        .map((reserva) => {
                          const left = ((reserva.horaInicio - HORA_MIN) / (HORA_MAX - HORA_MIN)) * 100;
                          const width = ((reserva.horaFin - reserva.horaInicio) / (HORA_MAX - HORA_MIN)) * 100;
                          const activa = reserva.id === reservaSeleccionada.id;

                          return (
                            <button
                              type="button"
                              key={reserva.id}
                              className={`host-week__event ${activa ? "is-selected" : ""}`}
                              style={{ left: `${left}%`, width: `${width}%` }}
                              onClick={() => setReservaSeleccionada(reserva)}
                            >
                              <strong>{reserva.titulo}</strong>
                              <span>{reserva.horaLabel}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </HostCard>

        <HostCard className="host-detail">
          <div className="host-detail__scroll">
            <div className="host-detail__header">
              <h2>Reserva de cancha</h2>
              <span className="host-detail__badge">{reservaSeleccionada.estado}</span>
            </div>

            <p className="host-detail__numero">Nº de reserva: {reservaSeleccionada.numero}</p>

            <div className="host-detail__section">
              <div className="host-detail__tags">
                <span>
                  <BallIcon />
                  {reservaSeleccionada.deporte}
                </span>
                <span>
                  <img src="/assets/icons/canchas.svg" alt="" />
                  {reservaSeleccionada.cancha}
                </span>
              </div>
            </div>

            <div className="host-detail__section">
              <div className="host-detail__row">
                <CalendarIcon />
                {reservaSeleccionada.fecha}
              </div>
              <div className="host-detail__row">
                <ClockIcon />
                {reservaSeleccionada.horaLabel}
              </div>
            </div>

            <div className="host-detail__section">
              <h3>Contacto</h3>
              <div className="host-detail__row">
                <UserIcon />
                {reservaSeleccionada.contactoNombre}
              </div>
              <div className="host-detail__row">
                <UserIcon />
                {reservaSeleccionada.contactoTelefono}
              </div>
              <div className="host-detail__row">
                <UserIcon />
                {reservaSeleccionada.contactoCorreo}
              </div>
            </div>

            <div className="host-detail__section">
              <h3>Pago total</h3>
              <div className="host-detail__pago">
                <strong>{formatPrecio(reservaSeleccionada.pagoTotal)}</strong>
                <span>{reservaSeleccionada.pagoEstado}</span>
              </div>
            </div>

            <div className="host-detail__section host-detail__section--last">
              <h3>Notas:</h3>
              <p className="host-detail__notas">{reservaSeleccionada.notas}</p>
            </div>
          </div>

          <div className="host-detail__actions">
            <button type="button" className="host-detail__reagendar">
              Reagendar reserva
            </button>
            <button type="button" className="host-detail__cancelar">
              Cancelar reserva
            </button>
          </div>
        </HostCard>
      </div>
    </div>
  );
};

export default Reservas;
