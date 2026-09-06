import { useState } from "react";
import StatCard, { HostCard } from "./components/StatCard";
import { ChevronDownIcon } from "./components/icons";
import { datosCaja } from "./cajaData";
import "./Caja.css";

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const Caja = () => {
  const [periodo, setPeriodo] = useState("presente");

  const { stats, proximosPagos, ultimosMovimientos, splitPayments, proximosCobros } = datosCaja;

  return (
    <div className="host-caja">
      <div className="host-caja__header">
        <h1>Caja</h1>
        <div className="host-caja__header-actions">
          <div className="host-period-select">
            <select
              value={periodo}
              onChange={(event) => setPeriodo(event.target.value)}
            >
              <option value="presente">Presente</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>
            <ChevronDownIcon />
          </div>
          <button type="button" className="host-export-btn">
            <img src={`${import.meta.env.BASE_URL}assets/icons/exportar-reporte.svg`} alt="" />
            Exportar reporte
          </button>
        </div>
      </div>

      <div className="host-caja__stats">
        <StatCard label="Ingresos hoy" value={stats.ingresosHoy} delta={stats.deltaHoy} />
        <StatCard label="Ingreso semanal" value={stats.ingresoSemanal} delta={stats.deltaSemanal} deltaNote="vs semana pasada" />
        <StatCard label="Ingreso Mensual" value={stats.ingresoMensual} delta={stats.deltaMensual} deltaNote="vs mes pasado" />
        <StatCard label="Pagos pendientes" value={stats.pagosPendientesTotal} />
      </div>

      <div className="host-caja__stats">
        <StatCard label="Pagos completados" value={stats.pagosCompletados} />
        <StatCard label="Comisión de la plataforma" value={stats.comisionPlataforma} />
        <StatCard label="Ganancia" value={stats.ganancia} />
        <StatCard label="Saldo disponible" value={stats.saldoDisponible} />
      </div>

      <div className="host-caja__grid">
        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src={`${import.meta.env.BASE_URL}assets/icons/calendario-pagos.svg`} alt="" />
            <h2>Próximos pagos</h2>
          </div>

          <div className="host-pagos-table">
            <div className="host-pagos-table__row host-pagos-table__row--head">
              <span>fecha</span>
              <span>Reserva</span>
              <span>Cliente</span>
              <span>Monto</span>
              <span>Estado</span>
            </div>
            {proximosPagos.length > 0 ? (
              proximosPagos.map((pago) => (
                <div className="host-pagos-table__row" key={pago.id}>
                  <span>{pago.fecha}</span>
                  <span>{pago.reserva}</span>
                  <span>{pago.cliente}</span>
                  <span>{formatPrecio(pago.monto)}</span>
                  <span>
                    <span className="host-badge host-badge--pendiente">{pago.estado}</span>
                  </span>
                </div>
              ))
            ) : (
              <p style={{ padding: "1rem 0", color: "var(--host-text-secondary)" }}>
                No hay pagos pendientes.
              </p>
            )}
          </div>

          <a href="#" className="host-panel__link">
            Ver todos los pagos pendientes <span>→</span>
          </a>
        </HostCard>

        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src={`${import.meta.env.BASE_URL}assets/icons/historial.svg`} alt="" />
            <h2>Últimos movimientos</h2>
          </div>

          <div className="host-movimientos">
            {ultimosMovimientos.length > 0 ? (
              ultimosMovimientos.map((movimiento) => (
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
              ))
            ) : (
              <p style={{ padding: "1rem 0", color: "var(--host-text-secondary)" }}>
                No hay movimientos recientes.
              </p>
            )}
          </div>

          <a href="#" className="host-panel__link">
            Ver toda la actividad <span>→</span>
          </a>
        </HostCard>
      </div>

      <div className="host-caja__grid">
        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />
            <h2>Split payments pendientes</h2>
          </div>

          <div className="host-splits">
            {splitPayments.length > 0 ? (
              splitPayments.map((split) => (
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
              ))
            ) : (
              <p style={{ padding: "1rem 0", color: "var(--host-text-secondary)" }}>
                No hay split payments pendientes.
              </p>
            )}
          </div>

          <a href="#" className="host-panel__link">
            Ver todos los split payments <span>→</span>
          </a>
        </HostCard>

        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src={`${import.meta.env.BASE_URL}assets/icons/billetera.svg`} alt="" />
            <h2>Próximos cobros</h2>
          </div>

          <div className="host-cobros">
            {proximosCobros.length > 0 ? (
              proximosCobros.map((cobro) => (
                <div className="host-cobros__row" key={cobro.id}>
                  <div>
                    <strong>{cobro.titulo}</strong>
                    <p>{cobro.subtitulo}</p>
                  </div>
                  <span>{cobro.monto}</span>
                </div>
              ))
            ) : (
              <p style={{ padding: "1rem 0", color: "var(--host-text-secondary)" }}>
                No hay cobros próximos.
              </p>
            )}
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
