import { Link } from "react-router-dom";
import NotificationsDropdownPlayer from "./NotificationsDropdownPlayer";
import { useEffect, useRef, useState } from "react";
import "./TopbarPlayer.css";

interface TopbarPlayerProps {
  title?: string;
}

const TopbarPlayer = ({ title = "" }: TopbarPlayerProps) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="player-topbar">
      <h1 className="player-topbar__title">{title}</h1>

      <div className="player-topbar__actions">
        <div className="player-topbar__notif" ref={wrapperRef}>
          <button
            type="button"
            className="player-topbar__bell"
            aria-label="Notificaciones"
            onClick={() => setNotifOpen((prev) => !prev)}
          >
            <img src={`${import.meta.env.BASE_URL}assets/icons/notificaciones.svg`} alt="" />
            <span className="player-topbar__badge" />
          </button>
          {notifOpen && <NotificationsDropdownPlayer />}
        </div>

        <Link to="/home-player" className="player-topbar__home">
          Volver al inicio
          <img src={`${import.meta.env.BASE_URL}assets/icons/flecha-dashboard.svg`} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default TopbarPlayer;