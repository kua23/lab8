import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Customer } from '../types/types';
import {customerService} from '../services/api';

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch customers when component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await customerService.getAll();
        console.log(data);
        // Make sure each customer has required properties initialized
        const processedData = data.map(customer => ({
          ...customer,
          identityDocuments: customer.identityDocuments || [],
          identityProofs: customer.identityProofs || []
        }));
        setCustomers(processedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError("Failed to load customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []); // Empty dependency array ensures this runs once on mount
  
  const filteredCustomers = customers.filter(customer => {
    const fullName = typeof customer.name === 'string' 
      ? customer.name.toLowerCase()
      : `${customer.name.firstName} ${customer.name.middleName} ${customer.name.lastName}`.toLowerCase();
    
    return fullName.includes(searchTerm.toLowerCase()) ||
           customer.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.address.country.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const viewCustomer = (customer: Customer) => {
    navigate(`/customers/view/${customer.id}`, { 
      state: { customerData: customer } 
    });
  };

  const editCustomer = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/customers/create', { 
      state: { 
        customerData: customer, 
        editMode: true 
      } 
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Customers
        </h1>
        <button
          onClick={() => navigate('/customers/create')}
          className="btn-primary"
        >
          Add New Customer
        </button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search customers by name, city or country..."
          className="form-input w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-300">Loading customers...</p>
        </div>
      )}
      
      {error && !loading && (
        <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-white hover:text-red-100 underline"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Customers Table */}
      {!loading && !error && (
        <div className="bg-dark-light rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-dark-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-dark-darker cursor-pointer transition-colors"
                    onClick={() => viewCustomer(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">
                        {typeof customer.name === 'string'
                          ? customer.name
                          : `${customer.name.firstName} ${customer.name.middleName ? customer.name.middleName + ' ' : ''}${customer.name.lastName}`
                        }
                      </div>
                      <div className="text-gray-400 text-sm">
                        Born: {new Date(customer.dateOfBirth).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{customer.address.city}</div>
                      <div className="text-gray-400 text-sm">{customer.address.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.contactDetails ? (
                        <>
                          <div>{customer.contactDetails.email}</div>
                          <div className="text-gray-400 text-sm">{customer.contactDetails.phoneNumber}</div>
                        </>
                      ) : (
                        <span className="text-gray-400">No contact details</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {customer.identityDocuments && customer.identityDocuments.length > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                            {customer.identityDocuments.length} Doc{customer.identityDocuments.length !== 1 && 's'}
                          </span>
                        )}
                        {customer.identityProofs && customer.identityProofs.length > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200">
                            {customer.identityProofs.length} Proof{customer.identityProofs.length !== 1 && 's'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => editCustomer(customer, e)}
                        className="text-primary hover:text-primary-light"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    {searchTerm ? 'No customers found matching your search.' : 'No customers available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomersList;
