import React from 'react';

const StatsCard = ({ title, value, subtext, icon: Icon, iconBg, iconColor }) => {
  return (
    <div className="glass-card stat-card">
      <div>
        <div className="stat-header">
          <span className="stat-title">{title}</span>
          {Icon && (
            <div className="stat-icon" style={{ background: iconBg || 'rgba(99, 102, 241, 0.15)', color: iconColor || '#818cf8' }}>
              <Icon size={20} />
            </div>
          )}
        </div>
        <div className="stat-value">{value}</div>
      </div>
      {subtext && <div className="stat-sub">{subtext}</div>}
    </div>
  );
};

export default StatsCard;
