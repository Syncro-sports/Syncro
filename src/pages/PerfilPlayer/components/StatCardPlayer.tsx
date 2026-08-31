import { ReactNode } from "react";
import "./StatCardPlayer.css";

interface StatCardPlayerProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

const StatCardPlayer = ({ label, value, icon }: StatCardPlayerProps) => {
  return (
    <div className="player-card stat-card-player">
      {icon && <span className="stat-card-player__icon">{icon}</span>}
      <div className="stat-card-player__text">
        <span className="stat-card-player__label">{label}</span>
        <span className="stat-card-player__value">{value}</span>
      </div>
    </div>
  );
};

export default StatCardPlayer;

export const PlayerCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`player-card ${className}`}>{children}</div>
);