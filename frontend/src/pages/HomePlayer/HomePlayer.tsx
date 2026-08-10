import HeaderPlayer from "../../components/HeaderPlayer";
//import UserMenurPlayer from "../../components/UserMenuPlayer";
import HeroPlayer from "./components/HeroPlayer";
import GuiaPlayer from "./components/GuiaPlayer";
import CtaPlayer from "./components/CtaPlayer";
import Footer from "../../components/Footer";
import "./HomePlayer.css";

const HomePlayer = () => {
  return (
    <div className="home-player">
      <HeaderPlayer />

      <HeroPlayer />
      <GuiaPlayer />
      <CtaPlayer />
      <Footer />
    </div>
  );
};

export default HomePlayer;
