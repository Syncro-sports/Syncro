import { Outlet, useLocation } from "react-router-dom";
import SidebarPlayer from "./components/SidebarPlayer";
import TopbarPlayer from "./components/TopbarPlayer";
import { PlayerDataProvider } from "./PlayerDataContext";
import "./PerfilPlayer.css";
import "./PlayerUI.css";

// El titulo de cada pestana se muestra en la barra superior (igual que en el perfil del host)
const TITULOS_POR_RUTA: Array<{ match: (pathname: string) => boolean; titulo: string }> = [
  { match: (p) => p.replace(/\/$/, "") === "/perfil-jugador", titulo: "Dashboard" },
  { match: (p) => p.startsWith("/perfil-jugador/reservas"), titulo: "Mis reservas" },
  { match: (p) => p.startsWith("/perfil-jugador/historial"), titulo: "Historial" },
  { match: (p) => p.startsWith("/perfil-jugador/pagos"), titulo: "Pagos" },
  { match: (p) => p.startsWith("/perfil-jugador/equipos"), titulo: "Mis equipos" },
  { match: (p) => p.startsWith("/perfil-jugador/configuracion"), titulo: "Configuración" },
];

const PerfilPlayer = () => {
  const location = useLocation();
  const titulo = TITULOS_POR_RUTA.find(({ match }) => match(location.pathname))?.titulo || "";

  return (
    <PlayerDataProvider>
      <div className="player-layout">
        <SidebarPlayer />
        <div className="player-main">
          <TopbarPlayer title={titulo} />
          <div className="player-main__content">
            <Outlet />
          </div>
        </div>
      </div>
    </PlayerDataProvider>
  );
};

export default PerfilPlayer;