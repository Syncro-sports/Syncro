export interface ReservaJugador {
  id: string;
  complejo: string;
  direccion: string;
  fecha: string;
  hora: string;
  deporte: string;
  rival: string;
  tipo: string;
  imagen: string;
  estado: "confirmada" | "pendiente";
}

export interface AccesoRapidoItem {
  to: string;
  label: string;
  icono: string;
}

interface DatosReservas {
  reservas: ReservaJugador[];
  proximosSieteDias: number;
  estaSemana: number;
  proximaSemana: number;
}

// Cuando el equipo de backend conecte esta vista, esta bandera pasa a venir
// de la respuesta real del fetch
const backendConectado = false;

const datosReservasMock: DatosReservas = {
  reservas: [
    {
      id: "1",
      complejo: "Complejo los Pibes",
      direccion: "Caseros, Buenos Aires",
      fecha: "Junio 15, 2026",
      hora: "10:00 AM",
      deporte: "Fútbol",
      rival: "vs Los Titanes FC",
      tipo: "Competitivo",
      imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
      estado: "confirmada",
    },
    {
      id: "2",
      complejo: "Complejo los Pibes",
      direccion: "Caseros, Buenos Aires",
      fecha: "Junio 15, 2026",
      hora: "10:00 AM",
      deporte: "Fútbol",
      rival: "vs Los Titanes FC",
      tipo: "Competitivo",
      imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
      estado: "confirmada",
    },
    {
      id: "3",
      complejo: "Complejo los Pibes",
      direccion: "Caseros, Buenos Aires",
      fecha: "Junio 15, 2026",
      hora: "10:00 AM",
      deporte: "Fútbol",
      rival: "vs Los Titanes FC",
      tipo: "Competitivo",
      imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
      estado: "confirmada",
    },
  ],
  // Esta semana + proxima semana suman la cantidad de reservas confirmadas
  // de arriba (2 + 1 = 3), para que los numeros cierren entre si
  proximosSieteDias: 2,
  estaSemana: 2,
  proximaSemana: 1,
};

const datosReservasReal: DatosReservas = {
  reservas: [], // ddbb_reservas
  proximosSieteDias: 0, // ddbb_proximos_7_dias
  estaSemana: 0, // ddbb_esta_semana
  proximaSemana: 0, // ddbb_proxima_semana
};

export const datosReservas: DatosReservas = backendConectado ? datosReservasReal : datosReservasMock;

export const ACCESOS_RAPIDOS_RESERVAS: AccesoRapidoItem[] = [
  { to: "/canchas", label: "Reservar una cancha", icono: "canchas.svg" },
  { to: "/partidos", label: "Encontrar oponentes", icono: "pelota-header.svg" },
  { to: "/equipos", label: "Crear equipo", icono: "equipos.svg" },
  { to: "/partidos", label: "Buscar matchmaking", icono: "valoracion.svg" },
];