import Button from "../../../components/Button";
import "./HeroHost.css";

const HeroHost = () => {
  return (
    <section className="hero-host">
      <div
        className="hero-host__inner"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5, 7, 11, 0.92) 0%, rgba(5, 7, 11, 0.55) 55%, rgba(5, 7, 11, 0.2) 100%), url(${import.meta.env.BASE_URL}assets/hero-host-background.jpg)`,
        }}
      >
        <div className="hero-host__content">
          <h1 className="hero-host__title">
            SYN<span>CRO</span>
          </h1>
          <h2 className="hero-host__subtitle">
            ADMINISTRÁ TU COMPLEJO
            <br />
            DESDE <span>UN SOLO LUGAR</span>
          </h2>
          <p className="hero-host__text">
            Controlá reservas, canchas, pagos, personal y estadísticas desde una sola plataforma.
          </p>
          <Button to="/perfil-host/canchas">VER MIS CANCHAS</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroHost;