import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTicketById, updateTicket } from '../api/ticketApi';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [updateStatus, setUpdateStatus] = useState('');
  const [updatePriority, setUpdatePriority] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(id);
        if (data.success) {
          setTicket(data.data);
          setUpdateStatus(data.data.status);
          setUpdatePriority(data.data.priority);
        }
      } catch (err) {
        setError(err.message || 'Failed to load ticket details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (updateStatus === ticket.status && updatePriority === ticket.priority) {
      return; // No changes
    }

    try {
      setUpdating(true);
      setUpdateError(null);
      const data = await updateTicket(id, {
        status: updateStatus,
        priority: updatePriority
      });
      
      if (data.success) {
        setTicket(data.data);
      }
    } catch (err) {
      setUpdateError(err.message || 'Failed to update ticket.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="ticket-detail-page"><div className="loading-state">Loading ticket details...</div></div>;
  
  if (error) return (
    <div className="ticket-detail-page">
      <div className="error-banner">{error}</div>
      <Link to="/" className="btn-secondary">Back to Dashboard</Link>
    </div>
  );
  
  if (!ticket) return <div className="ticket-detail-page"><div className="error-banner">Ticket not found</div></div>;

  return (
    <div className="ticket-detail-page">
      <header className="page-header">
        <h1>Ticket #{ticket.id}</h1>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </header>

      <div className="ticket-content-wrapper">
        <div className="ticket-main-info card">
          <h2 className="ticket-title-large">{ticket.title}</h2>
          
          <div className="ticket-meta-info">
            <div className="meta-item">
              <span className="meta-label">Customer Email:</span>
              <span className="meta-value">{ticket.customer_email}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Created:</span>
              <span className="meta-value">{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last Updated:</span>
              <span className="meta-value">{new Date(ticket.updated_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="ticket-description-box">
            <h3>Description</h3>
            <p className="description-text">{ticket.description}</p>
          </div>
        </div>

        <div className="ticket-sidebar card">
          <h3>Update Ticket</h3>
          
          {updateError && <div className="error-banner small-error">{updateError}</div>}
          
          <form onSubmit={handleUpdate} className="update-form">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select 
                id="status" 
                value={updateStatus} 
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="form-input"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select 
                id="priority" 
                value={updatePriority} 
                onChange={(e) => setUpdatePriority(e.target.value)}
                className="form-input"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn-primary full-width" 
              disabled={updating || (updateStatus === ticket.status && updatePriority === ticket.priority)}
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
