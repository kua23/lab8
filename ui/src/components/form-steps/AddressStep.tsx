import { useState, useEffect, useRef } from 'react';
import { Address } from '../../types';

interface AddressStepProps {
  address: Address;
  onUpdate: (address: Address) => void;
}

const AddressStep = ({ address, onUpdate }: AddressStepProps) => {
  const [formData, setFormData] = useState<Address>(address);
  const [errors, setErrors] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  // Add refs to track updates from props and previous values
  const isUpdatingFromProps = useRef(false);
  const prevAddressRef = useRef<Address>(address);
  
  // Sync local state when parent address prop changes
  useEffect(() => {
    // Only update if there's an actual change to avoid loops
    if (JSON.stringify(address) !== JSON.stringify(formData)) {
      isUpdatingFromProps.current = true;
      setFormData(address);
      // Reset the flag after state update is processed
      setTimeout(() => {
        isUpdatingFromProps.current = false;
      }, 0);
    }
  }, [address]);

  // Validate form data without setting errors (to avoid render loops)
  const validateData = (data: Address): boolean => {
    if (!data.street.trim()) return false;
    if (!data.city.trim()) return false;
    if (!data.state.trim()) return false;
    if (!data.zipCode.trim()) return false;
    if (!data.country.trim()) return false;
    return true;
  };

  // Update parent component whenever form data changes and is valid
  useEffect(() => {
    // Skip if we're updating from props to avoid the loop
    if (isUpdatingFromProps.current) {
      return;
    }
    
    // Check if all fields are valid without updating error state
    if (validateData(formData)) {
      // Only update if data has actually changed
      const hasChanged = JSON.stringify(formData) !== JSON.stringify(prevAddressRef.current);
      if (hasChanged) {
        prevAddressRef.current = {...formData};
        onUpdate(formData);
      }
    }
  }, [formData, onUpdate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear the error when user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // This function now only updates the error state - called on blur, not in useEffect
  const validate = () => {
    const newErrors = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
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
            Street Address
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
              City
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
              State/Province
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
              ZIP/Postal Code
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
              Country
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
