function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>
        <div>
          <strong>NexusFlow</strong>
          <span>IoT Monitoring</span>
        </div>
      </div>

      <nav className="nav-list">
        <button className={`nav-item ${activePage === "dashboard" ? "nav-active" : ""}`} onClick={() => onNavigate("dashboard")}>
          <span>⌂</span> Dashboard
        </button>
        <button className={`nav-item ${activePage === "sensors" ? "nav-active" : ""}`} onClick={() => onNavigate("sensors")}>
          <span>◉</span> Sensors
        </button>
        <button className={`nav-item ${activePage === "telemetry" ? "nav-active" : ""}`} onClick={() => onNavigate("telemetry")}>
          <span>⌁</span> Telemetry
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="system-pill">
          <span className="live-dot" />
          Monitoring online
        </div>
        <p>NexusFlow MVP</p>
      </div>
    </aside>
  );
}

export default Sidebar;
