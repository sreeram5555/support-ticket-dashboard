import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
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
                <StatusBadge type="status" value={ticket.status} />
              </td>
              <td>
                <StatusBadge type="priority" value={ticket.priority} />
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
