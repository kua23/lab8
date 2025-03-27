import React, { useState } from 'react';
import { IdentityProof } from '../../types/types';

interface IdentityProofsStepProps {
  identityProofs: IdentityProof[];
  onUpdate: (identityProofs: IdentityProof[]) => void;
}

const IdentityProofsStep: React.FC<IdentityProofsStepProps> = ({ identityProofs = [], onUpdate }) => {
  // Default to empty array if identityProofs is undefined
  const initialProofs = Array.isArray(identityProofs) && identityProofs.length > 0 
    ? [...identityProofs] 
    : [{ type: '', documentNumber: '' }];
  
  const [proofsList, setProofsList] = useState<IdentityProof[]>(initialProofs);
  
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  const handleChange = (index: number, field: keyof IdentityProof, value: string) => {
    const updatedProofs = [...proofsList];
    updatedProofs[index] = {
      ...updatedProofs[index],
      [field]: value
    };
    
    if (errors[index]?.[field]) {
      const updatedErrors = { ...errors };
      updatedErrors[index] = { ...updatedErrors[index], [field]: '' };
      setErrors(updatedErrors);
    }
    
    setProofsList(updatedProofs);
    onUpdate(updatedProofs);
  };

  const addProof = () => {
    setProofsList([
      ...proofsList, 
      { type: '', documentNumber: '' }
    ]);
  };

  const removeProof = (index: number) => {
    const updatedProofs = [...proofsList];
    updatedProofs.splice(index, 1);
    
    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
    
    setProofsList(updatedProofs);
    onUpdate(updatedProofs);
  };

  const validateProof = (proof: IdentityProof, index: number) => {
    const proofErrors: Record<string, string> = {};
    
    if (!proof.type.trim()) proofErrors.type = 'Proof type is required';
    if (!proof.documentNumber?.trim()) proofErrors.documentNumber = 'Document number is required';
    
    if (Object.keys(proofErrors).length > 0) {
      const newErrors = { ...errors };
      newErrors[index] = proofErrors;
      setErrors(newErrors);
      return false;
    }
    
    return true;
  };
  
  const handleBlur = (index: number) => {
    if (validateProof(proofsList[index], index)) {
      onUpdate(proofsList);
    }
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
        Add one or more identity proofs
      </p>
      
      {proofsList.map((proof, index) => (
        <div key={index} className="mb-6 p-4 border border-gray-700 rounded-lg">
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
                value={proof.type || ''}
                onChange={(e) => handleChange(index, 'type', e.target.value)}
                onBlur={() => handleBlur(index)}
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
                value={proof.documentNumber || ''}
                onChange={(e) => handleChange(index, 'documentNumber', e.target.value)}
                onBlur={() => handleBlur(index)}
                className="form-input"
                placeholder="Document identification number"
              />
              {errors[index]?.documentNumber && (
                <p className="text-red-400 text-sm mt-1">{errors[index].documentNumber}</p>
              )}
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
