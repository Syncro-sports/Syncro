import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./GuiaUsuario.css";

const pasos = [
  {
    icono: "/assets/icons/perfil.svg",
    titulo: "Crea tu cuenta",
    texto: "Registrate gratis en segundos y forma parte de la mayor comunidad de fútbol.",
  },
  {
    icono: "/assets/icons/perfil-edit.svg",
    titulo: "Define tu perfil",
    texto: "Elige cómo quieres vivir el partido: como Jugador, Organizador de equipos o Host de canchas.",
  },
  {
    icono: "/assets/icons/lugar.svg",
    titulo: "Encuentra tu lugar",
    texto: "Busca partidos abiertos en tu zona, arma desafíos para tu equipo o publica la disponibilidad de tus predios.",
  },
  {
    icono: "/assets/icons/reserva.svg",
    titulo: "Cordina y reserva",
    texto: "Gestiona las convocatorias de tus jugadores, asegura tus turnos o recibe reservas en tiempo real de forma segura.",
  },
  {
    icono: "/assets/icons/juega.svg",
    titulo: "Juega",
    texto: "¡Y listo! Suma puntos en el ranking, administra tus complejos y disfruta de la pasión del juego desde un solo lugar.",
  },
];

const GuiaUsuario = () => {
  return (
    <div className="guia-usuario">
      <Header />

      <section className="guia-usuario__hero">
        <img src="/assets/icons/guia-usuario.svg" alt="" />
        <h1>Guía de usuario</h1>
        <p>Todo lo que necesitás saber para empezar a jugar con Syncro, paso a paso.</p>
      </section>

      <section className="guia-usuario__list">
        {pasos.map((paso, index) => (
          <div className="guia-usuario__step" key={paso.titulo}>
            <span className="guia-usuario__step-number">{String(index + 1).padStart(2, "0")}</span>
            <img src={paso.icono} alt="" />
            <div>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default GuiaUsuario;
