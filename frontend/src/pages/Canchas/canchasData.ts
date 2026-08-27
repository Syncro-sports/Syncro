export type TipoCancha =
  | "FUTBOL 5"
  | "FUTBOL 7"
  | "FUTBOL 8"
  | "FUTBOL 9"
  | "FUTBOL 11";

export type SuperficieCancha =
  | "CESPED SINTETICO"
  | "CESPED NATURAL"
  | "CEMENTO";

export type NivelCancha = "A" | "B" | "C";

export interface ComplejoCancha {
  id: number;
  nombre: string;
  localidad: string;
  distanciaKm: number;
  distanciaLabel: string;
  direccion: string;
  precio: number;
  descuento: string | null;
  descuentoMonto: number;
  rankingTag: string | null;
  rating: number;
  reviewsCount: number;
  imagen: string;
  imagenes: string[];
  tipo: TipoCancha;
  superficie: SuperficieCancha;
  nivel: NivelCancha;
  turnosHoy: string[];
  servicios: string[];
  ownerNotes: string;
  highlights: string[];
  coords: {
    xPercent: number;
    yPercent: number;
    lat: number;
    lng: number;
  };
}

export interface FiltrosCanchas {
  tipos: TipoCancha[];
  superficies: SuperficieCancha[];
  niveles: NivelCancha[];
  ubicacion: string;
}

export const FILTROS_CANCHAS_INICIALES: FiltrosCanchas = {
  tipos: [],
  superficies: [],
  niveles: [],
  ubicacion: "todas",
};

export const UBICACIONES_DISPONIBLES = [
  { id: "todas", label: "TODAS LAS ZONAS" },
  { id: "monte-grande", label: "MONTE GRANDE" },
  { id: "canning", label: "CANNING" },
  { id: "lomas", label: "LOMAS DE ZAMORA" },
  { id: "lanus", label: "LANÚS" },
  { id: "adrogue", label: "ADROGUÉ" },
  { id: "banfield", label: "BANFIELD" },
  { id: "ezeiza", label: "EZEIZA" },
];

export const COMPLEJOS_CANCHAS: ComplejoCancha[] = [
  {
    id: 1,
    nombre: "Arena del Sur",
    localidad: "Caseros",
    distanciaKm: 0.6,
    distanciaLabel: "0,6 km",
    direccion: "Av. San Martín 3250, Caseros, Buenos Aires",
    precio: 40000,
    descuento: "20% OFF",
    descuentoMonto: 8000,
    rankingTag: "Ranking",
    rating: 4.8,
    reviewsCount: 128,
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
    imagenes: [
      `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
      `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
      `${import.meta.env.BASE_URL}assets/canchas/cancha-3.jpg`,
    ],
    tipo: "FUTBOL 5",
    superficie: "CESPED SINTETICO",
    nivel: "A",
    turnosHoy: ["14:00", "16:00", "17:00", "18:00", "20:00", "21:00", "22:00"],
    servicios: [
      "Fútbol 5",
      "Césped Sintético",
      "Iluminación LED",
      "Vestuarios",
      "Estacionamiento",
      "Buffet",
      "Sector Parrillas",
      "WiFi Gratis",
      "Duchas",
    ],
    ownerNotes:
      "¡Bienvenidos a Arena del Sur! Cuidamos cada detalle para que disfrutes de la mejor experiencia de fútbol. Nuestras canchas cuentan con césped monofilamento de 50mm, iluminación LED profesional y vestuarios premium.",
    highlights: [
      "Complejo Premium",
      "Estacionamiento Gratuito",
      "Duchas Calefaccionadas",
      "Sector Parrillas",
      "Buffet y Bar",
      "Ambiente Familiar",
    ],
    coords: { xPercent: 22, yPercent: 42, lat: -34.825, lng: -58.468 },
  },
  {
    id: 2,
    nombre: "Tense Sport",
    localidad: "Monte Grande",
    distanciaKm: 0.6,
    distanciaLabel: "0,6 km",
    direccion: "Av. Fair 1250, Monte Grande, Buenos Aires",
    precio: 50000,
    descuento: "15% OFF",
    descuentoMonto: 7500,
    rankingTag: "Ranking",
    rating: 4.3,
    reviewsCount: 142,
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
    imagenes: [
      `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
      `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
      `${import.meta.env.BASE_URL}assets/canchas/cancha-4.jpg`,
    ],
    tipo: "FUTBOL 5",
    superficie: "CESPED SINTETICO",
    nivel: "A",
    turnosHoy: ["14:00", "16:00", "17:00", "19:00", "21:30"],
    servicios: [
      "Fútbol 5",
      "Césped Sintético",
      "Iluminación LED",
      "Vestuarios",
      "Estacionamiento",
      "Buffet",
      "WiFi Gratis",
    ],
    ownerNotes:
      "Complejo deportivo de primer nivel en Monte Grande con césped monofilamento de 50mm, iluminación LED de última generación y repetición instantánea de jugadas (Replay).",
    highlights: [
      "Complejo Premium",
      "Estacionamiento Gratuito",
      "Duchas Calefaccionadas",
      "Buffet",
      "Grabación Replay HD",
    ],
    coords: { xPercent: 36, yPercent: 28, lat: -34.828, lng: -58.462 },
  },
  {
    id: 3,
    nombre: "Predio San Martín",
    localidad: "Monte Grande",
    distanciaKm: 0.9,
    distanciaLabel: "0,9 km",
    direccion: "Gral. Rodríguez 840, Monte Grande",
    precio: 50000,
    descuento: "15% OFF",
    descuentoMonto: 7500,
    rankingTag: "Ranking",
    rating: 4.3,
    reviewsCount: 98,
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-3.jpg`,
    imagenes: [
      `${import.meta.env.BASE_URL}assets/canchas/cancha-3.jpg`,
      `${import.meta.env.BASE_URL}assets/canchas/cancha-5.jpg`,
    ],
    tipo: "FUTBOL 7",
    superficie: "CESPED SINTETICO",
    nivel: "B",
    turnosHoy: ["14:00", "16:00", "17:00", "19:00", "22:00"],
    servicios: [
      "Fútbol 7",
      "Césped Sintético",
      "Iluminación LED",
      "Vestuarios",
      "Sector Parrillas",
    ],
    ownerNotes:
      "Predio exclusivo para fútbol 7 con sector de parrillas para después del partido, vestuarios calefaccionados y amplio estacionamiento.",
    highlights: [
      "Estacionamiento Gratuito",
      "Sector Parrillas",
      "Duchas Calefaccionadas",
    ],
    coords: { xPercent: 43, yPercent: 68, lat: -34.872, lng: -58.502 },
  },
  {
    id: 4,
    nombre: "Arenas Club Central",
    localidad: "Canning",
    distanciaKm: 1.4,
    distanciaLabel: "1,4 km",
    direccion: "Ruta 58 Km 9, Canning",
    precio: 50000,
    descuento: "15% OFF",
    descuentoMonto: 7500,
    rankingTag: "Ranking",
    rating: 4.3,
    reviewsCount: 215,
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-4.jpg`,
    imagenes: [
      `${import.meta.env.BASE_URL}assets/canchas/cancha-4.jpg`,
      `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
    ],
    tipo: "FUTBOL 5",
    superficie: "CESPED SINTETICO",
    nivel: "A",
    turnosHoy: ["14:00", "16:00", "17:00", "19:00", "20:30"],
    servicios: [
      "Fútbol 5",
      "Césped Sintético",
      "Iluminación LED",
      "Vestuarios",
      "Estacionamiento",
      "Buffet",
      "WiFi Gratis",
    ],
    ownerNotes:
      "Canchas techadas de césped sintético y piso flotante para fútbol y futsal en Canning con todas las comodidades.",
    highlights: [
      "Complejo Premium",
      "Estacionamiento Gratuito",
      "Buffet",
    ],
    coords: { xPercent: 51, yPercent: 72, lat: -34.831, lng: -58.472 },
  },
  {
    id: 5,
    nombre: "El Templo Fútbol",
    localidad: "Canning",
    distanciaKm: 1.8,
    distanciaLabel: "1,8 km",
    direccion: "Mariano Castex 3200, Canning",
    precio: 50000,
    descuento: "15% OFF",
    descuentoMonto: 7500,
    rankingTag: "Ranking",
    rating: 4.3,
    reviewsCount: 180,
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-5.jpg`,
    imagenes: [
      `${import.meta.env.BASE_URL}assets/canchas/cancha-5.jpg`,
      `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
    ],
    tipo: "FUTBOL 11",
    superficie: "CESPED NATURAL",
    nivel: "A",
    turnosHoy: ["14:00", "16:00", "17:00", "19:00", "21:00"],
    servicios: [
      "Fútbol 11",
      "Césped Natural",
      "Iluminación LED",
      "Vestuarios",
      "Estacionamiento",
      "Sector Parrillas",
    ],
    ownerNotes:
      "Cancha de fútbol 11 profesional con medidas reglamentarias FIFA, gradas para espectadores y riego computarizado.",
    highlights: [
      "Complejo Premium",
      "Estacionamiento Gratuito",
      "Sector Parrillas",
    ],
    coords: { xPercent: 68, yPercent: 46, lat: -34.881, lng: -58.511 },
  },
  {
    id: 6,
    nombre: "Urban Soccer Club",
    localidad: "Lomas de Zamora",
    distanciaKm: 2.5,
    distanciaLabel: "2,5 km",
    direccion: "Hipólito Yrigoyen 8900, Lomas",
    precio: 50000,
    descuento: "15% OFF",
    descuentoMonto: 7500,
    rankingTag: "Ranking",
    rating: 4.3,
    reviewsCount: 230,
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
    imagenes: [
      `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
      `${import.meta.env.BASE_URL}assets/canchas/cancha-3.jpg`,
    ],
    tipo: "FUTBOL 5",
    superficie: "CEMENTO",
    nivel: "C",
    turnosHoy: ["14:00", "16:00", "17:00", "19:00", "22:15"],
    servicios: [
      "Fútbol 5",
      "Cemento Pulido",
      "Iluminación LED",
      "Vestuarios",
      "Buffet",
      "WiFi Gratis",
    ],
    ownerNotes:
      "Gimnasio techado para futsal y fútbol 5 en Lomas de Zamora con vestuarios y cantina.",
    highlights: [
      "Estacionamiento Gratuito",
      "Buffet",
      "Ambiente Familiar",
    ],
    coords: { xPercent: 28, yPercent: 78, lat: -34.761, lng: -58.402 },
  },
];
