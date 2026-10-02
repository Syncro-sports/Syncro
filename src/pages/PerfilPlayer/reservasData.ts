export interface JugadorPago {
  id: string;
  nombre: string;
  iniciales: string;
  esCapitan?: boolean;
  esYo?: boolean;
  pagado: boolean;
  // Nombre de quien pago la cuota, si la pago otra persona
  pagadoPor?: string;
  // Cuando la fila representa una entrada (slot) real del backend, sin jugador asignado
  entradaId?: string;
  esSlot?: boolean;
}

export interface ReservaDetalleData {
  reservaId: string;
  numero: string;
  estado: "confirmada" | "pendiente";
  tipoLabel: string;
  partidoId?: string;
  tuEquipo?: string;
  rival?: {
    id?: string;
    nombre: string;
    ubicacion?: string;
    nivel?: string;
    // Porcentaje que pago el equipo rival (el jugador NO ve el detalle por persona)
    porcentajePagado?: number;
  };
  fechaLabel: string;
  hora: string;
  canchaNombre: string;
  direccion?: string;
  formato: string;
  superficie: string;
  duracion: string;
  metodoPago: "split" | "full";
  total: number;
  senia: number;
  // Split payment
  cuota?: number;
  jugadores: JugadorPago[];
  yoPagado: boolean;
  otrosPendientes: number;
  // Reserva pagada completa por una sola persona del equipo
  pagoTotalPor?: string;
  // Texto del plazo de pago ("martes 13 de octubre, 20:00") si el backend lo informa
  plazoLabel?: string;
  // Calculo de la cuota (solo se muestra si hay datos para armarlo)
  calculo?: {
    costoCancha: number;
    promocion: number;
    totalConPromocion: number;
    parteEquipo: number;
    jugadoresPorEquipo: number;
    cuota: number;
  };
}

export interface PagoBadge {
  texto: string;
  tono: "pendiente" | "parcial" | "ok";
}

export interface ReservaJugador {
  id: string;
  complejo: string;
  direccion: string;
  fecha: string;
  // YYYY-MM-DD, para calcular proximas reservas
  fechaISO?: string;
  hora: string;
  // Hora de fin (HH:MM). Junto con la fecha define si la reserva ya finalizo
  horaFin?: string;
  deporte: string;
  rival: string;
  tipo: string;
  imagen: string;
  estado: "confirmada" | "pendiente";
  pagoBadge?: PagoBadge;
  esMock?: boolean;
  // true cuando los datos de ejemplo se cargan a proposito para la cuenta demo (sin aviso de error)
  esDemo?: boolean;
  // true cuando la fecha + hora de fin ya pasaron (la reserva va al historial)
  finalizada: boolean;
  detalle: ReservaDetalleData;
}

export interface DatosReservas {
  reservas: ReservaJugador[];
  proximosSieteDias: number;
  estaSemana: number;
  proximaSemana: number;
}

const IMAGEN_MOCK = `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`;

// ---- Datos de ejemplo (se usan solo si el backend no responde) ----

const CUOTA_MOCK = 3300;

const jugadoresMock = (pagaron: Record<number, number | null>): JugadorPago[] => {
  const base = [
    { id: "1", nombre: "Agustín Morales", iniciales: "AM", esCapitan: true },
    { id: "2", nombre: "Ramiro Quintana", iniciales: "RQ", esYo: true },
    { id: "3", nombre: "Mateo Silveira", iniciales: "MS" },
    { id: "4", nombre: "Joaquín Benítez", iniciales: "JB" },
    { id: "5", nombre: "Lucas Ferreyra", iniciales: "LF" },
  ];
  return base.map((j) => {
    const idNum = Number(j.id);
    const pagado = pagaron[idNum] !== undefined;
    const pagoPor = pagaron[idNum];
    const pagador = pagoPor ? base.find((b) => Number(b.id) === pagoPor) : null;
    return {
      ...j,
      pagado,
      ...(pagador ? { pagadoPor: pagador.nombre.split(" ")[0] } : {}),
    };
  });
};

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

// Fechas relativas a hoy, asi los ejemplos siempre quedan en el futuro
// (por ejemplo "2 dias despues de la fecha en que se abre la pagina")
const fechaMock = (diasDespues: number) => {
  const fecha = new Date();
  fecha.setHours(12, 0, 0, 0);
  fecha.setDate(fecha.getDate() + diasDespues);
  const limite = new Date(fecha);
  limite.setDate(limite.getDate() - 1);
  const iso = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
  return {
    iso,
    larga: capitalizar(fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })),
    corta: capitalizar(fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })),
    plazo: `${limite.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}, 10:00`,
  };
};

const detalleMockBase = (
  id: string,
  numero: string,
  diasDespues: number,
): Omit<ReservaDetalleData, "jugadores" | "yoPagado" | "otrosPendientes" | "metodoPago"> => ({
  reservaId: id,
  numero,
  estado: "confirmada",
  tipoLabel: "Competitivo",
  tuEquipo: "CAU FC",
  rival: { id: "titanes", nombre: "Los Titanes FC", ubicacion: "Banfield", nivel: "B" },
  fechaLabel: fechaMock(diasDespues).larga,
  hora: "10:00",
  canchaNombre: "Complejo los Pibes",
  direccion: "Caseros, Buenos Aires",
  formato: "FUTBOL 5",
  superficie: "SINTETICO",
  duracion: "60 mins",
  total: 38000,
  senia: 12000,
  cuota: CUOTA_MOCK,
  plazoLabel: fechaMock(diasDespues).plazo,
  calculo: {
    costoCancha: 38000,
    promocion: 5000,
    totalConPromocion: 33000,
    parteEquipo: 16500,
    jugadoresPorEquipo: 5,
    cuota: CUOTA_MOCK,
  },
});

const reservaMock = (id: string, variante: "pendiente" | "pagado" | "total", diasDespues: number): ReservaJugador => {
  const base = detalleMockBase(id, `MOCK0${id}`.slice(0, 10).toUpperCase(), diasDespues);
  const fecha = fechaMock(diasDespues);
  let detalle: ReservaDetalleData;
  let pagoBadge: PagoBadge;

  if (variante === "pendiente") {
    detalle = {
      ...base,
      metodoPago: "split",
      jugadores: jugadoresMock({ 1: null, 3: 1, 4: null }),
      yoPagado: false,
      otrosPendientes: 1,
      rival: { ...base.rival!, porcentajePagado: 40 },
    };
    pagoBadge = { texto: "Falta tu pago", tono: "pendiente" };
  } else if (variante === "pagado") {
    detalle = {
      ...base,
      metodoPago: "split",
      jugadores: jugadoresMock({ 1: null, 2: null, 4: null, 5: 2 }),
      yoPagado: true,
      otrosPendientes: 1,
      rival: { ...base.rival!, porcentajePagado: 80 },
    };
    pagoBadge = { texto: "Faltan pagos del equipo", tono: "parcial" };
  } else {
    detalle = {
      ...base,
      metodoPago: "full",
      jugadores: [],
      yoPagado: true,
      otrosPendientes: 0,
      pagoTotalPor: "Agustín Morales",
      rival: { ...base.rival!, porcentajePagado: 0 },
    };
    pagoBadge = { texto: "Pagado", tono: "ok" };
  }

  return {
    id,
    complejo: "Complejo los Pibes",
    direccion: "Caseros, Buenos Aires",
    fecha: fecha.corta,
    fechaISO: fecha.iso,
    hora: "10:00 AM",
    deporte: "Fútbol",
    rival: "vs Los Titanes FC",
    tipo: "Competitivo",
    imagen: IMAGEN_MOCK,
    estado: "confirmada",
    pagoBadge,
    esMock: true,
    finalizada: false,
    detalle,
  };
};

export const datosReservasMock: DatosReservas = {
  reservas: [reservaMock("1", "pendiente", 2), reservaMock("2", "pagado", 5), reservaMock("3", "total", 9)],
  // Esta semana + proxima semana suman la cantidad de reservas confirmadas
  // de arriba (2 + 1 = 3), para que los numeros cierren entre si
  proximosSieteDias: 2,
  estaSemana: 2,
  proximaSemana: 1,
};

// Reserva de ejemplo que se agrega siempre a la lista (mientras dura la etapa de demo):
// cae 2 dias despues del dia en que se abre la pagina y tiene una cuota pendiente.
export const reservaDemoSiempre = (): ReservaJugador => ({
  ...reservaMock("demo-proxima", "pendiente", 2),
  esDemo: true,
});
