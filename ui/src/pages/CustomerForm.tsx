import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Customer, CustomerName, Address, IdentityDocument, IdentityProof } from '../types/types';
import PersonalInfoStep from '../components/form-steps/PersonalInfoStep';
import AddressStep from '../components/form-steps/AddressStep';
import IdentityDocumentsStep from '../components/form-steps/IdentityDocumentsStep';
import IdentityProofsStep from '../components/form-steps/IdentityProofsStep';
// Just add the .js extension to the import
import { customerService } from '../services/api.ts';

// Initialize empty customer with proper structure
const initialCustomer: Customer = {
  name: { firstName: '', middleName: '', lastName: '' },
  dateOfBirth: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  identityDocuments: [],
  identityProofs: []
};

const CustomerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState<Customer>(initialCustomer);
  const totalSteps = 4;
  const processedStateRef = useRef<unknown>(null);
  
  // Add submit handler
  const handleSubmit = async () => {
    try {
      if (customer.id) {
        await customerService.update(customer.id, customer);
      } else {
        await customerService.create(customer);
      }
      navigate('/customers/view');
    } catch (error) {
      console.error('Error submitting customer data:', error);
    }
  };
  
  useEffect(() => {
    // Check if we're returning from preview with edits AND the state is different
    if (
      location.state?.customerData && 
      location.state?.editMode &&
      JSON.stringify(processedStateRef.current) !== JSON.stringify(location.state)
    ) {
      // Store current state to avoid reprocessing
      processedStateRef.current = location.state;
      
      // Ensure the customer data has the correct structure
      const customerData: Customer = location.state.customerData;
      
      // If name is a string, convert it to CustomerName object
      if (typeof customerData.name === 'string') {
        // Split the name string into parts
        const nameParts = customerData.name.trim().split(/\s+/);
        
        // Create a CustomerName object
        customerData.name = {
          firstName: nameParts[0] || '',
          middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '',
          lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
        };
      }
      
      setCustomer(customerData);
      
      if (location.state.step) {
        setStep(location.state.step);
      }
    }
  }, [location]);
  
  const handlePersonalInfoUpdate = (data: { name: CustomerName, dateOfBirth: string }) => {
    setCustomer(prev => ({
      ...prev,
      name: data.name,
      dateOfBirth: data.dateOfBirth
    }));
  };

  const handleAddressUpdate = (address: Address) => {
    setCustomer(prev => ({
      ...prev,
      address
    }));
  };

  const handleDocumentsUpdate = (identityDocuments: IdentityDocument[]) => {
    setCustomer(prev => ({
      ...prev,
      identityDocuments
    }));
  };

  const handleProofsUpdate = (identityProofs: IdentityProof[]) => {
    setCustomer(prev => ({
      ...prev,
      identityProofs
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      // Go to summary/preview
      navigate('/customers/view/preview', {
        state: { 
          preview: true,
          customerData: customer
        }
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Create New Customer
      </h1>
      
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between mb-2">
          {[...Array(totalSteps)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i + 1 === step 
                    ? 'bg-primary text-white' 
                    : i + 1 < step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-dark-light text-gray-400'
                }`}
              >
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="text-xs mt-1 text-gray-400">
                {i === 0 ? 'Personal' : 
                 i === 1 ? 'Address' : 
                 i === 2 ? 'Documents' : 'Proofs'}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-dark-light rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Form Steps */}
      <div className="bg-dark-light rounded-lg shadow-lg p-6">
        {step === 1 && (
          <PersonalInfoStep
            data={{ 
              name: (typeof customer.name === 'string') 
                ? { firstName: customer.name, middleName: '', lastName: '' } 
                : customer.name as CustomerName, 
              dateOfBirth: customer.dateOfBirth 
            }}
            onUpdate={handlePersonalInfoUpdate}
          />
        )}
        
        {step === 2 && (
          <AddressStep
            address={customer.address}
            onUpdate={handleAddressUpdate}
          />
        )}
        
        {step === 3 && (
          <IdentityDocumentsStep
            documents={customer.identityDocuments}
            onUpdate={handleDocumentsUpdate}
          />
        )}
        
        {step === 4 && (
          <IdentityProofsStep
            identityProofs={customer.identityProofs}
            onUpdate={handleProofsUpdate}
          />
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            className={`btn-outline ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={step === 1}
          >
            Previous
          </button>
          
          {step === totalSteps ? (
            <div className="flex space-x-4">
              <button
                onClick={nextStep}
                className="btn-secondary"
              >
                Review
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                Submit
              </button>
            </div>
          ) : (
            <button
              onClick={nextStep}
              className="btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
