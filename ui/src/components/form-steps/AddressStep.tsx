import { useState } from 'react';
import { Address } from '../../types/types';

interface AddressStepProps {
  address: Address;
  onUpdate: (address: Address) => void;
}

const AddressStep = ({ address, onUpdate }: AddressStepProps) => {
  const [formData, setFormData] = useState<Address>({
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    country: address?.country || ''
  });
  
  const [errors, setErrors] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // Clear the error when user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    // Send valid data to parent
    if (isFormDataValid(newFormData)) {
      onUpdate(newFormData);
    }
  };
  
  const isFormDataValid = (data: Address): boolean => {
    return !!(data.street?.trim() && 
              data.city?.trim() && 
              data.state?.trim() && 
              data.zipCode?.trim() && 
              data.country?.trim());
  };

  const validate = () => {
    const newErrors = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    
    if (!formData.street?.trim()) newErrors.street = 'Street address is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.state?.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode?.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.country?.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    
    const isValid = !Object.values(newErrors).some(error => error !== '');
    if (isValid) {
      onUpdate(formData);
    }
    return isValid;
  };

  const handleBlur = () => {
    validate();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Address Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Street Address*
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="Enter street address"
          />
          {errors.street && (
            <p className="text-red-400 text-sm mt-1">{errors.street}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              City*
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="text-red-400 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              State/Province*
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              placeholder="Enter state or province"
            />
            {errors.state && (
              <p className="text-red-400 text-sm mt-1">{errors.state}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              ZIP/Postal Code*
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              placeholder="Enter ZIP code"
            />
            {errors.zipCode && (
              <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Country*
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              placeholder="Enter country"
            />
            {errors.country && (
              <p className="text-red-400 text-sm mt-1">{errors.country}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressStep;
