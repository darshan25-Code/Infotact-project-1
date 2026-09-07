function StatCard({ label, value, hint, icon, tone = "blue" }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        {hint && <span className="stat-hint">{hint}</span>}
      </div>
    </div>
  );
}

export default StatCard;
