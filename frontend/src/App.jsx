import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import SensorModal from "./components/SensorModal";
import Dashboard from "./pages/Dashboard";
import Sensors from "./pages/Sensors";
import Telemetry from "./pages/Telemetry";
import { api } from "./services/api";

const pageInfo = {
  dashboard: {
    title: "Operations dashboard",
    subtitle: "A live overview of your IoT sensor network."
  },
  sensors: {
    title: "Sensors",
    subtitle: "Manage registered devices and their monitoring status."
  },
  telemetry: {
    title: "Telemetry",
    subtitle: "Explore recent measurements and sensor statistics."
  }
};

function App() {
  const [page, setPage] = useState("dashboard");
  const [sensors, setSensors] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [latestBySensor, setLatestBySensor] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [selectedSensorStats, setSelectedSensorStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [sensorResponse, telemetryResponse, latestResponse] = await Promise.all([
        api.getSensors(),
        api.getTelemetry(100),
        api.getLatestTelemetry()
      ]);

      setSensors(sensorResponse?.data || []);
      setTelemetry(telemetryResponse?.data || []);
      setLatestBySensor(latestResponse?.data || []);
    } catch (err) {
      setError(err.message || "Unable to load data from the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  async function handleStatusChange(sensorId, status) {
    try {
      setError("");
      await api.updateSensorStatus(sensorId, status);
      setSensors((current) => current.map((sensor) =>
        sensor.sensorId === sensorId ? { ...sensor, status } : sensor
      ));
      setNotice(`Sensor ${sensorId} is now ${status}.`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSelectSensor(sensorId) {
    try {
      setError("");
      const response = await api.getSensorStats(sensorId);
      setSelectedSensor(sensorId);
      setSelectedSensorStats(response.statistics || null);
      setPage("telemetry");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateSensor(payload) {
    try {
      setSubmitting(true);
      setError("");
      await api.createSensor(payload);
      setModalOpen(false);
      setNotice(`Sensor ${payload.sensorId} registered successfully.`);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const currentPage = useMemo(() => pageInfo[page], [page]);

  return (
    <div className="app-shell">
      <Sidebar activePage={page} onNavigate={setPage} />

      <main className="main-area">
        <Topbar
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          loading={loading}
          onRefresh={loadData}
        />

        {error && (
          <div className="alert alert-error">
            <strong>Connection error:</strong> {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        {notice && (
          <div className="alert alert-success">
            <strong>Success:</strong> {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}

        {loading && sensors.length === 0 ? (
          <div className="loading-panel">
            <div className="loader" />
            <h2>Connecting to NexusFlow...</h2>
            <p>Fetching sensors and telemetry from the backend.</p>
          </div>
        ) : (
          <>
            {page === "dashboard" && (
              <Dashboard
                sensors={sensors}
                telemetry={telemetry}
                latestBySensor={latestBySensor}
                loading={loading}
                onStatusChange={handleStatusChange}
                onSelectSensor={handleSelectSensor}
                onNavigate={setPage}
              />
            )}

            {page === "sensors" && (
              <Sensors
                sensors={sensors}
                onStatusChange={handleStatusChange}
                onSelectSensor={handleSelectSensor}
                onAddSensor={() => setModalOpen(true)}
              />
            )}

            {page === "telemetry" && (
              <Telemetry
                telemetry={telemetry}
                selectedSensor={selectedSensor}
                selectedSensorStats={selectedSensorStats}
              />
            )}
          </>
        )}
      </main>

      {modalOpen && (
        <SensorModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateSensor}
          submitting={submitting}
        />
      )}
    </div>
  );
}

export default App;
