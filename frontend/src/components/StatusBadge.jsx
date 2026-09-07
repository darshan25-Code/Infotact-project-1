function StatusBadge({ status }) {
  const normalized = String(status || "inactive").toLowerCase();
  const active = normalized === "active";

  return (
    <span className={`status-badge ${active ? "status-active" : "status-inactive"}`}>
      <span className="status-dot" />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default StatusBadge;
