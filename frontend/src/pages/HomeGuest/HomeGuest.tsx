import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Hero from "./components/Hero";
import GuiaUsuarioPreview from "./components/GuiaUsuarioPreview";
import PartidosBuscandoRival from "./components/PartidosBuscandoRival";
import CtaDuenos from "./components/CtaDuenos";
import "./HomeGuest.css";

const HomeGuest = () => {
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
