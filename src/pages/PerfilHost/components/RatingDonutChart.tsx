import "./RatingDonutChart.css";

interface Segmento {
  label: string;
  value: number;
  color: string;
}

interface RatingDonutChartProps {
  segments: Segmento[];
}

const SIZE = 140;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RatingDonutChart = ({ segments }: RatingDonutChartProps) => {
  let acumulado = 0;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="host-rating-donut">
      {segments.map((segmento) => {
        const dash = (segmento.value / 100) * CIRCUMFERENCE;
        const offset = (acumulado / 100) * CIRCUMFERENCE;
        acumulado += segmento.value;

        return (
          <circle
            key={segmento.label}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={segmento.color}
            strokeWidth={STROKE}
            strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        );
      })}
    </svg>
  );
};

export default RatingDonutChart;