/**
 * TypeScript Type Definitions
 * Common types used across the application
 */

// User Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  ghanaCardNumber?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | 'ADMIN'
  | 'POLICE'
  | 'RENEWAL_USER'
  | 'GUN_DEALER'
  | 'SECURITY_AGENCY'
  | 'INDIVIDUAL';

export type UserStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'SUSPENDED'
  | 'INACTIVE';

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  data: any; // Using any temporarily or Partial<User> because backend fields (user_id) might differ from frontend User (id)
}

// Application Types
export interface Application {
  id: string;
  userId: string;
  type: ApplicationType;
  status: ApplicationStatus;
  firearmDetails?: FirearmDetails;
  documents: Document[];
  submittedAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export type ApplicationType =
  | 'NEW_LICENSE'
  | 'RENEWAL'
  | 'TRANSFER'
  | 'REPLACEMENT';

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PENDING_PAYMENT';

// Firearm Types
export interface Firearm {
  id: string;
  serialNumber: string;
  make: string;
  model: string;
  caliber: string;
  type: FirearmType;
  status: FirearmStatus;
  ownerId: string;
  licenceId?: string;
  registeredAt: string;
  updatedAt: string;
}

export type FirearmType =
  | 'PISTOL'
  | 'REVOLVER'
  | 'RIFLE'
  | 'SHOTGUN'
  | 'OTHER';

export type FirearmStatus =
  | 'ACTIVE'
  | 'LOST'
  | 'STOLEN'
  | 'DEACTIVATED'
  | 'TRANSFERRED';

export interface FirearmDetails {
  make: string;
  model: string;
  caliber: string;
  type: FirearmType;
  serialNumber?: string;
  purpose: string;
}

// Licence Types
export interface Licence {
  id: string;
  userId: string;
  licenceNumber: string;
  type: LicenceType;
  status: LicenceStatus;
  issuedAt: string;
  expiresAt: string;
  firearms: Firearm[];
}

export type LicenceType =
  | 'INDIVIDUAL'
  | 'DEALER'
  | 'SECURITY_AGENCY';

export type LicenceStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'REVOKED';

// Document Types
export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: string;
  status: DocumentStatus;
}

export type DocumentType =
  | 'GHANA_CARD'
  | 'PASSPORT_PHOTO'
  | 'PROOF_OF_ADDRESS'
  | 'POLICE_REPORT'
  | 'BUSINESS_LICENSE'
  | 'TAX_CLEARANCE'
  | 'OTHER';

export type DocumentStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED';

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  applicationId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
  completedAt?: string;
}

export type PaymentMethod =
  | 'MOBILE_MONEY'
  | 'BANK_CARD'
  | 'BANK_TRANSFER';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

// Dashboard Types
// Dashboard Types matching API Response
export interface DashboardData {
  user: {
    id: string;
    email: string;
    phone: string;
    full_name: string | null;
    status: string;
    roles: string[];
    created_at: string;
  };
  kyc: {
    status: string;
    passed: boolean;
    provider: string;
    verified_channels: {
      sms: boolean;
      email: boolean;
    };
    verified_at: string;
    full_name: string | null;
    dob: string | null;
  };
  summary: DashboardSummary;
  recent_resources: {
    firearms: DashboardFirearm[];
    applications: DashboardApplication[];
    payments: any[];
  };
  dealer_profile: any | null;
}

export interface DashboardSummary {
  total_firearms: number;
  total_applications: number;
  approved_applications: number;
  pending_applications: number;
  total_payments_made: number;
  total_amount_paid: string;
  is_dealer: boolean;
}

export interface DashboardFirearm {
  id: string;
  serial_number: string;
  type: string;
  model: string;
  calibre: string;
  status: string;
  created_at: string;
}

export interface DashboardApplication {
  id: string;
  tracking_id: string;
  type: string;
  status: string;
  submitted_at: string | null;
  decision_at: string | null;
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
  createdAt: string;
  read: boolean;
}

export type AlertType =
  | 'LICENCE_EXPIRING'
  | 'APPLICATION_UPDATE'
  | 'PAYMENT_REQUIRED'
  | 'SYSTEM_NOTIFICATION';

export type AlertSeverity =
  | 'INFO'
  | 'WARNING'
  | 'ERROR';

// Region Types
export interface Region {
  id: string;
  name: string;
  code: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
