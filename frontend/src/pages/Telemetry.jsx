import LineChart from "../components/LineChart";
import TelemetryTable from "../components/TelemetryTable";

function Telemetry({ telemetry, selectedSensor, selectedSensorStats }) {
  const chartData = [...telemetry].reverse().slice(-30);

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Telemetry explorer</h2>
          <p>Monitor sensor measurements stored in MongoDB.</p>
        </div>
        <span className="live-label"><span className="live-dot" /> Live API data</span>
      </div>

      <div className="content-grid two-columns">
        <LineChart data={chartData} metric="temperature" title="Temperature" unit="°C" />
        <LineChart data={chartData} metric="pressure" title="Pressure" unit=" hPa" />
      </div>

      {selectedSensor && selectedSensorStats && (
        <div className="stats-panel">
          <div>
            <span className="panel-label">Selected sensor</span>
            <strong>{selectedSensor}</strong>
          </div>
          <div><span>Readings</span><strong>{selectedSensorStats.count ?? "—"}</strong></div>
          <div><span>Avg. temperature</span><strong>{selectedSensorStats.temperature?.average != null ? `${Number(selectedSensorStats.temperature.average).toFixed(1)} °C` : "—"}</strong></div>
          <div><span>Avg. humidity</span><strong>{selectedSensorStats.humidity?.average != null ? `${Number(selectedSensorStats.humidity.average).toFixed(1)} %` : "—"}</strong></div>
          <div><span>Avg. pressure</span><strong>{selectedSensorStats.pressure?.average != null ? `${Number(selectedSensorStats.pressure.average).toFixed(1)} hPa` : "—"}</strong></div>
        </div>
      )}

      <TelemetryTable telemetry={telemetry} />
    </div>
  );
}

export default Telemetry;
