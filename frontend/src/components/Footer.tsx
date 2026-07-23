import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__divider">
        <img src={`${import.meta.env.BASE_URL}assets/linea-footer.svg`} alt="" className="footer__divider-line" />
        <img src={`${import.meta.env.BASE_URL}assets/icons/pelota.svg`} alt="" className="footer__divider-ball" />
      </div>

      <div className="footer__content">
        <div className="footer__brand">
          <img src={`${import.meta.env.BASE_URL}assets/logo.svg`} alt="Syncro" className="footer__logo" />
          <p>— TU PRÓXIMO PARTIDO EMPIEZA ACÁ. —</p>
        </div>

        <div className="footer__col">
          <h4>NAVEGACIÓN</h4>
          <a href="#">Centro de ayuda &gt;</a>
          <a href="#">Cómo funciona &gt;</a>
          <a href="#">Precios &gt;</a>
        </div>

        <div className="footer__col">
          <h4>TÉRMINOS LEGALES</h4>
          <a href="#">Términos y condiciones</a>
          <a href="#">Política de privacidad</a>
        </div>

        <div className="footer__col">
          <h4>CONTACTO</h4>
          <a href="mailto:syncrosports5@gmail.com">syncrosports5@gmail.com</a>
          <a href="tel:+541112345678">+54 11 1234-5678</a>
        </div>

        <div className="footer__col">
          <h4>REDES</h4>
          <div className="footer__social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="WhatsApp">WA</a>
            <a href="#" aria-label="TikTok">TT</a>
            <a href="#" aria-label="YouTube">YT</a>
          </div>
        </div>

        <div className="footer__col">
          <h4>DESCARGÁ LA APP</h4>
          <div className="footer__stores">
            <span className="footer__store-badge">App Store</span>
            <span className="footer__store-badge">Google Play</span>
          </div>
        </div>
      </div>

      <p className="footer__copy">© 2026 Syncro. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
