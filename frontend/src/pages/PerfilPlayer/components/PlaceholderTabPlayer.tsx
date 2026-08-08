import { ReactNode } from "react";
import { PlayerCard } from "./StatCardPlayer";
import "./PlaceholderTabPlayer.css";

interface PlaceholderTabPlayerProps {
  titulo: string;
  descripcion: string;
  icono: ReactNode;
}

const PlaceholderTabPlayer = ({ titulo, descripcion, icono }: PlaceholderTabPlayerProps) => {
  return (
    <div className="player-placeholder">
      <h1 className="player-placeholder__title">{titulo}</h1>
      <PlayerCard className="player-placeholder__card">
        <span className="player-placeholder__icon">{icono}</span>
        <p>{descripcion}</p>
        <span className="player-placeholder__tag">Próximamente</span>
      </PlayerCard>
    </div>
  );
};

export default PlaceholderTabPlayer;