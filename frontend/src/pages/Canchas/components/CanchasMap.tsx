import { ComplejoCancha } from "../canchasData";
import "./CanchasMap.css";

interface CanchasMapProps {
  complejos?: ComplejoCancha[];
  onSelectComplejo?: (cancha: ComplejoCancha) => void;
}

const CanchasMap = ({}: CanchasMapProps) => {
  return (
    <section className="canchas-map-section">
      <h2 className="canchas-map-title">EXPLORA COMPLEJOS POR TU ZONA</h2>

      <div className="canchas-map-frame">
        <iframe
          title="Mapa Interactivo de Canchas"
          className="canchas-map-iframe"
          src="https://www.openstreetmap.org/export/embed?bbox=-59.52186584472657%2C-34.99850370014628%2C-58.375167846679695%2C-34.511083202999714&layer=mapnik"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default CanchasMap;
