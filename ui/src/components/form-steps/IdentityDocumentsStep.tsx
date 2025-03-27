import { useState } from 'react';
import { IdentityDocument } from '../../types/types';

interface IdentityDocumentsStepProps {
  documents: IdentityDocument[];
  onUpdate: (documents: IdentityDocument[]) => void;
}

const IdentityDocumentsStep = ({ documents, onUpdate }: IdentityDocumentsStepProps) => {
  const [documentsList, setDocumentsList] = useState<IdentityDocument[]>(
    documents.length > 0 ? [...documents] : [{ 
      type: '', 
      number: '', 
      issuingAuthority: '', 
      issueDate: '', 
      expiryDate: '' 
    }]
  );
  
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  const handleChange = (index: number, field: keyof IdentityDocument, value: string) => {
    const updatedDocuments = [...documentsList];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [field]: value
    };
    
    // Clear error when user types
    if (errors[index]?.[field]) {
      const updatedErrors = { ...errors };
      updatedErrors[index] = { ...updatedErrors[index], [field]: '' };
      setErrors(updatedErrors);
    }
    
    setDocumentsList(updatedDocuments);
    
    // Only send valid data to parent
    const isValid = validateDocument(updatedDocuments[index]);
    if (Object.keys(isValid).length === 0) {
      onUpdate(updatedDocuments);
    }
  };

  const addDocument = () => {
    const newDocuments = [
      ...documentsList, 
      { type: '', number: '', issuingAuthority: '', issueDate: '', expiryDate: '' }
    ];
    setDocumentsList(newDocuments);
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...documentsList];
    updatedDocuments.splice(index, 1);
    
    // Remove errors for this index
    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
    
    setDocumentsList(updatedDocuments);
    onUpdate(updatedDocuments);
  };

  const validateDocument = (document: IdentityDocument) => {
    const documentErrors: Record<string, string> = {};
    
    if (!document.type.trim()) documentErrors.type = 'Document type is required';
    if (!document.number.trim()) documentErrors.number = 'Document number is required';
    if (!document.issuingAuthority.trim()) documentErrors.issuingAuthority = 'Issuing authority is required';
    if (!document.issueDate) documentErrors.issueDate = 'Issue date is required';
    if (!document.expiryDate) documentErrors.expiryDate = 'Expiry date is required';
    
    // Check if expiry date is after issue date
    if (document.issueDate && document.expiryDate) {
      const issueDate = new Date(document.issueDate);
      const expiryDate = new Date(document.expiryDate);
      
      if (expiryDate <= issueDate) {
        documentErrors.expiryDate = 'Expiry date must be after issue date';
      }
    }
    
    return documentErrors;
  };

  const validate = (index: number) => {
    const documentErrors = validateDocument(documentsList[index]);
    
    if (Object.keys(documentErrors).length > 0) {
      const newErrors = { ...errors };
      newErrors[index] = documentErrors;
      setErrors(newErrors);
      return false;
    }
    
    return true;
  };
  
  const handleBlur = (index: number) => {
    if (validate(index)) {
      onUpdate(documentsList);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Identity Documents</h2>
      <p className="text-gray-400 mb-6">
        Add one or more identity documents (passport, driver's license, etc.)
      </p>
      
      {documentsList.map((document, index) => (
        <div 
          key={index} 
          className="mb-6 p-4 border border-gray-700 rounded-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Document #{index + 1}</h3>
            {documentsList.length > 1 && (
              <button 
                type="button"
                onClick={() => removeDocument(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Document Type
              </label>
              <input
                type="text"
                value={document.type}
                onChange={(e) => handleChange(index, 'type', e.target.value)}
                onBlur={() => handleBlur(index)}
                className="form-input"
                placeholder="Passport, Driver's License, etc."
              />
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
                value={document.number}
                onChange={(e) => handleChange(index, 'number', e.target.value)}
                onBlur={() => handleBlur(index)}
                className="form-input"
                placeholder="Document number"
              />
              {errors[index]?.number && (
                <p className="text-red-400 text-sm mt-1">{errors[index].number}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Issuing Authority
              </label>
              <input
                type="text"
                value={document.issuingAuthority}
                onChange={(e) => handleChange(index, 'issuingAuthority', e.target.value)}
                onBlur={() => handleBlur(index)}
                className="form-input"
                placeholder="Authority that issued this document"
              />
              {errors[index]?.issuingAuthority && (
                <p className="text-red-400 text-sm mt-1">{errors[index].issuingAuthority}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={document.issueDate}
                  onChange={(e) => handleChange(index, 'issueDate', e.target.value)}
                  onBlur={() => handleBlur(index)}
                  className="form-input"
                />
                {errors[index]?.issueDate && (
                  <p className="text-red-400 text-sm mt-1">{errors[index].issueDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={document.expiryDate}
                  onChange={(e) => handleChange(index, 'expiryDate', e.target.value)}
                  onBlur={() => handleBlur(index)}
                  className="form-input"
                />
                {errors[index]?.expiryDate && (
                  <p className="text-red-400 text-sm mt-1">{errors[index].expiryDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addDocument}
        className="flex items-center text-primary hover:text-primary-light mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        Add Another Document
      </button>
    </div>
  );
};

export default IdentityDocumentsStep;
