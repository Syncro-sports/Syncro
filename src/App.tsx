import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeGuest from "./pages/HomeGuest/HomeGuest";
import Auth from "./pages/Auth/Auth";
import HomeHost from "./pages/HomeHost/HomeHost";
import HomePlayer from "./pages/HomePlayer/HomePlayer";
import Canchas from "./pages/Canchas/Canchas";
import Partidos from "./pages/Partidos/Partidos";
import Equipos from "./pages/Equipos/Equipos";
import EquipoDetalle from "./pages/Equipos/EquipoDetalle";
import Torneos from "./pages/Torneos/Torneos";
import PerfilHost from "./pages/PerfilHost/PerfilHost";
import HostDashboard from "./pages/PerfilHost/Dashboard";
import HostReservas from "./pages/PerfilHost/Reservas";
import CanchasAdmin from "./pages/PerfilHost/CanchasAdmin";
import Caja from "./pages/PerfilHost/Caja";
import Estadisticas from "./pages/PerfilHost/Estadisticas";
import Staff from "./pages/PerfilHost/Staff";
import Valoraciones from "./pages/PerfilHost/Valoraciones";
import HostConfiguracion from "./pages/PerfilHost/Configuracion";
import GuiaUsuario from "./pages/GuiaUsuario/GuiaUsuario";
import PerfilPlayer from "./pages/PerfilPlayer/PerfilPlayer";
import Dashboard from "./pages/PerfilPlayer/Dashboard";
import ReservasPlayer from "./pages/PerfilPlayer/Reservas";
import HistorialPlayer from "./pages/PerfilPlayer/Historial";
import PagosPlayer from "./pages/PerfilPlayer/Pagos";
import EquiposPlayer from "./pages/PerfilPlayer/Equipos";
import ConfiguracionPlayer from "./pages/PerfilPlayer/Configuracion";

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Routes>
        <Route path="/" element={<HomeGuest />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/home-host" element={<HomeHost />} />
        <Route path="/home-player" element={<HomePlayer />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/equipos/:id" element={<EquipoDetalle />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/perfil-host" element={<PerfilHost />}>
          <Route index element={<HostDashboard />} />
          <Route path="reservas" element={<HostReservas />} />
          <Route path="canchas" element={<CanchasAdmin />} />
          <Route path="caja" element={<Caja />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="staff" element={<Staff />} />
          <Route path="valoraciones" element={<Valoraciones />} />
          <Route path="configuracion" element={<HostConfiguracion />} />
        </Route>
        <Route path="/guia-usuario" element={<GuiaUsuario />} />
        <Route path="/perfil-jugador" element={<PerfilPlayer />}>
          <Route index element={<Dashboard />} />
          <Route path="reservas" element={<ReservasPlayer />} />
          <Route path="historial" element={<HistorialPlayer />} />
          <Route path="pagos" element={<PagosPlayer />} />
          <Route path="equipos" element={<EquiposPlayer />} />
          <Route path="configuracion" element={<ConfiguracionPlayer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;