export interface StatResumen {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaNote: string;
}

export interface PuntoIngreso {
  label: string;
  value: number;
}

export interface RendimientoCancha {
  cancha: string;
  ingresos: number;
  horas: string;
  ocupacion: number;
}

export interface TopReserva {
  id: string;
  equipo: string;
  cancha: string;
  fecha: string;
  monto: number;
}

export interface ActividadReciente {
  id: string;
  texto: string;
  hora: string;
}

export interface OcupacionInfo {
  porcentaje: number;
  delta: string;
  horasOcupadas: number;
  horasDisponibles: number;
  horasTotal: number;
}

export interface OtrosStats {
  partidosRanking: number;
  cancelaciones: number;
  noPresentados: number;
  reprogramacion: number;
}

interface DatosEstadisticas {
  stats: StatResumen[];
  ingresosSerie: PuntoIngreso[];
  ingresosTotal: string;
  ingresosDelta: string;
  ocupacion: OcupacionInfo;
  rendimientoCanchas: RendimientoCancha[];
  topReservas: TopReserva[];
  actividadReciente: ActividadReciente[];
  otros: OtrosStats;
}

// Cuando el equipo de backend conecte esta vista, esta bandera pasa a venir
// de un contexto de autenticacion o de la respuesta real del fetch
const sesionIniciada = false;

const datosEstadisticasMock: DatosEstadisticas = {
  stats: [
    { id: "ingresos", label: "Ingresos totales", value: "$124.850", delta: "+24.5%", deltaNote: "vs mes pasado" },
    { id: "reservas", label: "Reservas realizadas", value: "142", delta: "+18.3%", deltaNote: "vs mes pasado" },
    { id: "jugadores", label: "Jugadores unicos", value: "328", delta: "+15.7%", deltaNote: "vs mes pasado" },
    { id: "horas", label: "Horas reservadas", value: "236h", delta: "+22.1%", deltaNote: "vs mes pasado" },
    { id: "ocupacion", label: "Ocupación promedio", value: "82%", delta: "+8.4%", deltaNote: "vs mes pasado" },
  ],
  ingresosSerie: [
    { label: "1 Jul", value: 10000 },
    { label: "4 Jul", value: 30000 },
    { label: "8 Jul", value: 18000 },
    { label: "12 Jul", value: 25000 },
    { label: "16 Jul", value: 20000 },
    { label: "20 Jul", value: 35000 },
    { label: "24 Jul", value: 34000 },
    { label: "28 Jul", value: 35000 },
    { label: "31 Jul", value: 35000 },
  ],
  ingresosTotal: "$124.850",
  ingresosDelta: "+24.5% vs mes pasado",
  ocupacion: {
    porcentaje: 82,
    delta: "+8.4% vs mes pasado",
    horasOcupadas: 236,
    horasDisponibles: 52,
    horasTotal: 288,
  },
  rendimientoCanchas: [
    { cancha: "Cancha 1", ingresos: 52100, horas: "96hs", ocupacion: 85 },
    { cancha: "Cancha 2", ingresos: 41250, horas: "78hs", ocupacion: 80 },
    { cancha: "Cancha 3", ingresos: 23780, horas: "46hs", ocupacion: 76 },
    { cancha: "Cancha 4", ingresos: 7720, horas: "16hs", ocupacion: 45 },
  ],
  topReservas: [
    { id: "1", equipo: "Los Pibes FC", cancha: "Cancha 2", fecha: "14 Jun, 20:00hs", monto: 45000 },
    { id: "2", equipo: "La Verde FC", cancha: "Cancha 1", fecha: "10 Jun, 21:00hs", monto: 42000 },
    { id: "3", equipo: "Amigos del Fútbol", cancha: "Cancha 3", fecha: "05 Jun, 19:00hs", monto: 38000 },
    { id: "4", equipo: "Team Alpha", cancha: "Cancha 1", fecha: "12 Jun, 18:00hs", monto: 35000 },
    { id: "5", equipo: "Fútbol Libre", cancha: "Cancha 2", fecha: "08 Jun, 20:00hs", monto: 33000 },
  ],
  actividadReciente: [
    { id: "1", texto: "Nueva reserva confirmada en Cancha 2", hora: "Hace 12 min" },
    { id: "2", texto: "Pago recibido de Los Pibes FC", hora: "Hace 40 min" },
    { id: "3", texto: "Reseña de 5 estrellas en Cancha 1", hora: "Hace 1 h" },
    { id: "4", texto: "Reserva cancelada en Cancha 3", hora: "Hace 2 h" },
  ],
  otros: {
    partidosRanking: 15,
    cancelaciones: 6,
    noPresentados: 3,
    reprogramacion: 8,
  },
};

const datosEstadisticasReal: DatosEstadisticas = {
  stats: [], // ddbb_stats
  ingresosSerie: [], // ddbb_ingresos_serie
  ingresosTotal: "", // ddbb_ingresos_total
  ingresosDelta: "", // ddbb_ingresos_delta
  ocupacion: { porcentaje: 0, delta: "", horasOcupadas: 0, horasDisponibles: 0, horasTotal: 0 }, // ddbb_ocupacion
  rendimientoCanchas: [], // ddbb_rendimiento_canchas
  topReservas: [], // ddbb_top_reservas
  actividadReciente: [], // ddbb_actividad_reciente
  otros: { partidosRanking: 0, cancelaciones: 0, noPresentados: 0, reprogramacion: 0 }, // ddbb_otros
};

export const datosEstadisticas: DatosEstadisticas = sesionIniciada ? datosEstadisticasReal : datosEstadisticasMock;