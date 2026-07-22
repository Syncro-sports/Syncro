import "./HourGrid.css";

interface HourGridProps {
  count: number;
}

const HourGrid = ({ count }: HourGridProps) => (
  <div className="host-hourgrid" aria-hidden="true">
    {Array.from({ length: count }).map((_, index) => (
      <span key={index} style={{ left: `${(index / (count - 1)) * 100}%` }} />
    ))}
  </div>
);

export default HourGrid;
