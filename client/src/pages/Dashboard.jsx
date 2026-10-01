import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { getTickets, getTicketStats } from '../api/ticketApi';
import SummaryWidget from '../components/dashboard/SummaryWidget';
import FilterBar from '../components/dashboard/FilterBar';
import TicketList from '../components/dashboard/TicketList';
import Pagination from '../components/dashboard/Pagination';
import Toast from '../components/common/Toast';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  
  const [toastMessage, setToastMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listError, setListError] = useState(null);

  // Derive filters from URL
  const filters = {
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    page: parseInt(searchParams.get('page')) || 1,
    pageSize: 10
  };

  useEffect(() => {
    if (location.state && location.state.toastMessage) {
      setToastMessage(location.state.toastMessage);
      // Clear state so refresh doesn't show toast again
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getTicketStats();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      setListLoading(true);
      const data = await getTickets(filters);
      if (data.success) {
        setTickets(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      setListError(err.message || 'Failed to load tickets');
    } finally {
      setListLoading(false);
    }
  }, [filters.search, filters.status, filters.priority, filters.page, filters.pageSize]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.priority) params.set('priority', newFilters.priority);
    // Reset to page 1 on filter change
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  return (
    <div className="dashboard-page">
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage('')} 
        />
      )}
      
      <header className="page-header">
        <h1>Dashboard</h1>
        <button className="btn-primary" onClick={() => navigate('/tickets/new')}>
          + New Ticket
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}
      
      {loading ? (
        <div className="loading-state">Loading stats...</div>
      ) : (
        <div className="summary-widgets">
          <SummaryWidget title="Total Tickets" count={stats.total} type="neutral" />
          <SummaryWidget title="Open" count={stats.open} type="warning" />
          <SummaryWidget title="In Progress" count={stats.inProgress} type="primary" />
          <SummaryWidget title="Resolved" count={stats.resolved} type="success" />
        </div>
      )}

      <div className="ticket-list-section">
        <h2>Tickets</h2>
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        
        <TicketList 
          tickets={tickets} 
          loading={listLoading} 
          error={listError} 
        />
        
        <Pagination 
          pagination={pagination} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
