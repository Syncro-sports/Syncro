import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./PerfilHost.css";

const PerfilHost = () => {
  return (
    <div className="host-layout">
      <Sidebar />
      <div className="host-main">
        <Topbar />
        <div className="host-main__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PerfilHost;
