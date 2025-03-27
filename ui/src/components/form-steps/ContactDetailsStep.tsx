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
    alternatePhoneNumber: contactDetails?.alternatePhoneNumber || '',
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
        alternatePhoneNumber: contactDetails?.alternatePhoneNumber || '',
        preferredContactMethod: contactDetails?.preferredContactMethod || 'EMAIL'
      });
      
      // Reset the flag after the state update completes
      setTimeout(() => {
        isUpdatingFromProps.current = false;
      }, 0);
    }
  }, [contactDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // Only update parent if we're not already updating from props
    if (!isUpdatingFromProps.current) {
      const updatedStr = JSON.stringify(newFormData);
      if (updatedStr !== lastContactDetailsRef.current) {
        lastContactDetailsRef.current = updatedStr;
        onUpdate(newFormData);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Contact Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="email@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-input"
            placeholder="555-123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Alternate Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="alternatePhoneNumber"
            value={formData.alternatePhoneNumber || ''}
            onChange={handleChange}
            className="form-input"
            placeholder="555-123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Preferred Contact Method
          </label>
          <select
            name="preferredContactMethod"
            value={formData.preferredContactMethod}
            onChange={handleChange}
            className="form-input bg-dark text-white"
          >
            <option value="EMAIL">Email</option>
            <option value="PHONE">Phone</option>
            <option value="SMS">SMS</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsStep;
