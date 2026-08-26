import "./CajaSkeleton.css";

export const StatCardSkeleton = () => (
  <div className="host-stat-skeleton skeleton-pulse" />
);

export const ListRowSkeleton = () => (
  <div className="host-row-skeleton">
    <div className="skeleton-pulse" style={{ height: "18px", width: "40%" }} />
    <div className="skeleton-pulse" style={{ height: "18px", width: "25%" }} />
  </div>
);
