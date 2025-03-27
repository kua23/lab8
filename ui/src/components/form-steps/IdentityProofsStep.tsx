import { useState, useEffect, useRef } from 'react';
import { IdentityProof } from '../../types';

interface IdentityProofsStepProps {
  proofs: IdentityProof[];
  onUpdate: (proofs: IdentityProof[]) => void;
}

const IdentityProofsStep = ({ proofs, onUpdate }: IdentityProofsStepProps) => {
  const [proofsList, setProofsList] = useState<IdentityProof[]>(
    proofs.length > 0 ? proofs : [{ 
      type: '', 
      documentNumber: '', 
      verificationStatus: 'PENDING' 
    }]
  );
  
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  // Add a ref to track initial render and previous proofs
  const isInitialRender = useRef(true);
  const prevProofsRef = useRef<IdentityProof[]>([]);
  
  // Check if proofs have actually changed in a meaningful way
  const haveProofsChanged = (prev: IdentityProof[], current: IdentityProof[]): boolean => {
    if (prev.length !== current.length) return true;
    
    return current.some((proof, index) => {
      return (
        proof.type !== prev[index]?.type ||
        proof.documentNumber !== prev[index]?.documentNumber
      );
    });
  };

  // Auto-update parent component when valid proofs change
  useEffect(() => {
    // Skip the first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevProofsRef.current = [...proofsList];
      return;
    }
    
    // Only update if at least one proof is complete
    const hasCompleteProof = proofsList.some(
      proof => proof.type && proof.documentNumber
    );
    
    // Only call onUpdate when proofs have actually changed and are valid
    if (hasCompleteProof && validate() && haveProofsChanged(prevProofsRef.current, proofsList)) {
      prevProofsRef.current = [...proofsList];
      onUpdate(proofsList);
    }
  }, [proofsList]); // Removed onUpdate from dependency array

  const handleChange = (index: number, field: keyof IdentityProof, value: string | IdentityProof['verificationStatus']) => {
    const updatedProofs = [...proofsList];
    updatedProofs[index] = {
      ...updatedProofs[index],
      [field]: value
    };
    setProofsList(updatedProofs);
    
    // Clear error when user types
    if (errors[index]?.[field]) {
      const updatedErrors = { ...errors };
      updatedErrors[index] = { ...updatedErrors[index], [field]: '' };
      setErrors(updatedErrors);
    }
  };

  const addProof = () => {
    setProofsList([
      ...proofsList, 
      { type: '', documentNumber: '', verificationStatus: 'PENDING' }
    ]);
  };

  const removeProof = (index: number) => {
    const updatedProofs = [...proofsList];
    updatedProofs.splice(index, 1);
    setProofsList(updatedProofs);
    
    // Remove errors for this index
    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
    
    // Update parent component with the removed proof
    onUpdate(updatedProofs);
  };

  const validateProof = (proof: IdentityProof) => {
    const proofErrors: Record<string, string> = {};
    
    if (!proof.type.trim()) proofErrors.type = 'Proof type is required';
    if (!proof.documentNumber.trim()) proofErrors.documentNumber = 'Document number is required';
    
    return proofErrors;
  };

  const validate = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let hasErrors = false;
    
    proofsList.forEach((proof, index) => {
      const proofErrors = validateProof(proof);
      
      if (Object.keys(proofErrors).length > 0) {
        newErrors[index] = proofErrors;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    return !hasErrors;
  };

  const proofTypes = [
    "Tax ID",
    "National ID",
    "Social Security Number",
    "Birth Certificate",
    "Other"
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Customer Identity Proofs</h2>
      <p className="text-gray-400 mb-6">
        Add one or more identity proofs for verification
      </p>
      
      {proofsList.map((proof, index) => (
        <div 
          key={index} 
          className="mb-6 p-4 border border-gray-700 rounded-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Proof #{index + 1}</h3>
            {proofsList.length > 1 && (
              <button 
                type="button"
                onClick={() => removeProof(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Proof Type
              </label>
              <select
                value={proof.type}
                onChange={(e) => handleChange(index, 'type', e.target.value)}
                className="form-input bg-dark-light text-white"
              >
                <option value="">Select proof type</option>
                {proofTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors[index]?.type && (
                <p className="text-red-400 text-sm mt-1">{errors[index].type}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Document Number
              </label>
              <input
                type="text"
                value={proof.documentNumber}
                onChange={(e) => handleChange(index, 'documentNumber', e.target.value)}
                className="form-input"
                placeholder="Document identification number"
              />
              {errors[index]?.documentNumber && (
                <p className="text-red-400 text-sm mt-1">{errors[index].documentNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Verification Status
              </label>
              <select
                value={proof.verificationStatus}
                onChange={(e) => handleChange(index, 'verificationStatus', e.target.value as IdentityProof['verificationStatus'])}
                className="form-input bg-dark-light text-white"
                disabled
              >
                <option value="PENDING">PENDING</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
              <p className="text-gray-400 text-sm mt-1">
                Status will be updated after verification by the system
              </p>
            </div>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addProof}
        className="flex items-center text-primary hover:text-primary-light mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        Add Another Proof
      </button>
    </div>
  );
};

export default IdentityProofsStep;
