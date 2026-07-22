export interface Reserva {
  id: string;
  numero: string;
  dia: string;
  horaInicio: number;
  horaFin: number;
  titulo: string;
  estado: string;
  deporte: string;
  cancha: string;
  fecha: string;
  horaLabel: string;
  contactoNombre: string;
  contactoTelefono: string;
  contactoCorreo: string;
  pagoTotal: number;
  pagoEstado: string;
  notas: string;
  variant: "confirmado" | "amistoso";
}

export const DIAS_SEMANA = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

export const HORAS_RESERVAS = ["6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "24:00"];

export const CANCHAS_RESERVAS = ["Cancha 1", "Cancha 2", "Cancha 3", "Cancha 4"];

export const RESERVAS: Reserva[] = [
  {
    id: "AA1234",
    numero: "#AA1234",
    dia: "Lunes",
    horaInicio: 10,
    horaFin: 13,
    titulo: "Reserva de cancha",
    estado: "Confirmado",
    deporte: "Futbol 5",
    cancha: "Cancha 1",
    fecha: "Junio 15, 2026",
    horaLabel: "10:00 - 13:00",
    contactoNombre: "/nombreDeUsuario",
    contactoTelefono: "/numeroDeTelefono",
    contactoCorreo: "/CorreoDeUsuario",
    pagoTotal: 18000,
    pagoEstado: "Pagado",
    notas: "No se añadieron notas",
    variant: "confirmado",
  },
  {
    id: "AA1235",
    numero: "#AA1235",
    dia: "Martes",
    horaInicio: 12,
    horaFin: 15,
    titulo: "Alpha vs Olimpo",
    estado: "Confirmado",
    deporte: "Futbol 7",
    cancha: "Cancha 1",
    fecha: "Junio 16, 2026",
    horaLabel: "12:00 - 15:00",
    contactoNombre: "/nombreDeEquipoAlpha",
    contactoTelefono: "/numeroDeTelefono",
    contactoCorreo: "/CorreoDeUsuario",
    pagoTotal: 25000,
    pagoEstado: "Pagado",
    notas: "Partido amistoso entre equipos, cancha reservada por ambos capitanes.",
    variant: "amistoso",
  },
  {
    id: "AA1236",
    numero: "#AA1236",
    dia: "Miercoles",
    horaInicio: 18,
    horaFin: 20,
    titulo: "Reserva de cancha",
    estado: "Confirmado",
    deporte: "Futbol 5",
    cancha: "Cancha 1",
    fecha: "Junio 17, 2026",
    horaLabel: "18:00 - 20:00",
    contactoNombre: "/nombreDeUsuario2",
    contactoTelefono: "/numeroDeTelefono2",
    contactoCorreo: "/CorreoDeUsuario2",
    pagoTotal: 20000,
    pagoEstado: "Pagado",
    notas: "No se añadieron notas",
    variant: "confirmado",
  },
  {
    id: "AA1237",
    numero: "#AA1237",
    dia: "Viernes",
    horaInicio: 20,
    horaFin: 22,
    titulo: "Los Halcones FC",
    estado: "Pendiente",
    deporte: "Futbol 5",
    cancha: "Cancha 1",
    fecha: "Junio 19, 2026",
    horaLabel: "20:00 - 22:00",
    contactoNombre: "/nombreDeUsuario3",
    contactoTelefono: "/numeroDeTelefono3",
    contactoCorreo: "/CorreoDeUsuario3",
    pagoTotal: 22000,
    pagoEstado: "Pendiente",
    notas: "Esperando confirmación de pago de seña.",
    variant: "amistoso",
  },
  {
    id: "AA1238",
    numero: "#AA1238",
    dia: "Sabado",
    horaInicio: 16,
    horaFin: 18,
    titulo: "Cumpleaños Torneo",
    estado: "Confirmado",
    deporte: "Futbol 7",
    cancha: "Cancha 1",
    fecha: "Junio 20, 2026",
    horaLabel: "16:00 - 18:00",
    contactoNombre: "/nombreDeUsuario4",
    contactoTelefono: "/numeroDeTelefono4",
    contactoCorreo: "/CorreoDeUsuario4",
    pagoTotal: 25000,
    pagoEstado: "Pagado",
    notas: "Cumpleaños, traen su propia torta y decoración.",
    variant: "confirmado",
  },
  {
    id: "AB1201",
    numero: "#AB1201",
    dia: "Lunes",
    horaInicio: 8,
    horaFin: 10,
    titulo: "Escuela de fútbol",
    estado: "Confirmado",
    deporte: "Futbol 7",
    cancha: "Cancha 2",
    fecha: "Junio 15, 2026",
    horaLabel: "8:00 - 10:00",
    contactoNombre: "/nombreDeUsuario5",
    contactoTelefono: "/numeroDeTelefono5",
    contactoCorreo: "/CorreoDeUsuario5",
    pagoTotal: 30000,
    pagoEstado: "Pagado",
    notas: "Reserva fija semanal, categoría infantil.",
    variant: "confirmado",
  },
  {
    id: "AB1202",
    numero: "#AB1202",
    dia: "Jueves",
    horaInicio: 14,
    horaFin: 16,
    titulo: "Torneo Amateur",
    estado: "Confirmado",
    deporte: "Futbol 11",
    cancha: "Cancha 3",
    fecha: "Junio 18, 2026",
    horaLabel: "14:00 - 16:00",
    contactoNombre: "/nombreDeUsuario6",
    contactoTelefono: "/numeroDeTelefono6",
    contactoCorreo: "/CorreoDeUsuario6",
    pagoTotal: 40000,
    pagoEstado: "Pagado",
    notas: "Partido de octavos de final del torneo amateur.",
    variant: "amistoso",
  },
];

export interface ReservaHoy {
  id: string;
  cancha: string;
  horaInicio: number;
  horaFin: number;
  titulo: string;
  variant: "confirmado" | "amistoso";
}

export const RESERVAS_HOY: ReservaHoy[] = [
  { id: "H1", cancha: "cancha 1", horaInicio: 10, horaFin: 13, titulo: "Reserva de cancha", variant: "confirmado" },
  { id: "H2", cancha: "cancha 1", horaInicio: 18, horaFin: 20, titulo: "Grupo Martínez", variant: "confirmado" },
  { id: "H3", cancha: "cancha 2", horaInicio: 8, horaFin: 10, titulo: "Escuela de fútbol", variant: "confirmado" },
  { id: "H4", cancha: "cancha 2", horaInicio: 14, horaFin: 16, titulo: "Alpha vs Olimpo", variant: "amistoso" },
  { id: "H5", cancha: "cancha 3", horaInicio: 20, horaFin: 22, titulo: "Torneo Amateur", variant: "amistoso" },
  { id: "H6", cancha: "cancha 4", horaInicio: 12, horaFin: 14, titulo: "Reserva de cancha", variant: "confirmado" },
];
