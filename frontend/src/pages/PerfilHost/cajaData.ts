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

// Cuando el equipo de backend conecte esta vista, esta bandera pasa a venir
// de un contexto de autenticacion o de la respuesta real del fetch
const sesionIniciada = false;

const datosCajaMock: CajaResponse = {
  stats: {
    ingresosHoy: "$5.420",
    deltaHoy: "+14.5%",
    ingresoSemanal: "$32.450",
    deltaSemanal: "+14.5%",
    ingresoMensual: "$124.850",
    deltaMensual: "+14.5%",
    pagosPendientesTotal: "$8.750",
    pagosCompletados: "142",
    comisionPlataforma: "$7.480",
    ganancia: "$24.970",
    saldoDisponible: "$16.220",
  },
  proximosPagos: [
    { id: "1", fecha: "22 Julio, 18:30hs", reserva: "#AA7845", cliente: "Los Pibes FC", monto: 9500, estado: "Pendiente Split" },
    { id: "2", fecha: "22 Julio, 20hs", reserva: "#AA7846", cliente: "Juan Pérez", monto: 45000, estado: "Pendiente" },
    { id: "3", fecha: "23 Julio, 15:30hs", reserva: "#AA7847", cliente: "La Verde FC", monto: 12000, estado: "Pendiente Split" },
    { id: "4", fecha: "24 Julio, 10hs", reserva: "#AA7848", cliente: "San Martín", monto: 38000, estado: "Pendiente" },
    { id: "5", fecha: "24 Julio, 18hs", reserva: "#AA7849", cliente: "Pedro Gómez", monto: 10000, estado: "Pendiente Split" },
  ],
  ultimosMovimientos: [
    { id: "1", titulo: "Pago recibido", subtitulo: "Reserva #AA7845 - Los Pibes FC", monto: "+$45.000", tono: "positivo", hora: "Hoy 18:30" },
    { id: "2", titulo: "Comisión Syncro", subtitulo: "Sobre reserva #AA7845", monto: "-$2.250", tono: "negativo", hora: "Hoy 18:30" },
    { id: "3", titulo: "Pago recibido", subtitulo: "Reserva #AA7846 - Juan Pérez", monto: "+$38.000", tono: "positivo", hora: "Hoy 16:15" },
    { id: "4", titulo: "Pago recibido", subtitulo: "Reserva #AA7847 - La Verde FC", monto: "+$32.000", tono: "positivo", hora: "Hoy 18:30" },
  ],
  splitPayments: [
    { id: "1", equipo: "Borra FC", escudo: `${import.meta.env.BASE_URL}assets/canchas/borra-fc.png`, reserva: "#AA7850", fecha: "25/07", pagado: 25000, total: 50000 },
    { id: "2", equipo: "CAU FC", escudo: `${import.meta.env.BASE_URL}assets/canchas/cau.png`, reserva: "#AA7855", fecha: "24/07", pagado: 15000, total: 40000 },
  ],
  proximosCobros: [
    { id: "1", titulo: "Se acreditan mañana", subtitulo: "2 reservas", monto: "$82.000" },
    { id: "2", titulo: "En proceso", subtitulo: "3 reservas", monto: "$35.000" },
    { id: "3", titulo: "Retirable", subtitulo: "Disponible para retirar", monto: "$16.220" },
  ],
};

const datosCajaReal: CajaResponse = {
  stats: {
    ingresosHoy: "", // ddbb_ingresos_hoy
    ingresoSemanal: "", // ddbb_ingreso_semanal
    ingresoMensual: "", // ddbb_ingreso_mensual
    pagosPendientesTotal: "", // ddbb_pagos_pendientes_total
    pagosCompletados: "", // ddbb_pagos_completados
    comisionPlataforma: "", // ddbb_comision_plataforma
    ganancia: "", // ddbb_ganancia
    saldoDisponible: "", // ddbb_saldo_disponible
  },
  proximosPagos: [], // ddbb_proximos_pagos
  ultimosMovimientos: [], // ddbb_ultimos_movimientos
  splitPayments: [], // ddbb_split_payments
  proximosCobros: [], // ddbb_proximos_cobros
};

export const datosCaja: CajaResponse = sesionIniciada ? datosCajaReal : datosCajaMock;
