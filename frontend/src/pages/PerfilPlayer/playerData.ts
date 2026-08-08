export interface EquipoJugador {
  id: string;
  nombre: string;
  escudo: string;
}

interface DatosUsuario {
  usuario: string;
  expTotal: number;
  partidosJugados: number;
  horasJugadas: number;
  equiposCantidad: number;
  equiposMax: number;
  complejosVisitados: number;
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
};

const datosUsuarioReal: DatosUsuario = {
  usuario: "", // ddbb_usuario
  expTotal: 0, // ddbb_xp
  partidosJugados: 0, // ddbb_partidos
  horasJugadas: 0, // ddbb_hs
  equiposCantidad: 0,
  equiposMax: 0,
  complejosVisitados: 0,
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