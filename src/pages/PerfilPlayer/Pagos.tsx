import { useNavigate } from "react-router-dom";
import { PAGOS_PENDIENTES, HISTORIAL_PAGOS, RESUMEN_PAGOS } from "./pagosData";
import "./Pagos.css";

// TODO(back): no existe un endpoint que liste los pagos del jugador, por eso esta
// pestaña sigue con datos de ejemplo. El pago real se hace desde el detalle de cada reserva.
const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

const Pagos = () => {
  const navigate = useNavigate();
  const irAReservas = () => navigate("/perfil-jugador/reservas");

  return (
    <div className="pj">
      <div className="player-pagos__resumen">
        <div className="player-card player-pagos__stat player-pagos__stat--alerta">
          <div className="player-pagos__stat-label">Por pagar</div>
          <div className="player-pagos__stat-monto">{fmt(RESUMEN_PAGOS.totalPendiente)}</div>
          <div className="player-pagos__stat-sub">
            {RESUMEN_PAGOS.cantidadPendientes} {RESUMEN_PAGOS.cantidadPendientes === 1 ? "cuota pendiente" : "cuotas pendientes"}
          </div>
        </div>
        <div className="player-card player-pagos__stat">
          <div className="player-pagos__stat-label">Pagado en total</div>
          <div className="player-pagos__stat-monto">{fmt(RESUMEN_PAGOS.totalPagado)}</div>
          <div className="player-pagos__stat-sub">{RESUMEN_PAGOS.cantidadTotalPagos} pagos realizados</div>
        </div>
        <div className="player-card player-pagos__stat">
          <div className="player-pagos__stat-label">Crédito disponible</div>
          <div className="player-pagos__stat-monto">{fmt(RESUMEN_PAGOS.totalDisponible)}</div>
          <div className="player-pagos__stat-sub">Se usa solo para pagar futuros partidos.</div>
        </div>
      </div>

      <div className="player-pagos__titulo">
        <h3>Pagos pendientes</h3>
      </div>

      {PAGOS_PENDIENTES.length === 0 && (
        <div className="player-card player-pagos__vacio">No tenés pagos pendientes. ¡Estás al día!</div>
      )}

      {PAGOS_PENDIENTES.map((item) => (
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
            <div className="player-pagos__venc">{item.vencimiento}</div>
          </div>

          <div className="player-pagos__monto">
            <div>
              <small>Tu cuota</small>
              <b>{fmt(item.montoIndividual)}</b>
            </div>
            <div className="player-pagos__botones">
              <button type="button" className="pj-btn pj-btn--primary pj-btn--sm" onClick={irAReservas}>
                Pagar mi cuota
              </button>
              <button type="button" className="pj-btn pj-btn--ghost pj-btn--sm" onClick={irAReservas}>
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
            {HISTORIAL_PAGOS.map((item) => (
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
