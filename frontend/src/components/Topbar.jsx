function Topbar({ title, subtitle, loading, onRefresh }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">REAL-TIME TELEMETRY</p>
        <h1>{title}</h1>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>
      <button className="refresh-button" onClick={onRefresh} disabled={loading}>
        <span className={loading ? "spin" : ""}>↻</span>
        {loading ? "Refreshing..." : "Refresh data"}
      </button>
    </header>
  );
}

export default Topbar;
