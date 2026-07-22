import { useState } from "react";
import StatCard, { HostCard } from "./components/StatCard";
import { ChevronDownIcon } from "./components/icons";
import { PROXIMOS_COBROS, PROXIMOS_PAGOS, SPLIT_PAYMENTS, ULTIMOS_MOVIMIENTOS } from "./cajaData";
import "./Caja.css";

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const Caja = () => {
  const [periodo, setPeriodo] = useState("presente");

  return (
    <div className="host-caja">
      <div className="host-caja__header">
        <h1>Caja</h1>
        <div className="host-caja__header-actions">
          <div className="host-period-select">
            <select value={periodo} onChange={(event) => setPeriodo(event.target.value)}>
              <option value="presente">Presente</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>
            <ChevronDownIcon />
          </div>
          <button type="button" className="host-export-btn">
            <img src="/assets/icons/exportar-reporte.svg" alt="" />
            Exportar reporte
          </button>
        </div>
      </div>

      <div className="host-caja__stats">
        <StatCard label="Ingresos hoy" value="$5.420" delta="+14.5%" />
        <StatCard label="Ingreso semanal" value="$32.450" delta="+14.5%" deltaNote="vs semana pasada" />
        <StatCard label="Ingreso Mensual" value="$124.850" delta="+14.5%" deltaNote="vs mes pasado" />
        <StatCard label="Pagos pendientes" value="$8.750" />
      </div>

      <div className="host-caja__stats">
        <StatCard label="Pagos completados" value="142" />
        <StatCard label="Comision de la plataforma" value="$7.480" />
        <StatCard label="Ganancia" value="$24.970" />
        <StatCard label="Saldo disponible" value="$16.220" />
      </div>

      <div className="host-caja__grid">
        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src="/assets/icons/calendario-pagos.svg" alt="" />
            <h2>Proximos pagos</h2>
          </div>

          <div className="host-pagos-table">
            <div className="host-pagos-table__row host-pagos-table__row--head">
              <span>fecha</span>
              <span>Reserva</span>
              <span>Cliente</span>
              <span>Monto</span>
              <span>Estado</span>
            </div>
            {PROXIMOS_PAGOS.map((pago) => (
              <div className="host-pagos-table__row" key={pago.id}>
                <span>{pago.fecha}</span>
                <span>{pago.reserva}</span>
                <span>{pago.cliente}</span>
                <span>{formatPrecio(pago.monto)}</span>
                <span>
                  <span className="host-badge host-badge--pendiente">{pago.estado}</span>
                </span>
              </div>
            ))}
          </div>

          <a href="#" className="host-panel__link">
            Ver todos los pagos pendientes <span>→</span>
          </a>
        </HostCard>

        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src="/assets/icons/historial.svg" alt="" />
            <h2>Ultimos movimientos</h2>
          </div>

          <div className="host-movimientos">
            {ULTIMOS_MOVIMIENTOS.map((movimiento) => (
              <div className="host-movimientos__row" key={movimiento.id}>
                <div>
                  <strong>{movimiento.titulo}</strong>
                  <p>{movimiento.subtitulo}</p>
                </div>
                <div className="host-movimientos__amount">
                  <span className={movimiento.tono === "positivo" ? "is-positivo" : "is-negativo"}>
                    {movimiento.monto}
                  </span>
                  <small>{movimiento.hora}</small>
                </div>
              </div>
            ))}
          </div>

          <a href="#" className="host-panel__link">
            Ver toda la actividad <span>→</span>
          </a>
        </HostCard>
      </div>

      <div className="host-caja__grid">
        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src="/assets/icons/equipos.svg" alt="" />
            <h2>Split payments pendientes</h2>
          </div>

          <div className="host-splits">
            {SPLIT_PAYMENTS.map((split) => (
              <div className="host-splits__row" key={split.id}>
                <img src={split.escudo} alt={split.equipo} className="host-splits__crest" />
                <div className="host-splits__info">
                  <strong>{split.equipo}</strong>
                  <p>
                    Reserva {split.reserva} - {split.fecha}
                  </p>
                  <span>{Math.round((split.pagado / split.total) * 100)}% pagado</span>
                </div>
                <div className="host-splits__amount">
                  {formatPrecio(split.pagado)}/{formatPrecio(split.total)}
                </div>
                <button type="button" className="host-splits__cta">
                  Ver detalle
                </button>
              </div>
            ))}
          </div>

          <a href="#" className="host-panel__link">
            Ver todos los split payments <span>→</span>
          </a>
        </HostCard>

        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src="/assets/icons/billetera.svg" alt="" />
            <h2>Proximos cobros</h2>
          </div>

          <div className="host-cobros">
            {PROXIMOS_COBROS.map((cobro) => (
              <div className="host-cobros__row" key={cobro.id}>
                <div>
                  <strong>{cobro.titulo}</strong>
                  <p>{cobro.subtitulo}</p>
                </div>
                <span>{cobro.monto}</span>
              </div>
            ))}
          </div>

          <button type="button" className="host-cobros__retirar">
            Retirar dinero
          </button>
        </HostCard>
      </div>
    </div>
  );
};

export default Caja;
