import { ReactNode, useState } from "react";
import StatCard, { HostCard } from "./components/StatCard";
import LineChart from "./components/LineChart";
import DonutChart from "./components/DonutChart";
import { ClockIcon, EyeIcon, CalendarIcon, UserIcon, TrendUpIcon } from "./components/icons";
import PeriodSelect from "./components/PeriodSelect";
import { datosEstadisticas } from "./estadisticasData";
import "./Estadisticas.css";

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const ICONOS_STATS: Record<string, ReactNode> = {
  ingresos: <img src={`${import.meta.env.BASE_URL}assets/icons/dinero.svg`} alt="" />,
  reservas: <CalendarIcon />,
  jugadores: <UserIcon />,
  horas: <ClockIcon />,
  ocupacion: <TrendUpIcon />,
};

const Estadisticas = () => {
  const [periodo, setPeriodo] = useState("mes");
  const {
    stats,
    ingresosSerie,
    ingresosTotal,
    ingresosDelta,
    ocupacion,
    rendimientoCanchas,
    topReservas,
    actividadReciente,
    otros,
  } = datosEstadisticas;
  const maxIngreso = Math.max(...ingresosSerie.map((punto) => punto.value), 0);

  return (
    <div className="host-estadisticas">
      <div className="host-estadisticas__header">
        <h1>Estadisticas</h1>
        <div className="host-estadisticas__header-actions">
          <PeriodSelect
            value={periodo}
            onChange={setPeriodo}
            options={[
              { value: "semana", label: "Esta semana" },
              { value: "mes", label: "Este mes" },
              { value: "anio", label: "Este año" },
            ]}
          />
          <button type="button" className="host-export-btn">
            <img src={`${import.meta.env.BASE_URL}assets/icons/exportar-reporte.svg`} alt="" />
            Exportar reporte
          </button>
        </div>
      </div>

      <div className="host-estadisticas__stats">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            delta={stat.delta}
            deltaNote={stat.deltaNote}
            icon={ICONOS_STATS[stat.id]}
          />
        ))}
      </div>

      <div className="host-estadisticas__charts">
        <HostCard className="host-panel host-panel--chart">
          <div className="host-panel__title">
            <img src={`${import.meta.env.BASE_URL}assets/icons/dinero.svg`} alt="" />
            <h2>Ingresos</h2>
          </div>
          <div className="host-panel__headline">
            <strong>{ingresosTotal}</strong>
            <span>{ingresosDelta}</span>
          </div>
          <LineChart data={ingresosSerie} maxValue={maxIngreso} />
        </HostCard>

        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src={`${import.meta.env.BASE_URL}assets/icons/estadistica.svg`} alt="" />
            <h2>Ocupación de canchas</h2>
          </div>
          <div className="host-panel__headline">
            <strong>{ocupacion.porcentaje}%</strong>
            <span>{ocupacion.delta}</span>
          </div>

          <div className="host-ocupacion">
            <DonutChart porcentaje={ocupacion.porcentaje} />
            <div className="host-ocupacion__legend">
              <div>
                <span className="host-ocupacion__dot is-ocupado" />
                Horas ocupadas
                <strong>
                  {ocupacion.horasOcupadas}h ({ocupacion.porcentaje}%)
                </strong>
              </div>
              <div>
                <span className="host-ocupacion__dot is-disponible" />
                Horas disponibles
                <strong>
                  {ocupacion.horasDisponibles}h ({100 - ocupacion.porcentaje}%)
                </strong>
              </div>
              <div className="host-ocupacion__total">
                <span>Total de horas</span>
                <strong>{ocupacion.horasTotal}hs</strong>
              </div>
            </div>
          </div>
        </HostCard>
      </div>

      <div className="host-estadisticas__tables">
        <HostCard className="host-panel">
          <div className="host-panel__title">
            <img src={`${import.meta.env.BASE_URL}assets/icons/canchas.svg`} alt="" />
            <h2>Rendimiento por cancha</h2>
          </div>
          <div className="host-rendimiento-table">
            <div className="host-rendimiento-table__row host-rendimiento-table__row--head">
              <span>Cancha</span>
              <span>Ingresos</span>
              <span>Horas</span>
              <span>Ocupación</span>
            </div>
            {rendimientoCanchas.map((cancha) => (
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
            {topReservas.map((reserva) => (
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
            {actividadReciente.map((item) => (
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
            Partidos de ranking: <strong>{otros.partidosRanking}</strong>
          </span>
          <span>
            Cancelaciones: <strong>{otros.cancelaciones}</strong>
          </span>
          <span>
            No presentados: <strong>{otros.noPresentados}</strong>
          </span>
          <span>
            Reprogramacion: <strong>{otros.reprogramacion}</strong>
          </span>
        </div>
      </HostCard>
    </div>
  );
};

export default Estadisticas;