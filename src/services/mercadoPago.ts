// Mercado Pago se abre en otra pestaña para no sacar al jugador de Syncro.
//
// Los navegadores bloquean las ventanas que se abren despues de una espera (como pedir el
// link al backend). Por eso se abre una pestaña en blanco en el mismo instante del clic
// (abrirVentanaPago) y, cuando el backend devuelve el link, se la lleva ahi (irAMercadoPago).

// Textos que van cambiando mientras se prepara todo (la ultima se queda hasta terminar)
export const TEXTOS_ESPERA = [
  "Confirmando los datos de tu reserva…",
  "Verificando que el horario siga libre…",
  "Reservando tu turno en la cancha…",
  "Calculando tu parte del pago…",
  "Armando la lista de jugadores…",
  "Preparando el pago seguro…",
  "Ya casi está, abriendo Mercado Pago…",
];

// Lo que se ve en la pestaña nueva hasta que el backend devuelve el link de pago
const PAGINA_DE_ESPERA = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Preparando tu pago…</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#05070b;color:#fff;font-family:system-ui,sans-serif;text-align:center}
main{max-width:26rem;padding:2rem}
.e{position:relative;height:9rem;width:15rem;margin:0 auto}
.sh{position:absolute;left:50%;bottom:0;width:3.4rem;height:.6rem;margin-left:-1.7rem;border-radius:50%;background:#000;animation:sh 1s infinite}
.b{position:absolute;left:50%;bottom:.3rem;width:3.4rem;height:3.4rem;margin-left:-1.7rem;transform-origin:50% 100%;animation:b 1s infinite}
.b svg{width:100%;height:100%;display:block;animation:r 1.1s linear infinite}
.p{height:.4rem;width:15rem;margin:0 auto 1.5rem;border-top:3px solid #a7e61d;background:repeating-linear-gradient(90deg,#1c1f24 0 1.5rem,#23272e 1.5rem 3rem);animation:p .5s linear infinite}
@keyframes b{0%{transform:translateY(0) scale(1.14,.86);animation-timing-function:cubic-bezier(.2,.65,.4,1)}50%{transform:translateY(-5.2rem) scale(.96,1.05);animation-timing-function:cubic-bezier(.6,0,.8,.35)}100%{transform:translateY(0) scale(1.14,.86)}}
@keyframes sh{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(.45);opacity:.15}}
@keyframes r{to{transform:rotate(360deg)}}
@keyframes p{to{background-position:-3rem 0}}
@keyframes f{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
h1{font-size:1.3rem;margin:0 0 .6rem}p{color:#9aa0aa;line-height:1.5;margin:0}
#t{display:block;margin-top:1rem;color:#a7e61d;font-size:.9rem;font-weight:600;min-height:1.4rem;animation:f .4s}
</style></head><body><main><div class="e"><div class="sh"></div><div class="b"><svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#0b0e12" stroke-width="3"/><polygon points="50,29 70,44 62,67 38,67 30,44" fill="#0b0e12"/><path d="M50 29V4M70 44L95 36M62 67L78 92M38 67L22 92M30 44L5 36" stroke="#0b0e12" stroke-width="3" stroke-linecap="round"/></svg></div></div><div class="p"></div>
<h1>Confirmando los datos de tu reserva</h1>
<p>En unos segundos se abrirá Mercado Pago para que realices el pago y termines de reservar.</p>
<span id="t"></span></main>
<script>
var T=${JSON.stringify(TEXTOS_ESPERA)},i=0,e=document.getElementById("t");
function s(){e.style.animation="none";e.offsetWidth;e.style.animation="";e.textContent=T[i];if(i<T.length-1)i++}
s();setInterval(s,2200);
</script></body></html>`;

export const abrirVentanaPago = (): Window | null => {
  const ventana = window.open("", "_blank");
  if (ventana) {
    ventana.opener = null;
    ventana.document.write(PAGINA_DE_ESPERA);
  }
  return ventana;
};

// Devuelve true si se pudo abrir en la pestaña; false si el navegador la bloqueo
// (en ese caso la pantalla muestra un boton "Abrir Mercado Pago").
export const irAMercadoPago = (ventana: Window | null, url: string): boolean => {
  if (!url) {
    ventana?.close();
    throw new Error("El servidor no devolvió el enlace de pago de Mercado Pago.");
  }
  if (!/^https:\/\//i.test(url)) {
    ventana?.close();
    throw new Error(`Mercado Pago devolvió un enlace no válido (${url.slice(0, 60)}).`);
  }
  if (ventana && !ventana.closed) {
    ventana.location.href = url;
    return true;
  }
  return Boolean(window.open(url, "_blank", "noopener"));
};
