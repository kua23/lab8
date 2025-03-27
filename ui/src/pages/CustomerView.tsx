import { useLocation, useNavigate } from 'react-router';
import { Customer } from '../types/types';

const CustomerView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerData } = location.state || {};
  const customer: Customer = customerData || null;

  // If no customer data is found, redirect back
  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No customer information available</h2>
        <button
          onClick={() => navigate('/customers/view')}
          className="btn-primary"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Customer Details
        </h1>
        <div>
          <button
            onClick={() => navigate('/customers/create', { 
              state: { 
                customerData: customer, 
                editMode: true 
              } 
            })}
            className="btn-primary mr-4"
          >
            Edit Customer
          </button>
          <button
            onClick={() => navigate('/customers/view')}
            className="btn-outline"
          >
            Back to List
          </button>
        </div>
      </div>

      <div className="bg-dark-light rounded-lg shadow-lg p-6 mb-8">
        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="text-lg">
                {typeof customer.name === 'string' 
                  ? customer.name 
                  : `${customer.name.firstName} ${customer.name.middleName ? customer.name.middleName + ' ' : ''}${customer.name.lastName}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Date of Birth</p>
              <p className="text-lg">{new Date(customer.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Street Address</p>
              <p className="text-lg">{customer.address.street}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">City</p>
              <p className="text-lg">{customer.address.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">State/Province</p>
              <p className="text-lg">{customer.address.state}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">ZIP/Postal Code</p>
              <p className="text-lg">{customer.address.zipCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Country</p>
              <p className="text-lg">{customer.address.country}</p>
            </div>
          </div>
        </div>

        {/* Contact Details (if available) */}
        {customer.contactDetails && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg">{customer.contactDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone Number</p>
                <p className="text-lg">{customer.contactDetails.phoneNumber}</p>
              </div>
              {/* alternatePhoneNumber section removed as it doesn't exist in types.ts */}
              {customer.contactDetails.preferredContactMethod && (
                <div>
                  <p className="text-sm text-gray-400">Preferred Contact Method</p>
                  <p className="text-lg">{customer.contactDetails.preferredContactMethod}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Identity Documents */}
        {customer.identityDocuments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Identity Documents</h2>
            {customer.identityDocuments.map((doc, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Document Type</p>
                    <p className="text-lg">{doc.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Document Number</p>
                    <p className="text-lg">{doc.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Issue Date</p>
                    <p className="text-lg">{new Date(doc.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Expiry Date</p>
                    <p className="text-lg">{new Date(doc.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Identity Proofs */}
        {customer.identityProofs.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Identity Proofs</h2>
            {customer.identityProofs.map((proof, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Proof Type</p>
                    <p className="text-lg">{proof.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Document Number</p>
                    <p className="text-lg">{proof.documentNumber}</p>
                  </div>
                  {/* verificationStatus section removed as it doesn't exist in types.ts */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => navigate('/customers/view')}
          className="btn-outline"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default CustomerView;
