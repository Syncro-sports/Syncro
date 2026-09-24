import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// -- Modificado: se quita el cambio de modo claro --
import UserMenuPlayer from "./UserMenuPlayer";
import { authService } from "../services/authService";
import "./HeaderHost.css";

const HeaderHost = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Borra token y usuario del navegador y vuelve al home principal
  const handleLogout = () => {
    authService.cerrarSesion();
    navigate("/", { replace: true });
  };

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
            <button type="button" onClick={toggleMenu} className="header-host__profile-btn">
              <img src={`${import.meta.env.BASE_URL}assets/icons/perfil-header.svg`} alt="Perfil" />
            </button>
            {isMenuOpen && (
              <UserMenuPlayer
                username={authService.obtenerUsuario()?.nombre}
                role="Host"
                perfilTo="/perfil-host"
                onLogout={handleLogout}
              />
            )}
            {/* -- Modificado: se quita el cambio de modo claro -- */}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderHost;