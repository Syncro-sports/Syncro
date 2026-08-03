import HeaderHost from "../../components/HeaderHost";
import Footer from "../../components/Footer";
import HeroHost from "./components/HeroHost";
import GuiaHost from "./components/GuiaHost";
import CtaHost from "./components/CtaHost";
import "./HomeHost.css";

const HomeHost = () => {
  return (
    <div className="home-host">
      <HeaderHost />
      <HeroHost />
      <GuiaHost />
      <CtaHost />
      <Footer />
    </div>
  );
};

export default HomeHost;