import React, { useState, useEffect } from 'react';
import { customerService } from '../services/api';

function CustomerComponent() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await customerService.getAll();
        setCustomers(data);
      } catch (err) {
        setError('Failed to fetch customers. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, []); // Empty dependency array to run only once on component mount
  
  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="customer-list">
      <h2>Customers</h2>
      {customers.length === 0 ? (
        <p>No customers found</p>
      ) : (
        <ul>
          {customers.map(customer => (
            <li key={customer.id}>
              {typeof customer.name === 'string' 
                ? customer.name
                : `${customer.name.firstName} ${customer.name.middleName ? customer.name.middleName + ' ' : ''}${customer.name.lastName}`} - {customer.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomerComponent;
