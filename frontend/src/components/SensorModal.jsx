import { useState } from "react";

function SensorModal({ onClose, onSubmit, submitting }) {
  const [form, setForm] = useState({
    sensorId: "",
    name: "",
    type: "Temperature",
    location: ""
  });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">SENSOR MANAGEMENT</p>
            <h2>Register sensor</h2>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={submit}>
          <label>
            Sensor ID
            <input required value={form.sensorId} onChange={(e) => update("sensorId", e.target.value)} placeholder="TEMP-005" />
          </label>
          <label>
            Sensor name
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Boiler Temperature Sensor" />
          </label>
          <label>
            Sensor type
            <select value={form.type} onChange={(e) => update("type", e.target.value)}>
              <option>Temperature</option>
              <option>Humidity</option>
              <option>Pressure</option>
              <option>Environmental</option>
              <option>Multi-sensor</option>
            </select>
          </label>
          <label>
            Location
            <input required value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Factory Floor A" />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? "Registering..." : "Register sensor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SensorModal;
