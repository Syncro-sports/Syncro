import { Link } from "react-router-dom";
import "./GuiaUsuarioPreview.css";

const pasos = [
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/perfil.svg`,
    titulo: "Crea tu cuenta",
    texto: "Registrate gratis en segundos y forma parte de la mayor comunidad de fútbol.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/perfil-edit.svg`,
    titulo: "Define tu perfil",
    texto: "Elige cómo quieres vivir el partido: como Jugador, Organizador de equipos o Host de canchas.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/lugar.svg`,
    titulo: "Encuentra tu lugar",
    texto: "Busca partidos abiertos en tu zona, arma desafíos para tu equipo o publica la disponibilidad de tus predios.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/reserva.svg`,
    titulo: "Cordina y reserva",
    texto: "Gestiona las convocatorias de tus jugadores, asegura tus turnos o recibe reservas en tiempo real de forma segura.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/juega.svg`,
    titulo: "Juega",
    texto: "¡Y listo! Suma puntos en el ranking, administra tus complejos y disfruta de la pasión del juego desde un solo lugar.",
  },
];

const GuiaUsuarioPreview = () => {
  return (
    <section className="guia">
      <Link to="/guia-usuario" className="guia__title">
        <img src={`${import.meta.env.BASE_URL}assets/icons/guia-usuario.svg`} alt="" />
        <h2>Guia de usuario</h2>
      </Link>

      <div className="guia__grid">
        {pasos.map((paso) => (
          <div className="guia__card" key={paso.titulo}>
            <img src={paso.icono} alt="" className="guia__card-icon" />
            <h3>{paso.titulo}</h3>
            <p>{paso.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuiaUsuarioPreview;
