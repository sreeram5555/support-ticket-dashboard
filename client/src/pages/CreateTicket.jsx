import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketApi';
import './CreateTicket.css';

const TITLE_MAX_LENGTH = 120;

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer_email: '',
    priority: 'Medium'
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > TITLE_MAX_LENGTH) {
      newErrors.title = `Title must be ${TITLE_MAX_LENGTH} characters or less`;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      const data = await createTicket({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        customer_email: formData.customer_email.trim()
      });
      
      if (data.success) {
        navigate('/', { state: { toastMessage: 'Ticket created successfully!' } });
      }
    } catch (err) {
      // Check if it's a validation error from backend (422)
      if (err.code === 422 && err.details) {
        const backendErrors = {};
        err.details.forEach(detail => {
          backendErrors[detail.field] = detail.message;
        });
        setErrors(backendErrors);
        setSubmitError('Please fix the validation errors above.');
      } else {
        setSubmitError(err.message || 'An error occurred while creating the ticket.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-ticket-page">
      <header className="page-header">
        <h1>Create New Ticket</h1>
        <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </header>

      {submitError && <div className="error-banner">{submitError}</div>}

      <div className="card">
        <form onSubmit={handleSubmit} className="create-ticket-form">
          
          <div className="form-group">
            <label htmlFor="title">Title <span className="required">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="Brief summary of the issue"
            />
            <div className="field-footer">
              {errors.title ? (
                <span className="field-error">{errors.title}</span>
              ) : (
                <span></span>
              )}
              <span className={`char-counter ${formData.title.length > TITLE_MAX_LENGTH ? 'error-text' : ''}`}>
                {formData.title.length}/{TITLE_MAX_LENGTH}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="customer_email">Customer Email <span className="required">*</span></label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              className={`form-input ${errors.customer_email ? 'input-error' : ''}`}
              placeholder="customer@example.com"
            />
            {errors.customer_email && <span className="field-error">{errors.customer_email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span className="required">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-input textarea-input ${errors.description ? 'input-error' : ''}`}
              placeholder="Detailed explanation of the issue..."
              rows="6"
            ></textarea>
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
