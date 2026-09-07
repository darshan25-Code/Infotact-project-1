import SensorTable from "../components/SensorTable";

function Sensors({ sensors, onStatusChange, onSelectSensor, onAddSensor }) {
  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Sensor management</h2>
          <p>Register devices and control their monitoring status.</p>
        </div>
        <button className="primary-button" onClick={onAddSensor}>+ Register sensor</button>
      </div>

      <div className="mini-summary-grid">
        <div className="mini-card"><span>Total</span><strong>{sensors.length}</strong></div>
        <div className="mini-card"><span>Active</span><strong>{sensors.filter((s) => s.status === "active").length}</strong></div>
        <div className="mini-card"><span>Inactive</span><strong>{sensors.filter((s) => s.status !== "active").length}</strong></div>
      </div>

      <SensorTable
        sensors={sensors}
        onStatusChange={onStatusChange}
        onSelect={onSelectSensor}
      />
    </div>
  );
}

export default Sensors;
