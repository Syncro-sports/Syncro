import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./PerfilHost.css";

export interface HostOutletContextType {
  search: string;
  setSearch: (value: string) => void;
}

const PerfilHost = () => {
  const [search, setSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    setSearch("");
  }, [location.pathname]);

  const getSearchPlaceholder = () => {
    if (location.pathname.includes("/canchas")) {
      return "Buscar por nombre, deporte o tag...";
    }
    if (location.pathname.includes("/reservas")) {
      return "Buscar reservas...";
    }
    return "Busca reservas, canchas, etc...";
  };

  return (
    <div className="host-layout">
      <Sidebar />
      <div className="host-main">
        <Topbar
          search={search}
          onSearchChange={setSearch}
          placeholder={getSearchPlaceholder()}
        />
        <div className="host-main__content">
          <Outlet context={{ search, setSearch } satisfies HostOutletContextType} />
        </div>
      </div>
    </div>
  );
};

export default PerfilHost;
