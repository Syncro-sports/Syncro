import { useState } from "react";
import StatCard, { HostCard } from "./components/StatCard";
import LineChart from "./components/LineChart";
import DonutChart from "./components/DonutChart";
import { ChevronDownIcon, ClockIcon, EyeIcon } from "./components/icons";
import { ACTIVIDAD_RECIENTE, INGRESOS_SERIE, RENDIMIENTO_CANCHAS, TOP_RESERVAS } from "./estadisticasData";
import "./Estadisticas.css";

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const Estadisticas = () => {
  const [periodo, setPeriodo] = useState("mes");
  const maxIngreso = Math.max(...INGRESOS_SERIE.map((punto) => punto.value));

  return (
    <div className="host-estadisticas">
      <div className="host-estadisticas__header">
        <h1>Estadisticas</h1>
        <div className="host-estadisticas__header-actions">
          <div className="host-period-select">
            <select value={periodo} onChange={(event) => setPeriodo(event.target.value)}>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
              <option value="anio">Este año</option>
            </select>
            <ChevronDownIcon />
          </div>
          <button type="button" className="host-export-btn">
            <img src="/assets/icons/exportar-reporte.svg" alt="" />
            Exportar reporte
          </button>
        </div>
      </div>

      <div className="host-estadisticas__stats">
        <StatCard label="Ingresos totales" value="$124.850" delta="+24.5%" deltaNote="vs mes pasado" />
        <StatCard label="Reservas realizadas" value="142" delta="+18.3%" deltaNote="vs mes pasado" />
        <StatCard label="Jugadores unicos" value="328" delta="+15.7%" deltaNote="vs mes pasado" />
        <StatCard label="Horas reservadas" value="236h" delta="+22.1%" deltaNote="vs mes pasado" />
        <StatCard label="Ocupación promedio" value="82%" delta="+8.4%" deltaNote="vs mes pasado" />
      </div>

      <div className="host-estadisticas__charts">
        <HostCard className="host-panel host-panel--chart">
          <div className="host-panel__title">
            <img src="/assets/icons/dinero.svg" alt="" />
            <h2>Ingresos</h2>
          </div>
          <div className="host-panel__headline">
            <strong>$124.850</strong>
            <span>+24.5% vs mes pasado</span>
          </div>
          <LineChart data={INGRESOS_SERIE} maxValue={maxIngreso} />
        </HostCard>

        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src="/assets/icons/estadistica.svg" alt="" />
            <h2>Ocupación de canchas</h2>
          </div>
          <div className="host-panel__headline">
            <strong>82%</strong>
            <span>+8.4% vs mes pasado</span>
          </div>

          <div className="host-ocupacion">
            <DonutChart porcentaje={82} />
            <div className="host-ocupacion__legend">
              <div>
                <span className="host-ocupacion__dot is-ocupado" />
                Horas ocupadas
                <strong>236h (82%)</strong>
              </div>
              <div>
                <span className="host-ocupacion__dot is-disponible" />
                Horas disponibles
                <strong>52h (18%)</strong>
              </div>
            </div>
          </div>
          <div className="host-ocupacion__total">
            <span>Total de horas</span>
            <strong>288hs</strong>
          </div>
        </HostCard>
      </div>

      <div className="host-estadisticas__tables">
        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src="/assets/icons/canchas.svg" alt="" />
            <h2>Rendimiento por cancha</h2>
          </div>
          <div className="host-rendimiento-table">
            <div className="host-rendimiento-table__row host-rendimiento-table__row--head">
              <span>Cancha</span>
              <span>Ingresos</span>
              <span>Horas</span>
              <span>Ocupación</span>
            </div>
            {RENDIMIENTO_CANCHAS.map((cancha) => (
              <div className="host-rendimiento-table__row" key={cancha.cancha}>
                <span>{cancha.cancha}</span>
                <span>{formatPrecio(cancha.ingresos)}</span>
                <span>{cancha.horas}</span>
                <span className="host-rendimiento-table__bar">
                  <span style={{ width: `${cancha.ocupacion}%` }} />
                </span>
              </div>
            ))}
          </div>
        </HostCard>

        <HostCard className="host-panel">
          <div className="host-panel__title">
            <ClockIcon />
            <h2>Top reservas</h2>
          </div>
          <div className="host-top-reservas">
            <div className="host-top-reservas__row host-top-reservas__row--head">
              <span>Reserva</span>
              <span>Fecha</span>
              <span>Monto</span>
            </div>
            {TOP_RESERVAS.map((reserva) => (
              <div className="host-top-reservas__row" key={reserva.id}>
                <span>
                  <strong>{reserva.equipo}</strong>
                  <small>{reserva.cancha}</small>
                </span>
                <span>{reserva.fecha}</span>
                <span>{formatPrecio(reserva.monto)}</span>
              </div>
            ))}
          </div>
        </HostCard>

        <HostCard className="host-panel">
          <div className="host-panel__title">
            <EyeIcon />
            <h2>Actividad reciente</h2>
          </div>
          <div className="host-actividad">
            {ACTIVIDAD_RECIENTE.map((item) => (
              <div className="host-actividad__row" key={item.id}>
                <p>{item.texto}</p>
                <span>{item.hora}</span>
              </div>
            ))}
          </div>
        </HostCard>
      </div>

      <HostCard className="host-otros">
        <span className="host-otros__label">Otros</span>
        <div className="host-otros__pills">
          <span>
            Partidos de ranking: <strong>15</strong>
          </span>
          <span>
            Cancelaciones: <strong>6</strong>
          </span>
          <span>
            No presentados: <strong>3</strong>
          </span>
          <span>
            Reprogramacion: <strong>8</strong>
          </span>
        </div>
      </HostCard>
    </div>
  );
};

export default Estadisticas;
