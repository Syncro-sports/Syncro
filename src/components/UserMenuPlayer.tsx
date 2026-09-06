import React from "react";
import { Link } from "react-router-dom";
import "./UserMenuPlayer.css";

const URL_CHATBOT = import.meta.env.VITE_CHATBOT_URL || "http://localhost:8501";

interface UserMenu {
  username?: string;
  role?: string;
  perfilTo?: string;
  onLogout?: () => void;
}

export const UserMenuPlayer: React.FC<UserMenu> = ({
  username = "/insertUser",
  role = "Jugador",
  perfilTo = "/perfil",
  onLogout,
}) => {
  return (
    <nav className="user-menu">
      <div className="user-menu__header">
        <div>
          <img
            className="user-menu__img"
            src={`${import.meta.env.BASE_URL}assets/icons/perfil-header.svg`}
            alt="Imagen de usuario"
          />
        </div>
        <div className="user-menu__info">
          <span className="user-menu-name">{username}</span>
          <span className="user-menu-role">{role}</span>
        </div>
      </div>

      <div className="user-menu__line" />

      <ul className="user-menu__list">
        <li>
          <Link to={perfilTo} className="user-menu__item">
            <img
              src={`${import.meta.env.BASE_URL}assets/icons/perfil-icono.svg`}
              alt="Mi perfil"
              className="menu-icon"
            />
            <span>Mi perfil</span>
          </Link>
        </li>
        <li>
          <Link to="/mi-plan" className="user-menu__item">
            <img
              src={`${import.meta.env.BASE_URL}assets/icons/plan.svg`}
              alt="Mi plan"
              className="menu-icon"
            />
            <span>Mi plan</span>
          </Link>
        </li>
        <li>
          {/* Chatbot: se sirve aparte, por eso es un enlace externo y no un Link */}
          <a
            href={URL_CHATBOT}
            target="_blank"
            rel="noopener noreferrer"
            className="user-menu__item"
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/icons/help.svg`}
              alt="Centro de ayuda"
              className="menu-icon"
            />
            <span>Centro de ayuda</span>
          </a>
        </li>
        <li>
          <button onClick={onLogout} className="user-menu__item">
            <img
              src={`${import.meta.env.BASE_URL}assets/icons/logout.svg`}
              alt="Cerrar sesión"
              className="menu-icon"
            />
            <span>Cerrar sesión</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default UserMenuPlayer;
