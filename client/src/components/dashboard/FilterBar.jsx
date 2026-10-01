import { useState, useEffect } from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ ...filters, search: localSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters, onFilterChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value, page: 1 });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group search-group">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          id="search"
          placeholder="Search by title or email..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="filter-input"
        />
      </div>
      
      <div className="filter-group">
        <label htmlFor="status">Status</label>
        <select 
          id="status" 
          name="status" 
          value={filters.status} 
          onChange={handleChange}
          className="filter-input"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority">Priority</label>
        <select 
          id="priority" 
          name="priority" 
          value={filters.priority} 
          onChange={handleChange}
          className="filter-input"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
