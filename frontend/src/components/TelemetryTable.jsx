import { formatDate, formatNumber } from "../utils/format";

function TelemetryTable({ telemetry }) {
  return (
    <div className="table-card">
      <div className="section-heading">
        <div>
          <h3>Recent telemetry</h3>
          <p>Latest readings received from the sensor network</p>
        </div>
        <span className="count-chip">{telemetry.length} readings</span>
      </div>

      {telemetry.length === 0 ? (
        <div className="empty-state">No telemetry readings available.</div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Sensor</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Pressure</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {telemetry.map((item, index) => (
                <tr key={item._id || `${item.sensorId}-${item.timestamp}-${index}`}>
                  <td><strong>{item.sensorId}</strong></td>
                  <td>{formatNumber(item.temperature)} °C</td>
                  <td>{formatNumber(item.humidity)} %</td>
                  <td>{formatNumber(item.pressure)} hPa</td>
                  <td>{formatDate(item.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TelemetryTable;
