import { Link } from "react-router-dom";
import "./GuiaPlayer.css";

const pasos = [
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/lugar.svg`,
    titulo: "Descubre complejos",
    texto:
      "Explora complejos deportivos y encuentra el lugar perfecto para tu proximo partido.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/reserva.svg`,
    titulo: "Reserva tu cancha",
    texto: "Elegi una fecha y organiza un partido privado con tus amigos.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/equipos.svg`,
    titulo: "Únete o crea un equipo",
    texto: "Forma parte de un equipo o crea el tuyo para jugar.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/pelota.svg`,
    titulo: "Juega y gana experiencia",
    texto:
      "Cada partido completado te otrorga experiencia y te ayuda a subir de nivel.",
  },
  {
    icono: `${import.meta.env.BASE_URL}assets/icons/perfil-edit.svg`,
    titulo: "Construye tu perfil",
    texto:
      "Crea una identidad deportiva que evolucione con cada partido que juegas.",
  },
];

const GuiaPlayer = () => {
  return (
    <section className="guia-player">
      <Link to="/guia-usuario" className="guia-player__title">
        <img
          src={`${import.meta.env.BASE_URL}assets/icons/guia-usuario.svg`}
          alt=""
        />
        <h2>Guia de usuario</h2>
      </Link>

      <div className="guia-player__grid">
        {pasos.map((paso) => (
          <div className="guia-player__card" key={paso.titulo}>
            <img src={paso.icono} alt="" className="guia-player__card-icon" />
            <h3>{paso.titulo}</h3>
            <p>{paso.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuiaPlayer;
