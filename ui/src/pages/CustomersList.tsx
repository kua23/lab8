import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Customer } from '../types';

const CustomersList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/customer');
        
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/20 border border-red-500 p-4 text-red-100">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        All Customers
      </h1>
      
      {customers.length === 0 ? (
        <div className="bg-dark-light rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No customers found</p>
          <Link to="/customers/create" className="btn-primary">Create New Customer</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Link 
              key={customer.id} 
              to={`/customers/view/${customer.id}`}
              className="card hover:border-primary-light border-2 border-transparent"
            >
              <h2 className="text-xl font-semibold mb-2">{customer.name}</h2>
              <p className="text-gray-400">DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {customer.address.city}, {customer.address.country}
                </span>
                <span className="text-primary">View details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersList;
