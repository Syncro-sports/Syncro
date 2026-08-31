import Button from "../../../components/Button";

import "./CtaPlayer.css";

const CtaPlayer = () => {
  return (
    <section className="cta-player">
      <div className="cta-player__inner">
        <img
          className="cta-player__img"
          src={`${import.meta.env.BASE_URL}assets/perfil-player.jpg`}
          alt=""
        />

        <div className="cta-player__content">
          <h2 className="cta-player__title">
            Tu camino deportivo <br />
            <span>comienza aquí.</span>
          </h2>
          <p className="cta-player__text">
            Cada partido que juegas forma parte de tu historia. Gana
            experiencia, sube de nivel, únete a equipos y construye un perfil
            deportivo que evoluciona junto a tu recorrido dentro de Syncro.
          </p>

          <ul className="cta-player__list">
            <li className="cta-player__idem">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/valoracion.svg`}
                alt=""
                className="cta-player__icon"
              />
              <span>Gana experiencia después de cada partido</span>
            </li>
            <li className="cta-player__idem">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/historial.svg`}
                alt=""
                className="cta-player__icon"
              />
              <span>Construye tu historial deportivo</span>
            </li>
            <li className="cta-player__idem">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`}
                alt=""
                className="cta-player__icon"
              />
              <span>Juega con múltiples equipos</span>
            </li>
          </ul>

          <Button variant="outline" to="/perfil">
            VER MI PERFIL
          </Button>
        </div>
      </div>

      <div className="cta-player__inner2">
        <div className="cta-player__content2">
          <h2 className="cta-player__title">
            Juega más. <span>Progresa más.</span>
          </h2>
          <p className="cta-player__text2">
            Cada reserva, cada equipo y cada partido contribuyen a tu evolución
            dentro <br /> de Syncro. Tu perfil crece con cada partido que
            juegas.
          </p>
        </div>
        <div>
          <img
            className="cta-player__img2"
            src={`${import.meta.env.BASE_URL}assets/img-cta.jpg`}
            alt="Jugadores en la cancha"
          />
        </div>
      </div>
    </section>
  );
};

export default CtaPlayer;
