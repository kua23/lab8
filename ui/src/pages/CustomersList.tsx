import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Customer } from '../types/types';

// Sample data - in a real app, this would come from an API
const sampleCustomers: Customer[] = [
  {
    id: 1,
    name: { firstName: 'John', middleName: '', lastName: 'Doe' },
    dateOfBirth: '1990-05-15',
    address: {
      street: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'USA'
    },
    contactDetails: {
      email: 'john.doe@example.com',
      phoneNumber: '+1 555-123-4567'
    },
    identityDocuments: [
      {
        type: 'Passport',
        number: 'P12345678',
        issuingAuthority: 'U.S. Department of State',
        issueDate: '2018-03-15',
        expiryDate: '2028-03-14'
      }
    ],
    identityProofs: [
      {
        type: 'Social Security Number',
        documentNumber: '123-45-6789',
        verificationStatus: 'VERIFIED'
      }
    ]
  },
  {
    id: 2,
    name: { firstName: 'Jane', middleName: 'Marie', lastName: 'Smith' },
    dateOfBirth: '1985-08-22',
    address: {
      street: '456 Elm St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    contactDetails: {
      email: 'jane.smith@example.com',
      phoneNumber: '+1 555-987-6543'
    },
    identityDocuments: [
      {
        type: "Driver's License",
        number: 'DL98765432',
        issuingAuthority: 'NY DMV',
        issueDate: '2019-10-12',
        expiryDate: '2027-10-11'
      }
    ],
    identityProofs: [
      {
        type: 'Tax ID',
        documentNumber: '87-6543210',
        verificationStatus: 'PENDING'
      }
    ]
  }
];

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers] = useState<Customer[]>(sampleCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      
      {/* Customers Table */}
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
                      {customer.identityDocuments.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                          {customer.identityDocuments.length} Doc{customer.identityDocuments.length !== 1 && 's'}
                        </span>
                      )}
                      {customer.identityProofs.length > 0 && (
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
                  No customers found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersList;
