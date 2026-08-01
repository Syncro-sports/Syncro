import HeaderHost from "../../components/HeaderHost";
import Footer from "../../components/Footer";
import HeroHost from "./components/HeroHost";
import GuiaHost from "./components/GuiaHost";
import CtaHost from "./components/CtaHost";

const HomeHost = () => {
  return (
    <div>
      <HeaderHost />
      <HeroHost />
      <GuiaHost />
      <CtaHost />
      <Footer />
    </div>
  );
};

export default HomeHost;