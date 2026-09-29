import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./PerfilHost.css";

const LOGO_STORAGE_KEY = "syncro_host_logo";

export interface HostOutletContextType {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
}

const leerLogoGuardado = (): string => {
  try {
    return localStorage.getItem(LOGO_STORAGE_KEY) || "";
  } catch {
    return "";
  }
};

const TITULOS_POR_RUTA: Array<{ match: (pathname: string) => boolean; titulo: string }> = [
  { match: (p) => p === "/perfil-host", titulo: "Dashboard" },
  { match: (p) => p.startsWith("/perfil-host/reservas"), titulo: "Reservas y calendario" },
  { match: (p) => p.startsWith("/perfil-host/canchas"), titulo: "Canchas" },
  { match: (p) => p.startsWith("/perfil-host/caja"), titulo: "Caja" },
  { match: (p) => p.startsWith("/perfil-host/estadisticas"), titulo: "Estadisticas" },
  { match: (p) => p.startsWith("/perfil-host/staff"), titulo: "Staff" },
  { match: (p) => p.startsWith("/perfil-host/valoraciones"), titulo: "Valoraciones" },
  { match: (p) => p.startsWith("/perfil-host/configuracion"), titulo: "Configuración" },
];

const PerfilHost = () => {
  const location = useLocation();
  const [logoUrl, setLogoUrlState] = useState<string>(leerLogoGuardado);

  const setLogoUrl = (url: string) => {
    setLogoUrlState(url);
    try {
      localStorage.setItem(LOGO_STORAGE_KEY, url);
    } catch {
      // si el navegador no deja guardar, el logo igual queda en pantalla esta sesion
    }
  };

  const titulo =
    TITULOS_POR_RUTA.find(({ match }) => match(location.pathname))?.titulo || "";

  return (
    <div className="host-layout">
      <Sidebar />
      <div className="host-main">
        <Topbar title={titulo} logoUrl={logoUrl} />
        <div className="host-main__content">
          <Outlet context={{ logoUrl, setLogoUrl } satisfies HostOutletContextType} />
        </div>
      </div>
    </div>
  );
};

export default PerfilHost;
