import { CANCHAS } from "./canchasData";
import "./CanchasAdmin.css";

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const CanchasAdmin = () => {
  return (
    <div className="host-canchas">
      <h1 className="host-canchas__title">Canchas</h1>

      <div className="host-canchas__grid">
        {CANCHAS.map((cancha) => (
          <div className="cancha-card" key={cancha.id}>
            <div className="cancha-card__photo" style={{ backgroundImage: `url(${cancha.imagen})` }}>
              <span className="cancha-card__name">{cancha.nombre}</span>
            </div>

            <div className="cancha-card__tags">
              {cancha.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="cancha-card__price-row">
              <span className="cancha-card__price-original">{formatPrecio(cancha.precioOriginal)}</span>
              <span className="cancha-card__price-note">Sin descuento</span>
            </div>
            <div className="cancha-card__price-row cancha-card__price-row--final">
              <strong>{formatPrecio(cancha.precioDescuento)}</strong>
              <span>{cancha.descuentoLabel}</span>
            </div>
          </div>
        ))}

        <button type="button" className="cancha-card cancha-card--add">
          <img src="/assets/icons/balon-mas.svg" alt="" />
          Añadir nueva cancha
        </button>
      </div>
    </div>
  );
};

export default CanchasAdmin;
