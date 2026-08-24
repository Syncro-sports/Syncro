export interface CajaStats {
  ingresosHoy: string;
  deltaHoy?: string;
  ingresoSemanal: string;
  deltaSemanal?: string;
  ingresoMensual: string;
  deltaMensual?: string;
  pagosPendientesTotal: string;
  pagosCompletados: string;
  comisionPlataforma: string;
  ganancia: string;
  saldoDisponible: string;
}

export interface ProximoPago {
  id: string;
  fecha: string;
  reserva: string;
  cliente: string;
  monto: number;
  estado: "Pendiente" | "Pendiente Split";
}

export interface Movimiento {
  id: string;
  titulo: string;
  subtitulo: string;
  monto: string;
  tono: "positivo" | "negativo";
  hora: string;
}

export interface SplitPayment {
  id: string;
  equipo: string;
  escudo: string;
  reserva: string;
  fecha: string;
  pagado: number;
  total: number;
}

export interface ProximoCobro {
  id: string;
  titulo: string;
  subtitulo: string;
  monto: string;
}

export interface CajaResponse {
  stats: CajaStats;
  proximosPagos: ProximoPago[];
  ultimosMovimientos: Movimiento[];
  splitPayments: SplitPayment[];
  proximosCobros: ProximoCobro[];
}
