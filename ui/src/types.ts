export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IdentityDocument {
  type: string;
  number: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
}

export interface IdentityProof {
  type: string;
  documentNumber: string;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
}

export interface Customer {
  id?: string;
  name: string;
  dateOfBirth: string;
  address: Address;
  identityDocuments: IdentityDocument[];
  identityProofs: IdentityProof[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FormState {
  step: number;
  customer: Customer;
}
