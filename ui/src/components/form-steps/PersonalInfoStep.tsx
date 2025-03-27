import { useState, useEffect, useRef } from 'react';

interface PersonalInfoProps {
  data: {
    name: string;
    dateOfBirth: string;
  };
  onUpdate: (data: { name: string; dateOfBirth: string }) => void;
}

const PersonalInfoStep = ({ data, onUpdate }: PersonalInfoProps) => {
  const [name, setName] = useState(data.name);
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth);
  const [errors, setErrors] = useState({
    name: '',
    dateOfBirth: ''
  });
  
  // Add a ref to track if we're updating from parent data
  const isUpdatingFromProps = useRef(false);
  
  // Update values when props change
  useEffect(() => {
    isUpdatingFromProps.current = true;
    setName(data.name);
    setDateOfBirth(data.dateOfBirth);
    // Use a timeout to reset the flag after the state updates have been processed
    setTimeout(() => {
      isUpdatingFromProps.current = false;
    }, 0);
  }, [data]);

  // Validate values without setting state
  const validateValues = () => {
    const newErrors = {
      name: '',
      dateOfBirth: ''
    };
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Check if the person is at least 18 years old
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        newErrors.dateOfBirth = 'Customer must be at least 18 years old';
      }
    }

    return newErrors;
  };

  // Notify parent only when values have changed and are valid
  useEffect(() => {
    // Skip if we're currently updating from props to avoid the infinite loop
    if (isUpdatingFromProps.current) return;
    
    const newErrors = validateValues();
    const formIsValid = !Object.values(newErrors).some(error => error);
    
    setErrors(newErrors);
    
    // Only update parent if form is valid and there's actual data
    if (formIsValid && name && dateOfBirth) {
      // Check if data has actually changed before calling onUpdate
      if (name !== data.name || dateOfBirth !== data.dateOfBirth) {
        onUpdate({ name, dateOfBirth });
      }
    }
  }, [name, dateOfBirth, onUpdate]); // Remove data from dependencies

  // Handle blur events to validate as user moves between fields
  const handleBlur = (field: 'name' | 'dateOfBirth') => {
    const newErrors = validateValues();
    setErrors(prev => ({
      ...prev,
      [field]: newErrors[field]
    }));
  };

  // Handle changes in fields
  const handleChange = (field: 'name' | 'dateOfBirth', value: string) => {
    if (field === 'name') {
      setName(value);
    } else {
      setDateOfBirth(value);
    }
    
    // Don't clear errors immediately - they'll be recalculated in the useEffect
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Personal Information</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className="form-input"
            placeholder="Enter full name"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            onBlur={() => handleBlur('dateOfBirth')}
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

