export const INGRESOS_SERIE = [
  { label: "1 Jul", value: 10000 },
  { label: "4 Jul", value: 30000 },
  { label: "8 Jul", value: 18000 },
  { label: "12 Jul", value: 25000 },
  { label: "16 Jul", value: 20000 },
  { label: "20 Jul", value: 35000 },
  { label: "24 Jul", value: 34000 },
  { label: "28 Jul", value: 35000 },
  { label: "31 Jul", value: 35000 },
];

export interface RendimientoCancha {
  cancha: string;
  ingresos: number;
  horas: string;
  ocupacion: number;
}

export const RENDIMIENTO_CANCHAS: RendimientoCancha[] = [
  { cancha: "Cancha 1", ingresos: 52100, horas: "96hs", ocupacion: 85 },
  { cancha: "Cancha 2", ingresos: 41250, horas: "78hs", ocupacion: 80 },
  { cancha: "Cancha 3", ingresos: 23780, horas: "46hs", ocupacion: 76 },
  { cancha: "Cancha 4", ingresos: 7720, horas: "16hs", ocupacion: 45 },
];

export interface TopReserva {
  id: string;
  equipo: string;
  cancha: string;
  fecha: string;
  monto: number;
}

export const TOP_RESERVAS: TopReserva[] = [
  { id: "1", equipo: "Los Pibes FC", cancha: "Cancha 2", fecha: "14 Jun, 20:00hs", monto: 45000 },
  { id: "2", equipo: "La Verde FC", cancha: "Cancha 1", fecha: "10 Jun, 21:00hs", monto: 42000 },
  { id: "3", equipo: "Amigos del Fútbol", cancha: "Cancha 3", fecha: "05 Jun, 19:00hs", monto: 38000 },
  { id: "4", equipo: "Team Alpha", cancha: "Cancha 1", fecha: "12 Jun, 18:00hs", monto: 35000 },
  { id: "5", equipo: "Fútbol Libre", cancha: "Cancha 2", fecha: "08 Jun, 20:00hs", monto: 33000 },
];

export interface ActividadReciente {
  id: string;
  texto: string;
  hora: string;
}

export const ACTIVIDAD_RECIENTE: ActividadReciente[] = [
  { id: "1", texto: "Nueva reserva confirmada en Cancha 2", hora: "Hace 12 min" },
  { id: "2", texto: "Pago recibido de Los Pibes FC", hora: "Hace 40 min" },
  { id: "3", texto: "Reseña de 5 estrellas en Cancha 1", hora: "Hace 1 h" },
  { id: "4", texto: "Reserva cancelada en Cancha 3", hora: "Hace 2 h" },
];
