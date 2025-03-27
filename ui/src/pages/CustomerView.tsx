import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Customer } from '../types';

const CustomerView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if we're viewing this as part of the form preview
  const isPreview = location.state?.preview === true;
  const previewData = location.state?.customerData as Customer | undefined;

  useEffect(() => {
    // If we're in preview mode and have preview data, use it
    if (isPreview && previewData) {
      setCustomer(previewData);
      setLoading(false);
      return;
    }

    // Otherwise fetch the customer data from API
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/customer/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }
        
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id, isPreview, previewData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="rounded-lg bg-red-500/20 border border-red-500 p-4 text-red-100">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p>{error || 'Customer not found'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          {isPreview ? 'Preview Customer Data' : 'Customer Details'}
        </h1>
        
        {isPreview && (
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/customers/create', { state: { 
                customerData: previewData,
                editMode: true
              }})}
              className="btn-secondary"
            >
              Edit Information
            </button>
            <button 
              onClick={async () => {
                try {
                  console.log(previewData);
                  const response = await fetch('/api/customer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(previewData)
                  });
                  
                  if (!response.ok) throw new Error('Failed to create customer');
                  
                  const data = await response.json();
                  navigate(`/customers/view/${data.id}`);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'An error occurred');
                }
              }}
              className="btn-primary"
            >
              Submit Customer Data
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-dark-light rounded-lg shadow-lg p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-xl">{customer.name}</p>
            </div>
            <div>
              <p className="text-gray-400">Date of Birth</p>
              <p className="text-xl">{new Date(customer.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Street</p>
              <p className="text-xl">{customer.address.street}</p>
            </div>
            <div>
              <p className="text-gray-400">City</p>
              <p className="text-xl">{customer.address.city}</p>
            </div>
            <div>
              <p className="text-gray-400">State</p>
              <p className="text-xl">{customer.address.state}</p>
            </div>
            <div>
              <p className="text-gray-400">ZIP Code</p>
              <p className="text-xl">{customer.address.zipCode}</p>
            </div>
            <div>
              <p className="text-gray-400">Country</p>
              <p className="text-xl">{customer.address.country}</p>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Identity Documents</h2>
          {customer.identityDocuments.length === 0 ? (
            <p className="text-gray-400">No identity documents provided</p>
          ) : (
            <div className="space-y-4">
              {customer.identityDocuments.map((doc, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Type</p>
                      <p className="text-xl">{doc.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Number</p>
                      <p className="text-xl">{doc.number}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Issuing Authority</p>
                      <p className="text-xl">{doc.issuingAuthority}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Issue Date</p>
                      <p className="text-xl">{new Date(doc.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Expiry Date</p>
                      <p className="text-xl">{new Date(doc.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">Identity Proofs</h2>
          {customer.identityProofs.length === 0 ? (
            <p className="text-gray-400">No identity proofs provided</p>
          ) : (
            <div className="space-y-4">
              {customer.identityProofs.map((proof, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Type</p>
                      <p className="text-xl">{proof.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Document Number</p>
                      <p className="text-xl">{proof.documentNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Verification Status</p>
                      <p className={`text-xl ${
                        proof.verificationStatus === 'VERIFIED' ? 'text-green-500' : 
                        proof.verificationStatus === 'REJECTED' ? 'text-red-500' : 
                        'text-yellow-500'
                      }`}>
                        {proof.verificationStatus}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CustomerView;
