export type DeporteTipo = "Fútbol" | "Futsal";
export type FormatoTipo = "5 vs 5" | "6 vs 6" | "7 vs 7" | "8 vs 8" | "9 vs 9" | "11 vs 11";
export type SuperficieTipo = "Sintético" | "Césped natural" | "Parquet" | "Cemento";
export type EstadoCancha = "activa" | "mantenimiento" | "inactiva";

export const calcularDescuentoLabel = (precioOriginal: number, precioDescuento: number): string => {
  if (!precioOriginal || !precioDescuento || Number(precioDescuento) >= Number(precioOriginal)) {
    return "";
  }
  const porcentaje = Math.round(((Number(precioOriginal) - Number(precioDescuento)) / Number(precioOriginal)) * 100);
  return porcentaje > 0 ? `${porcentaje}% off` : "";
};

export interface Cancha {
  id: number | string;
  nombre: string;
  imagen: string;
  deporte: DeporteTipo;
  formato: FormatoTipo;
  superficie: SuperficieTipo;
  esTechada: boolean;
  esCompetitiva: boolean;
  esIluminada: boolean;
  replay: boolean;
  estado: EstadoCancha;
  precioOriginal: number;
  precioDescuento: number;
  precioNoche: number;
  senia: number;
  descuentoLabel: string;
  rating: number;
  tags: string[];
  descripcion?: string;
}

export const DEPORTES_OPCIONES: DeporteTipo[] = ["Fútbol", "Futsal"];
export const FORMATOS_OPCIONES: FormatoTipo[] = [
  "5 vs 5",
  "6 vs 6",
  "7 vs 7",
  "8 vs 8",
  "9 vs 9",
  "11 vs 11",
];
export const SUPERFICIES_OPCIONES: SuperficieTipo[] = ["Sintético", "Césped natural", "Parquet", "Cemento"];
export const ESTADOS_OPCIONES: { valor: EstadoCancha; label: string }[] = [
  { valor: "activa", label: "Activa" },
  { valor: "mantenimiento", label: "En Mantenimiento" },
  { valor: "inactiva", label: "Inactiva" },
];

export const IMAGENES_PRESET: string[] = [
  `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
  `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
  `${import.meta.env.BASE_URL}assets/canchas/cancha-3.jpg`,
  `${import.meta.env.BASE_URL}assets/canchas/cancha-4.jpg`,
  `${import.meta.env.BASE_URL}assets/canchas/cancha-5.jpg`,
];

export const CANCHAS: Cancha[] = [
  {
    id: 1,
    nombre: "Cancha 1 - Monumental",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
    deporte: "Fútbol",
    formato: "5 vs 5",
    superficie: "Sintético",
    esTechada: true,
    esCompetitiva: true,
    esIluminada: true,
    replay: true,
    estado: "activa",
    tags: ["Fútbol 5", "Techada", "Competitiva", "Replay", "4.8 ★"],
    precioOriginal: 25000,
    precioDescuento: 20000,
    precioNoche: 28000,
    senia: 8000,
    descuentoLabel: "20% off",
    rating: 4.8,
    descripcion: "Cancha de fútbol 5 con césped sintético de última generación de 50mm, iluminación LED profesional y sistema de grabación de jugadas (Replay).",
  },
  {
    id: 2,
    nombre: "Cancha 2 - La Bombonera",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
    deporte: "Fútbol",
    formato: "11 vs 11",
    superficie: "Césped natural",
    esTechada: false,
    esCompetitiva: true,
    esIluminada: true,
    replay: false,
    estado: "activa",
    tags: ["Fútbol 11", "Césped natural", "Competitiva", "4.9 ★"],
    precioOriginal: 45000,
    precioDescuento: 38000,
    precioNoche: 52000,
    senia: 15000,
    descuentoLabel: "15% off",
    rating: 4.9,
    descripcion: "Cancha reglamentaria de fútbol 11 con césped natural nivelado, gradas para espectadores y riego automático. Ideal para torneos y partidos de alta competencia.",
  },
  {
    id: 3,
    nombre: "Cancha 3 - Wembley",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-3.jpg`,
    deporte: "Futsal",
    formato: "5 vs 5",
    superficie: "Sintético",
    esTechada: false,
    esCompetitiva: false,
    esIluminada: true,
    replay: true,
    estado: "mantenimiento",
    tags: ["Futsal", "Sintético", "5vs5", "4.7 ★"],
    precioOriginal: 22000,
    precioDescuento: 18000,
    precioNoche: 25000,
    senia: 6000,
    descuentoLabel: "18% off",
    rating: 4.7,
    descripcion: "Cancha al aire libre para Futsal 5. Actualmente en mantenimiento por recambio de caucho granulado.",
  },
  {
    id: 4,
    nombre: "Cancha 4 - Maracaná",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-4.jpg`,
    deporte: "Futsal",
    formato: "5 vs 5",
    superficie: "Parquet",
    esTechada: true,
    esCompetitiva: false,
    esIluminada: true,
    replay: false,
    estado: "activa",
    tags: ["Futsal", "Techada", "Parquet", "4.6 ★"],
    precioOriginal: 26000,
    precioDescuento: 21000,
    precioNoche: 29000,
    senia: 8000,
    descuentoLabel: "20% off",
    rating: 4.6,
    descripcion: "Gimnasio techado con piso de parquet flotante amortiguado, apto para futsal y actividades de salón.",
  },
  {
    id: 5,
    nombre: "Cancha 5 - Camp Nou",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-5.jpg`,
    deporte: "Fútbol",
    formato: "7 vs 7",
    superficie: "Sintético",
    esTechada: true,
    esCompetitiva: true,
    esIluminada: true,
    replay: true,
    estado: "activa",
    tags: ["Fútbol 7", "Techada", "Competitiva", "7vs7", "4.8 ★"],
    precioOriginal: 32000,
    precioDescuento: 26000,
    precioNoche: 36000,
    senia: 10000,
    descuentoLabel: "18% off",
    rating: 4.8,
    descripcion: "Cancha de fútbol 7 techada con redes perimetrales, gradas para espectadores y cámaras automáticas para revivir tus mejores goles.",
  },
];
