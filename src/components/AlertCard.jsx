export default function AlertCard({ alert, onFlag }) {
  return (
    <div className={`alert-card ${alert.severity}`}>
      <div className="alert-header">
        <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
        <span className="alert-id">{alert.id}</span>
        <span style={{fontSize:10,fontWeight:600,color:'#64748b'}}>Stage {alert.stage}</span>
        <span style={{fontSize:10,color:'#64748b'}}>📍 {alert.location}</span>
        <span className="alert-time">🕐 {alert.time}</span>
      </div>
      <div className="alert-desc">{alert.description}</div>
      <div className="alert-footer">
        <span className="alert-meta">Division: {alert.division}</span>
        <span className={`badge badge-${alert.status}`}>{alert.status.replace('_',' ').toUpperCase()}</span>
        {alert.status !== 'resolved' && (
          <button
            className={`flag-btn ${alert.status === 'under_review' ? 'flagged' : ''}`}
            onClick={() => onFlag(alert.id)}
          >
            {alert.status === 'under_review' ? '🔍 Under Review' : '⚑ Flag for Investigation'}
          </button>
        )}
      </div>
    </div>
  );
}
