import StatusBadge from "./StatusBadge";

function SensorTable({ sensors, onStatusChange, onSelect }) {
  return (
    <div className="table-card">
      <div className="section-heading">
        <div>
          <h3>Sensor fleet</h3>
          <p>Registered devices and current status</p>
        </div>
        <span className="count-chip">{sensors.length} sensors</span>
      </div>

      {sensors.length === 0 ? (
        <div className="empty-state">No sensors registered yet.</div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Sensor</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map((sensor) => (
                <tr key={sensor.sensorId}>
                  <td>
                    <button className="sensor-link" onClick={() => onSelect(sensor.sensorId)}>
                      <strong>{sensor.name}</strong>
                      <span>{sensor.sensorId}</span>
                    </button>
                  </td>
                  <td>{sensor.type}</td>
                  <td>{sensor.location}</td>
                  <td><StatusBadge status={sensor.status} /></td>
                  <td>
                    <button
                      className="small-button"
                      onClick={() => onStatusChange(sensor.sensorId, sensor.status === "active" ? "inactive" : "active")}
                    >
                      {sensor.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SensorTable;
