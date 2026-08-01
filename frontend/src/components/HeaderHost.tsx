import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./HeaderHost.css";

const HeaderHost = () => {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo">
          <Link to="/home-host">
            <img src={`${import.meta.env.BASE_URL}assets/logo.svg`} alt="Syncro" />
          </Link>
        </div>

        <nav className="header__nav">
          <div className="header__links">
            <Link to="/partidos" className="header__nav-link">
              <img src={`${import.meta.env.BASE_URL}assets/icons/pelota-header.svg`} alt="" />
              <span>PARTIDOS</span>
            </Link>
            <Link to="/equipos" className="header__nav-link">
              <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />
              <span>EQUIPOS</span>
            </Link>
            <Link to="/valoracion" className="header__nav-link">
              <img src={`${import.meta.env.BASE_URL}assets/icons/valoracion.svg`} alt="" />
              <span>VALORACIÓN</span>
            </Link>
            <Link to="/torneos" className="header__nav-link">
              <img src={`${import.meta.env.BASE_URL}assets/icons/torneos.svg`} alt="" />
              <span>TORNEOS</span>
            </Link>
          </div>

          <div className="header__actions">
            <Link to="/perfil-host" className="header__profile">
              <img src={`${import.meta.env.BASE_URL}assets/icons/perfil-header.svg`} alt="Perfil" />
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderHost;