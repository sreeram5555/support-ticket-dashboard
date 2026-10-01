import { Link } from 'react-router-dom';
import './TicketList.css';

const TicketList = ({ tickets, loading, error }) => {
  if (loading) {
    return <div className="ticket-list-loading">Loading tickets...</div>;
  }

  if (error) {
    return <div className="ticket-list-error">{error}</div>;
  }

  if (!tickets || tickets.length === 0) {
    return <div className="ticket-list-empty">No tickets found matching your criteria.</div>;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Customer Email</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>#{ticket.id}</td>
              <td className="ticket-title">{ticket.title}</td>
              <td>{ticket.customer_email}</td>
              <td>
                <span className={`badge ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              </td>
              <td>
                <span className={`badge ${getPriorityClass(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </td>
              <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
              <td>
                <Link to={`/tickets/${ticket.id}`} className="view-link">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketList;
