import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to format errors consistently
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      success: false,
      error: {
        code: 500,
        message: 'Network error or server is down',
      },
    });
  }
);

export const getTickets = (params) => {
  return apiClient.get('/tickets', { params });
};

export const getTicketStats = () => {
  return apiClient.get('/tickets/stats');
};

export const getTicketById = (id) => {
  return apiClient.get(`/tickets/${id}`);
};

export const createTicket = (data) => {
  return apiClient.post('/tickets', data);
};

export const updateTicket = (id, data) => {
  return apiClient.patch(`/tickets/${id}`, data);
};
