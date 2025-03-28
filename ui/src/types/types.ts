export interface CustomerName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerContactDetails {
  email: string;
  phoneNumber: string;
  preferredContactMethod?: 'EMAIL' | 'PHONE' | 'SMS';
}

export interface IdentityDocument {
  type: string;
  number: string;
  issueDate: string;
  expiryDate: string;
}

export interface IdentityProof {
  type: string;
  documentNumber: string;
}

export interface Customer {
  id?: number;
  name: CustomerName | string;
  dateOfBirth: string;
  address: Address;
  contactDetails?: CustomerContactDetails;
  identityDocuments: IdentityDocument[];
  identityProofs: IdentityProof[];
}