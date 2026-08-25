import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, UserIcon } from "./icons";
import NotificationsDropdown from "./NotificationsDropdown";
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
  const [notifOpen, setNotifOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="host-topbar">
      <div className="host-topbar__search" onClick={() => inputRef.current?.focus()}>
        <img src={`${import.meta.env.BASE_URL}assets/icons/lupa.svg`} alt="" />
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

        <button type="button" className="host-topbar__user">
          <span className="host-topbar__avatar">
            <UserIcon />
          </span>
          /insertUser
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
