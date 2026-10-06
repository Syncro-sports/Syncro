import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PAGOS_PENDIENTES, HISTORIAL_PAGOS, RESUMEN_PAGOS, PagoPendiente, HistorialItem, ResumenPagos } from "./pagosData";
import { usePlayerData } from "./PlayerDataContext";
import type { ReservaJugador } from "./reservasData";
import "./Pagos.css";

// TODO(back): no existe un endpoint que liste los pagos del jugador. Mientras tanto esta pestaña se arma
// con las reservas del jugador (las mismas de "Reservas"): lo que falta pagar y lo que ya esta pago.
// Solo si no hay conexion con el servidor se muestran datos de ejemplo.
const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

const cuotaDe = (r: ReservaJugador) => r.detalle.cuota ?? r.detalle.senia;

const aPendiente = (r: ReservaJugador): PagoPendiente => {
  const d = r.detalle;
  return {
    id: r.id,
    imagen: r.imagen,
    tipoTag: d.tipoLabel as PagoPendiente["tipoTag"],
    fecha: `${r.fecha} · ${r.hora}`,
    complejo: r.complejo,
    ubicacion: r.direccion,
    rival: r.rival,
    pagados: d.jugadores.filter((j) => j.pagado).length,
    totalIntegrantes: d.jugadores.length,
    vencimiento: d.plazoLabel ? `Pagá hasta el ${d.plazoLabel}` : "",
    montoIndividual: cuotaDe(r),
  };
};

const aHistorial = (r: ReservaJugador): HistorialItem => {
  const d = r.detalle;
  const esCuota = d.metodoPago === "split";
  return {
    id: r.id,
    imagen: r.imagen,
    fecha: r.fecha,
    complejo: r.complejo,
    rival: r.rival,
    tipo: esCuota ? "Cuota" : "Reserva",
    monto: esCuota ? cuotaDe(r) : d.total || d.senia,
    pagador: "Vos",
  };
};

const Pagos = () => {
  const navigate = useNavigate();
  const { reservas, esMock } = usePlayerData();
  const irAReserva = (id?: string) => navigate(id ? `/perfil-jugador/reservas?reserva=${id}` : "/perfil-jugador/reservas");

  const { pendientes, historial, resumen } = useMemo(() => {
    // Sin conexion con el servidor: datos de ejemplo
    if (esMock) return { pendientes: PAGOS_PENDIENTES, historial: HISTORIAL_PAGOS, resumen: RESUMEN_PAGOS as ResumenPagos | null };
    const pend = reservas.filter((r) => r.estado === "pendiente" || r.pagoBadge?.tono === "pendiente");
    const hist = reservas.filter((r) => r.estado === "confirmada" && r.pagoBadge?.tono !== "pendiente");
    const pendientes = pend.map(aPendiente);
    const historial = hist.map(aHistorial);
    return {
      pendientes,
      historial,
      resumen: null as ResumenPagos | null,
    };
  }, [reservas, esMock]);

  const totalPendiente = pendientes.reduce((acc, p) => acc + p.montoIndividual, 0);
  const totalPagado = historial.reduce((acc, h) => acc + h.monto, 0);
  const datosResumen = resumen ?? {
    totalDisponible: 0,
    totalPendiente,
    cantidadPendientes: pendientes.length,
    totalPagado,
    reembolsado: 0,
    cantidadTotalPagos: historial.length,
  };

  return (
    <div className="pj">
      <div className="player-pagos__resumen">
        <div className="player-card player-pagos__stat player-pagos__stat--alerta">
          <div className="player-pagos__stat-label">Por pagar</div>
          <div className="player-pagos__stat-monto">{fmt(datosResumen.totalPendiente)}</div>
          <div className="player-pagos__stat-sub">
            {datosResumen.cantidadPendientes} {datosResumen.cantidadPendientes === 1 ? "cuota pendiente" : "cuotas pendientes"}
          </div>
        </div>
        <div className="player-card player-pagos__stat">
          <div className="player-pagos__stat-label">Pagado en total</div>
          <div className="player-pagos__stat-monto">{fmt(datosResumen.totalPagado)}</div>
          <div className="player-pagos__stat-sub">{datosResumen.cantidadTotalPagos} {datosResumen.cantidadTotalPagos === 1 ? "pago realizado" : "pagos realizados"}</div>
        </div>
        {esMock && (
          <div className="player-card player-pagos__stat">
            <div className="player-pagos__stat-label">Crédito disponible</div>
            <div className="player-pagos__stat-monto">{fmt(datosResumen.totalDisponible)}</div>
            <div className="player-pagos__stat-sub">Se usa solo para pagar futuros partidos.</div>
          </div>
        )}
      </div>

      <div className="player-pagos__titulo">
        <h3>Pagos pendientes</h3>
      </div>

      {pendientes.length === 0 && (
        <div className="player-card player-pagos__vacio">No tenés pagos pendientes. ¡Estás al día!</div>
      )}

      {pendientes.map((item) => (
        <div className="player-card player-pagos__pendiente" key={item.id}>
          <img className="player-pagos__pendiente-img" src={item.imagen} alt={item.complejo} />

          <div>
            <div className="player-pagos__pendiente-titulo">
              {item.complejo} · {item.tipoTag}
            </div>
            <div className="player-pagos__pendiente-sub">
              {item.fecha} · {item.rival}
            </div>
          </div>

          <div>
            {item.totalIntegrantes > 0 && (
              <div className="pj-progreso" style={{ marginBottom: 0 }}>
                <div className="pj-progreso__row">
                  <span>Pago del equipo</span>
                  <strong>
                    {item.pagados} de {item.totalIntegrantes} pagaron
                  </strong>
                </div>
                <div className="pj-barra">
                  <div className="pj-barra__fill" style={{ width: `${(item.pagados / item.totalIntegrantes) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="player-pagos__venc">{item.vencimiento}</div>
          </div>

          <div className="player-pagos__monto">
            <div>
              <small>Tu cuota</small>
              <b>{fmt(item.montoIndividual)}</b>
            </div>
            <div className="player-pagos__botones">
              <button type="button" className="pj-btn pj-btn--primary pj-btn--sm" onClick={() => irAReserva(item.id)}>
                Pagar mi cuota
              </button>
              <button type="button" className="pj-btn pj-btn--ghost pj-btn--sm" onClick={() => irAReserva(item.id)}>
                Ver detalle
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="player-pagos__titulo">
        <h3>Historial de pagos</h3>
      </div>

      <div className="player-card player-pagos__tabla-wrap">
        <table className="player-pagos__tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Partido</th>
              <th>Tipo</th>
              <th>Pagó</th>
              <th className="num">Monto</th>
            </tr>
          </thead>
          <tbody>
            {historial.length === 0 && (
              <tr>
                <td colSpan={5}>Todavía no hay pagos registrados.</td>
              </tr>
            )}
            {historial.map((item) => (
              <tr key={item.id}>
                <td>{item.fecha}</td>
                <td>
                  <b>{item.complejo}</b>
                  {item.rival && <div className="player-pagos__tabla-sub">{item.rival}</div>}
                </td>
                <td>{item.tipo}</td>
                <td>{item.pagador}</td>
                <td className="num">
                  <b>{fmt(item.monto)}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="pj-foot">
        ¿Problemas con un pago? <button type="button">Contactar soporte</button>
      </p>
    </div>
  );
};

export default Pagos;
