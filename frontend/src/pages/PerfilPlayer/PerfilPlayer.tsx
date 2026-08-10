import { Outlet } from "react-router-dom";
import SidebarPlayer from "./components/SidebarPlayer";
import TopbarPlayer from "./components/TopbarPlayer";
import "./PerfilPlayer.css";

const PerfilPlayer = () => {
  return (
    <div className="player-layout">
      <SidebarPlayer />
      <div className="player-main">
        <TopbarPlayer />
        <div className="player-main__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PerfilPlayer;