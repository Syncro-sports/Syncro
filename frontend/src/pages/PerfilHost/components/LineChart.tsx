import "./LineChart.css";

interface LineChartProps {
  data: { label: string; value: number }[];
  maxValue: number;
}

const WIDTH = 560;
const HEIGHT = 160;
const PADDING = 8;

const formatEje = (valor: number) => (valor === 0 ? "0" : `${Math.round(valor / 1000)}k`);

const LineChart = ({ data, maxValue }: LineChartProps) => {
  const niceMax = Math.ceil((maxValue * 1.15) / 10000) * 10000;
  const ejeSteps = [niceMax, niceMax * 0.8, niceMax * 0.6, niceMax * 0.4, niceMax * 0.2, 0];

  const step = (WIDTH - PADDING * 2) / (data.length - 1);
  const points = data.map((point, index) => ({
    x: PADDING + step * index,
    y: HEIGHT - (point.value / niceMax) * HEIGHT,
    label: point.label,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div className="host-linechart">
      <div className="host-linechart__body">
        <div className="host-linechart__eje">
          {ejeSteps.map((valor) => (
            <span key={valor}>{formatEje(valor)}</span>
          ))}
        </div>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="host-linechart__svg">
          <path d={path} fill="none" stroke="var(--host-green)" strokeWidth="2" />
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="3.5" fill="var(--host-green)" />
          ))}
        </svg>
      </div>
      <div className="host-linechart__labels">
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
};

export default LineChart;