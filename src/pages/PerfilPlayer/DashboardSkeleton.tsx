import "./DashboardSkeleton.css";

// Bloque gris animado. Las medidas (en rem) son las de cada elemento real del
// Dashboard, para que al cargar los datos nada se mueva.
const Bloque = ({ w, h, r, className = "" }: { w?: string; h: string; r?: string; className?: string }) => (
  <span className={`pjs ${className}`} style={{ width: w, height: h, borderRadius: r }} />
);

// Esqueleto de la grilla del Dashboard: proximo partido (+ "Despues") a la
// izquierda, progreso y equipos a la derecha. Usa las mismas clases contenedoras
// que la vista real (pj-grid, pj-col, pj-next, pj-card...), asi hereda sus paddings.
const DashboardSkeleton = () => (
  <div className="pj-grid" aria-busy="true" aria-label="Cargando tu panel">
    <div className="pj-col">
      <div className="player-card pj-next">
        <div className="pj-next__body">
          <div className="pj-next__main">
            {/* PROXIMO PARTIDO + cuenta regresiva */}
            <div className="pj-next__top">
              <Bloque w="7.5rem" h="0.72rem" />
              <Bloque w="5rem" h="1.5rem" r="999px" />
            </div>

            {/* chips: tipo y estado */}
            <div className="pj-chips">
              <Bloque w="5.5rem" h="1.65rem" r="999px" />
              <Bloque w="9rem" h="1.65rem" r="999px" />
            </div>

            {/* Tu equipo vs Rival */}
            <div className="pj-vs">
              <div className="pj-vs__team">
                <Bloque w="3.25rem" h="3.25rem" r="10px" />
                <div className="pjs-col">
                  <Bloque w="8rem" h="1.1rem" />
                  <Bloque w="4.5rem" h="0.68rem" />
                </div>
              </div>
              <Bloque w="1.4rem" h="0.8rem" />
              <div className="pj-vs__team">
                <Bloque w="3.25rem" h="3.25rem" r="10px" />
                <div className="pjs-col">
                  <Bloque w="7rem" h="1.1rem" />
                  <Bloque w="3.5rem" h="0.68rem" />
                </div>
              </div>
            </div>

            {/* hora grande + fecha */}
            <div className="pj-next__when">
              <Bloque w="7rem" h="2.4rem" />
              <Bloque w="10rem" h="0.95rem" />
            </div>

            {/* complejo y direccion */}
            <div className="pj-next__where">
              <Bloque w="1.1rem" h="1.1rem" r="50%" />
              <Bloque w="60%" h="0.85rem" />
            </div>

            {/* bloque de pago */}
            <div className="pj-pago pjs-pago">
              <div className="pjs-col">
                <Bloque w="6rem" h="0.82rem" />
                <Bloque w="5.5rem" h="1.15rem" />
              </div>
              <Bloque w="9rem" h="1.9rem" r="8px" />
            </div>

            {/* Ver reserva / Añadir al calendario */}
            <div className="pj-next__actions">
              <Bloque w="6.5rem" h="1.9rem" r="8px" />
              <Bloque w="10.5rem" h="1.9rem" r="8px" />
            </div>
          </div>

          <div className="pj-next__photo">
            <span className="pjs pjs--foto" />
          </div>
        </div>

        {/* DESPUES: dos filas */}
        <div className="pj-later">
          <div className="pj-later__title">
            <Bloque w="4.5rem" h="0.78rem" />
          </div>
          {[0, 1].map((i) => (
            <div className="pj-row pjs-row" key={i}>
              <Bloque w="2.9rem" h="2.9rem" r="8px" />
              <div className="pj-row__main pjs-col">
                <Bloque w={i === 0 ? "11rem" : "9rem"} h="0.95rem" />
                <Bloque w="14rem" h="0.8rem" />
              </div>
              <Bloque w="5.5rem" h="1.5rem" r="999px" />
            </div>
          ))}
          <div className="pj-later__foot">
            <Bloque w="9rem" h="0.85rem" />
          </div>
        </div>
      </div>
    </div>

    <div className="pj-col">
      {/* Tu progreso */}
      <div className="player-card pj-card">
        <div className="pj-card__head">
          <Bloque w="6.5rem" h="1rem" />
        </div>
        <div className="pj-level">
          <Bloque w="3rem" h="3rem" r="50%" />
          <div className="pjs-col">
            <Bloque w="6rem" h="1.2rem" />
            <Bloque w="11rem" h="0.8rem" />
          </div>
        </div>
        <div className="pj-xp">
          <div className="pj-xp__row">
            <Bloque w="5rem" h="0.74rem" />
            <Bloque w="5rem" h="0.74rem" />
          </div>
          <Bloque w="100%" h="0.45rem" r="999px" />
        </div>
        <div className="pj-stats">
          {[0, 1, 2].map((i) => (
            <div className="pjs-col" key={i}>
              <Bloque w="3rem" h="1.85rem" />
              <Bloque w="4rem" h="1rem" />
            </div>
          ))}
        </div>
      </div>

      {/* Mis equipos */}
      <div className="player-card pj-card">
        <div className="pj-card__head">
          <Bloque w="6.5rem" h="1rem" />
          <Bloque w="3.5rem" h="1.4rem" r="999px" />
        </div>
        {[0, 1].map((i) => (
          <div className="pj-team" key={i}>
            <Bloque w="2.6rem" h="2.75rem" r="10px" />
            <div className="pj-team__main pjs-col">
              <Bloque w={i === 0 ? "7.5rem" : "6rem"} h="0.95rem" />
              <Bloque w="10rem" h="0.75rem" />
            </div>
          </div>
        ))}
        <div className="pj-card__foot">
          <Bloque w="8rem" h="1.1rem" />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
