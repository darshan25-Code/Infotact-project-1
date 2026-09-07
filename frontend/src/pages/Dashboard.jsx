import StatCard from "../components/StatCard";
import LineChart from "../components/LineChart";
import SensorTable from "../components/SensorTable";
import TelemetryTable from "../components/TelemetryTable";
import { formatNumber } from "../utils/format";

function Dashboard({ sensors, telemetry, latestBySensor, loading, onStatusChange, onSelectSensor, onNavigate }) {
  const active = sensors.filter((sensor) => sensor.status === "active").length;
  const inactive = sensors.length - active;
  const latest = telemetry[0];
  const chartData = [...telemetry].reverse().slice(-20);

  return (
    <>
      <div className="stat-grid">
        <StatCard label="Total sensors" value={sensors.length} hint="Registered devices" icon="◉" tone="blue" />
        <StatCard label="Active sensors" value={active} hint={`${inactive} inactive`} icon="✓" tone="green" />
        <StatCard label="Latest temperature" value={latest ? `${formatNumber(latest.temperature)} °C` : "—"} hint={latest?.sensorId || "Waiting for data"} icon="°" tone="orange" />
        <StatCard label="Latest humidity" value={latest ? `${formatNumber(latest.humidity)} %` : "—"} hint={latest?.sensorId || "Waiting for data"} icon="≈" tone="purple" />
      </div>

      <div className="content-grid two-columns">
        <LineChart data={chartData} metric="temperature" title="Temperature trend" unit="°C" />
        <LineChart data={chartData} metric="humidity" title="Humidity trend" unit="%" />
      </div>

      <SensorTable
        sensors={sensors.slice(0, 6)}
        onStatusChange={onStatusChange}
        onSelect={onSelectSensor}
      />

      <TelemetryTable telemetry={telemetry.slice(0, 8)} />

      <div className="dashboard-footer-note">
        <span>●</span> Data is fetched directly from the NexusFlow backend. {latestBySensor.length} sensors currently have a latest reading.
        <button onClick={() => onNavigate("telemetry")}>View all telemetry →</button>
      </div>
    </>
  );
}

export default Dashboard;
