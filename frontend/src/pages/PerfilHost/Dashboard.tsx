import { useNavigate } from "react-router-dom";
import StatCard, { HostCard } from "./components/StatCard";
import { ClockIcon, TrendUpIcon } from "./components/icons";
import HourGrid from "./components/HourGrid";
import { RESERVAS_HOY } from "./reservasData";
import "./Dashboard.css";

const CANCHAS = ["cancha 1", "cancha 2", "cancha 3", "cancha 4"];
const HORAS = ["6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "24:00"];
const HORA_MIN = 6;
const HORA_MAX = 24;

const INGRESO_SEMANAL = [
  { dia: "Lunes", monto: 95000 },
  { dia: "Martes", monto: 60000 },
  { dia: "Miercoles", monto: 110000 },
  { dia: "Jueves", monto: 130000 },
  { dia: "Viernes", monto: 150000 },
  { dia: "Sabado", monto: 170000 },
  { dia: "Domingo", monto: 65000 },
];

const montoMaximo = Math.max(...INGRESO_SEMANAL.map((item) => item.monto));

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="host-dashboard">
      <h1 className="host-dashboard__title">Dashboard</h1>

      <div className="host-dashboard__stats">
        <StatCard label="Ingresos hoy" value="$124.500" delta="+14.5%" />
        <StatCard label="Reservas activas" value="18" delta="+9" />
        <StatCard label="Ocupación" value="82%" delta="+5%" />
        <StatCard label="Cancelaciones" value="3" delta="-33%" deltaTone="negative" />
      </div>

      <div className="host-dashboard__main">
        <HostCard className="host-schedule">
          <h2>Reservas activas (hoy)</h2>
          <div className="host-schedule__header">
            <span className="host-schedule__corner">Canchas</span>
            <div className="host-schedule__hours">
              {HORAS.map((hora) => (
                <span key={hora}>{hora}</span>
              ))}
            </div>
          </div>

          <div className="host-schedule__body">
            <div className="host-schedule__gridlines">
              <HourGrid count={HORAS.length} />
            </div>

            {CANCHAS.map((cancha) => (
              <div className="host-schedule__row" key={cancha}>
                <span className="host-schedule__row-label">{cancha}</span>
                <div className="host-schedule__track">
                  {RESERVAS_HOY.filter((reserva) => reserva.cancha === cancha).map((reserva) => {
                    const left = ((reserva.horaInicio - HORA_MIN) / (HORA_MAX - HORA_MIN)) * 100;
                    const width = ((reserva.horaFin - reserva.horaInicio) / (HORA_MAX - HORA_MIN)) * 100;

                    return (
                      <span
                        className="host-schedule__event"
                        key={reserva.id}
                        style={{ left: `${left}%`, width: `${width}%` }}
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
          <strong className="host-weekly__total">$780.000</strong>
          <div className="host-weekly__list">
            {INGRESO_SEMANAL.map((item) => (
              <div className="host-weekly__row" key={item.dia}>
                <span>{item.dia}</span>
                <span
                  className="host-weekly__bar"
                  style={{ width: `${(item.monto / montoMaximo) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </HostCard>
      </div>

      <div className="host-dashboard__insights">
        <HostCard className="host-insight">
          <span className="host-insight__title">Cancha más rentable</span>
          <div className="host-insight__row">
            <div className="host-insight__text">
              <strong>Cancha 1</strong>
              <p>$45.080</p>
              <small>ganancia mensual</small>
            </div>
            <span className="host-insight__icon">
              <TrendUpIcon />
            </span>
          </div>
        </HostCard>

        <HostCard className="host-insight">
          <span className="host-insight__title">Horarios más demandados</span>
          <div className="host-insight__row">
            <div className="host-insight__text">
              <strong>20:00 - 22:00</strong>
              <small>79% de reservas</small>
            </div>
            <span className="host-insight__icon">
              <ClockIcon />
            </span>
          </div>
        </HostCard>

        <HostCard className="host-insight">
          <span className="host-insight__title">Reserva promedio</span>
          <div className="host-insight__row">
            <div className="host-insight__text">
              <strong>$14.200</strong>
              <p>+8.3%</p>
              <small>vs ultimo mes</small>
            </div>
            <span className="host-insight__icon">
              <img src="/assets/icons/dinero.svg" alt="" />
            </span>
          </div>
        </HostCard>
      </div>

      <HostCard className="host-quick">
        <span className="host-quick__label">Acceso rapido</span>
        <div className="host-quick__actions">
          <button type="button" onClick={() => navigate("/perfil-host/canchas")}>
            <img src="/assets/icons/canchas.svg" alt="" />
            Añadir cancha
          </button>
          <button type="button" onClick={() => navigate("/perfil-host/caja")}>
            <img src="/assets/icons/dinero.svg" alt="" />
            Ver ingresos
          </button>
          <button type="button">
            <img src="/assets/icons/exportar-reporte.svg" alt="" />
            Exportar reporte semanal
          </button>
        </div>
      </HostCard>
    </div>
  );
};

export default Dashboard;
