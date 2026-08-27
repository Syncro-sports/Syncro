import { Navigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Hero from "./components/Hero";
import GuiaUsuarioPreview from "./components/GuiaUsuarioPreview";
import PartidosBuscandoRival from "./components/PartidosBuscandoRival";
import CtaDuenos from "./components/CtaDuenos";
import { authService, rutaPorRol } from "../../services/authService";
import "./HomeGuest.css";

// Home principal (sin sesion). Si ya hay alguien logueado, lo manda a su propio home
const HomeGuest = () => {
  const rutaSesion = authService.haySesion() ? rutaPorRol(authService.obtenerRol()) : "/";

  if (rutaSesion !== "/") return <Navigate to={rutaSesion} replace />;

  return (
    <div className="home-guest">
      <Header />
      <Hero />
      <GuiaUsuarioPreview />
      <PartidosBuscandoRival />
      <CtaDuenos />
      <Footer />
    </div>
  );
};

export default HomeGuest;
