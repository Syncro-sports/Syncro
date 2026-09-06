// commit: seguridad/rutas-y-deploy
import { Navigate, Outlet } from "react-router-dom";
import { authService, normalizarRol } from "../services/authService";

interface RutaProtegidaProps {
  rol?: string;
}

const RutaProtegida = ({ rol }: RutaProtegidaProps) => {
  if (!authService.haySesion()) return <Navigate to="/login" replace />;
  if (rol && authService.obtenerRol() !== normalizarRol(rol)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default RutaProtegida;
