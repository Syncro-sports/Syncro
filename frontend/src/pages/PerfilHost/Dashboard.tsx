import "./Dashboard.css";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "./components/StatCard";
import { HostCard } from "./components/StatCard";
import { ClockIcon, TrendUpIcon } from "./components/icons";
import HourGrid from "./components/HourGrid";

import { RESERVAS_HOY } from "./reservasData";

import {
  DASHBOARD_STATS,
  CANCHAS,
  CONFIGURACION_HORARIOS,
  INGRESO_SEMANAL,
  INSIGHTS_DASHBOARD,
  ACCIONES_RAPIDAS,
} from "./DashboardData";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const horas = useMemo(() => {
    const resultado: number[] = [];

    for (
      let hora = CONFIGURACION_HORARIOS.horaMin;
      hora <= CONFIGURACION_HORARIOS.horaMax;
      hora += CONFIGURACION_HORARIOS.intervalo
    ) {
      resultado.push(hora);
    }

    return resultado;
  }, []);

  const montoMaximo = useMemo(() => {
    return Math.max(
      ...INGRESO_SEMANAL.map((item) => item.monto),
      0
    );
  }, []);

  const ingresoSemanalTotal = useMemo(() => {
    return INGRESO_SEMANAL.reduce(
      (total, item) => total + item.monto,
      0
    );
  }, []);

  const formatearHora = (hora: number) => {
    return `${hora.toString().padStart(2, "0")}:00`;
  };

  const formatearMoneda = (monto: number) => {
    return `$${monto.toLocaleString("es-AR")}`;
  };

  return (
    <div className="host-dashboard">
      <h1 className="host-dashboard__title">Dashboard</h1>


      <div className="host-dashboard__stats">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            delta={stat.delta}
            deltaTone={stat.deltaTone}
          />
        ))}
      </div>

      <div className="host-dashboard__main">

        <HostCard className="host-schedule">
          <h2>Reservas activas (hoy)</h2>

          <div className="host-schedule__header">
            <span className="host-schedule__corner">
              Canchas
            </span>

            <div className="host-schedule__hours">
              {horas.map((hora) => (
                <span key={hora}>
                  {formatearHora(hora)}
                </span>
              ))}
            </div>
          </div>

          <div className="host-schedule__body">
            <div className="host-schedule__gridlines">
              <HourGrid count={horas.length} />
            </div>

            {CANCHAS.map((cancha) => (
              <div
                className="host-schedule__row"
                key={cancha.id}
              >
                <span className="host-schedule__row-label">
                  {cancha.nombre}
                </span>

                <div className="host-schedule__track">
                  {RESERVAS_HOY
                    .filter(
                      (reserva) =>
                        reserva.cancha === cancha.nombre
                    )
                    .map((reserva) => {
                      const rango =
                        CONFIGURACION_HORARIOS.horaMax -
                        CONFIGURACION_HORARIOS.horaMin;

                      const left =
                        ((reserva.horaInicio -
                          CONFIGURACION_HORARIOS.horaMin) /
                          rango) *
                        100;

                      const width =
                        ((reserva.horaFin -
                          reserva.horaInicio) /
                          rango) *
                        100;

                      return (
                        <span
                          className="host-schedule__event"
                          key={reserva.id}
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                          }}
                        >
                          {reserva.titulo}
                        </span>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </HostCard>


        <HostCard className="host-weekly">
          <h2>Ingreso semanal</h2>

          <strong className="host-weekly__total">
            {formatearMoneda(ingresoSemanalTotal)}
          </strong>

          <div className="host-weekly__list">
            {INGRESO_SEMANAL.map((item) => (
              <div
                className="host-weekly__row"
                key={item.dia}
              >
                <span>{item.dia}</span>

                <span
                  className="host-weekly__bar"
                  style={{
                    width:
                      montoMaximo > 0
                        ? `${(item.monto / montoMaximo) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            ))}
          </div>
        </HostCard>
      </div>


      <div className="host-dashboard__insights">
        <HostCard className="host-insight">
          <span className="host-insight__title">
            Cancha más rentable
          </span>

          <div className="host-insight__row">
            <div className="host-insight__text">
              <strong>
                {INSIGHTS_DASHBOARD.canchaMasRentable.nombre}
              </strong>

              <p>
                {formatearMoneda(
                  INSIGHTS_DASHBOARD.canchaMasRentable.monto
                )}
              </p>

              <small>
                {INSIGHTS_DASHBOARD.canchaMasRentable.descripcion}
              </small>
            </div>

            <span className="host-insight__icon">
              <TrendUpIcon />
            </span>
          </div>
        </HostCard>

        <HostCard className="host-insight">
          <span className="host-insight__title">
            Horarios más demandados
          </span>

          <div className="host-insight__row">
            <div className="host-insight__text">
              <strong>
                {formatearHora(
                  INSIGHTS_DASHBOARD.horarioMasDemandado.horaInicio
                )}{" "}
                -{" "}
                {formatearHora(
                  INSIGHTS_DASHBOARD.horarioMasDemandado.horaFin
                )}
              </strong>

              <small>
                {
                  INSIGHTS_DASHBOARD.horarioMasDemandado
                    .porcentaje
                }
                % de reservas
              </small>
            </div>

            <span className="host-insight__icon">
              <ClockIcon />
            </span>
          </div>
        </HostCard>

        <HostCard className="host-insight">
          <span className="host-insight__title">
            Reserva promedio
          </span>

          <div className="host-insight__row">
            <div className="host-insight__text">
              <strong>
                {formatearMoneda(
                  INSIGHTS_DASHBOARD.reservaPromedio.monto
                )}
              </strong>

              <p>
                +
                {
                  INSIGHTS_DASHBOARD.reservaPromedio.variacion
                }
                %
              </p>

              <small>
                {INSIGHTS_DASHBOARD.reservaPromedio.descripcion}
              </small>
            </div>

            <span className="host-insight__icon">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/dinero.svg`}
                alt=""
              />
            </span>
          </div>
        </HostCard>
      </div>


      <HostCard className="host-quick">
        <span className="host-quick__label">
          Acceso rapido
        </span>

        <div className="host-quick__actions">
          {ACCIONES_RAPIDAS.map((accion) => (
            <button
              type="button"
              key={accion.id}
              onClick={() => {
                if (accion.route) {
                  navigate(accion.route);
                }
              }}
            >
              <img
                src={accion.icon}
                alt=""
              />

              {accion.label}
            </button>
          ))}
        </div>
      </HostCard>
    </div>
  );
};

export default Dashboard;
