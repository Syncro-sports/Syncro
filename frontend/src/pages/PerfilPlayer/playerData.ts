export interface EquipoJugador {
  id: string;
  nombre: string;
  escudo: string;
  rango: string;
  proximoPartidoFecha: string;
  rival: string;
  torneo: string;
}

export interface ProximoPartido {
  imagen: string;
  fecha: string;
  hora: string;
  deporte: string;
  equipo: string;
  tipo: string;
}

export interface ActividadItem {
  id: number;
  texto: string;
  tiempo: string;
}

interface DatosUsuario {
  usuario: string;
  expTotal: number;
  partidosJugados: number;
  horasJugadas: number;
  equiposCantidad: number;
  equiposMax: number;
  complejosVisitados: number;
  proximoPartido: ProximoPartido;
  equipo: EquipoJugador;
  actividadReciente: ActividadItem[];
}

const sesionIniciada = false;

const datosUsuarioMock: DatosUsuario = {
  usuario: "insertUser",
  expTotal: 30040,
  partidosJugados: 86,
  horasJugadas: 143,
  equiposCantidad: 2,
  equiposMax: 3,
  complejosVisitados: 18,
    proximoPartido: {
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
    fecha: "Junio 15, 2026",
    hora: "10:00 AM",
    deporte: "Fútbol",
    equipo: "CAU FC",
    tipo: "Competitivo",
  },
  equipo: {
    id: "cau-fc",
    nombre: "CAU FC",
    escudo: `${import.meta.env.BASE_URL}assets/canchas/cau.png`,
    rango: "Rango 5",
    proximoPartidoFecha: "Junio 15, 2026 - 10:00 AM",
    rival: "vs Borra FC",
    torneo: "Los Titanes",
  },
  actividadReciente: [
    { id: 1, texto: "Notificacion 1", tiempo: "Hace 1 día" },
    { id: 2, texto: "Notificacion 2", tiempo: "Hace 1 día" },
    { id: 3, texto: "Notificacion 3", tiempo: "Hace 3 días" },
    { id: 4, texto: "Notificacion 4", tiempo: "Junio 15, 2026" },
  ],
};

const datosUsuarioReal: DatosUsuario = {
  usuario: "", // ddbb_usuario
  expTotal: 0, // ddbb_xp
  partidosJugados: 0, // ddbb_partidos
  horasJugadas: 0, // ddbb_hs
  equiposCantidad: 0,
  equiposMax: 0,
  complejosVisitados: 0,
  proximoPartido: { imagen: "", fecha: "", hora: "", deporte: "", equipo: "", tipo: "" },
  equipo: { id: "", nombre: "", escudo: "", rango: "", proximoPartidoFecha: "", rival: "", torneo: "" },
  actividadReciente: [],
};

export const datosUsuario: DatosUsuario = sesionIniciada ? datosUsuarioReal : datosUsuarioMock;

const XP_POR_NIVEL = 1600;

export interface NivelInfo {
  nivel: number;
  xpActual: number;
  xpRestante: number;
  porcentaje: number;
}

export const calcularNivel = (expTotal: number): NivelInfo => {
  const nivel = Math.floor(expTotal / XP_POR_NIVEL);
  const xpActual = expTotal - nivel * XP_POR_NIVEL;
  const xpRestante = XP_POR_NIVEL - xpActual;
  const porcentaje = (xpActual / XP_POR_NIVEL) * 100;

  return { nivel, xpActual, xpRestante, porcentaje };
};

export const obtenerRangoIcono = (nivel: number): string => {
  if (nivel < 5) return "rango-1.svg";
  if (nivel < 10) return "rango-2.svg";
  if (nivel < 20) return "rango-3.svg";
  return "rango-4.svg";
};

export const obtenerSaludo = (): string => {
  const hora = new Date().getHours();
  if (hora < 12) return "Buenos días";
  if (hora < 20) return "Buenas tardes";
  return "Buenas noches";
};