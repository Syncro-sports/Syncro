import Button from "../../../components/Button";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div
        className="hero__inner"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5, 7, 11, 0.92) 0%, rgba(5, 7, 11, 0.55) 55%, rgba(5, 7, 11, 0.2) 100%), url(${import.meta.env.BASE_URL}assets/hero-background.jpg)`,
        }}
      >
        <div className="hero__content">
          <h1 className="hero__title">
            SYN<span>CRO</span>
          </h1>
          <h2 className="hero__subtitle">
            TU PRÓXIMO PARTIDO
            <br />
            EMPIEZA <span>ACÁ</span>
          </h2>
          <p className="hero__text">Conectamos jugadores y canchas para que nunca te quedes sin jugar.</p>
          <Button to="/canchas">RESERVAR CANCHA</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
