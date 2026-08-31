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

export interface ReservaHoy {
  id: string;
  cancha: string;
  horaInicio: number;
  horaFin: number;
  titulo: string;
  variant: "confirmado" | "amistoso";
}
export interface DatosReservas {
  canchas: string[];
  reservas: Reserva[];
  reservasHoy: ReservaHoy[];
}

export const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
];

export const HORAS_RESERVAS = [
  "6:00",
  "8:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
  "00:00",
];

export const CANCHAS_RESERVAS = [
  "Cancha 1",
  "Cancha 2",
  "Cancha 3",
  "Cancha 4",
];

const sesionIniciada = false;

const datosReservasMock: DatosReservas = {
  canchas: CANCHAS_RESERVAS,
  reservas: [
    {
      id: "AA0001",
      numero: "#AA0001",
      dia: "Lunes",
      horaInicio: 10,
      horaFin: 13,
      titulo: "Reserva Juan P.",
      estado: "Confirmado",
      deporte: "Futbol 5",
      cancha: "Cancha 1",
      fecha: "Junio 15, 2026",
      horaLabel: "10:00 - 13:00",
      contactoNombre: "Juan Pérez",
      contactoTelefono: "+54 9 11 1234-5678",
      contactoCorreo: "juan.perez@gmail.com",
      pagoTotal: 18000,
      pagoEstado: "Pagado",
      notas: "No se añadieron notas",
      variant: "confirmado",
    },
    {
      id: "AA0002",
      numero: "RES-002",
      dia: "Martes",
      horaInicio: 12,
      horaFin: 15,
      titulo: "Alpha vs Olimpo",
      estado: "Confirmado",
      deporte: "Futbol 7",
      cancha: "Cancha 1",
      fecha: "Junio 16, 2026",
      horaLabel: "12:00 - 15:00",
      contactoNombre: "Lucas Gómez",
      contactoTelefono: "+54 9 11 8765-4321",
      contactoCorreo: "lucas.gomez@gmail.com",
      pagoTotal: 25000,
      pagoEstado: "Pagado",
      notas:
        "Partido amistoso entre equipos, cancha reservada por ambos capitanes.",
      variant: "amistoso",
    },
    {
      id: "AA0003",
      numero: "AA0003",
      dia: "Miercoles",
      horaInicio: 18,
      horaFin: 20,
      titulo: "Reserva Mariano S.",
      estado: "Confirmado",
      deporte: "Futbol 5",
      cancha: "Cancha 1",
      fecha: "Junio 17, 2026",
      horaLabel: "18:00 - 20:00",
      contactoNombre: "Mariano Silva",
      contactoTelefono: "+54 9 11 5555-4444",
      contactoCorreo: "mariano.silva@email.com",
      pagoTotal: 20000,
      pagoEstado: "Pagado",
      notas: "No se añadieron notas",
      variant: "confirmado",
    },
    {
      id: "AA0004",
      numero: "AA0004",
      dia: "Viernes",
      horaInicio: 20,
      horaFin: 22,
      titulo: "Los Halcones FC",
      estado: "Pendiente",
      deporte: "Futbol 5",
      cancha: "Cancha 1",
      fecha: "Junio 19, 2026",
      horaLabel: "20:00 - 22:00",
      contactoNombre: "Gonzalo Fernández",
      contactoTelefono: "+54 9 11 3333-2222",
      contactoCorreo: "gonzalo.f@gmail.com",
      pagoTotal: 22000,
      pagoEstado: "Pendiente",
      notas: "Esperando confirmación de pago de seña.",
      variant: "amistoso",
    },
    {
      id: "AA0005",
      numero: "AA0005",
      dia: "Sabado",
      horaInicio: 16,
      horaFin: 18,
      titulo: "Cumpleaños Torneo",
      estado: "Confirmado",
      deporte: "Futbol 7",
      cancha: "Cancha 1",
      fecha: "Junio 20, 2026",
      horaLabel: "16:00 - 18:00",
      contactoNombre: "Ignacio Rodriguez",
      contactoTelefono: "+54 9 11 2093-2222",
      contactoCorreo: "ignacio.rodriguez@gmail.com",
      pagoTotal: 25000,
      pagoEstado: "Pagado",
      notas: "Cumpleaños, traen su propia torta y decoración.",
      variant: "confirmado",
    },
    {
      id: "AA0006",
      numero: "AA0006",
      dia: "Lunes",
      horaInicio: 8,
      horaFin: 10,
      titulo: "Escuela de fútbol",
      estado: "Confirmado",
      deporte: "Futbol 7",
      cancha: "Cancha 2",
      fecha: "Junio 15, 2026",
      horaLabel: "8:00 - 10:00",
      contactoNombre: "Leonel Sosa",
      contactoTelefono: "+54 9 11 2085-4101",
      contactoCorreo: "leonel.sosa@gmail.com",
      pagoTotal: 30000,
      pagoEstado: "Pagado",
      notas: "Reserva fija semanal, categoría infantil.",
      variant: "confirmado",
    },
    {
      id: "AA0007",
      numero: "#AA0007",
      dia: "Jueves",
      horaInicio: 14,
      horaFin: 16,
      titulo: "Torneo Amateur",
      estado: "Confirmado",
      deporte: "Futbol 11",
      cancha: "Cancha 3",
      fecha: "Junio 18, 2026",
      horaLabel: "14:00 - 16:00",
      contactoNombre: "Benjamin Ramirez",
      contactoTelefono: "+54 9 11 2482-0298",
      contactoCorreo: "benjamin.ramirez@gmail.com",
      pagoTotal: 40000,
      pagoEstado: "Pagado",
      notas: "Partido de octavos de final del torneo amateur.",
      variant: "amistoso",
    },
  ],
  reservasHoy: [
    {
      id: "H1",
      cancha: "cancha 1",
      horaInicio: 10,
      horaFin: 13,
      titulo: "Reserva de cancha",
      variant: "confirmado",
    },
    {
      id: "H2",
      cancha: "cancha 1",
      horaInicio: 18,
      horaFin: 20,
      titulo: "Grupo Martínez",
      variant: "confirmado",
    },
    {
      id: "H3",
      cancha: "cancha 2",
      horaInicio: 8,
      horaFin: 10,
      titulo: "Escuela de fútbol",
      variant: "confirmado",
    },
    {
      id: "H4",
      cancha: "cancha 2",
      horaInicio: 14,
      horaFin: 16,
      titulo: "Alpha vs Olimpo",
      variant: "amistoso",
    },
    {
      id: "H5",
      cancha: "cancha 3",
      horaInicio: 20,
      horaFin: 22,
      titulo: "Torneo Amateur",
      variant: "amistoso",
    },
    {
      id: "H6",
      cancha: "cancha 4",
      horaInicio: 12,
      horaFin: 14,
      titulo: "Reserva de cancha",
      variant: "confirmado",
    },
  ],
};

const datosReservasReal: DatosReservas = {
  canchas: [],
  reservas: [],
  reservasHoy: [],
};

export const datosReservas: DatosReservas = sesionIniciada
  ? datosReservasReal
  : datosReservasMock;

export const RESERVAS: Reserva[] = datosReservas.reservas;

export const RESERVAS_HOY: ReservaHoy[] = datosReservas.reservasHoy;
