import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTicketById, updateTicket, deleteTicket } from '../api/ticketApi';
import './TicketDetail.css';
import constants from '../../../server/src/constants.js';
const { TITLE_MAX_LENGTH } = constants;

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [updatePriority, setUpdatePriority] = useState('');
  
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(id);
        if (data.success) {
          setTicket(data.data);
          setUpdateTitle(data.data.title);
          setUpdateDescription(data.data.description);
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
    
    const trimmedTitle = updateTitle.trim();
    const trimmedDescription = updateDescription.trim();
    
    if (!trimmedTitle || !trimmedDescription) {
      setUpdateError('Title and description cannot be empty.');
      return;
    }
    
    if (
      updateStatus === ticket.status && 
      updatePriority === ticket.priority &&
      trimmedTitle === ticket.title &&
      trimmedDescription === ticket.description
    ) {
      return; // No changes
    }

    try {
      setUpdating(true);
      setUpdateError(null);
      const data = await updateTicket(id, {
        title: trimmedTitle,
        description: trimmedDescription,
        status: updateStatus,
        priority: updatePriority
      });
      
      if (data.success) {
        navigate('/', { state: { toastMessage: 'Ticket updated successfully!' } });
      }
    } catch (err) {
      let errorMessage = err.message || 'Failed to update ticket.';
      if (err.error && err.error.details && err.error.details.length > 0) {
        errorMessage = err.error.details.map(d => d.message).join(', ');
      }
      setUpdateError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleting(true);
      const data = await deleteTicket(id);
      if (data.success) {
        navigate('/', { state: { toastMessage: 'Ticket deleted successfully!' } });
      }
    } catch (err) {
      setUpdateError(err.message || 'Failed to delete ticket.');
      setDeleting(false);
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
        <div className="header-actions">
          <button 
            className="btn-secondary" 
            style={{ color: '#dc2626', borderColor: '#fca5a5', marginRight: '1rem' }}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Ticket'}
          </button>
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
        </div>
      </header>

      {updateError && <div className="error-banner">{updateError}</div>}

      <form onSubmit={handleUpdate} className="ticket-content-wrapper">
        <div className="ticket-main-info card">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              className="form-input"
              required
              maxLength={TITLE_MAX_LENGTH}
            />
          </div>
          
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

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={updateDescription}
              onChange={(e) => setUpdateDescription(e.target.value)}
              className="form-input"
              rows={6}
              required
            />
          </div>
        </div>

        <div className="ticket-sidebar card">
          <h3>Ticket Settings</h3>
          
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
            disabled={
              updating || 
              (updateStatus === ticket.status && 
               updatePriority === ticket.priority && 
               updateTitle.trim() === ticket.title && 
               updateDescription.trim() === ticket.description)
            }
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketDetail;
