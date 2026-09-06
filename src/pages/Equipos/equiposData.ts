export type TipoEquipo = "FUTBOL 5" | "FUTBOL 7" | "FUTBOL 8" | "FUTBOL 9" | "FUTBOL 11";
export type SuperficieEquipo = "CESPED SINTETICO" | "CESPED NATURAL" | "CEMENTO";
export type NivelEquipo = "A" | "B" | "C";

export interface Equipo {
  id: number;
  nombre: string;
  tipo: TipoEquipo;
  superficie: SuperficieEquipo;
  nivel: NivelEquipo;
  ubicacion: string;
  jugadoresCant: number;
  jugadoresCap: number;
  puntos: number;
}

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

// Cuando el equipo de backend conecte esta vista, esta bandera pasa a true
const sesionIniciada = false;

const equiposMock: Equipo[] = [
  {
    id: 1,
    nombre: "Scaloneta",
    tipo: "FUTBOL 5",
    superficie: "CESPED SINTETICO",
    nivel: "A",
    ubicacion: "Banfield",
    jugadoresCant: 7,
    jugadoresCap: 15,
    puntos: 125,
  },
  {
    id: 2,
    nombre: "Vodka Juniors",
    tipo: "FUTBOL 7",
    superficie: "CESPED NATURAL",
    nivel: "B",
    ubicacion: "Lomas de Zamora",
    jugadoresCant: 12,
    jugadoresCap: 15,
    puntos: 75,
  },
  {
    id: 3,
    nombre: "Tiki Taka",
    tipo: "FUTBOL 5",
    superficie: "CEMENTO",
    nivel: "A",
    ubicacion: "Adrogué",
    jugadoresCant: 15,
    jugadoresCap: 15,
    puntos: 185,
  },
];

const equiposReal: Equipo[] = []; // ddbb_equipos

export const EQUIPOS: Equipo[] = sesionIniciada ? equiposReal : equiposMock;

export interface FiltrosEquipos {
  tipos: TipoEquipo[];
  superficies: SuperficieEquipo[];
  niveles: NivelEquipo[];
  ubicacion: string;
}

export const FILTROS_EQUIPOS_INICIALES: FiltrosEquipos = {
  tipos: [],
  superficies: [],
  niveles: [],
  ubicacion: "todas",
};
