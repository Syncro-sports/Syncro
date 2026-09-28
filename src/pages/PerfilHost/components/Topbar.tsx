import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon, UserIcon } from "./icons";
import NotificationsDropdown from "./NotificationsDropdown";
import UserMenuPlayer from "../../../components/UserMenuPlayer";
import { authService } from "../../../services/authService";
import "./Topbar.css";

interface TopbarProps {
  search?: string;
  onSearchChange?: (val: string) => void;
  placeholder?: string;
}

const Topbar = ({
  search = "",
  onSearchChange,
  placeholder = "Busca reservas, canchas, etc...",
}: TopbarProps) => {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const userWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (userWrapperRef.current && !userWrapperRef.current.contains(event.target as Node)) {
        setUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.cerrarSesion();
    navigate("/", { replace: true });
  };

  return (
    <div className="host-topbar">
      {/* Cambio para el merge */}
      <div className="host-topbar__search" onClick={() => inputRef.current?.focus()}>
        <img src={`${import.meta.env.BASE_URL}assets/icons/lupa-dashboard.svg`} alt="" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
        {Boolean(search && onSearchChange) && (
          <button
            type="button"
            className="host-topbar__clear-search"
            onClick={(e) => {
              e.stopPropagation();
              onSearchChange?.("");
            }}
            title="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>

      <div className="host-topbar__actions">
        <div className="host-topbar__notif" ref={wrapperRef}>
          <button
            type="button"
            className="host-topbar__bell"
            aria-label="Notificaciones"
            onClick={() => setNotifOpen((prev) => !prev)}
          >
            <img src={`${import.meta.env.BASE_URL}assets/icons/notificaciones.svg`} alt="" />
            <span className="host-topbar__badge" />
          </button>
          {notifOpen && <NotificationsDropdown />}
        </div>

        <div className="host-topbar__notif" ref={userWrapperRef}>
          <button
            type="button"
            className="host-topbar__user"
            onClick={() => setUserOpen((prev) => !prev)}
          >
            <span className="host-topbar__avatar">
              <UserIcon />
            </span>
            <span className="host-topbar__username">
              {authService.obtenerUsuario()?.nombre || "/insertUser"}
            </span>
            <ChevronDownIcon />
          </button>
          {userOpen && (
            <UserMenuPlayer
              username={authService.obtenerUsuario()?.nombre}
              role="Host"
              mostrarPerfil={false}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
