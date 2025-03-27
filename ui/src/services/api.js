import axios from 'axios';

const API_BASE_URL = '/api';

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Customer-related API calls
export const customerService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/customer');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/customer/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  create: async (customerData) => {
    try {
      // Validate required fields before sending
      if (!customerData.name) {
        throw new Error('Customer name is required');
      }
      
      // Log the exact data being sent
      console.log('Sending customer data:', JSON.stringify(customerData, null, 2));
      
      // Make sure the customerData is properly formatted
      const formattedData = {
        name: customerData.name,
        email: customerData.email || '',
        phone: customerData.phone || '',
        // Add any other required fields with defaults
        ...customerData
      };
      
      const response = await apiClient.post('/customer', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  update: async (id, customerData) => {
    try {
      const response = await apiClient.put(`/customer/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/customer/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
      }
      throw error;
    }
  }
};

export default apiClient;
