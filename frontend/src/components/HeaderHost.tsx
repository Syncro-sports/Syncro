import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./HeaderHost.css";

const HeaderHost = () => {
  return (
    <header className="header-host">
      <div className="header-host__inner">
        <div className="header-host__logo">
          <Link to="/home-host">
            <img src={`${import.meta.env.BASE_URL}assets/logo.svg`} alt="Syncro" />
          </Link>
        </div>

        <nav className="header-host__nav">
          <div className="header-host__links">
            <Link to="/partidos" className="header-host__nav-link">
              <img src={`${import.meta.env.BASE_URL}assets/icons/pelota-header.svg`} alt="" />
              <span>PARTIDOS</span>
            </Link>
            <Link to="/equipos" className="header-host__nav-link">
              <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />
              <span>EQUIPOS</span>
            </Link>
            <Link to="/valoracion" className="header-host__nav-link">
              <img src={`${import.meta.env.BASE_URL}assets/icons/valoracion.svg`} alt="" />
              <span>VALORACIÓN</span>
            </Link>
            <Link to="/torneos" className="header-host__nav-link">
              <img src={`${import.meta.env.BASE_URL}assets/icons/torneos.svg`} alt="" />
              <span>TORNEOS</span>
            </Link>
          </div>

          <div className="header-host__actions">
            <Link to="/perfil-host" className="header-host__profile">
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