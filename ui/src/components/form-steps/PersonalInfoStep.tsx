import { useState } from 'react';
import { CustomerName } from '../../types/types';

interface PersonalInfoStepProps {
  data: {
    name: CustomerName;
    dateOfBirth: string;
  };
  onUpdate: (data: {
    name: CustomerName;
    dateOfBirth: string;
  }) => void;
}

const PersonalInfoStep = ({ data, onUpdate }: PersonalInfoStepProps) => {
  const [formData, setFormData] = useState({
    name: {
      firstName: data.name?.firstName || '',
      middleName: data.name?.middleName || '',
      lastName: data.name?.lastName || '',
    },
    dateOfBirth: data.dateOfBirth || '',
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let newFormData = {...formData};
    
    if (name === 'firstName' || name === 'middleName' || name === 'lastName') {
      newFormData = {
        ...formData,
        name: {
          ...formData.name,
          [name]: value
        }
      };
      
      if (name === 'firstName' || name === 'lastName') {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    } else {
      newFormData = {
        ...formData,
        [name]: value
      };
      
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setFormData(newFormData);
    
    // Call parent update if form is valid
    if (isValid(newFormData)) {
      onUpdate(newFormData);
    }
  };
  
  const isValid = (data: typeof formData) => {
    return (
      data.name.firstName.trim() !== '' &&
      data.name.lastName.trim() !== '' &&
      data.dateOfBirth.trim() !== ''
    );
  };
  
  const validate = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
    };
    
    if (!formData.name.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.name.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const selectedDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
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
      <h2 className="text-2xl font-semibold mb-6 text-primary">Personal Information</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              First Name*
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.name.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={formData.name.middleName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter middle name (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Last Name*
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.name.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Date of Birth*
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.dateOfBirth && (
            <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;

