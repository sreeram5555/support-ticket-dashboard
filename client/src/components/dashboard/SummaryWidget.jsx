import './SummaryWidget.css';

const SummaryWidget = ({ title, count, type, loading = false }) => {
  if (loading) {
    return (
      <div className="summary-widget widget-skeleton">
        <div className="skeleton-title"></div>
        <div className="skeleton-count"></div>
      </div>
    );
  }

  return (
    <div className={`summary-widget widget-${type}`}>
      <h3 className="widget-title">{title}</h3>
      <div className="widget-count">{count}</div>
    </div>
  );
};

export default SummaryWidget;
