export type TipoPartido = "Competitivo" | "Amistoso";
export type Nivel = "Principiante" | "Intermedio" | "Avanzado" | "Profesional";
export type Bloque = "manana" | "tarde" | "noche";
export type FechaTag = "hoy" | "manana" | "semana" | "finde";
export type Estado = "Abierto" | "Cerrado";

export interface Partido {
  id: number;
  tipo: TipoPartido;
  nivel: Nivel;
  fechaLabel: string;
  fechaTag: FechaTag;
  fechaCompleta: string;
  hora: string;
  bloque: Bloque;
  precio: number;
  ubicacion: string;
  direccion: string;
  canchaNombre: string;
  canchaTipo: string;
  canchaSuperficie: string;
  climaTemp: number;
  climaDescripcion: string;
  climaHumedad: number;
  equipoLocalNombre: string;
  equipoVisitanteNombre: string | null;
  rankingEstimado: number | null;
  partidosJugados: number | null;
  nivelRival: Nivel | null;
  costoCancha: number;
  promocion: number;
  entradaJugador: number;
  maxJugadores: number;
  formato: string;
  duracion: string;
  arbitro: string;
  estado: Estado;
}

export interface Filtros {
  tipo: "todos" | TipoPartido;
  precioMax: number;
  horarios: Bloque[];
  fechas: FechaTag[];
  niveles: Nivel[];
}

export const FILTROS_INICIALES: Filtros = {
  tipo: "todos",
  precioMax: 100000,
  horarios: [],
  fechas: [],
  niveles: [],
};