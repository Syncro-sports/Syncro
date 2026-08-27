import "./CanchaCardSkeleton.css";

const CanchaCardSkeleton = () => {
  return (
    <div className="cancha-card-skeleton">
      <div className="cancha-skeleton-image cancha-skeleton-pulse" />
      <div className="cancha-card-skeleton__body">
        <div className="cancha-skeleton-line cancha-skeleton-pulse" style={{ width: "60%" }} />
        <div className="cancha-skeleton-line cancha-skeleton-pulse" style={{ width: "40%" }} />
        <div className="cancha-skeleton-price cancha-skeleton-pulse" />
        <div className="cancha-skeleton-turnos">
          <div className="cancha-skeleton-turno cancha-skeleton-pulse" />
          <div className="cancha-skeleton-turno cancha-skeleton-pulse" />
          <div className="cancha-skeleton-turno cancha-skeleton-pulse" />
        </div>
        <div className="cancha-skeleton-footer cancha-skeleton-pulse" />
      </div>
    </div>
  );
};

export default CanchaCardSkeleton;
