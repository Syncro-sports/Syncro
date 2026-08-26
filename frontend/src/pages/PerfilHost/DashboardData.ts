export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaTone?: "negative";
}

export interface Cancha {
  id: string;
  nombre: string;
}

export interface ConfiguracionHorarios {
  horaMin: number;
  horaMax: number;
  intervalo: number;
}

export interface IngresoSemanal {
  dia: string;
  monto: number;
}

export interface CanchaMasRentable {
  nombre: string;
  monto: number;
  descripcion: string;
}

export interface HorarioMasDemandado {
  horaInicio: number;
  horaFin: number;
  porcentaje: number;
}

export interface ReservaPromedio {
  monto: number;
  variacion: number;
  descripcion: string;
}

export interface InsightsDashboard {
  canchaMasRentable: CanchaMasRentable;
  horarioMasDemandado: HorarioMasDemandado;
  reservaPromedio: ReservaPromedio;
}

export interface AccionRapida {
  id: string;
  label: string;
  icon: string;
  route?: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  canchas: Cancha[];
  configuracionHorarios: ConfiguracionHorarios;
  ingresosSemanal: IngresoSemanal[];
  insights: InsightsDashboard;
  accionesRapidas: AccionRapida[];
}

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "ingresos-hoy",
    label: "Ingresos hoy",
    value: "$124.500",
    delta: "+14.5%",
  },
  {
    id: "reservas-activas",
    label: "Reservas activas",
    value: "18",
    delta: "+9",
  },
  {
    id: "ocupacion",
    label: "Ocupación",
    value: "82%",
    delta: "+5%",
  },
  {
    id: "cancelaciones",
    label: "Cancelaciones",
    value: "3",
    delta: "-33%",
    deltaTone: "negative",
  },
];

export const CANCHAS: Cancha[] = [
  {
    id: "cancha-1",
    nombre: "cancha 1",
  },
  {
    id: "cancha-2",
    nombre: "cancha 2",
  },
  {
    id: "cancha-3",
    nombre: "cancha 3",
  },
  {
    id: "cancha-4",
    nombre: "cancha 4",
  },
];

export const CONFIGURACION_HORARIOS: ConfiguracionHorarios = {
  horaMin: 6,
  horaMax: 24,
  intervalo: 2,
};

export const INGRESO_SEMANAL: IngresoSemanal[] = [
  {
    dia: "Lunes",
    monto: 95000,
  },
  {
    dia: "Martes",
    monto: 60000,
  },
  {
    dia: "Miércoles",
    monto: 110000,
  },
  {
    dia: "Jueves",
    monto: 130000,
  },
  {
    dia: "Viernes",
    monto: 150000,
  },
  {
    dia: "Sábado",
    monto: 170000,
  },
  {
    dia: "Domingo",
    monto: 65000,
  },
];

export const INSIGHTS_DASHBOARD: InsightsDashboard = {
  canchaMasRentable: {
    nombre: "Cancha 1",
    monto: 45080,
    descripcion: "ganancia mensual",
  },

  horarioMasDemandado: {
    horaInicio: 20,
    horaFin: 22,
    porcentaje: 79,
  },

  reservaPromedio: {
    monto: 14200,
    variacion: 8.3,
    descripcion: "vs ultimo mes",
  },
};

export const ACCIONES_RAPIDAS: AccionRapida[] = [
  {
    id: "agregar-cancha",
    label: "Añadir cancha",
    icon: `${import.meta.env.BASE_URL}assets/icons/canchas.svg`,
    route: "/perfil-host/canchas",
  },
  {
    id: "ver-ingresos",
    label: "Ver ingresos",
    icon: `${import.meta.env.BASE_URL}assets/icons/dinero.svg`,
    route: "/perfil-host/caja",
  },
  {
    id: "exportar-reporte",
    label: "Exportar reporte semanal",
    icon: `${import.meta.env.BASE_URL}assets/icons/exportar-reporte.svg`,
  },
];

export const DASHBOARD_DATA: DashboardData = {
  stats: DASHBOARD_STATS,
  canchas: CANCHAS,
  configuracionHorarios: CONFIGURACION_HORARIOS,
  ingresosSemanal: INGRESO_SEMANAL,
  insights: INSIGHTS_DASHBOARD,
  accionesRapidas: ACCIONES_RAPIDAS,
};