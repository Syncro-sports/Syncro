import "./PartidoCardSkeleton.css";

const PartidoCardSkeleton = () => {
  return (
    <div className="partido-card-skeleton">
      <div className="skeleton-header skeleton-pulse" />
      <div className="skeleton-line skeleton-pulse" style={{ width: "70%" }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: "90%" }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: "50%" }} />
      <div className="skeleton-footer skeleton-pulse" />
    </div>
  );
};

export default PartidoCardSkeleton;