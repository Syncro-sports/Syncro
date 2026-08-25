export interface ValoracionReciente {
  id: string;
  nombre: string;
  puntaje: number;
  comentario: string;
}

export interface DistribucionEstrella {
  estrellas: number;
  porcentaje: number;
  cantidad: number;
  color: string;
}

interface DatosValoraciones {
  promedio: number;
  promedioDelta: string;
  total: number;
  totalDelta: string;
  positivas: number;
  positivasNota: string;
  negativas: number;
  negativasNota: string;
  recientes: ValoracionReciente[];
  distribucion: DistribucionEstrella[];
}

// Criterio definido por PM: una valoracion se considera positiva a partir
// de 4 puntos (inclusive), y negativa por debajo de 4. Cuando el backend
// devuelva el listado completo de valoraciones individuales, esta funcion
// se usa para calcular "positivas"/"negativas" en vez de los numeros fijos
// de abajo (ej: valoracionesRaw.filter(v => esValoracionPositiva(v.puntaje)).length)
export const esValoracionPositiva = (puntaje: number): boolean => puntaje >= 4;

// Cuando el equipo de backend conecte esta vista, esta bandera pasa a venir
// de un contexto de autenticacion o de la respuesta real del fetch
const sesionIniciada = false;

const datosValoracionesMock: DatosValoraciones = {
  promedio: 4.7,
  promedioDelta: "+0.2 vs el mes pasado",
  total: 326,
  totalDelta: "+18.6% vs el mes pasado",
  positivas: 289,
  positivasNota: "88.7% del total",
  negativas: 36,
  negativasNota: "+11.3% del total",
  recientes: [
    { id: "1", nombre: "Lucas Fernandez", puntaje: 4.5, comentario: "Excelente cancha, muy buena iluminación y el cesped está en perfectas condiciones. Volveremos seguro" },
    { id: "2", nombre: "Matias Romero", puntaje: 5, comentario: "La mejor cancha en la que jugué. Todo impecable. Vestuarios limpios y buen ambiente" },
    { id: "3", nombre: "Nicolás Pérez", puntaje: 4, comentario: "Muy buena cancha y atención. Solo faltaría mejorar un poco la comodidad de los vestuarios." },
    { id: "4", nombre: "Agustín Díaz", puntaje: 4.5, comentario: "Buen estado del cesped y las instalaciones. Recomendable." },
    // Datos genéricos de relleno, no estaban definidos en el Figma
    { id: "5", nombre: "Camila Sosa", puntaje: 5, comentario: "Todo excelente, la reserva fue muy fácil y la cancha estaba impecable." },
    { id: "6", nombre: "Franco Molina", puntaje: 4, comentario: "Buena experiencia en general, aunque el estacionamiento podría ser más grande." },
  ],
  distribucion: [
    { estrellas: 5, porcentaje: 62, cantidad: 202, color: "var(--host-green)" },
    { estrellas: 4, porcentaje: 24, cantidad: 78, color: "#22d3ee" },
    { estrellas: 3, porcentaje: 8, cantidad: 26, color: "#eab308" },
    { estrellas: 2, porcentaje: 4, cantidad: 13, color: "#f97316" },
    { estrellas: 1, porcentaje: 2, cantidad: 7, color: "#ef4444" },
  ],
};

const datosValoracionesReal: DatosValoraciones = {
  promedio: 0, // ddbb_promedio
  promedioDelta: "", // ddbb_promedio_delta
  total: 0, // ddbb_total
  totalDelta: "", // ddbb_total_delta
  positivas: 0, // ddbb_positivas (calculado con esValoracionPositiva sobre valoracionesRaw)
  positivasNota: "", // ddbb_positivas_nota
  negativas: 0, // ddbb_negativas
  negativasNota: "", // ddbb_negativas_nota
  recientes: [], // ddbb_valoraciones_recientes
  distribucion: [], // ddbb_distribucion
};

export const datosValoraciones: DatosValoraciones = sesionIniciada
  ? datosValoracionesReal
  : datosValoracionesMock;