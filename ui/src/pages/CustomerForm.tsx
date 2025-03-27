import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Customer } from '../types';
import PersonalInfoStep from '../components/form-steps/PersonalInfoStep';
import AddressStep from '../components/form-steps/AddressStep';
import IdentityDocumentsStep from '../components/form-steps/IdentityDocumentsStep';
import IdentityProofsStep from '../components/form-steps/IdentityProofsStep';

// Initialize empty customer
const initialCustomer: Customer = {
  name: '',
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
  
  useEffect(() => {
    // Check if we're returning from preview with edits
    if (location.state?.customerData && location.state?.editMode) {
      setCustomer(location.state.customerData);
      // Optionally set step if specified
      if (location.state.step) {
        setStep(location.state.step);
      }
    }
  }, [location.state]);
  
  const updateCustomer = (data: Partial<Customer>) => {
    setCustomer(prev => ({
      ...prev,
      ...data
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
            data={{ name: customer.name, dateOfBirth: customer.dateOfBirth }}
            onUpdate={(data) => updateCustomer(data)}
          />
        )}
        
        {step === 2 && (
          <AddressStep
            address={customer.address}
            onUpdate={(address) => updateCustomer({ address })}
          />
        )}
        
        {step === 3 && (
          <IdentityDocumentsStep
            documents={customer.identityDocuments}
            onUpdate={(identityDocuments) => updateCustomer({ identityDocuments })}
          />
        )}
        
        {step === 4 && (
          <IdentityProofsStep
            proofs={customer.identityProofs}
            onUpdate={(identityProofs) => updateCustomer({ identityProofs })}
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
          
          <button
            onClick={nextStep}
            className="btn-primary"
          >
            {step === totalSteps ? 'Review' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
