import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PartidoCard from "../../Partidos/components/PartidoCard";
import PartidoCardSkeleton from "../../Partidos/components/PartidoCardSkeleton";
import { Partido, PARTIDOS } from "../../Partidos/partidosData";
import { partidosService } from "../../../services/partidosService";
import "./PartidosBuscandoRival.css";

const CANTIDAD_DESTACADOS = 3;

const PartidosBuscandoRival = () => {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [partidosDestacados, setPartidosDestacados] = useState<Partido[]>(
    PARTIDOS.slice(0, CANTIDAD_DESTACADOS)
  );

  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        // Mostramos los partidos reales que ya haya en el backend (para que
        // "Ver detalle" lleve a uno que de verdad exista en /partidos) y
        // completamos el resto con mockups hasta llegar a 3, mientras el
        // backend todavia no tiene suficientes partidos cargados.
        const reales = await partidosService.obtenerPartidos();
        const idsReales = new Set(reales.map((p) => p.id));
        const relleno = PARTIDOS.filter((p) => !idsReales.has(p.id));
        setPartidosDestacados([...reales, ...relleno].slice(0, CANTIDAD_DESTACADOS));
      } finally {
        setLoading(false);
      }
    };
    cargarDestacados();
  }, []);

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="busca-partido">
      <Link to="/partidos" className="busca-partido__title">
        <img src={`${import.meta.env.BASE_URL}assets/icons/lupa.svg`} alt="" />
        <h2>Buscá tu próximo partido</h2>
      </Link>
      <p className="busca-partido__subtitle">Encontrá partidos disponibles cerca tuyo y unite a la cancha</p>

      <div className="busca-partido__grid">
        {loading
          ? Array.from({ length: CANTIDAD_DESTACADOS }).map((_, i) => <PartidoCardSkeleton key={i} />)
          : partidosDestacados.map((partido) => (
              <PartidoCard
                key={partido.id}
                partido={partido}
                favorito={favoritos.has(partido.id)}
                onToggleFavorito={toggleFavorito}
                onVerDetalle={(p) => navigate(`/partidos?partido=${p.id}`)}
              />
            ))}
      </div>
    </section>
  );
};

export default PartidosBuscandoRival;
