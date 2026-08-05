import "./Footer.css";
import { useEffect } from 'react';

const Footer = () => {
  return (
    <footer className="footer">
    
    <div className="footer-divider">
      <svg id="ballDivider" viewBox="0 0 1600 130" role="img" aria-label="divisor con pelota">
        <g id="dividerContent"></g>
      </svg>
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

(() => {
  function drawBallDivider() {
    const NS = "http://www.w3.org/2000/svg";
    const content = document.getElementById("dividerContent");
    
    if (!content) return false;
    
    if (content.children.length > 0) return true;

    const W = 1600;
    const H = 130;

    const cx = W / 2;
    const cy = 78;

    const rSemi  = 46;
    const rBall  = 34;
    const rSpoke = 23;
    const rPent  = 9;
    const rBulge = 31;

    const lineWidth = 2;
    const ringWidth = 2;
    const ballWidth = 1.6;

    interface Point {
      x: number;
      y: number;
    }

    function pt(cx: number, cy: number, r: number, deg: number): Point {
      const rad = (deg * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    function el(tag: string, attrs: Record<string, string>) {
      const node = document.createElementNS(NS, tag) as SVGElement;
      for (const k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          node.setAttribute(k, attrs[k]);
        }
      }
      return node;
    }

    const leftLine = el("path", { d: `M 0 ${cy} L ${cx - rSemi} ${cy}`, class: "divider-stroke", "stroke-width": lineWidth.toString() });
    const rightLine = el("path", { d: `M ${cx + rSemi} ${cy} L ${W} ${cy}`, class: "divider-stroke", "stroke-width": lineWidth.toString() });

    const semicircle = el("path", {
      d: `M ${cx - rSemi} ${cy} A ${rSemi} ${rSemi} 0 0 1 ${cx + rSemi} ${cy}`,
      class: "divider-stroke", 
      "stroke-width": ringWidth.toString()
    });

    const ballRing = el("circle", { cx: cx.toString(), cy: cy.toString(), r: rBall.toString(), class: "divider-stroke", "stroke-width": ringWidth.toString() });

    const pentPts: Point[] = [];
    const spokePts: Point[] = [];
    for (let k = 0; k < 5; k++) {
      const angle = -90 + k * 72;
      pentPts.push(pt(cx, cy, rPent, angle));
      spokePts.push(pt(cx, cy, rSpoke, angle));
    }

    const pentagonD = `M ${pentPts[0].x} ${pentPts[0].y} ` + pentPts.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ") + " Z";
    const pentagon = el("path", { d: pentagonD, class: "divider-stroke", "stroke-width": ballWidth.toString() });

    const spokesD = pentPts.map((p, i) => `M ${p.x} ${p.y} L ${spokePts[i].x} ${spokePts[i].y}`).join(" ");
    const spokes = el("path", { d: spokesD, class: "divider-stroke", "stroke-width": ballWidth.toString() });

    let arcsD = "";
    for (let k = 0; k < 5; k++) {
      const a = spokePts[k];
      const b = spokePts[(k + 1) % 5];
      const midAngle = -90 + k * 72 + 36;
      const bulge = pt(cx, cy, rBulge, midAngle);
      arcsD += `M ${a.x} ${a.y} Q ${bulge.x} ${bulge.y} ${b.x} ${b.y} `;
    }
    const arcs = el("path", { d: arcsD, class: "divider-stroke", "stroke-width": ballWidth.toString() });

    [leftLine, rightLine, semicircle, ballRing, pentagon, spokes, arcs].forEach(n => content.appendChild(n));
    return true;
  }

  if (drawBallDivider()) return;

  const observer = new MutationObserver(() => {
    if (drawBallDivider()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
