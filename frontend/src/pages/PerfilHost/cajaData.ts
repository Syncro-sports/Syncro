export interface ProximoPago {
  id: string;
  fecha: string;
  reserva: string;
  cliente: string;
  monto: number;
  estado: "Pendiente" | "Pendiente Split";
}

export const PROXIMOS_PAGOS: ProximoPago[] = [
  { id: "1", fecha: "22 Julio, 18:30hs", reserva: "#AA7845", cliente: "Los Pibes FC", monto: 9500, estado: "Pendiente Split" },
  { id: "2", fecha: "22 Julio, 20hs", reserva: "#AA7846", cliente: "Juan Pérez", monto: 45000, estado: "Pendiente" },
  { id: "3", fecha: "23 Julio, 15:30hs", reserva: "#AA7847", cliente: "La Verde FC", monto: 12000, estado: "Pendiente Split" },
  { id: "4", fecha: "24 Julio, 10hs", reserva: "#AA7848", cliente: "San Martín", monto: 38000, estado: "Pendiente" },
  { id: "5", fecha: "24 Julio, 18hs", reserva: "#AA7849", cliente: "Pedro Gómez", monto: 10000, estado: "Pendiente Split" },
];

export interface Movimiento {
  id: string;
  titulo: string;
  subtitulo: string;
  monto: string;
  tono: "positivo" | "negativo";
  hora: string;
}

export const ULTIMOS_MOVIMIENTOS: Movimiento[] = [
  { id: "1", titulo: "Pago recibido", subtitulo: "Reserva #AA7845 - Los Pibes FC", monto: "+$45.000", tono: "positivo", hora: "Hoy 18:30" },
  { id: "2", titulo: "Comisión Syncro", subtitulo: "Sobre reserva #AA7845", monto: "-$2.250", tono: "negativo", hora: "Hoy 18:30" },
  { id: "3", titulo: "Pago recibido", subtitulo: "Reserva #AA7846 - Juan Pérez", monto: "+$38.000", tono: "positivo", hora: "Hoy 16:15" },
  { id: "4", titulo: "Pago recibido", subtitulo: "Reserva #AA7847 - La Verde FC", monto: "+$32.000", tono: "positivo", hora: "Hoy 18:30" },
];

export interface SplitPayment {
  id: string;
  equipo: string;
  escudo: string;
  reserva: string;
  fecha: string;
  pagado: number;
  total: number;
}

export const SPLIT_PAYMENTS: SplitPayment[] = [
  { id: "1", equipo: "Borra FC", escudo: "/assets/canchas/borra-fc.png", reserva: "#AA7850", fecha: "25/07", pagado: 25000, total: 50000 },
  { id: "2", equipo: "CAU FC", escudo: "/assets/canchas/cau.png", reserva: "#AA7855", fecha: "24/07", pagado: 15000, total: 40000 },
];

export interface ProximoCobro {
  id: string;
  titulo: string;
  subtitulo: string;
  monto: string;
}

export const PROXIMOS_COBROS: ProximoCobro[] = [
  { id: "1", titulo: "Se acreditan mañana", subtitulo: "2 reservas", monto: "$82.000" },
  { id: "2", titulo: "En proceso", subtitulo: "3 reservas", monto: "$35.000" },
  { id: "3", titulo: "Retirable", subtitulo: "Disponible para retirar", monto: "$16.220" },
];
