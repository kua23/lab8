import axios from 'axios';
import { Customer } from '../types/types';

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
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
    if (config.data) {
      console.log('Request data:', config.data);
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Customer-related API calls
export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const response = await apiClient.get('/customer');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
  
  getById: async (id: number | string): Promise<Customer> => {
    try {
      const response = await apiClient.get(`/customer/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },
  
  create: async (customerData: Customer): Promise<Customer> => {
    try {
      const response = await apiClient.post('/customer', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },
  
  update: async (id: number | string, customerData: Customer): Promise<Customer> => {
    try {
      const response = await apiClient.put(`/customer/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: number | string): Promise<void> => {
    try {
      await apiClient.delete(`/customer/${id}`);
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }
};

export default {
  customerService
};