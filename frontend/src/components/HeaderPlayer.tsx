import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./HeaderPlayer.css";

const HeaderPlayer = () => {
  return (
    <header className="header-player">
      <div className="header-player__inner">
        <div className="header-player__logo">
          <Link to="/home-player">
            <img
              src={`${import.meta.env.BASE_URL}assets/logo.svg`}
              alt="Syncro"
            />
          </Link>
        </div>
        <nav className="header-player__nav">
          <div className="header-player__links">
            <Link to="/partidos" className="header-player__nav-link">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/pelota-header.svg`}
                alt=""
              />
              <span>PARTIDOS</span>
            </Link>

            <Link to="/equipos" className="header-player__nav-link">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`}
                alt=""
              />
              <span>EQUIPOS</span>
            </Link>

            <Link to="/canchas" className="header-player__nav-link">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/canchas.svg`}
                alt=""
              />
              <span>CANCHAS</span>
            </Link>
          </div>

          <div className="header-player__actions">
            <Link to="/perfil-player" className="header-player__profile">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/perfil-header.svg`}
                alt="Perfil"
              />
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderPlayer;
