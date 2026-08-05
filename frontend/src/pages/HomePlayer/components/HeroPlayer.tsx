import Button from "../../../components/Button";
import "./HeroPlayer.css";

const HeroPlayer = () => {
  return (
    <section className="hero-player">
      <div
        className="hero-player__inner"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5, 7, 11, 0.92) 0%, rgba(5, 7, 11, 0.55) 55%, rgba(5, 7, 11, 0.2) 100%), 
          url(${import.meta.env.BASE_URL}assets/hero-background.jpg)`,
        }}
      >
        <div className="hero-player__content">
          <h1 className="hero-player__title">
            SYN<span>CRO</span>
          </h1>
          <h2 className="hero-player__subtitle">
            TU PRÓXIMO PARTIDO
            <br />
            EMPIEZA <span>ACÁ</span>
          </h2>
          <p className="hero-player__text">
            Reserva canchas, organiza partidos, descubri nuevos complejos
            deportivos y lleva tu perfil deportivo al siguiente nivel con cada
            partido que jugas.
          </p>
          <Button variant="outline" to="/canchas">
            VER MI PERFIL
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroPlayer;
