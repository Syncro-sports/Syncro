export type TipoPartido = "Competitivo" | "Amistoso" | "Privada";

export interface PartidoHistorial {
  id: number | string;
  tipo: TipoPartido;
  // Fecha y horario en que se jugo (ya formateado para mostrar)
  fecha: string;
  complejo: string;
  direccion: string;
  // Vacio en reservas privadas (no hay rival)
  rival: string;
  // El backend todavia no informa resultados: si no llegan, no se muestra marcador
  marcadorLocal?: number;
  marcadorVisitante?: number;
}

// Datos de ejemplo: solo se usan si el backend no responde
export const HISTORIAL_MOCK: PartidoHistorial[] = [
  {
    id: "mock-1",
    tipo: "Competitivo",
    fecha: "15 de junio de 2026 · 10:00 – 11:00",
    complejo: "Complejo los Pibes",
    direccion: "Caseros, Buenos Aires",
    rival: "Los Titanes FC",
    marcadorLocal: 3,
    marcadorVisitante: 2,
  },
  {
    id: "mock-2",
    tipo: "Amistoso",
    fecha: "2 de junio de 2026 · 20:00 – 21:00",
    complejo: "Complejo los Pibes",
    direccion: "Caseros, Buenos Aires",
    rival: "Norte United",
    marcadorLocal: 1,
    marcadorVisitante: 1,
  },
];
