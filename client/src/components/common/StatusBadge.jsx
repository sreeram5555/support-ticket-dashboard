import './StatusBadge.css';

const StatusBadge = ({ type, value }) => {
  const getBadgeClass = () => {
    if (type === 'status') {
      switch (value) {
        case 'Open': return 'status-open';
        case 'In Progress': return 'status-progress';
        case 'Resolved': return 'status-resolved';
        default: return '';
      }
    } else if (type === 'priority') {
      switch (value) {
        case 'High': return 'priority-high';
        case 'Medium': return 'priority-medium';
        case 'Low': return 'priority-low';
        default: return '';
      }
    }
    return '';
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {value}
    </span>
  );
};

export default StatusBadge;
