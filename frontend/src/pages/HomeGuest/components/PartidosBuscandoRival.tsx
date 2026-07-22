import { Link } from "react-router-dom";
import "./PartidosBuscandoRival.css";

const partidos = [
  { fecha: "20/04", ubicacion: "Cancha Central", valor: "$20.000" },
  { fecha: "20/04", ubicacion: "Cancha Central", valor: "$20.000" },
  { fecha: "20/04", ubicacion: "Cancha Central", valor: "$20.000" },
];

const PartidosBuscandoRival = () => {
  return (
    <section className="busca-partido">
      <Link to="/partidos" className="busca-partido__title">
        <img src="/assets/icons/lupa.svg" alt="" />
        <h2>Buscá tu próximo partido</h2>
      </Link>
      <p className="busca-partido__subtitle">Encontrá partidos disponibles cerca tuyo y unite a la cancha</p>

      <div className="busca-partido__grid">
        {partidos.map((partido, index) => (
          <div className="partido-card" key={index}>
            <div className="partido-card__vs">
              <img src="/assets/camisa-verde.jpg" alt="Equipo local" className="partido-card__shirt" />
              <span>VS</span>
              <img src="/assets/camisa-gris.jpg" alt="Equipo rival" className="partido-card__shirt" />
            </div>

            <div className="partido-card__divider" />

            <div className="partido-card__row">
              <img src="/assets/icons/reserva.svg" alt="" />
              <span className="partido-card__label">FECHA</span>
              <span className="partido-card__value">{partido.fecha}</span>
            </div>
            <div className="partido-card__row">
              <img src="/assets/icons/lugar.svg" alt="" />
              <span className="partido-card__label">UBICACIÓN</span>
              <span className="partido-card__value">{partido.ubicacion}</span>
            </div>
            <div className="partido-card__row">
              <img src="/assets/icons/dinero.svg" alt="" />
              <span className="partido-card__label">VALOR POR EQUIPO</span>
              <span className="partido-card__value">{partido.valor}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartidosBuscandoRival;
