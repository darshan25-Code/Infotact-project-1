const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(body?.message || `Request failed with status ${response.status}`);
  }

  return body;
}

export const api = {
  health: () => request("/health"),

  getSensors: () => request("/sensors"),

  getSensor: (sensorId) => request(`/sensors/${encodeURIComponent(sensorId)}`),

  createSensor: (payload) =>
    request("/sensors", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  updateSensorStatus: (sensorId, status) =>
    request(`/sensors/${encodeURIComponent(sensorId)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),

  getTelemetry: (limit = 100) => request(`/telemetry?limit=${limit}`),

  getRecentTelemetry: (limit = 20) => request(`/telemetry?limit=${limit}`),

  getLatestTelemetry: () => request("/telemetry/latest"),

  getSensorTelemetry: (sensorId, limit = 100) =>
    request(`/telemetry/${encodeURIComponent(sensorId)}?limit=${limit}`),

  getSensorStats: (sensorId) =>
    request(`/telemetry/${encodeURIComponent(sensorId)}/stats`),

  createTelemetry: (payload) =>
    request("/telemetry", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};

export { API_BASE_URL };
