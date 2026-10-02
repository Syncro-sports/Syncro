import { ReservaDetalleData, ReservaJugador } from "./reservasData";

const pad = (n: number) => String(n).padStart(2, "0");

// Formato que pide Google Calendar: YYYYMMDDTHHMMSS (hora local, sin zona)
const fechaParaCalendario = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

export const tituloEvento = (detalle: ReservaDetalleData): string =>
  detalle.tuEquipo && detalle.rival
    ? `Partido: ${detalle.tuEquipo} vs ${detalle.rival.nombre}`
    : `Reserva en ${detalle.canchaNombre}`;

// Link de "Añadir a Google Calendar" con toda la informacion de la reserva.
// Devuelve null si la reserva no tiene fecha/hora validas.
export const linkGoogleCalendar = (reserva: ReservaJugador): string | null => {
  const detalle = reserva.detalle;
  if (!reserva.fechaISO) return null;

  const inicio = new Date(`${reserva.fechaISO}T${detalle.hora}:00`);
  if (Number.isNaN(inicio.getTime())) return null;

  const minutos = parseInt(detalle.duracion, 10);
  let fin = reserva.horaFin
    ? new Date(`${reserva.fechaISO}T${reserva.horaFin}:00`)
    : new Date(inicio.getTime() + (Number.isFinite(minutos) ? minutos : 60) * 60000);
  if (fin <= inicio) fin = new Date(fin.getTime() + 24 * 60 * 60000);

  const detalles = [
    `Tipo: ${detalle.tipoLabel}`,
    `Cancha: ${detalle.canchaNombre}`,
    detalle.tuEquipo && detalle.rival ? `Equipos: ${detalle.tuEquipo} vs ${detalle.rival.nombre}` : "",
    `Reserva N.º ${detalle.numero}`,
    `Más información: ${window.location.origin}${import.meta.env.BASE_URL}perfil-jugador/reservas`,
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: tituloEvento(detalle),
    dates: `${fechaParaCalendario(inicio)}/${fechaParaCalendario(fin)}`,
    details: detalles,
    location: detalle.direccion ? `${detalle.canchaNombre}, ${detalle.direccion}` : detalle.canchaNombre,
    ctz: "America/Argentina/Buenos_Aires",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
