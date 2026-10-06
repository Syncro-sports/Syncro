export type TipoEquipo = "FUTBOL 5" | "FUTBOL 7" | "FUTBOL 8" | "FUTBOL 9" | "FUTBOL 11";
export type SuperficieEquipo = "CESPED SINTETICO" | "CESPED NATURAL" | "CEMENTO";
export type NivelEquipo = "A" | "B" | "C";
export type SexoEquipo = "MASCULINO" | "FEMENINO" | "MIXTO";

export interface Equipo {
  id: string;
  nombre: string;
  tipo: TipoEquipo;
  superficie: SuperficieEquipo;
  nivel: NivelEquipo;
  ubicacion: string;
  jugadoresCant: number;
  jugadoresCap: number;
  puntos: number;
}

// Cuando el equipo de backend conecte esta vista, esta bandera pasa a true
const sesionIniciada = false;

const equiposMock: Equipo[] = [
  {
    id: "3",
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
    id: "2",
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
    id: "1",
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

// Filtros que el backend realmente soporta en GET /equipos: nivel, sexo y ubicacion.
// La ubicacion es el texto exacto que cargo el equipo ("" = todas las zonas).
export interface FiltrosEquipos {
  niveles: NivelEquipo[];
  sexos: SexoEquipo[];
  ubicacion: string;
}

export const FILTROS_EQUIPOS_INICIALES: FiltrosEquipos = {
  niveles: [],
  sexos: [],
  ubicacion: "",
};
