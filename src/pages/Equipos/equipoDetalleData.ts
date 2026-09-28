export type ResultadoPartido = "victoria" | "empate" | "derrota";

export interface StreakItem {
  id: string;
  resultado: ResultadoPartido;
}

export interface PartidoHistorial {
  id: string;
  fecha: string;
  equipoLocalNombre: string;
  equipoRivalNombre: string;
  puntosLocal: number;
  puntosRival: number;
  resultado: ResultadoPartido;
}

export interface JugadorEquipo {
  id: string;
  nombre: string;
  posicion: string;
  esCapitan: boolean;
}

export interface EquipoDetalleData {
  equipo: {
    nombre: string;
    torneos: number;
    descripcion: string;
    lugar: string;
    genero: string;
    ctaLabel: string;
  };
  streakLabel: string;
  streakWindowLabel: string;
  streak: StreakItem[];
  tituloHistorial: string;
  Historial: PartidoHistorial[];
  tituloJugadores: string;
  jugadoresCant: number;
  jugadoresCap: number;
  jugadores: JugadorEquipo[];
}

// Mock de respaldo: lo usa equiposService cuando el backend todavia no responde
// (mismo criterio que PARTIDOS en partidosData.ts / COMPLEJOS_CANCHAS en canchasData.ts)
export const EQUIPOS_DETALLE_MOCK: Record<string, EquipoDetalleData> = {
  titanes: {
    equipo: {
      nombre: "Los Titanes",
      torneos: 125,
      descripcion: "Compitiendo con disciplina. Ganando en unidad.",
      lugar: "Banfield",
      genero: "Masculino",
      ctaLabel: "Solicitar entrar",
    },
    streakLabel: "Racha actual:",
    streakWindowLabel: "Ultimos 30 dias",
    streak: [
      { id: "s1", resultado: "empate" },
      { id: "s2", resultado: "derrota" },
      { id: "s3", resultado: "victoria" },
    ],
    tituloHistorial: "Historial de partidos",
    Historial: [
      {
        id: "m1",
        fecha: "12/07",
        equipoLocalNombre: "Los Titanes",
        equipoRivalNombre: "Chelicos",
        puntosLocal: 2,
        puntosRival: 2,
        resultado: "empate",
      },
      {
        id: "m2",
        fecha: "05/07",
        equipoLocalNombre: "Los Titanes",
        equipoRivalNombre: "Tallarines",
        puntosLocal: 1,
        puntosRival: 6,
        resultado: "derrota",
      },
      {
        id: "m3",
        fecha: "12/06",
        equipoLocalNombre: "Los Titanes",
        equipoRivalNombre: "Fernet FC",
        puntosLocal: 7,
        puntosRival: 6,
        resultado: "victoria",
      },
    ],
    tituloJugadores: "Jugadores",
    jugadoresCant: 7,
    jugadoresCap: 15,
    jugadores: [
      { id: "p1", nombre: "Nahuen Perez", posicion: "ARQ", esCapitan: false },
      { id: "p2", nombre: "Jose Lopez", posicion: "DEF", esCapitan: false },
      { id: "p3", nombre: "Juan Cruz Herrera", posicion: "DEF", esCapitan: false },
      { id: "p4", nombre: "Martin Ceballos", posicion: "DEF", esCapitan: false },
      { id: "p5", nombre: "Martin Puentes", posicion: "MED", esCapitan: false },
      { id: "p6", nombre: "Lucas Rodriguez", posicion: "MED", esCapitan: true },
      { id: "p7", nombre: "Mauro Lombardo", posicion: "DEL", esCapitan: false },
    ],
  },
  "norte-united": {
    equipo: {
      nombre: "Norte United",
      torneos: 48,
      descripcion: "Amigos en la cancha. Hermanos fuera de ella.",
      lugar: "San Isidro",
      genero: "Masculino",
      ctaLabel: "Solicitar entrar",
    },
    streakLabel: "Racha actual:",
    streakWindowLabel: "Ultimos 30 dias",
    streak: [
      { id: "s1", resultado: "victoria" },
      { id: "s2", resultado: "victoria" },
      { id: "s3", resultado: "empate" },
    ],
    tituloHistorial: "Historial de partidos",
    Historial: [
      {
        id: "m1",
        fecha: "10/07",
        equipoLocalNombre: "Norte United",
        equipoRivalNombre: "Los Pumas",
        puntosLocal: 3,
        puntosRival: 1,
        resultado: "victoria",
      },
      {
        id: "m2",
        fecha: "03/07",
        equipoLocalNombre: "Norte United",
        equipoRivalNombre: "Halcones FC",
        puntosLocal: 2,
        puntosRival: 2,
        resultado: "empate",
      },
    ],
    tituloJugadores: "Jugadores",
    jugadoresCant: 5,
    jugadoresCap: 15,
    jugadores: [
      { id: "p1", nombre: "Marcos Diaz", posicion: "ARQ", esCapitan: true },
      { id: "p2", nombre: "Ezequiel Torres", posicion: "DEF", esCapitan: false },
      { id: "p3", nombre: "Julian Ferreyra", posicion: "MED", esCapitan: false },
      { id: "p4", nombre: "Ramiro Acosta", posicion: "MED", esCapitan: false },
      { id: "p5", nombre: "Bruno Sosa", posicion: "DEL", esCapitan: false },
    ],
  },
};
