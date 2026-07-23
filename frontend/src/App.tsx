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
import Dashboard from "./pages/PerfilHost/Dashboard";
import Reservas from "./pages/PerfilHost/Reservas";
import CanchasAdmin from "./pages/PerfilHost/CanchasAdmin";
import Caja from "./pages/PerfilHost/Caja";
import Estadisticas from "./pages/PerfilHost/Estadisticas";
import Staff from "./pages/PerfilHost/Staff";
import Valoraciones from "./pages/PerfilHost/Valoraciones";
import Configuracion from "./pages/PerfilHost/Configuracion";
import GuiaUsuario from "./pages/GuiaUsuario/GuiaUsuario";

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
          <Route index element={<Dashboard />} />
          <Route path="reservas" element={<Reservas />} />
          <Route path="canchas" element={<CanchasAdmin />} />
          <Route path="caja" element={<Caja />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="staff" element={<Staff />} />
          <Route path="valoraciones" element={<Valoraciones />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
        <Route path="/guia-usuario" element={<GuiaUsuario />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
