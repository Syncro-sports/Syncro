import { ReactNode } from "react";
import { HostCard } from "./StatCard";
import "./PlaceholderTab.css";

interface PlaceholderTabProps {
  titulo: string;
  descripcion: string;
  icono: ReactNode;
}

const PlaceholderTab = ({ titulo, descripcion, icono }: PlaceholderTabProps) => {
  return (
    <div className="host-placeholder">
      <h1 className="host-placeholder__title">{titulo}</h1>
      <HostCard className="host-placeholder__card">
        <span className="host-placeholder__icon">{icono}</span>
        <p>{descripcion}</p>
        <span className="host-placeholder__tag">Próximamente</span>
      </HostCard>
    </div>
  );
};

export default PlaceholderTab;
