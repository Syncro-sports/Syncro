import { apiClient } from "./apiClient";
import { authService } from "./authService";
import { pagosService, TipoPago } from "./pagosService";
import { HISTORIAL_MOCK, PartidoHistorial } from "../pages/PerfilPlayer/HistorialData";
import {
  datosReservasMock,
  DatosReservas,
  reservaDemoSiempre,
  JugadorPago,
  ReservaDetalleData,
  ReservaJugador,
} from "../pages/PerfilPlayer/reservasData";

const IMAGEN_POR_DEFECTO = `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`;

// Cuenta de demostracion: si el backend no devuelve resultados para ella se cargan
// datos de ejemplo, asi se puede mostrar todo el perfil. En cuanto el backend tenga
// datos reales para esa cuenta, se muestran esos y los de ejemplo dejan de aparecer.
const EMAIL_CUENTA_DEMO = "jugador@syncro.com";

// Mientras dura la etapa de demo, siempre se agrega una reserva de ejemplo que cae
// 2 dias despues del dia en que se abre la pagina, para que la lista nunca quede vacia.
// Para quitarla: poner esta constante en false (o borrar su uso).
const AGREGAR_RESERVA_DEMO_SIEMPRE = true;

const esCuentaDemo = (): boolean => authService.obtenerUsuario()?.email?.toLowerCase() === EMAIL_CUENTA_DEMO;

const reservasDemo = (): ReservaJugador[] => datosReservasMock.reservas.map((r) => ({ ...r, esDemo: true }));

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

const fechaDesdeISO = (iso: string) => new Date(`${iso}T12:00:00`);

const fechaCorta = (iso: string) =>
  capitalizar(fechaDesdeISO(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }));

const fechaLarga = (iso: string) =>
  capitalizar(
    fechaDesdeISO(iso).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  );

const minutosEntre = (inicio?: string, fin?: string): number | null => {
  if (!inicio || !fin) return null;
  const [hi, mi] = inicio.split(":").map(Number);
  const [hf, mf] = fin.split(":").map(Number);
  const minutos = hf * 60 + mf - (hi * 60 + mi);
  return Number.isFinite(minutos) && minutos > 0 ? minutos : null;
};

// Una reserva finalizo cuando ya paso su fecha + hora de fin.
// Si termina de madrugada (hora de fin menor a la de inicio) es del dia siguiente.
const yaFinalizo = (fecha: string, horaInicio?: string, horaFin?: string): boolean => {
  if (!fecha) return false;
  const fin = new Date(`${fecha}T${horaFin || horaInicio || "23:59"}:00`);
  if (Number.isNaN(fin.getTime())) return false;
  if (horaInicio && horaFin && horaFin < horaInicio) fin.setDate(fin.getDate() + 1);
  return fin.getTime() < Date.now();
};

const plazoLabel = (fechaLimite?: string | null) => {
  if (!fechaLimite) return undefined;
  const fecha = new Date(fechaLimite);
  if (Number.isNaN(fecha.getTime())) return undefined;
  const dia = fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const hora = fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${dia}, ${hora}`;
};

// Convierte una reserva tal cual la devuelve GET /reservas/mis-reservas
// (con la cancha ya populada) en lo que usa la lista y el detalle.
// Devuelve null para las reservas canceladas o expiradas (van al historial).
const mapearReserva = (raw: any): ReservaJugador | null => {
  const estado =
    raw.estado === "confirmada"
      ? "confirmada"
      : raw.estado === "pendiente" || raw.estado === "pendiente_pago"
        ? "pendiente"
        : null;
  if (!estado) return null;

  const cancha = raw.canchaId && typeof raw.canchaId === "object" ? raw.canchaId : {};
  const esSplit = raw.metodoPago === "split";
  const id = String(raw._id);
  const minutos = cancha.duracionTurno ?? minutosEntre(raw.horaInicio, raw.horaFin);

  const detalle: ReservaDetalleData = {
    reservaId: id,
    numero: raw.numero ? String(raw.numero) : id.slice(-6).toUpperCase(),
    estado,
    tipoLabel: raw.tipoReserva === "matchmaking" ? "Matchmaking" : "Reserva privada",
    ...(raw.partidoId ? { partidoId: String(raw.partidoId) } : {}),
    fechaLabel: fechaLarga(raw.fecha),
    hora: raw.horaInicio,
    canchaNombre: cancha.nombre ?? "Cancha",
    ...(cancha.direccion ? { direccion: cancha.direccion } : {}),
    formato: cancha.formato ?? "-",
    superficie: cancha.superficie ?? "-",
    duracion: minutos ? `${minutos} mins` : "-",
    metodoPago: esSplit ? "split" : "full",
    total: raw.total ?? 0,
    senia: raw.senia ?? 0,
    jugadores: [],
    yoPagado: estado === "confirmada",
    otrosPendientes: 0,
    ...(plazoLabel(raw.fechaLimitePago ?? raw.expiraEn)
      ? { plazoLabel: plazoLabel(raw.fechaLimitePago ?? raw.expiraEn) }
      : {}),
  };

  return {
    id,
    complejo: cancha.nombre ?? "Cancha",
    direccion: cancha.direccion ?? "",
    fecha: fechaCorta(raw.fecha),
    fechaISO: raw.fecha,
    hora: raw.horaInicio,
    ...(raw.horaFin ? { horaFin: raw.horaFin } : {}),
    deporte: cancha.deporte ?? "Fútbol",
    rival: raw.partidoId ? "Partido de matchmaking" : "Reserva privada",
    tipo: detalle.tipoLabel,
    imagen: cancha.imagenUrl || IMAGEN_POR_DEFECTO,
    estado,
    finalizada: yaFinalizo(raw.fecha, raw.horaInicio, raw.horaFin),
    ...(estado === "pendiente" ? { pagoBadge: { texto: "Falta tu pago", tono: "pendiente" as const } } : {}),
    detalle,
  };
};

const lunesDeLaSemana = (fecha: Date) => {
  const lunes = new Date(fecha);
  lunes.setHours(0, 0, 0, 0);
  const dia = (lunes.getDay() + 6) % 7;
  lunes.setDate(lunes.getDate() - dia);
  return lunes;
};

const calcularResumen = (reservas: ReservaJugador[]): Omit<DatosReservas, "reservas"> => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const en7dias = new Date(hoy);
  en7dias.setDate(hoy.getDate() + 7);
  const lunes = lunesDeLaSemana(hoy);
  const proximoLunes = new Date(lunes);
  proximoLunes.setDate(lunes.getDate() + 7);
  const luegoDelProximo = new Date(lunes);
  luegoDelProximo.setDate(lunes.getDate() + 14);

  let proximosSieteDias = 0;
  let estaSemana = 0;
  let proximaSemana = 0;

  reservas
    .filter((r) => r.estado === "confirmada" && !r.finalizada && r.fechaISO)
    .forEach((r) => {
      const fecha = fechaDesdeISO(r.fechaISO!);
      fecha.setHours(0, 0, 0, 0);
      if (fecha >= hoy && fecha < en7dias) proximosSieteDias++;
      if (fecha >= lunes && fecha < proximoLunes) estaSemana++;
      else if (fecha >= proximoLunes && fecha < luegoDelProximo) proximaSemana++;
    });

  return { proximosSieteDias, estaSemana, proximaSemana };
};

// Une las entradas (slots) del backend con lo que se muestra en el detalle.
// OJO: el backend no dice a que equipo pertenece cada entrada ni el nombre de
// quien la pago (solo ids), por eso cada fila se muestra como "Cuota N".
// TODO(back): ver como saber que entradas son de mi equipo y quien las pago.
const aplicarEntradas = (detalle: ReservaDetalleData, entradas: any[]): ReservaDetalleData => {
  const miId = authService.obtenerUsuario()?._id;
  const ordenadas = [...entradas].sort((a, b) => (a.numeroSlot ?? 0) - (b.numeroSlot ?? 0));

  const jugadores: JugadorPago[] = ordenadas.map((e) => {
    const esMia = miId !== undefined && [e.jugadorId, e.compradorId].map(String).includes(String(miId));
    return {
      id: String(e._id),
      entradaId: String(e._id),
      esSlot: true,
      nombre: esMia ? (authService.obtenerUsuario()?.nombre ?? "Vos") : `Cuota ${e.numeroSlot}`,
      iniciales: esMia ? "VOS" : String(e.numeroSlot ?? "?"),
      esYo: esMia,
      pagado: e.estado === "pagada",
    };
  });

  const yoPagado = jugadores.some((j) => j.esYo && j.pagado);
  const pendientes = jugadores.filter((j) => !j.pagado).length;

  return {
    ...detalle,
    jugadores,
    yoPagado,
    otrosPendientes: Math.max(0, pendientes - (yoPagado ? 0 : 1)),
    cuota: ordenadas[0]?.precioUnitario ?? detalle.cuota,
  };
};

// Trae todas las reservas del jugador (canceladas y expiradas se descartan)
const listarReservas = async (): Promise<ReservaJugador[]> => {
  const data = await apiClient.get<any[]>("/reservas/mis-reservas", {
    mensajeError: "No se pudieron obtener tus reservas",
  });
  return (Array.isArray(data) ? data : [])
    .map(mapearReserva)
    .filter((r): r is ReservaJugador => r !== null);
};

export const reservasService = {
  // Mock solo si el backend no responde (offline, CORS, sesion vencida).
  // Si responde, se usan los datos reales aunque la lista venga vacia.
  // Las reservas que ya finalizaron no se listan aca: van al historial.
  // TODO(post-presentacion 6/10): el fallback a mock ante CUALQUIER error es temporal,
  // para que la demo siempre muestre algo. Despues pasarlo a un flag (VITE_USE_MOCKS)
  // y mostrar un estado de error real. Ver AUDITORIA_PERFIL_JUGADOR.md (hallazgo A1).
  obtenerMisReservas: async (): Promise<DatosReservas & { esMock: boolean }> => {
    try {
      const reservas = (await listarReservas())
        .filter((r) => !r.finalizada)
        // La mas proxima primero; si son el mismo dia, la de horario mas temprano
        .sort((a, b) => (a.fechaISO ?? "").localeCompare(b.fechaISO ?? "") || a.hora.localeCompare(b.hora));

      // Cuenta demo sin reservas reales: se cargan las de ejemplo
      if (reservas.length === 0 && esCuentaDemo()) {
        return { ...datosReservasMock, reservas: reservasDemo(), esMock: true };
      }

      if (AGREGAR_RESERVA_DEMO_SIEMPRE) {
        reservas.push(reservaDemoSiempre());
        reservas.sort((a, b) => (a.fechaISO ?? "").localeCompare(b.fechaISO ?? "") || a.hora.localeCompare(b.hora));
      }

      return { reservas, ...calcularResumen(reservas), esMock: false };
    } catch (error) {
      console.warn("Backend de reservas no disponible, usando datos de ejemplo", error);
      return { ...datosReservasMock, esMock: true };
    }
  },

  // Historial: reservas confirmadas que ya finalizaron (fecha + hora de fin pasadas),
  // de la mas reciente a la mas antigua. Mock solo si el backend no responde.
  // TODO(back): el backend no informa el resultado (marcador), por eso no se muestra.
  obtenerHistorial: async (): Promise<{ partidos: PartidoHistorial[]; esMock: boolean; esDemo?: boolean }> => {
    try {
      const finalizadas = (await listarReservas())
        .filter((r) => r.estado === "confirmada" && r.finalizada)
        .sort((a, b) => (b.fechaISO ?? "").localeCompare(a.fechaISO ?? "") || b.hora.localeCompare(a.hora));

      const partidos = await Promise.all(
        finalizadas.map(async (r): Promise<PartidoHistorial> => {
          let tipo: PartidoHistorial["tipo"] = "Privada";
          let rival = "";

          // Si la reserva viene de un partido, se completa con el tipo y el rival
          if (r.detalle.partidoId) {
            try {
              const partido = await apiClient.get<any>(`/partidos/${r.detalle.partidoId}`, { auth: false });
              if (partido.tipo === "Competitivo" || partido.tipo === "Amistoso") tipo = partido.tipo;
              rival = partido.equipoVisitanteNombre ?? "";
            } catch (error) {
              console.warn("No se pudo obtener el partido del historial", error);
            }
          }

          const horario = r.horaFin ? `${r.hora} – ${r.horaFin}` : r.hora;
          return {
            id: r.id,
            tipo,
            fecha: `${r.fecha} · ${horario}`,
            complejo: r.complejo,
            direccion: r.direccion,
            rival,
          };
        }),
      );

      // Cuenta demo sin historial real: se carga el de ejemplo
      if (partidos.length === 0 && esCuentaDemo()) {
        return { partidos: HISTORIAL_MOCK, esMock: true, esDemo: true };
      }

      return { partidos, esMock: false };
    } catch (error) {
      console.warn("Backend de reservas no disponible, usando historial de ejemplo", error);
      return { partidos: HISTORIAL_MOCK, esMock: true };
    }
  },

  // Completa el detalle con el partido (equipos) y las entradas (split).
  // Cada pedido es opcional: si alguno falla se muestra lo que ya se tiene.
  obtenerDetalle: async (reserva: ReservaJugador): Promise<ReservaDetalleData> => {
    if (reserva.esMock) return reserva.detalle;

    let detalle = reserva.detalle;

    if (detalle.partidoId) {
      try {
        const partido = await apiClient.get<any>(`/partidos/${detalle.partidoId}`, { auth: false });
        detalle = {
          ...detalle,
          tipoLabel: partido.tipo ?? detalle.tipoLabel,
          ...(partido.equipoLocalNombre ? { tuEquipo: partido.equipoLocalNombre } : {}),
          ...(partido.equipoVisitanteNombre ? { rival: { nombre: partido.equipoVisitanteNombre } } : {}),
        };
      } catch (error) {
        console.warn("No se pudo obtener el partido de la reserva", error);
      }
    }

    if (detalle.metodoPago === "split") {
      try {
        const entradas = await apiClient.get<any[]>(`/entradas/reserva/${detalle.reservaId}`);
        if (Array.isArray(entradas) && entradas.length > 0) detalle = aplicarEntradas(detalle, entradas);
      } catch (error) {
        console.warn("No se pudieron obtener las entradas de la reserva", error);
      }
    }

    return detalle;
  },

  // Pago de la reserva completa (seña o total): el backend calcula el monto.
  pagarReserva: (reservaId: string, tipo: TipoPago): Promise<string> => pagosService.crearPreferencia(reservaId, tipo),

  // Pago de una entrada (split). Sin jugadorId paga la cuota propia; con jugadorId
  // paga la de otro jugador. Devuelve el link de Mercado Pago.
  pagarEntrada: async (entradaId: string, jugadorId?: string): Promise<string> => {
    const respuesta = await apiClient.post<{ initPoint: string }>(
      `/entradas/${entradaId}/adquirir`,
      jugadorId ? { jugadorId } : {},
      { mensajeError: "No se pudo reservar la entrada para pagar" },
    );
    return respuesta.initPoint;
  },

  cancelar: (reservaId: string) =>
    apiClient.patch(`/reservas/${reservaId}/cancelar`, undefined, { mensajeError: "No se pudo cancelar la reserva" }),
};
