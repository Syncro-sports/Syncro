import { Link } from "react-router-dom";
import "./CtaDuenos.css";

const features = [
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/reserva.svg`,
    titulo: "GESTOR DE RESERVAS",
    texto: "Administrá horarios, disponibilidad y turnos en tiempo real.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/dinero.svg`,
    titulo: "CONTROL DE INGRESOS",
    texto: "Visualizá reservas, pagos y rendimiento de cada cancha.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/estadistica.svg`,
    titulo: "ESTADÍSTICAS DEL COMPLEJO",
    texto: "Seguí ocupación, horarios más demandados y actividad.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/equipos.svg`,
    titulo: "GESTIÓN DE JUGADORES",
    texto: "Organizá partidos y conectate con más jugadores de MatchUp.",
  },
];

const CtaDuenos = () => {
  return (
    <section className="cta-duenos">
      <div className="cta-duenos__intro">
        <h2 className="cta-duenos__eyebrow">¿Tenés canchas para alquilar?</h2>
        <h3 className="cta-duenos__title">
          Gestioná tu complejo
          <br />
          de manera profesional
        </h3>
        <p className="cta-duenos__text">
          Publicá tus canchas en MatchUp, automatizá las reservas y administrá todo desde un solo lugar. Más
          reservas, menos cancelaciones; más ingresos.
        </p>
        <Link to="/perfil-host" className="cta-duenos__cta">
          <span className="cta-duenos__cta-icon">
            <img src={`${import.meta.env.BASE_URL}assets/icons/reserva.svg`} alt="" />
          </span>
          <span className="cta-duenos__cta-text">IR A PANEL DE DUEÑOS</span>
          <span className="cta-duenos__cta-arrow">→</span>
        </Link>
      </div>

      <div className="cta-duenos__features">
        {features.map((feature) => (
          <div className="cta-duenos__feature" key={feature.titulo}>
            <img src={feature.icono} alt="" />
            <h4>{feature.titulo}</h4>
            <p>{feature.texto}</p>
            <span className="cta-duenos__feature-divider" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CtaDuenos;
