import HeaderPlayer from "../../components/HeaderPlayer";
import MenuUserPlayer from "../../components/MenuUserPlayer";
import HeroPlayer from "./components/HeroPlayer";
import GuiaPlayer from "./components/GuiaPlayer";
import CtaPlayer from "./components/CtaPlayer";
import Footer from "../../components/Footer";
import "./HomePlayer.css";

const HomePlayer = () => {
  return (
    <div className="home-player">
      <HeaderPlayer />
      <MenuUserPlayer />
      <HeroPlayer />
      <GuiaPlayer />
      <CtaPlayer />
      <Footer />
    </div>
  );
};

export default HomePlayer;
