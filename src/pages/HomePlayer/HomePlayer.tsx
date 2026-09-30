import HeaderPlayer from "../../components/HeaderPlayer";
//import UserMenurPlayer from "../../components/UserMenuPlayer";
import HeroPlayer from "./components/HeroPlayer";
import GuiaPlayer from "./components/GuiaPlayer";
import CtaPlayer from "./components/CtaPlayer";
import Footer from "../../components/Footer";
import ChatbotWidget from "../../components/ChatbotWidget";
import PartidosBuscandoRival from "../HomeGuest/components/PartidosBuscandoRival";
import "./HomePlayer.css";

const HomePlayer = () => {
  return (
    <div className="home-player">
      <HeaderPlayer />

      <HeroPlayer />
      <GuiaPlayer />
      <PartidosBuscandoRival />
      <CtaPlayer />
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default HomePlayer;
