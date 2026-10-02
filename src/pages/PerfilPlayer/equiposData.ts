import type { Equipo } from "./components/EquipoCard";

const iconoUrl = (nombre: string) => `${import.meta.env.BASE_URL}assets/icons/${nombre}`;

// Un jugador puede estar en hasta 3 equipos a la vez
export const MAX_EQUIPOS = 3;

export interface SolicitudIngreso {
  id: string;
  equipoId: string;
  equipoNombre: string;
  nombre: string;
  iniciales: string;
  mensaje: string;
}

// Datos de ejemplo: se usan mientras el dominio "equipos" no este conectado al backend
export const EQUIPOS_MOCK: Equipo[] = [
  {
    id: "titanes",
    nombre: "Los Titanes",
    logoUrl: iconoUrl("titanes-escudo.png"),
    categoria: "División 2",
    descripcion: "Compitiendo con disciplina. Ganando en unidad.",
    integrantesActuales: 7,
    integrantesMax: 8,
    esPropietario: true,
    solicitudesPendientes: 1,
    proximoPartido: { fecha: "24 May 2025", hora: "7:00 PM" },
  },
  {
    id: "norte-united",
    nombre: "Norte United",
    logoUrl: iconoUrl("norte-united-escudo.png"),
    categoria: "Casual",
    descripcion: "Amigos en la cancha. Hermanos fuera de ella.",
    integrantesActuales: 5,
    integrantesMax: 8,
    esPropietario: false,
    proximoPartido: { fecha: "31 May 2025", hora: "8:00 PM" },
  },
];

export const SOLICITUDES_MOCK: SolicitudIngreso[] = [
  {
    id: "sol-1",
    equipoId: "titanes",
    equipoNombre: "Los Titanes",
    nombre: "Mateo Silveira",
    iniciales: "MS",
    mensaje: "Juego de central, tengo disponibilidad los sábados.",
  },
];
