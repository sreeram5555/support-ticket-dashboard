import './SummaryWidget.css';

const SummaryWidget = ({ title, count, type }) => {
  return (
    <div className={`summary-widget widget-${type}`}>
      <h3 className="widget-title">{title}</h3>
      <div className="widget-count">{count}</div>
    </div>
  );
};

export default SummaryWidget;
