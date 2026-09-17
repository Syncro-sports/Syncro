export interface PagoPendiente {
  id: string;
  imagen: string;
  tipoTag: "Competitivo" | "Amistoso";
  fecha: string;
  complejo: string;
  ubicacion: string;
  rival: string;
  pagados: number;
  totalIntegrantes: number;
  vencimiento: string;
  montoIndividual: number;
}

export interface HistorialItem {
  id: string;
  imagen: string;
  fecha: string;
  complejo: string;
  rival?: string;
  tipo: string;
  monto: number;
  pagador: string;
}

export interface ResumenPagos {
  totalDisponible: number;
  totalPendiente: number;
  cantidadPendientes: number;
  totalPagado: number;
  reembolsado: number;
  cantidadTotalPagos: number;
}

export interface DatosPagos {
  resumen: ResumenPagos;
  pendientes: PagoPendiente[];
  historial: HistorialItem[];
}

const BASE_URL = import.meta.env.BASE_URL;

const sesionIniciada = false;

const datosPagosMock: DatosPagos = {
  resumen: {
    totalDisponible: 5250.0,
    totalPendiente: 3250.0,
    cantidadPendientes: 2,
    totalPagado: 7450.0,
    reembolsado: 5250.0,
    cantidadTotalPagos: 9,
  },
  pendientes: [
    {
      id: "1",
      imagen: `${BASE_URL}assets/canchas/cancha-2.jpg`,
      tipoTag: "Competitivo",
      fecha: "Junio 15, 2026",
      complejo: "Complejo los Pibes",
      ubicacion: "Caseros, Buenos Aires.",
      rival: "vs. Los Titanes FC",
      pagados: 7,
      totalIntegrantes: 8,
      vencimiento: "Vence en 2 días",
      montoIndividual: 1750.0,
    },
    {
      id: "2",
      imagen: `${BASE_URL}assets/canchas/cancha-2.jpg`,
      tipoTag: "Amistoso",
      fecha: "Junio 15, 2026",
      complejo: "Complejo los Pibes",
      ubicacion: "Caseros, Buenos Aires.",
      rival: "vs. Los Titanes FC",
      pagados: 4,
      totalIntegrantes: 6,
      vencimiento: "Vence en 5 días",
      montoIndividual: 1500.0,
    },
  ],

  historial: [
    {
      id: "h1",
      imagen: `${BASE_URL}assets/canchas/cancha-2.jpg`,
      fecha: "Junio 15, 2026",
      complejo: "Complejo los Pibes",
      rival: "vs. Los Titanes FC",
      tipo: "Partida competitiva",
      monto: 1200.0,
      pagador: "Tú",
    },
    {
      id: "h2",
      imagen: `${BASE_URL}assets/canchas/cancha-2.jpg`,
      fecha: "Junio 15, 2026",
      complejo: "Complejo los Pibes",
      rival: "vs. Los Titanes FC",
      tipo: "Partida Amistosa",
      monto: 1800.0,
      pagador: "Juan",
    },
    {
      id: "h3",
      imagen: `${BASE_URL}assets/canchas/cancha-2.jpg`,
      fecha: "Junio 15, 2026",
      complejo: "Complejo los Pibes",
      tipo: "Reserva privada",
      monto: 1600.0,
      pagador: "Tú",
    },
    {
      id: "h4",
      imagen: `${BASE_URL}assets/canchas/cancha-2.jpg`,
      fecha: "Junio 15, 2026",
      complejo: "Complejo los Pibes",
      rival: "vs. Los Titanes FC",
      tipo: "Partida competitiva",
      monto: 1200.0,
      pagador: "Pedro",
    },
  ],
};

const datosPagosReal: DatosPagos = {
  resumen: {
    totalDisponible: 0,
    totalPendiente: 0,
    cantidadPendientes: 0,
    totalPagado: 0,
    reembolsado: 0,
    cantidadTotalPagos: 0,
  },
  pendientes: [],
  historial: [],
};

export const datosPagos: DatosPagos = sesionIniciada
  ? datosPagosReal
  : datosPagosMock;

export const RESUMEN_PAGOS: ResumenPagos = datosPagos.resumen;
export const PAGOS_PENDIENTES: PagoPendiente[] = datosPagos.pendientes;
export const HISTORIAL_PAGOS: HistorialItem[] = datosPagos.historial;
