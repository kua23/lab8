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
      // Format data to ensure it only contains fields from types.ts
      const formattedData = {
        ...customerData,
        identityDocuments: customerData.identityDocuments?.map(doc => ({
          type: doc.type,
          number: doc.number,
          issueDate: doc.issueDate,
          expiryDate: doc.expiryDate
        })),
        identityProofs: customerData.identityProofs?.map(proof => ({
          type: proof.type,
          documentNumber: proof.documentNumber
        }))
      };
      
      const response = await apiClient.post('/customer', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },
  
  update: async (id, customerData) => {
    try {
      // Format data to match current types.ts
      const formattedData = {
        ...customerData,
        identityDocuments: customerData.identityDocuments?.map(doc => ({
          type: doc.type,
          number: doc.number,
          issueDate: doc.issueDate,
          expiryDate: doc.expiryDate
        })) || [],
        identityProofs: customerData.identityProofs?.map(proof => ({
          type: proof.type,
          documentNumber: proof.documentNumber
        })) || []
      };
      
      const response = await apiClient.put(`/customer/${id}`, formattedData);
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
