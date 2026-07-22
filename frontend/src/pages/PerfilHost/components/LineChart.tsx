import "./LineChart.css";

interface LineChartProps {
  data: { label: string; value: number }[];
  maxValue: number;
}

const WIDTH = 560;
const HEIGHT = 160;
const PADDING = 8;

const LineChart = ({ data, maxValue }: LineChartProps) => {
  const step = (WIDTH - PADDING * 2) / (data.length - 1);

  const points = data.map((point, index) => {
    const x = PADDING + step * index;
    const y = HEIGHT - (point.value / maxValue) * HEIGHT;
    return { x, y, label: point.label };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");

  return (
    <div className="host-linechart">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="host-linechart__svg">
        <path d={path} fill="none" stroke="var(--host-green)" strokeWidth="2" />
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="3.5" fill="var(--host-green)" />
        ))}
      </svg>
      <div className="host-linechart__labels">
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
};

export default LineChart;
