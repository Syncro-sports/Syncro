import "./DonutChart.css";

interface DonutChartProps {
  porcentaje: number;
}

const SIZE = 140;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DonutChart = ({ porcentaje }: DonutChartProps) => {
  const dash = (porcentaje / 100) * CIRCUMFERENCE;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="host-donut">
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--host-border-subtle)"
        strokeWidth={STROKE}
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--host-green)"
        strokeWidth={STROKE}
        strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
      />
    </svg>
  );
};

export default DonutChart;
