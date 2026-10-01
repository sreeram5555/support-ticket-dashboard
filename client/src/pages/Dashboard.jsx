import { useEffect, useState, useCallback } from 'react';
import { getTickets, getTicketStats } from '../api/ticketApi';
import SummaryWidget from '../components/dashboard/SummaryWidget';
import FilterBar from '../components/dashboard/FilterBar';
import TicketList from '../components/dashboard/TicketList';
import Pagination from '../components/dashboard/Pagination';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 1,
    pageSize: 10
  });

  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listError, setListError] = useState(null);

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
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <button className="btn-primary" onClick={() => window.location.href = '/tickets/new'}>
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
