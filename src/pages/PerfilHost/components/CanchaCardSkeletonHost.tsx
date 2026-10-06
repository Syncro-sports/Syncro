import "./CanchaCardSkeletonHost.css";

const CanchaCardSkeletonHost = () => {
  return (
    <div className="host-cancha-skeleton">
      <div className="host-cancha-skeleton__photo host-cancha-skeleton__pulse" />
      <div className="host-cancha-skeleton__body">
        <div className="host-cancha-skeleton__line host-cancha-skeleton__pulse" style={{ width: "70%" }} />
        <div className="host-cancha-skeleton__line host-cancha-skeleton__pulse" style={{ width: "45%" }} />
        <div className="host-cancha-skeleton__price host-cancha-skeleton__pulse" />
        <div className="host-cancha-skeleton__actions">
          <div className="host-cancha-skeleton__btn host-cancha-skeleton__pulse" />
          <div className="host-cancha-skeleton__btn host-cancha-skeleton__pulse" />
        </div>
      </div>
    </div>
  );
};

export default CanchaCardSkeletonHost;
