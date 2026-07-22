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

const UBICACIONES = [
  { corta: "Libertad 569, Merlo, Bs As", completa: "Av. Libertad 569, Merlo, Buenos Aires." },
  { corta: "San Martín 1200, Moreno, Bs As", completa: "Av. San Martín 1200, Moreno, Buenos Aires." },
  { corta: "Rivadavia 850, Ituzaingó, Bs As", completa: "Av. Rivadavia 850, Ituzaingó, Buenos Aires." },
];

const HORAS: { hora: string; bloque: Bloque }[] = [
  { hora: "09:00", bloque: "manana" },
  { hora: "14:00", bloque: "tarde" },
  { hora: "20:00", bloque: "noche" },
];

const NIVELES: Nivel[] = ["Principiante", "Intermedio", "Avanzado", "Profesional"];

const FECHAS: { label: string; tag: FechaTag; completa: string }[] = [
  { label: "Hoy, 30 de junio", tag: "hoy", completa: "Martes, 30 de junio 2026" },
  { label: "Mañana, 1 de julio", tag: "manana", completa: "Miércoles, 1 de julio 2026" },
  { label: "Jueves, 3 de julio", tag: "semana", completa: "Jueves, 3 de julio 2026" },
  { label: "Sábado, 5 de julio", tag: "finde", completa: "Sábado, 5 de julio 2026" },
];

const CANCHAS = [
  { nombre: "Arenas del Sur", superficie: "Césped sintético" },
  { nombre: "Complejo Deportivo Norte", superficie: "Césped sintético" },
  { nombre: "Club River Chico", superficie: "Césped natural" },
];

const FORMATOS = [
  { formato: "5 vs 5", tipo: "Futbol 5 - 40x20 m", jugadores: 10, duracion: "2 tiempos de 25" },
  { formato: "7 vs 7", tipo: "Futbol 7 - 50x30 m", jugadores: 14, duracion: "2 tiempos de 30" },
  { formato: "11 vs 11", tipo: "Futbol 11 - 90x45 m", jugadores: 22, duracion: "2 tiempos de 45" },
];

const CLIMAS = [
  { temp: 18, descripcion: "Parcialmente nublado", humedad: 68 },
  { temp: 22, descripcion: "Despejado", humedad: 55 },
  { temp: 16, descripcion: "Templado", humedad: 72 },
  { temp: 25, descripcion: "Fresco por la noche", humedad: 60 },
];

const EQUIPOS_LOCALES = ["Scaloneta", "Los Pibes FC", "Real Merlo", "Atlético Turrón", "Deportivo Central", "Racing de Barrio"];
const EQUIPOS_VISITANTES = ["Halcones FC", "Estrella Roja", "Los Tanos", "Barrio Norte FC"];
const ARBITROS = ["A confirmar", "Carlos Ramírez", "A confirmar", "Laura Gómez", "A confirmar"];

export const PARTIDOS: Partido[] = Array.from({ length: 24 }, (_, i) => {
  const fecha = FECHAS[i % FECHAS.length];
  const horaInfo = HORAS[i % HORAS.length];
  const cancha = CANCHAS[i % CANCHAS.length];
  const ubicacion = UBICACIONES[i % UBICACIONES.length];
  const formatoInfo = FORMATOS[i % FORMATOS.length];
  const clima = CLIMAS[i % CLIMAS.length];
  const nivel = NIVELES[i % NIVELES.length];

  const rivalConfirmado = i % 2 === 0;
  const precio = 30000 + (i % 5) * 10000;
  const promocion = i % 3 === 0 ? 10000 : i % 3 === 1 ? 0 : 5000;

  return {
    id: i + 1,
    tipo: i % 3 === 0 ? "Amistoso" : "Competitivo",
    nivel,
    fechaLabel: fecha.label,
    fechaTag: fecha.tag,
    fechaCompleta: fecha.completa,
    hora: horaInfo.hora,
    bloque: horaInfo.bloque,
    precio,
    ubicacion: ubicacion.corta,
    direccion: ubicacion.completa,
    canchaNombre: cancha.nombre,
    canchaTipo: formatoInfo.tipo,
    canchaSuperficie: cancha.superficie,
    climaTemp: clima.temp,
    climaDescripcion: clima.descripcion,
    climaHumedad: clima.humedad,
    equipoLocalNombre: EQUIPOS_LOCALES[i % EQUIPOS_LOCALES.length],
    equipoVisitanteNombre: rivalConfirmado ? EQUIPOS_VISITANTES[i % EQUIPOS_VISITANTES.length] : null,
    rankingEstimado: rivalConfirmado ? 1200 + (i % 6) * 65 : null,
    partidosJugados: rivalConfirmado ? 8 + (i % 10) : null,
    nivelRival: rivalConfirmado ? nivel : null,
    costoCancha: precio + promocion,
    promocion,
    entradaJugador: Math.round(precio / formatoInfo.jugadores / 500) * 500,
    maxJugadores: formatoInfo.jugadores,
    formato: formatoInfo.formato,
    duracion: formatoInfo.duracion,
    arbitro: ARBITROS[i % ARBITROS.length],
    estado: i % 7 === 6 ? "Cerrado" : "Abierto",
  };
});

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
