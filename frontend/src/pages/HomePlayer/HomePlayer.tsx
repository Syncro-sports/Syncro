import HeaderPlayer from "../../components/HeaderPlayer";
import HeroPlayer from "./components/HeroPlayer";
import GuiaPlayer from "./components/GuiaPlayer";
import Footer from "../../components/Footer";
import "./HomePlayer.css";

const HomePlayer = () => {
  return (
    <div className="home-player">
      <HeaderPlayer />
      <HeroPlayer />
      <GuiaPlayer />

      <Footer />
    </div>
  );
};

export default HomePlayer;
