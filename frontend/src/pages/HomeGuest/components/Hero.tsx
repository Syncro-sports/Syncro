import Button from "../../../components/Button";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__inner">
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
