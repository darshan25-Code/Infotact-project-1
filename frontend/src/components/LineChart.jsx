import { formatNumber, shortTime } from "../utils/format";

function buildPoints(data, key, width, height, padding) {
  const values = data.map((item) => Number(item[key])).filter(Number.isFinite);
  if (!values.length) return { points: "", dots: [], min: 0, max: 0 };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;

  const dots = data.map((item, index) => {
    const value = Number(item[key]);
    const x = padding.left + (data.length === 1 ? usableWidth / 2 : (index / (data.length - 1)) * usableWidth);
    const y = padding.top + (1 - (value - min) / range) * usableHeight;
    return { x, y, value, timestamp: item.timestamp };
  }).filter((point) => Number.isFinite(point.value));

  return {
    points: dots.map((point) => `${point.x},${point.y}`).join(" "),
    dots,
    min,
    max
  };
}

function LineChart({ data, metric = "temperature", title = "Temperature trend", unit = "°C" }) {
  const width = 760;
  const height = 260;
  const padding = { top: 28, right: 24, bottom: 42, left: 48 };
  const chart = buildPoints(data, metric, width, height, padding);

  const first = chart.dots[0];
  const last = chart.dots[chart.dots.length - 1];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>{title}</h3>
          <p>Recent sensor readings</p>
        </div>
        {last && <strong className="chart-current">{formatNumber(last.value)}{unit}</strong>}
      </div>

      {!chart.dots.length ? (
        <div className="empty-state chart-empty">No readings available for this metric.</div>
      ) : (
        <div className="chart-wrap">
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} className="line-chart">
            {[0, 1, 2, 3].map((line) => {
              const y = padding.top + (line / 3) * (height - padding.top - padding.bottom);
              return <line key={line} x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="grid-line" />;
            })}
            <polyline points={chart.points} className="chart-line" fill="none" />
            {chart.dots.map((point, index) => (
              <circle key={`${point.timestamp}-${index}`} cx={point.x} cy={point.y} r="4" className="chart-dot">
                <title>{`${shortTime(point.timestamp)} — ${formatNumber(point.value)}${unit}`}</title>
              </circle>
            ))}
            <text x={padding.left} y={height - 12} className="axis-label">
              {first ? shortTime(first.timestamp) : ""}
            </text>
            <text x={width - padding.right} y={height - 12} textAnchor="end" className="axis-label">
              {last ? shortTime(last.timestamp) : ""}
            </text>
            <text x={10} y={padding.top + 4} className="axis-label">{formatNumber(chart.max)}</text>
            <text x={10} y={height - padding.bottom} className="axis-label">{formatNumber(chart.min)}</text>
          </svg>
        </div>
      )}
    </div>
  );
}

export default LineChart;
