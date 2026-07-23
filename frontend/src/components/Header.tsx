import { Link } from "react-router-dom";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo">
          <Link to="/">
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
            <Link to="/canchas" className="header__nav-link">
              <img src={`${import.meta.env.BASE_URL}assets/icons/canchas.svg`} alt="" />
              <span>CANCHAS</span>
            </Link>
          </div>

          <div className="header__actions">
            <Button to="/login">INICIAR SESION</Button>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
