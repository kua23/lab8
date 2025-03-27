import { useState, useEffect, useRef } from 'react';
import { CustomerContactDetails } from '../../types/types';

interface ContactDetailsStepProps {
  contactDetails: CustomerContactDetails | undefined;
  onUpdate: (contactDetails: CustomerContactDetails) => void;
}

const ContactDetailsStep = ({ contactDetails, onUpdate }: ContactDetailsStepProps) => {
  // Initialize with empty object or actual data
  const [formData, setFormData] = useState<CustomerContactDetails>({
    email: contactDetails?.email || '',
    phoneNumber: contactDetails?.phoneNumber || '',
    preferredContactMethod: contactDetails?.preferredContactMethod || 'EMAIL'
  });
  
  // Track if we're currently updating from props to prevent loops
  const isUpdatingFromProps = useRef(false);
  // Track the last processed contactDetails for comparison
  const lastContactDetailsRef = useRef<string>(JSON.stringify(contactDetails || {}));

  // Modified useEffect to prevent infinite loops
  useEffect(() => {
    const currentContactDetailsStr = JSON.stringify(contactDetails || {});
    
    // Only update if the prop has changed and we're not already updating from props
    if (currentContactDetailsStr !== lastContactDetailsRef.current && !isUpdatingFromProps.current) {
      isUpdatingFromProps.current = true;
      lastContactDetailsRef.current = currentContactDetailsStr;
      setFormData({
        email: contactDetails?.email || '',
        phoneNumber: contactDetails?.phoneNumber || '',
        preferredContactMethod: contactDetails?.preferredContactMethod || 'EMAIL'
      });
      
      // Reset the flag after the state update completes
      setTimeout(() => {
        isUpdatingFromProps.current = false;
      }, 0);
    }
  }, [contactDetails]);

  const [errors, setErrors] = useState({
    email: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Only send valid data to parent
    if (isValid(newFormData)) {
      onUpdate(newFormData);
    }
  };
  
  const isValid = (data: CustomerContactDetails): boolean => {
    return !!(
      isValidEmail(data.email) && 
      data.phoneNumber.trim() !== ''
    );
  };
  
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors = {
      email: '',
      phoneNumber: '',
    };
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    setErrors(newErrors);
    
    const isFormValid = !Object.values(newErrors).some(error => error !== '');
    if (isFormValid) {
      onUpdate(formData);
    }
    
    return isFormValid;
  };
  
  const handleBlur = () => {
    validate();
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Contact Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address*
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number*
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Preferred Contact Method
          </label>
          <select
            name="preferredContactMethod"
            value={formData.preferredContactMethod}
            onChange={handleChange}
            className="form-input bg-dark-light text-white"
          >
            <option value="EMAIL">Email</option>
            <option value="PHONE">Phone Call</option>
            <option value="SMS">SMS/Text Message</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsStep;
