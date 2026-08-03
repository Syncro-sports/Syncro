import { Link } from "react-router-dom";
import "./GuiaHost.css";

const pasos = [
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/perfil-lapiz.svg`,
    titulo: "Configura tu perfil",
    texto: "Personaliza la información de tu establecimiento y genera confianza con tus futuros clientes.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/balon-mas.svg`,
    titulo: "Publica tus canchas",
    texto: "Agrega todas las canchas disponibles con sus características y precios.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/reserva.svg`,
    titulo: "Abre tu agenda",
    texto: "Configura días, horarios y disponibilidad para comenzar a recibir reservas.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/reloj.svg`,
    titulo: "Gestiona las reservas",
    texto: "Acepta solicitudes, organiza tu calendario y administra los pagos desde un solo lugar.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/estadistica.svg`,
    titulo: "Haz crecer tu complejo",
    texto: "Consulta estadísticas, incorpora personal y mejora la experiencia de tus jugadores.",
  },
];

const GuiaHost = () => {
  return (
    <section className="guia-host">
      <Link to="/guia-usuario" className="guia-host__title">
        <img src={`${import.meta.env.BASE_URL}assets/icons/guia-usuario.svg`} alt="" />
        <h2>Guia de usuario</h2>
      </Link>

      <div className="guia-host__grid">
        {pasos.map((paso) => (
          <div className="guia-host__card" key={paso.titulo}>
            <img src={paso.icono} alt="" className="guia-host__card-icon" />
            <h3>{paso.titulo}</h3>
            <p>{paso.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuiaHost;