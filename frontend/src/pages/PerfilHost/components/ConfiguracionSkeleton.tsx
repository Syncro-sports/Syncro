import "./ConfiguracionSkeleton.css";

const ConfiguracionSkeleton = () => {
  return (
    <div className="configuracion-container config-skeleton-wrapper">
      <div className="configuracion-grid-top">
        <div className="config-card config-skeleton-card">
          <div className="config-skeleton-line config-skeleton-header-line" />
          <div className="config-skeleton-grid">
            <div className="config-skeleton-box" />
            <div className="config-skeleton-box" />
            <div className="config-skeleton-box full" />
            <div className="config-skeleton-box" />
            <div className="config-skeleton-box" />
          </div>
        </div>
        <div className="config-card config-skeleton-card">
          <div className="config-skeleton-line config-skeleton-header-line" />
          <div className="config-skeleton-circle" />
        </div>
      </div>

      <div className="config-card config-skeleton-card">
        <div className="config-skeleton-line config-skeleton-header-line" />
        <div className="config-skeleton-grid-4">
          <div className="config-skeleton-box" />
          <div className="config-skeleton-box" />
          <div className="config-skeleton-box" />
          <div className="config-skeleton-box" />
        </div>
      </div>

      <div className="configuracion-grid-bottom">
        <div className="config-card config-skeleton-card">
          <div className="config-skeleton-line config-skeleton-header-line" />
          <div className="config-skeleton-line" />
        </div>
        <div className="config-card config-skeleton-card">
          <div className="config-skeleton-line config-skeleton-header-line" />
          <div className="config-skeleton-line" />
          <div className="config-skeleton-line" />
          <div className="config-skeleton-line" />
        </div>
        <div className="config-card config-skeleton-card">
          <div className="config-skeleton-line config-skeleton-header-line" />
          <div className="config-skeleton-line" />
          <div className="config-skeleton-line" />
          <div className="config-skeleton-line" />
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionSkeleton;
