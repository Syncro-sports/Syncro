import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import UserMenuPlayer from "./UserMenuPlayer";
import { authService } from "../services/authService";
import "./HeaderPlayer.css";

const HeaderPlayer = () => {
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
            <button onClick={toggleMenu} className="header-player__profile-btn">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/perfil-header.svg`}
                alt="Perfil"
              />
            </button>
            {isMenuOpen && (
              <UserMenuPlayer
                username={authService.obtenerUsuario()?.nombre}
                onLogout={handleLogout}
              />
            )}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderPlayer;
