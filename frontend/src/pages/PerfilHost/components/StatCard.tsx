import { ReactNode } from "react";
import "./StatCard.css";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "negative";
  deltaNote?: string;
}

const StatCard = ({ label, value, delta, deltaTone = "positive", deltaNote = "vs ayer" }: StatCardProps) => {
  return (
    <div className="host-card stat-card">
      <span className="stat-card__label">{label}</span>
      <div className="stat-card__row">
        <strong className="stat-card__value">{value}</strong>
        {delta && (
          <span className={`stat-card__delta stat-card__delta--${deltaTone}`}>
            {delta}
            <small>{deltaNote}</small>
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;

export const HostCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`host-card ${className}`}>{children}</div>
);
