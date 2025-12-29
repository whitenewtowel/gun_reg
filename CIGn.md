# 🔫 Ghana National Firearm Licensing & Tracking Management System (NFLTMS)
## Complete Frontend Development Guide

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Backend API Reference](#backend-api-reference)
3. [Frontend Architecture](#frontend-architecture)
4. [Development Phases](#development-phases)
5. [Technical Stack](#technical-stack)
6. [Project Structure](#project-structure)
7. [Core Features & Components](#core-features--components)
8. [API Integration Guide](#api-integration-guide)
9. [State Management](#state-management)
10. [Authentication & Authorization](#authentication--authorization)
11. [Form Handling & Validation](#form-handling--validation)
12. [File Upload & Document Management](#file-upload--document-management)
13. [Routing & Navigation](#routing--navigation)
14. [UI/UX Guidelines](#uiux-guidelines)
15. [Testing Strategy](#testing-strategy)
16. [Deployment](#deployment)
17. [Development Workflow](#development-workflow)

---

## 1. PROJECT OVERVIEW

### 1.1 Purpose
A comprehensive digital platform to modernize Ghana's firearms licensing, registration, and tracking system, ensuring public safety through efficient gun control and regulatory compliance.

### 1.2 Key Stakeholders
- **Individual Gun Owners** - Apply for and renew firearm licenses
- **Licensed Dealers/Importers** - Manage inventory and sales
- **Security Agencies** - Bulk license management for armed personnel
- **Ghana Police Service** - Application review and firearm tracking
- **Ministry of Interior** - Policy oversight and analytics

### 1.3 System Components
- **Public Web Portal** - Citizen-facing application interface
- **Police/Admin Dashboard** - Law enforcement management system
- **Dealer Portal** - Inventory and sales management
- **Security Agency Portal** - Employee and firearm assignment
- **Mobile Application** - (Phase 4) On-the-go license verification

---

## 2. BACKEND API REFERENCE

### 2.1 Base URL
```
Production: https://national-firearm-licensing-tracking.onrender.com/api/v1
```

### 2.2 Authentication
All authenticated endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <access_token>
```

### 2.3 API Modules

#### **KYC & Onboarding** (No Auth Required)
```
GET    /kyc/get-session              # Get KYC session by email/phone
POST   /kyc/start                     # Start KYC process
POST   /kyc/verify-otp                # Verify OTP and create account
POST   /kyc/resend-otp                # Resend OTP
GET    /kyc/user-status               # Check KYC status
```

#### **Authentication**
```
POST   /auth/login                    # Login with email/password
POST   /auth/password/setup           # First-time password setup
POST   /auth/refresh                  # Refresh access token
POST   /auth/logout                   # Logout
POST   /auth/verify-token             # Verify current token
```

#### **Password Reset**
```
POST   /internal-users/password-reset/initiate        # Send OTP
POST   /internal-users/password-reset/verify-otp     # Verify OTP
POST   /internal-users/password-reset/complete       # Reset password
```

#### **User Profile**
```
GET    /users/me                      # Get own profile
PATCH  /users/me                      # Update profile
```

#### **User Dashboard**
```
GET    /dashboard                     # Comprehensive dashboard data
GET    /dashboard/firearms            # User's firearms
GET    /dashboard/applications        # User's applications
GET    /dashboard/payments            # Payment history
GET    /dashboard/summary             # Summary statistics
```

#### **Applications**
```
POST   /applications                  # Submit new application
GET    /applications/my               # Get my applications
GET    /applications/{id}             # Get application details
GET    /applications                  # List all (admin/police)
POST   /applications/{id}/approve     # Approve application
POST   /applications/{id}/reject      # Reject application
POST   /applications/{id}/police-override  # Police override
```

#### **Firearms**
```
POST   /firearms/register             # Register new firearm
GET    /firearms/search               # Search firearms
GET    /firearms/{id}                 # Get firearm details
PATCH  /firearms/{id}/status          # Update status
POST   /firearms/{id}/transfer        # Transfer ownership
GET    /firearms/{id}/ownership-history  # Ownership history
POST   /firearms/{id}/report-lost     # Report lost
POST   /firearms/{id}/report-stolen   # Report stolen
PATCH  /firearms/{id}/assign-serial   # Assign serial number
```

#### **Licences**
```
GET    /licences/status               # Check license status
GET    /licences/validate-buyer       # Validate buyer (dealer)
POST   /licences/apply                # Apply for license
GET    /licences/my                   # Get my licenses
GET    /licences/{id}                 # Get license details
POST   /licences/{id}/renew           # Renew license
```

#### **Admin - Licences**
```
GET    /admin/licences/applications              # All applications
GET    /admin/licences/applications/{id}         # Application details
POST   /admin/licences/applications/{id}/approve # Approve to next stage
POST   /admin/licences/applications/{id}/reject  # Reject
GET    /admin/licences/expiring                  # Expiring licenses
GET    /admin/licences/non-compliant             # Non-compliant (>12mo)
```

#### **Dealers**
```
POST   /dealers/register              # Register as dealer
GET    /dealers/me                    # My dealer profile
GET    /dealers/inventory             # My inventory
GET    /dealers/sales-history         # My sales
GET    /dealers/documents/status      # Document status
GET    /dealers/documents             # My documents
GET    /dealers/admin/pending         # Pending approvals (admin)
GET    /dealers                       # List dealers (admin)
POST   /dealers/{id}/approve          # Approve dealer
POST   /dealers/{id}/reject           # Reject dealer
GET    /dealers/reapplication/status  # Reapplication status
POST   /dealers/reapplication/submit  # Submit reapplication
```

#### **Payments**
```
POST   /payments/initiate             # Initiate payment
GET    /payments/my                   # My payment history
GET    /payments/{id}                 # Payment details
GET    /payments                      # All payments (admin)
POST   /payments/webhook/{provider}   # Payment webhook (no auth)
```

#### **Document Uploads**
```
POST   /uploads/dealer/{dealerId}/documents      # Upload dealer doc
POST   /uploads/firearm/{firearmId}/documents    # Upload firearm doc
POST   /uploads/licence/{licenceId}/documents    # Upload license doc
GET    /uploads/{documentType}/{entityId}/documents  # List documents
DELETE /uploads/documents/{documentId}           # Delete document
```

#### **Reports** (Admin)
```
GET    /reports/summary                      # Summary statistics
GET    /reports/firearms-by-region           # Export CSV
GET    /reports/dealer-activity              # Export CSV
GET    /reports/application-status           # Export CSV
GET    /reports/payments-reconciliation      # Export CSV
```

#### **Settings** (Admin)
```
GET    /settings/licence-fees         # Get license fees (public)
PATCH  /settings/licence-fees         # Update fees (admin)
GET    /settings/policies             # Get policies (admin)
GET    /settings/policies/{key}       # Get single policy
PATCH  /settings/policies/{key}       # Update policy
GET    /settings/integrations         # Get integrations
GET    /settings/integrations/{name}  # Get integration
PATCH  /settings/integrations/{name}  # Update integration
POST   /settings/integrations/{name}/test  # Test integration
```

#### **Admin System**
```
POST   /admin/system/internal-users                    # Create user
GET    /admin/system/internal-users                    # List users
GET    /admin/system/internal-users/{id}               # Get user
PATCH  /admin/system/internal-users/{id}               # Update user
POST   /admin/system/internal-users/{id}/roles         # Assign role
DELETE /admin/system/internal-users/{id}/roles/{role}  # Revoke role
GET    /admin/system/audit-logs                        # View audit logs
POST   /admin/system/internal-users/{id}/password-reset  # Reset password
```

#### **Regions**
```
GET    /regions                       # List all regions
```

#### **Webhooks**
```
POST   /webhooks/smile-id             # Smile ID verification
POST   /webhooks/smile-id/test        # Test webhook
```

---

## 3. FRONTEND ARCHITECTURE

### 3.1 Architecture Pattern
**Component-Based Architecture with Feature Modules**

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components + Pages)             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         State Management Layer          │
│  (Redux Toolkit + RTK Query)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         API Integration Layer           │
│  (Axios + Service Modules)              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Backend API                     │
│  (REST API on Render.com)               │
└─────────────────────────────────────────┘
```

### 3.2 Design Principles
- **Mobile-First**: Responsive design starting with mobile viewport
- **Component Reusability**: DRY principle for UI components
- **Separation of Concerns**: Business logic separate from presentation
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Code splitting, lazy loading, optimized images
- **Security**: XSS prevention, CSRF protection, secure token storage

---

## 4. DEVELOPMENT PHASES

### Phase 1: MVP Frontend (8 weeks)
**Goal**: Core user and admin interfaces

**Deliverables**:
- Landing page
- KYC onboarding flow
- User authentication
- User dashboard
- License application flow
- Payment integration
- Admin dashboard
- Application review system
- Firearm search

**Success Metrics**:
- 100 successful license applications
- Police can review and approve applications
- Payment success rate >95%
- Zero critical bugs

---

### Phase 2: Dealer Portal (4 weeks)
**Goal**: Enable dealer operations

**Deliverables**:
- Dealer registration
- Import registration
- Inventory management
- Sales and transfer workflow
- Sales history

**Success Metrics**:
- 20 dealers registered
- 500 firearms imported
- 100 ownership transfers

---

### Phase 3: Security Agency Portal (3 weeks)
**Goal**: Bulk license management

**Deliverables**:
- Agency registration
- Bulk employee upload (CSV)
- Firearm assignment tracking
- Employee license management

**Success Metrics**:
- 5 security agencies onboarded
- Bulk operations working smoothly

---

### Phase 4: Mobile Application (8 weeks)
**Goal**: Mobile access for all users

**Deliverables**:
- iOS and Android apps
- QR code license verification
- Push notifications
- Camera document upload
- Offline mode for police

**Success Metrics**:
- 30% user adoption in 3 months
- App store rating >4.0

---

### Phase 5: Advanced Features (Ongoing)
**Goal**: Intelligence and optimization

**Deliverables**:
- Predictive analytics
- ML-based fraud detection
- Multi-language support
- Public transparency portal

---

## 5. TECHNICAL STACK

### 5.1 Core Technologies
```json
{
  "framework": "React 18.2+",
  "language": "TypeScript 5.0+",
  "bundler": "Vite 4.0+",
  "routing": "React Router 6.x",
  "stateManagement": "Redux Toolkit 2.0+",
  "dataFetching": "RTK Query",
  "uiLibrary": "Material-UI (MUI) 5.x",
  "forms": "React Hook Form 7.x",
  "validation": "Zod 3.x",
  "http": "Axios 1.6+",
  "dateHandling": "date-fns 3.x",
  "fileUpload": "react-dropzone 14.x",
  "pdfViewer": "react-pdf 7.x",
  "charts": "recharts 2.x",
  "maps": "react-leaflet 4.x",
  "notifications": "react-hot-toast 2.x"
}
```

### 5.2 Development Tools
```json
{
  "packageManager": "npm or pnpm",
  "linter": "ESLint 8.x",
  "formatter": "Prettier 3.x",
  "testing": "Vitest + React Testing Library",
  "e2e": "Playwright or Cypress",
  "versionControl": "Git + GitHub",
  "cicd": "GitHub Actions",
  "hosting": "Vercel or Netlify"
}
```

### 5.3 Why These Choices?

**TypeScript**: Type safety, better IDE support, fewer runtime errors

**Vite**: Fast development server, optimized production builds

**Redux Toolkit + RTK Query**: Simplified state management, built-in API caching, devtools

**Material-UI**: Comprehensive component library, Ghana-friendly theming, accessibility built-in

**React Hook Form + Zod**: Performant forms, TypeScript-first validation

**date-fns**: Lightweight, tree-shakeable, better than moment.js

---

## 6. PROJECT STRUCTURE

```
nfltms-frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── assets/
│       ├── images/
│       └── icons/
│
├── src/
│   ├── app/
│   │   ├── store.ts                    # Redux store configuration
│   │   ├── hooks.ts                    # Typed Redux hooks
│   │   └── rootReducer.ts              # Root reducer
│   │
│   ├── features/                       # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── PasswordResetForm.tsx
│   │   │   │   └── OTPInput.tsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   └── ResetPasswordPage.tsx
│   │   │   ├── services/
│   │   │   │   └── authApi.ts          # RTK Query API
│   │   │   ├── slices/
│   │   │   │   └── authSlice.ts        # Redux slice
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── utils/
│   │   │   │   └── tokenManager.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── kyc/
│   │   │   ├── components/
│   │   │   │   ├── KYCStartForm.tsx
│   │   │   │   ├── OTPVerification.tsx
│   │   │   │   └── GhanaCardVerification.tsx
│   │   │   ├── pages/
│   │   │   │   ├── KYCStartPage.tsx
│   │   │   │   ├── KYCVerifyPage.tsx
│   │   │   │   └── KYCCompletePage.tsx
│   │   │   ├── services/
│   │   │   │   └── kycApi.ts
│   │   │   └── types/
│   │   │       └── kyc.types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── RecentActivity.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   └── ProfilePage.tsx
│   │   │   ├── services/
│   │   │   │   └── dashboardApi.ts
│   │   │   └── types/
│   │   │       └── dashboard.types.ts
│   │   │
│   │   ├── applications/
│   │   │   ├── components/
│   │   │   │   ├── ApplicationForm/
│   │   │   │   │   ├── Step1_Type.tsx
│   │   │   │   │   ├── Step2_FirearmDetails.tsx
│   │   │   │   │   ├── Step3_Documents.tsx
│   │   │   │   │   ├── Step4_Address.tsx
│   │   │   │   │   ├── Step5_Payment.tsx
│   │   │   │   │   ├── Step6_Review.tsx
│   │   │   │   │   └── Step7_Confirmation.tsx
│   │   │   │   ├── ApplicationCard.tsx
│   │   │   │   ├── ApplicationStatusBadge.tsx
│   │   │   │   └── ApplicationTimeline.tsx
│   │   │   ├── pages/
│   │   │   │   ├── ApplicationsListPage.tsx
│   │   │   │   ├── NewApplicationPage.tsx
│   │   │   │   ├── ApplicationDetailPage.tsx
│   │   │   │   └── RenewalPage.tsx
│   │   │   ├── services/
│   │   │   │   └── applicationsApi.ts
│   │   │   ├── hooks/
│   │   │   │   └── useApplicationForm.ts
│   │   │   └── types/
│   │   │       └── application.types.ts
│   │   │
│   │   ├── firearms/
│   │   │   ├── components/
│   │   │   │   ├── FirearmCard.tsx
│   │   │   │   ├── FirearmDetailModal.tsx
│   │   │   │   ├── OwnershipHistoryTimeline.tsx
│   │   │   │   └── ReportLostStolenForm.tsx
│   │   │   ├── pages/
│   │   │   │   ├── FirearmsListPage.tsx
│   │   │   │   ├── FirearmDetailPage.tsx
│   │   │   │   └── RegisterFirearmPage.tsx
│   │   │   ├── services/
│   │   │   │   └── firearmsApi.ts
│   │   │   └── types/
│   │   │       └── firearm.types.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── components/
│   │   │   │   ├── PaymentMethodSelector.tsx
│   │   │   │   ├── MobileMoneyForm.tsx
│   │   │   │   ├── BankCardForm.tsx
│   │   │   │   └── PaymentStatusModal.tsx
│   │   │   ├── pages/
│   │   │   │   ├── PaymentPage.tsx
│   │   │   │   ├── PaymentHistoryPage.tsx
│   │   │   │   └── PaymentCallbackPage.tsx
│   │   │   ├── services/
│   │   │   │   └── paymentsApi.ts
│   │   │   └── types/
│   │   │       └── payment.types.ts
│   │   │
│   │   ├── dealers/
│   │   │   ├── components/
│   │   │   │   ├── DealerRegistrationForm.tsx
│   │   │   │   ├── InventoryTable.tsx
│   │   │   │   ├── SaleForm.tsx
│   │   │   │   └── ImportForm.tsx
│   │   │   ├── pages/
│   │   │   │   ├── DealerDashboardPage.tsx
│   │   │   │   ├── InventoryPage.tsx
│   │   │   │   ├── ImportPage.tsx
│   │   │   │   ├── SalesPage.tsx
│   │   │   │   └── DealerRegistrationPage.tsx
│   │   │   ├── services/
│   │   │   │   └── dealersApi.ts
│   │   │   └── types/
│   │   │       └── dealer.types.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── ApplicationReviewPanel.tsx
│   │   │   │   ├── FirearmSearchBar.tsx
│   │   │   │   ├── DealerApprovalCard.tsx
│   │   │   │   └── ReportsExportButton.tsx
│   │   │   ├── pages/
│   │   │   │   ├── AdminDashboardPage.tsx
│   │   │   │   ├── ApplicationsManagementPage.tsx
│   │   │   │   ├── ApplicationReviewPage.tsx
│   │   │   │   ├── FirearmsManagementPage.tsx
│   │   │   │   ├── DealersManagementPage.tsx
│   │   │   │   ├── ReportsPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── services/
│   │   │   │   ├── adminApi.ts
│   │   │   │   ├── reportsApi.ts
│   │   │   │   └── settingsApi.ts
│   │   │   └── types/
│   │   │       └── admin.types.ts
│   │   │
│   │   └── shared/                     # Shared across features
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── utils/
│   │       └── types/
│   │
│   ├── components/                     # Reusable UI components
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.styles.ts
│   │   │   │   └── Button.test.tsx
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Table/
│   │   │   ├── Tabs/
│   │   │   └── ... (other UI components)
│   │   │
│   │   ├── forms/
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── FormTextArea.tsx
│   │   │   ├── FormCheckbox.tsx
│   │   │   ├── FormRadio.tsx
│   │   │   └── FormDatePicker.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Container.tsx
│   │   │   └── PageWrapper.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   │
│   │   └── feedback/
│   │       ├── Toast.tsx
│   │       ├── Alert.tsx
│   │       └── Notification.tsx
│   │
│   ├── layouts/                        # Page layouts
│   │   ├── PublicLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── pages/                          # Top-level pages
│   │   ├── LandingPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── UnauthorizedPage.tsx
│   │
│   ├── services/                       # API services
│   │   ├── api.ts                      # Axios instance
│   │   ├── apiClient.ts                # API client wrapper
│   │   └── endpoints.ts                # API endpoints constants
│   │
│   ├── hooks/                          # Custom hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useClickOutside.ts
│   │   └── usePagination.ts
│   │
│   ├── utils/                          # Utility functions
│   │   ├── formatters.ts               # Date, currency, text formatters
│   │   ├── validators.ts               # Custom validators
│   │   ├── constants.ts                # App-wide constants
│   │   ├── helpers.ts                  # Helper functions
│   │   └── storage.ts                  # LocalStorage/SessionStorage
│   │
│   ├── types/                          # TypeScript types
│   │   ├── global.d.ts
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── styles/                         # Global styles
│   │   ├── theme.ts                    # MUI theme configuration
│   │   ├── globalStyles.ts
│   │   └── variables.css
│   │
│   ├── config/                         # Configuration files
│   │   ├── app.config.ts
│   │   ├── routes.config.ts
│   │   └── env.ts
│   │
│   ├── router/                         # Routing configuration
│   │   ├── AppRouter.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── routes.ts
│   │
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Entry point
│   └── vite-env.d.ts
│
├── .env.development
├── .env.production
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 7. CORE FEATURES & COMPONENTS

### 7.1 Landing Page

**Route**: `/`

**Purpose**: Entry point for all users

**Components**:
```tsx
<LandingPage>
  <Header>
    <Logo />
    <Navigation />
    <LanguageSelector />
  </Header>
  
  <HeroSection>
    <Headline>Ghana National Firearm Licensing System</Headline>
    <Subheadline>Secure. Digital. Efficient.</Subheadline>
    <CTAButtons>
      <Button variant="primary" to="/kyc/start">
        Apply for License
      </Button>
      <Button variant="outline" to="/licences/check">
        Check License Status
      </Button>
    </CTAButtons>
  </HeroSection>
  
  <UserTypeSection>
    <UserTypeCard 
      icon={<PersonIcon />}
      title="Individual Gun Owner"
      description="Apply for or renew your firearm license"
      action="Get Started"
      to="/kyc/start"
    />
    <UserTypeCard 
      icon={<BusinessIcon />}
      title="Licensed Dealer"
      description="Register as a dealer and manage inventory"
      action="Register Business"
      to="/dealer/register"
    />
    <UserTypeCard 
      icon={<SecurityIcon />}
      title="Security Agency"
      description="Manage firearms for your personnel"
      action="Register Agency"
      to="/agency/register"
    />
  </UserTypeSection>
  
  <QuickActionsSection>
    <QuickActionCard 
      icon={<SearchIcon />}
      title="Check License Status"
      to="/licences/check"
    />
    <QuickActionCard 
      icon={<ReportIcon />}
      title="Report Lost/Stolen"
      to="/firearms/report"
    />
    <QuickActionCard 
      icon={<TrackIcon />}
      title="Track Application"
      to="/applications/track"
    />
  </QuickActionsSection>
  
  <FeaturesSection>
    <Feature 
      icon={<ClockIcon />}
      title="Fast Processing"
      description="Applications reviewed within 21 days"
    />
    <Feature 
      icon={<ShieldIcon />}
      title="Secure System"
      description="Ghana Card integration for verification"
    />
    <Feature 
      icon={<MobileIcon />}
      title="Mobile Access"
      description="Access your license anytime, anywhere"
    />
  </FeaturesSection>
  
  <Footer>
    <FooterLinks />
    <ContactInfo />
    <SocialMedia />
  </Footer>
</LandingPage>
```

**API Calls**: None (static content)

---

### 7.2 KYC Onboarding Flow

#### **Step 1: Start KYC** (`/kyc/start`)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  emailOrPhone: z.string()
    .min(1, 'Email or phone is required')
    .refine((val) => {
      // Validate email or Ghana phone format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(0|\+233)[0-9]{9}$/;
      return emailRegex.test(val) || phoneRegex.test(val);
    }, 'Must be a valid email or Ghana phone number'),
});

export const KYCStartPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const [startKYC, { isLoading }] = useStartKYCMutation();

  const onSubmit = async (data) => {
    try {
      const result = await startKYC({
        emailOrPhone: data.emailOrPhone,
      }).unwrap();
      
      // Navigate to OTP verification
      navigate('/kyc/verify-otp', { 
        state: { 
          sessionId: result.sessionId,
          emailOrPhone: data.emailOrPhone 
        } 
      });
    } catch (error) {
      toast.error('Failed to start KYC. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <Typography variant="h4">Start Your Application</Typography>
          <Typography variant="body2">
            Enter your email or phone to begin
          </Typography>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Email or Phone Number"
            {...register('emailOrPhone')}
            error={errors.emailOrPhone?.message}
            placeholder="example@email.com or 0244123456"
          />
          
          <Button 
            type="submit" 
            fullWidth 
            loading={isLoading}
          >
            Continue
          </Button>
        </form>
        
        <Divider />
        
        <Typography variant="body2">
          Already have an account? <Link to="/auth/login">Login</Link>
        </Typography>
      </Card>
    </AuthLayout>
  );
};
```

**API Call**:
```typescript
// features/kyc/services/kycApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/services/api';

export const kycApi = createApi({
  reducerPath: 'kycApi',
  baseQuery,
  endpoints: (builder) => ({
    startKYC: builder.mutation({
      query: (data) => ({
        url: '/kyc/start',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: '/kyc/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resendOTP: builder.mutation({
      query: (data) => ({
        url: '/kyc/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useStartKYCMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
} = kycApi;
```

---

#### **Step 2: Verify OTP** (`/kyc/verify-otp`)

```tsx
export const KYCVerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, emailOrPhone } = location.state || {};
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();
  
  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOtp(newOTP);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };
  
  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
    
    try {
      const result = await verifyOTP({
        sessionId,
        otp: otpCode,
      }).unwrap();
      
      // Store tokens
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      
      // Navigate based on KYC status
      if (result.kycStatus === 'COMPLETE') {
        navigate('/dashboard');
      } else {
        navigate('/kyc/ghana-card');
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };
  
  const handleResend = async () => {
    try {
      await resendOTP({ sessionId }).unwrap();
      toast.success('OTP resent successfully');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };
  
  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <Typography variant="h4">Verify Your Identity</Typography>
          <Typography variant="body2">
            Enter the 6-digit code sent to {emailOrPhone}
          </Typography>
        </CardHeader>
        
        <OTPInput
          value={otp}
          onChange={handleOTPChange}
          length={6}
        />
        
        <Button
          fullWidth
          onClick={handleVerify}
          loading={isLoading}
          disabled={otp.join('').length !== 6}
        >
          Verify
        </Button>
        
        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Didn't receive code?{' '}
            <Link 
              onClick={handleResend}
              disabled={isResending}
            >
              Resend OTP
            </Link>
          </Typography>
        </Box>
      </Card>
    </AuthLayout>
  );
};
```

**OTP Input Component**:
```tsx
// components/forms/OTPInput.tsx
interface OTPInputProps {
  value: string[];
  onChange: (index: number, value: string) => void;
  length: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({ 
  value, 
  onChange, 
  length 
}) => {
  return (
    <Box display="flex" gap={1} justifyContent="center">
      {Array.from({ length }).map((_, index) => (
        <TextField
          key={index}
          id={`otp-${index}`}
          value={value[index]}
          onChange={(e) => onChange(index, e.target.value)}
          inputProps={{
            maxLength: 1,
            style: { textAlign: 'center', fontSize: '24px' },
          }}
          sx={{ width: '50px' }}
        />
      ))}
    </Box>
  );
};
```

---

#### **Step 3: Ghana Card Verification** (`/kyc/ghana-card`)

```tsx
export const KYCGhanaCardPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('PENDING');
  
  useEffect(() => {
    // Initialize Smile ID widget or similar
    initializeGhanaCardVerification();
    
    // Poll for verification status
    const interval = setInterval(async () => {
      const status = await checkVerificationStatus();
      setVerificationStatus(status);
      
      if (status === 'VERIFIED') {
        clearInterval(interval);
        navigate('/kyc/password-setup');
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <Typography variant="h4">Ghana Card Verification</Typography>
          <Typography variant="body2">
            We need to verify your Ghana Card details
          </Typography>
        </CardHeader>
        
        {verificationStatus === 'PENDING' && (
          <>
            <Box id="smile-id-container" />
            <LoadingSpinner text="Verifying your identity..." />
          </>
        )}
        
        {verificationStatus === 'VERIFIED' && (
          <Alert severity="success">
            Verification successful! Redirecting...
          </Alert>
        )}
        
        {verificationStatus === 'FAILED' && (
          <Alert severity="error">
            Verification failed. Please try again or contact support.
          </Alert>
        )}
      </Card>
    </AuthLayout>
  );
};
```

---

#### **Step 4: Password Setup** (`/kyc/password-setup`)

```tsx
const passwordSchema = z.object({
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const KYCPasswordSetupPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema),
  });
  
  const [setupPassword, { isLoading }] = useSetupPasswordMutation();
  const password = watch('password');
  
  const onSubmit = async (data) => {
    try {
      await setupPassword({
        password: data.password,
      }).unwrap();
      
      toast.success('Account setup complete!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to setup password');
    }
  };
  
  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <Typography variant="h4">Create Your Password</Typography>
          <Typography variant="body2">
            Choose a strong password to secure your account
          </Typography>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            type="password"
            label="Password"
            {...register('password')}
            error={errors.password?.message}
          />
          
          <PasswordStrengthMeter password={password} />
          
          <FormInput
            type="password"
            label="Confirm Password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          
          <Button type="submit" fullWidth loading={isLoading}>
            Complete Setup
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
};
```

**Password Strength Meter**:
```tsx
interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password 
}) => {
  const getStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };
  
  const strength = getStrength(password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['', 'error', 'warning', 'info', 'success', 'success'];
  
  if (!password) return null;
  
  return (
    <Box mt={1}>
      <LinearProgress
        variant="determinate"
        value={(strength / 5) * 100}
        color={strengthColors[strength]}
      />
      <Typography variant="caption" color={strengthColors[strength]}>
        Password Strength: {strengthLabels[strength]}
      </Typography>
    </Box>
  );
};
```

---

### 7.3 Authentication

#### **Login Page** (`/auth/login`)

```tsx
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const [login, { isLoading }] = useLoginMutation();
  
  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      
      // Store tokens
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Redirect based on role
      if (result.user.role === 'ADMIN' || result.user.role === 'POLICE') {
        navigate('/admin/dashboard');
      } else if (result.user.role === 'DEALER') {
        navigate('/dealer/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };
  
  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <Typography variant="h4">Welcome Back</Typography>
          <Typography variant="body2">
            Login to access your account
          </Typography>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            type="email"
            label="Email Address"
            {...register('email')}
            error={errors.email?.message}
            autoComplete="email"
          />
          
          <FormInput
            type="password"
            label="Password"
            {...register('password')}
            error={errors.password?.message}
            autoComplete="current-password"
          />
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormCheckbox label="Remember me" />
            <Link to="/auth/forgot-password">
              Forgot password?
            </Link>
          </Box>
          
          <Button type="submit" fullWidth loading={isLoading}>
            Login
          </Button>
        </form>
        
        <Divider />
        
        <Typography variant="body2" textAlign="center">
          Don't have an account?{' '}
          <Link to="/kyc/start">Sign up</Link>
        </Typography>
      </Card>
    </AuthLayout>
  );
};
```

---

### 7.4 User Dashboard

#### **Dashboard Overview** (`/dashboard`)

```tsx
export const DashboardPage = () => {
  const { data: summary, isLoading } = useGetDashboardSummaryQuery();
  const { data: firearms } = useGetDashboardFirearmsQuery();
  const { data: applications } = useGetDashboardApplicationsQuery();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your firearms and applications"
      />
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Licenses"
            value={summary?.activeLicenses || 0}
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Applications"
            value={summary?.pendingApplications || 0}
            icon={<PendingIcon />}
            color="warning"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Expiring Soon"
            value={summary?.expiringSoon || 0}
            icon={<WarningIcon />}
            color="error"
            alert={summary?.expiringSoon > 0}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Firearms"
            value={summary?.totalFirearms || 0}
            icon={<GunIcon />}
            color="info"
          />
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/applications/new')}
                  >
                    Apply for New License
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RenewIcon />}
                    onClick={() => navigate('/licences/renew')}
                  >
                    Renew License
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ReportIcon />}
                    onClick={() => navigate('/firearms/report')}
                  >
                    Report Lost/Stolen
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PaymentIcon />}
                    onClick={() => navigate('/payments')}
                  >
                    Payment History
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Firearms */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="My Firearms" 
              action={
                <Button 
                  size="small" 
                  onClick={() => navigate('/firearms')}
                >
                  View All
                </Button>
              }
            />
            <CardContent>
              {firearms?.slice(0, 3).map((firearm) => (
                <FirearmCard key={firearm.id} firearm={firearm} compact />
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <Timeline>
                {applications?.slice(0, 5).map((app) => (
                  <TimelineItem key={app.id}>
                    <TimelineSeparator>
                      <TimelineDot color={getStatusColor(app.status)} />
                      {app !== applications[applications.length - 1] && (
                        <TimelineConnector />
                      )}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2">
                        {app.type === 'NEW' ? 'New' : 'Renewal'} application
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(app.submittedAt)}
                      </Typography>
                      <Chip 
                        label={app.status} 
                        size="small"
                        color={getStatusColor(app.status)}
                      />
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};
```

**API Calls**:
```typescript
// features/dashboard/services/dashboardApi.ts
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => '/dashboard/summary',
    }),
    getDashboard: builder.query({
      query: () => '/dashboard',
    }),
    getDashboardFirearms: builder.query({
      query: () => '/dashboard/firearms',
    }),
    getDashboardApplications: builder.query({
      query: () => '/dashboard/applications',
    }),
    getDashboardPayments: builder.query({
      query: () => '/dashboard/payments',
    }),
  }),
});
```

---

### 7.5 License Application Flow

#### **Multi-Step Form Component**

```tsx
// features/applications/components/ApplicationForm/ApplicationFormContainer.tsx

export const ApplicationFormContainer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>({});
  
  const steps = [
    { number: 1, title: 'Application Type', component: Step1_Type },
    { number: 2, title: 'Firearm Details', component: Step2_FirearmDetails },
    { number: 3, title: 'Document Upload', component: Step3_Documents },
    { number: 4, title: 'Address Verification', component: Step4_Address },
    { number: 5, title: 'Fee Payment', component: Step5_Payment },
    { number: 6, title: 'Review & Submit', component: Step6_Review },
    { number: 7, title: 'Confirmation', component: Step7_Confirmation },
  ];
  
  const CurrentStepComponent = steps[currentStep - 1].component;
  
  const handleNext = (data: Partial<ApplicationFormData>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  return (
    <DashboardLayout>
      <Container maxWidth="md">
        <Card>
          <CardHeader>
            <Typography variant="h5">
              {currentStep < 7 ? 'New License Application' : 'Application Submitted'}
            </Typography>
          </CardHeader>
          
          <CardContent>
            {currentStep < 7 && (
              <Stepper activeStep={currentStep - 1} alternativeLabel>
                {steps.slice(0, 6).map((step) => (
                  <Step key={step.number}>
                    <StepLabel>{step.title}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
            
            <Box mt={4}>
              <CurrentStepComponent
                data={formData}
                onNext={handleNext}
                onBack={handleBack}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
};
```

---

#### **Step 1: Application Type**

```tsx
// Step1_Type.tsx
interface Step1Props {
  data: ApplicationFormData;
  onNext: (data: Partial<ApplicationFormData>) => void;
}

export const Step1_Type: React.FC<Step1Props> = ({ data, onNext }) => {
  const [type, setType] = useState(data.type || 'NEW');
  const { data: firearms } = useGetDashboardFirearmsQuery();
  
  const handleNext = () => {
    onNext({ type });
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Application Type
      </Typography>
      
      <RadioGroup value={type} onChange={(e) => setType(e.target.value)}>
        <FormControlLabel
          value="NEW"
          control={<Radio />}
          label={
            <Box>
              <Typography variant="body1">New License Application</Typography>
              <Typography variant="caption" color="textSecondary">
                Apply for a new firearm license
              </Typography>
            </Box>
          }
        />
        
        <FormControlLabel
          value="RENEWAL"
          control={<Radio />}
          label={
            <Box>
              <Typography variant="body1">License Renewal</Typography>
              <Typography variant="caption" color="textSecondary">
                Renew an existing firearm license
              </Typography>
            </Box>
          }
          disabled={!firearms || firearms.length === 0}
        />
      </RadioGroup>
      
      {type === 'RENEWAL' && firearms && firearms.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Select Firearm to Renew
          </Typography>
          <Select fullWidth>
            {firearms.map((firearm) => (
              <MenuItem key={firearm.id} value={firearm.id}>
                {firearm.type} - {firearm.serialNumber} 
                (Expires: {formatDate(firearm.expiryDate)})
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};
```

---

#### **Step 2: Firearm Details**

```tsx
// Step2_FirearmDetails.tsx
const firearmsSchema = z.object({
  firearmType: z.enum(['PISTOL', 'RIFLE', 'SHOTGUN']),
  serialNumber: z.string().optional(),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  caliber: z.string().min(1, 'Caliber is required'),
  purpose: z.enum(['HUNTING', 'SPORT_SHOOTING', 'SECURITY', 'BUSINESS']),
  storageDetails: z.string().min(10, 'Please describe your storage facility'),
});

export const Step2_FirearmDetails: React.FC<StepProps> = ({ 
  data, 
  onNext, 
  onBack 
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(firearmsSchema),
    defaultValues: data,
  });
  
  const firearmType = watch('firearmType');
  
  const onSubmit = (formData) => {
    onNext(formData);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" gutterBottom>
        Firearm Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.firearmType}>
            <InputLabel>Firearm Type</InputLabel>
            <Select {...register('firearmType')}>
              <MenuItem value="PISTOL">Pistol</MenuItem>
              <MenuItem value="RIFLE">Rifle</MenuItem>
              <MenuItem value="SHOTGUN">Shotgun</MenuItem>
            </Select>
            <FormHelperText>{errors.firearmType?.message}</FormHelperText>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormInput
            label="Make/Manufacturer"
            {...register('make')}
            error={errors.make?.message}
            placeholder="e.g., Glock, Winchester"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormInput
            label="Model"
            {...register('model')}
            error={errors.model?.message}
            placeholder="e.g., 17, 94"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormInput
            label="Caliber"
            {...register('caliber')}
            error={errors.caliber?.message}
            placeholder="e.g., 9mm, .308"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormInput
            label="Serial Number (if known)"
            {...register('serialNumber')}
            error={errors.serialNumber?.message}
            placeholder="Optional"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.purpose}>
            <InputLabel>Purpose of Ownership</InputLabel>
            <Select {...register('purpose')}>
              <MenuItem value="HUNTING">Hunting</MenuItem>
              <MenuItem value="SPORT_SHOOTING">Sport Shooting</MenuItem>
              <MenuItem value="SECURITY">Personal Security</MenuItem>
              <MenuItem value="BUSINESS">Business Use</MenuItem>
            </Select>
            <FormHelperText>{errors.purpose?.message}</FormHelperText>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormTextArea
            label="Storage Facility Details"
            {...register('storageDetails')}
            error={errors.storageDetails?.message}
            placeholder="Describe where and how you will store the firearm securely..."
            rows={4}
          />
        </Grid>
      </Grid>
      
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="contained">
          Next
        </Button>
      </Box>
    </form>
  );
};
```

---

#### **Step 3: Document Upload**

```tsx
// Step3_Documents.tsx
export const Step3_Documents: React.FC<StepProps> = ({ 
  data, 
  onNext, 
  onBack 
}) => {
  const [documents, setDocuments] = useState<DocumentUpload[]>(
    data.documents || []
  );
  const [uploadDocument] = useUploadDocumentMutation();
  
  const requiredDocuments = [
    { 
      type: 'MEDICAL_CERTIFICATE', 
      label: 'Medical Clearance Certificate',
      description: 'From approved hospital, less than 6 months old',
    },
    { 
      type: 'POLICE_CLEARANCE', 
      label: 'Police Character Reference',
      description: 'From your region',
    },
    { 
      type: 'PROOF_OF_ADDRESS', 
      label: 'Proof of Address',
      description: 'Utility bill or rental agreement',
    },
    { 
      type: 'PASSPORT_PHOTO', 
      label: 'Passport Photos',
      description: '2 recent passport-sized photographs',
    },
    { 
      type: 'STORAGE_PHOTOS', 
      label: 'Storage Facility Photos',
      description: 'Photos of where firearm will be stored',
    },
  ];
  
  const handleFileUpload = async (type: string, files: File[]) => {
    const file = files[0];
    
    // Validate file
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', type);
      
      // For now, just store locally. Will upload after application submission
      const newDoc = {
        type,
        file,
        name: file.name,
        uploadedAt: new Date(),
      };
      
      setDocuments([...documents.filter(d => d.type !== type), newDoc]);
      toast.success('Document added successfully');
    } catch (error) {
      toast.error('Failed to add document');
    }
  };
  
  const handleRemove = (type: string) => {
    setDocuments(documents.filter(d => d.type !== type));
  };
  
  const handleNext = () => {
    // Check if all required documents are uploaded
    const uploadedTypes = documents.map(d => d.type);
    const missingDocs = requiredDocuments.filter(
      doc => !uploadedTypes.includes(doc.type)
    );
    
    if (missingDocs.length > 0) {
      toast.error('Please upload all required documents');
      return;
    }
    
    onNext({ documents });
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Required Documents
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        All documents must be in PDF, JPG, or PNG format and less than 5MB
      </Alert>
      
      {requiredDocuments.map((doc) => {
        const uploaded = documents.find(d => d.type === doc.type);
        
        return (
          <Card key={doc.type} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    {doc.label}
                    <Chip 
                      label="Required" 
                      size="small" 
                      color="error" 
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {doc.description}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  {uploaded ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon color="success" />
                      <Typography variant="body2">
                        {uploaded.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemove(doc.type)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Dropzone
                      onDrop={(files) => handleFileUpload(doc.type, files)}
                      accept={{
                        'application/pdf': ['.pdf'],
                        'image/jpeg': ['.jpg', '.jpeg'],
                        'image/png': ['.png'],
                      }}
                      maxSize={5 * 1024 * 1024}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          sx={{
                            border: '2px dashed #ccc',
                            borderRadius: 1,
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <input {...getInputProps()} />
                          <UploadIcon />
                          <Typography variant="body2">
                            Click or drag to upload
                          </Typography>
                        </Box>
                      )}
                    </Dropzone>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
      
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};
```

---

#### **Step 4: Address Verification**

```tsx
// Step4_Address.tsx
export const Step4_Address: React.FC<StepProps> = ({ 
  data, 
  onNext, 
  onBack 
}) => {
  const { data: profile } = useGetProfileQuery();
  const { data: regions } = useGetRegionsQuery();
  
  const [useGhanaCardAddress, setUseGhanaCardAddress] = useState(true);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      address: profile?.address || '',
      region: data.region || '',
      district: data.district || '',
      policeStation: data.policeStation || '',
      gpsCoordinates: data.gpsCoordinates || '',
    },
  });
  
  const onSubmit = (formData) => {
    onNext(formData);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" gutterBottom>
        Address Verification
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        A police officer will visit this address to verify your storage facility
      </Alert>
      
      <FormControlLabel
        control={
          <Checkbox
            checked={useGhanaCardAddress}
            onChange={(e) => setUseGhanaCardAddress(e.target.checked)}
          />
        }
        label="Use address from Ghana Card"
      />
      
      {useGhanaCardAddress ? (
        <Card sx={{ mt: 2, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle2">
              Ghana Card Address:
            </Typography>
            <Typography variant="body2">
              {profile?.address || 'No address on file'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormTextArea
              label="Residential Address"
              {...register('address')}
              error={errors.address?.message}
              rows={3}
              required
            />
          </Grid>
        </Grid>
      )}
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select {...register('region')} required>
              {regions?.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormInput
            label="District"
            {...register('district')}
            error={errors.district?.message}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormInput
            label="Preferred Police Station for Verification"
            {...register('policeStation')}
            error={errors.policeStation?.message}
            placeholder="Select nearest police station"
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormInput
            label="GPS Coordinates (Optional)"
            {...register('gpsCoordinates')}
            error={errors.gpsCoordinates?.message}
            placeholder="e.g., GA-123-4567"
          />
          <Button
            size="small"
            startIcon={<LocationIcon />}
            onClick={() => {
              // Get current location
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  // Set coordinates
                  toast.success('Location captured');
                });
              }
            }}
          >
            Use Current Location
          </Button>
        </Grid>
      </Grid>
      
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="contained">
          Next
        </Button>
      </Box>
    </form>
  );
};
```

---

#### **Step 5: Payment**

```tsx
// Step5_Payment.tsx
export const Step5_Payment: React.FC<StepProps> = ({ 
  data, 
  onNext, 
  onBack 
}) => {
  const { data: fees } = useGetLicenceFeesQuery();
  const [initiatePayment, { isLoading }] = useInitiatePaymentMutation();
  
  const [paymentMethod, setPaymentMethod] = useState('MOBILE_MONEY');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Calculate fee based on firearm type
  const getFee = () => {
    if (data.type === 'RENEWAL') {
      return fees?.renewal || 200;
    }
    
    switch (data.firearmType) {
      case 'PISTOL':
        return fees?.newPistol || 500;
      case 'RIFLE':
        return fees?.newRifle || 400;
      case 'SHOTGUN':
        return fees?.newShotgun || 350;
      default:
        return 500;
    }
  };
  
  const fee = getFee();
  
  const handlePayment = async () => {
    try {
      const result = await initiatePayment({
        amount: fee,
        paymentMethod,
        phoneNumber: paymentMethod === 'MOBILE_MONEY' ? phoneNumber : undefined,
      }).unwrap();
      
      // For mobile money, user will receive prompt on phone
      if (paymentMethod === 'MOBILE_MONEY') {
        toast.success('Payment prompt sent to your phone');
        // Poll for payment status
        // For now, proceed to next step
        onNext({ paymentId: result.paymentId, fee });
      } else {
        // Redirect to payment gateway
        window.location.href = result.paymentUrl;
      }
    } catch (error) {
      toast.error('Failed to initiate payment');
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        License Fee Payment
      </Typography>
      
      <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="h4" textAlign="center">
            GHS {fee.toFixed(2)}
          </Typography>
          <Typography variant="body2" textAlign="center">
            {data.type === 'RENEWAL' ? 'License Renewal Fee' : 'New License Application Fee'}
          </Typography>
        </CardContent>
      </Card>
      
      <Typography variant="subtitle1" gutterBottom>
        Select Payment Method
      </Typography>
      
      <RadioGroup 
        value={paymentMethod} 
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <Card sx={{ mb: 2 }}>
          <CardActionArea>
            <FormControlLabel
              value="MOBILE_MONEY"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center" gap={2} p={1}>
                  <PhoneIcon />
                  <Box>
                    <Typography variant="body1">Mobile Money</Typography>
                    <Typography variant="caption" color="textSecondary">
                      MTN, Vodafone, AirtelTigo
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ width: '100%' }}
            />
          </CardActionArea>
        </Card>
        
        <Card sx={{ mb: 2 }}>
          <CardActionArea>
            <FormControlLabel
              value="BANK_CARD"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center" gap={2} p={1}>
                  <CreditCardIcon />
                  <Box>
                    <Typography variant="body1">Bank Card</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Visa, Mastercard
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ width: '100%' }}
            />
          </CardActionArea>
        </Card>
      </RadioGroup>
      
      {paymentMethod === 'MOBILE_MONEY' && (
        <Box mt={2}>
          <FormInput
            label="Mobile Money Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0244123456"
            helperText="You will receive a payment prompt on this number"
          />
        </Box>
      )}
      
      <Alert severity="info" sx={{ mt: 2 }}>
        Your application will be submitted after successful payment
      </Alert>
      
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={handlePayment}
          loading={isLoading}
          disabled={paymentMethod === 'MOBILE_MONEY' && !phoneNumber}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );
};
```

---

#### **Step 6: Review & Submit**

```tsx
// Step6_Review.tsx
export const Step6_Review: React.FC<StepProps> = ({ 
  data, 
  onNext, 
  onBack 
}) => {
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();
  const [agreed, setAgreed] = useState(false);
  
  const handleSubmit = async () => {
    if (!agreed) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    try {
      // Submit application
      const result = await submitApplication(data).unwrap();
      
      // Upload documents
      for (const doc of data.documents) {
        await uploadDocument({
          licenceId: result.applicationId,
          file: doc.file,
          type: doc.type,
        });
      }
      
      toast.success('Application submitted successfully!');
      onNext({ applicationId: result.applicationId, trackingId: result.trackingId });
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Your Application
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        Please review all information carefully before submitting
      </Alert>
      
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Application Type" />
        <CardContent>
          <Typography>
            {data.type === 'NEW' ? 'New License Application' : 'License Renewal'}
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Firearm Details" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">Type</Typography>
              <Typography>{data.firearmType}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">Make</Typography>
              <Typography>{data.make}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">Model</Typography>
              <Typography>{data.model}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">Caliber</Typography>
              <Typography>{data.caliber}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">Purpose</Typography>
              <Typography>{data.purpose}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Documents" />
        <CardContent>
          {data.documents?.map((doc) => (
            <Box key={doc.type} display="flex" alignItems="center" gap={1} mb={1}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="body2">{doc.name}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Address" />
        <CardContent>
          <Typography>{data.address}</Typography>
          <Typography variant="caption" color="textSecondary">
            {data.district}, {data.region}
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Payment" />
        <CardContent>
          <Typography variant="h6">GHS {data.fee?.toFixed(2)}</Typography>
          <Typography variant="caption" color="success.main">
            Payment Successful
          </Typography>
        </CardContent>
      </Card>
      
      <FormControlLabel
        control={
          <Checkbox 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            I confirm that all information provided is accurate and I agree to the{' '}
            <Link href="/terms" target="_blank">terms and conditions</Link>
          </Typography>
        }
      />
      
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!agreed}
        >
          Submit Application
        </Button>
      </Box>
    </Box>
  );
};
```

---

#### **Step 7: Confirmation**

```tsx
// Step7_Confirmation.tsx
export const Step7_Confirmation: React.FC<StepProps> = ({ data }) => {
  const navigate = useNavigate();
  
  return (
    <Box textAlign="center">
      <CheckCircleIcon 
        sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
      />
      
      <Typography variant="h4" gutterBottom>
        Application Submitted Successfully!
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Your application has been received and is being reviewed
      </Typography>
      
      <Card sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
        <CardContent>
          <Typography variant="caption" color="textSecondary">
            Tracking ID
          </Typography>
          <Typography variant="h5" fontFamily="monospace">
            {data.trackingId}
          </Typography>
          <Button
            size="small"
            startIcon={<CopyIcon />}
            onClick={() => {
              navigator.clipboard.writeText(data.trackingId);
              toast.success('Tracking ID copied');
            }}
          >
            Copy
          </Button>
        </CardContent>
      </Card>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>What happens next?</strong>
          <br />
          1. Police will review your application (1-2 weeks)
          <br />
          2. Site inspection will be scheduled
          <br />
          3. You'll receive approval or feedback (3-4 weeks)
          <br />
          <br />
          Estimated processing time: 21 working days
        </Typography>
      </Alert>
      
      <Box display="flex" gap={2} justifyContent="center">
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/applications')}
        >
          View My Applications
        </Button>
      </Box>
    </Box>
  );
};
```

---

## 8. API INTEGRATION GUIDE

### 8.1 Axios Configuration

```typescript
// src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://national-firearm-licensing-tracking.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.clear();
        window.location.href = '/auth/login';
        toast.error('Session expired. Please login again.');
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    const message = error.response?.data?.message || 'An error occurred';
    
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### 8.2 RTK Query Base Query

```typescript
// src/services/apiClient.ts
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import apiClient from './api';

export const baseQuery: BaseQueryFn
  {
    url: string;
    method?: AxiosRequestConfig['method'];
    body?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
  },
  unknown,
  unknown
> = async ({ url, method = 'GET', body, params }) => {
  try {
    const result = await apiClient({
      url,
      method,
      data: body,
      params,
    });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};
```

---

### 8.3 Example API Service

```typescript
// features/applications/services/applicationsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/services/apiClient';
import { Application, ApplicationFormData } from '../types/application.types';

export const applicationsApi = createApi({
  reducerPath: 'applicationsApi',
  baseQuery,
  tagTypes: ['Applications', 'Application'],
  endpoints: (builder) => ({
    // Get my applications
    getMyApplications: builder.query<Application[], void>({
      query: () => ({ url: '/applications/my' }),
      providesTags: ['Applications'],
    }),
    
    // Get application details
    getApplication: builder.query<Application, string>({
      query: (id) => ({ url: `/applications/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Application', id }],
    }),
    
    // Submit new application
    submitApplication: builder.mutation
      { applicationId: string; trackingId: string },
      ApplicationFormData
    >({
      query: (data) => ({
        url: '/applications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Applications'],
    }),
    
    // Admin: Get all applications
    getAllApplications: builder.query
      Application[],
      { status?: string; region?: string }
    >({
      query: (params) => ({
        url: '/applications',
        params,
      }),
      providesTags: ['Applications'],
    }),
    
    // Admin: Approve application
    approveApplication: builder.mutation
      void,
      { id: string; notes?: string }
    >({
      query: ({ id, notes }) => ({
        url: `/applications/${id}/approve`,
        method: 'POST',
        body: { notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Applications',
        { type: 'Application', id },
      ],
    }),
    
    // Admin: Reject application
    rejectApplication: builder.mutation
      void,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/applications/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Applications',
        { type: 'Application', id },
      ],
    }),
  }),
});

export const {
  useGetMyApplicationsQuery,
  useGetApplicationQuery,
  useSubmitApplicationMutation,
  useGetAllApplicationsQuery,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
} = applicationsApi;
```

---

## 9. STATE MANAGEMENT

### 9.1 Redux Store Configuration

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import all API slices
import { kycApi } from '@/features/kyc/services/kycApi';
import { authApi } from '@/features/auth/services/authApi';
import { dashboardApi } from '@/features/dashboard/services/dashboardApi';
import { applicationsApi } from '@/features/applications/services/applicationsApi';
import { firearmsApi } from '@/features/firearms/services/firearmsApi';
import { paymentsApi } from '@/features/payments/services/paymentsApi';
import { dealersApi } from '@/features/dealers/services/dealersApi';
import { adminApi } from '@/features/admin/services/adminApi';

// Import regular slices
import authReducer from '@/features/auth/slices/authSlice';
import uiReducer from '@/features/shared/slices/uiSlice';

export const store = configureStore({
  reducer: {
    // API reducers
    [kycApi.reducerPath]: kycApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    [firearmsApi.reducerPath]: firearmsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [dealersApi.reducerPath]: dealersApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    
    // Regular reducers
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      kycApi.middleware,
      authApi.middleware,
      dashboardApi.middleware,
      applicationsApi.middleware,
      firearmsApi.middleware,
      paymentsApi.middleware,
      dealersApi.middleware,
      adminApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### 9.2 Typed Hooks

```typescript
// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch


<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

### 9.3 Auth Slice Example

```typescript
// features/auth/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  ghanaCardNumber: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
```

---

## 10. AUTHENTICATION & AUTHORIZATION

### 10.1 Protected Route Component

```typescript
// src/router/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
```

---

### 10.2 Auth Hook

```typescript
// features/auth/hooks/useAuth.ts
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout as logoutAction } from '../slices/authSlice';
import { useLogoutMutation } from '../services/authApi';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  
  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Logout anyway on client side
    } finally {
      dispatch(logoutAction());
    }
  };
  
  const hasRole = (role: string) => {
    return user?.role === role;
  };
  
  const hasAnyRole = (roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  };
  
  return {
    user,
    isAuthenticated,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin: hasAnyRole(['ADMIN', 'POLICE']),
    isDealer: hasRole('DEALER'),
    isOwner: hasRole('OWNER'),
  };
};
```

---

## 11. FORM HANDLING & VALIDATION

### 11.1 Form Component Example with React Hook Form

```typescript
// Example usage of React Hook Form with Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  ghanaCard: z.string().regex(/^GHA-\d{9}-\d$/, 'Invalid Ghana Card format'),
});

type FormData = z.infer<typeof schema>;

export const ExampleForm = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data: FormData) => {
    // Handle submission
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Button type="submit" loading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
};
```

---

### 11.2 Custom Form Input Component

```typescript
// components/forms/FormInput.tsx
import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

type FormInputProps = Omit<TextFieldProps, 'error'> & {
  error?: string;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, ...props }, ref) => {
    return (
      <TextField
        {...props}
        inputRef={ref}
        error={!!error}
        helperText={error}
        fullWidth
        margin="normal"
      />
    );
  }
);
```

---

## 12. FILE UPLOAD & DOCUMENT MANAGEMENT

### 12.1 Document Upload Service

```typescript
// services/uploadService.ts
import apiClient from './api';

export const uploadService = {
  uploadDealerDocument: async (
    dealerId: string,
    file: File,
    documentType: string
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return apiClient.post(`/uploads/dealer/${dealerId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadFirearmDocument: async (
    firearmId: string,
    file: File,
    documentType: string
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return apiClient.post(`/uploads/firearm/${firearmId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadLicenceDocument: async (
    licenceId: string,
    file: File,
    documentType: string
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return apiClient.post(`/uploads/licence/${licenceId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getDocuments: async (documentType: string, entityId: string) => {
    return apiClient.get(`/uploads/${documentType}/${entityId}/documents`);
  },
  
  deleteDocument: async (documentId: string) => {
    return apiClient.delete(`/uploads/documents/${documentId}`);
  },
};
```

---

## 13. ROUTING & NAVIGATION

### 13.1 App Router

```typescript
// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Public pages
import LandingPage from '@/pages/LandingPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Auth pages
import LoginPage from '@/features/auth/pages/LoginPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';

// KYC pages
import KYCStartPage from '@/features/kyc/pages/KYCStartPage';
import KYCVerifyOTPPage from '@/features/kyc/pages/KYCVerifyOTPPage';

// User pages
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import ApplicationsListPage from '@/features/applications/pages/ApplicationsListPage';
import NewApplicationPage from '@/features/applications/pages/NewApplicationPage';

// Admin pages
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import ApplicationsManagementPage from '@/features/admin/pages/ApplicationsManagementPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* KYC routes (no auth required) */}
        <Route path="/kyc/start" element={<KYCStartPage />} />
        <Route path="/kyc/verify-otp" element={<KYCVerifyOTPPage />} />
        
        {/* User routes (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/new"
          element={
            <ProtectedRoute>
              <NewApplicationPage />
            </ProtectedRoute>
          }
        />
        
        {/* Admin routes (protected, admin only) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'POLICE']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'POLICE']}>
              <ApplicationsManagementPage />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
```

---

## 14. UI/UX GUIDELINES

### 14.1 Theme Configuration

```typescript
// src/styles/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#CE1126', // Ghana flag red
      light: '#E94057',
      dark: '#A00E1E',
    },
    secondary: {
      main: '#FCD116', // Ghana flag gold
      light: '#FFE066',
      dark: '#D4AF37',
    },
    success: {
      main: '#006B3F', // Ghana flag green
      light: '#4CAF50',
      dark: '#00472A',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
```

---

### 14.2 Design System

**Colors:**
- Primary Red: `#CE1126` (Ghana flag)
- Gold: `#FCD116` (Ghana flag)
- Green: `#006B3F` (Ghana flag)
- Grey: `#757575` (text secondary)
- Background: `#F5F5F5`

**Typography:**
- Headings: Inter Bold
- Body: Inter Regular
- Monospace (tracking IDs): Roboto Mono

**Spacing:**
- Use 8px grid system (8, 16, 24, 32, 40, 48px)

**Components:**
- Card elevation: 2
- Border radius: 8px
- Button height: 42px
- Input height: 56px

---

### 14.3 Responsive Breakpoints

```typescript
// MUI default breakpoints
xs: 0px
sm: 600px
md: 900px
lg: 1200px
xl: 1536px

// Usage in components
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4}>
    <Card />
  </Grid>
</Grid>
```

---

## 15. TESTING STRATEGY

### 15.1 Unit Tests

```typescript
// Example component test
// features/auth/components/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders login form', () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  it('shows validation errors', async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });
});
```

---

### 15.2 Integration Tests

```typescript
// Example API integration test
// features/applications/services/applicationsApi.test.ts
import { setupApiStore } from '@/test/utils/setupApiStore';
import { applicationsApi } from './applicationsApi';

describe('applicationsApi', () => {
  it('fetches applications', async () => {
    const storeRef = setupApiStore(applicationsApi);
    
    const result = await storeRef.store.dispatch(
      applicationsApi.endpoints.getMyApplications.initiate()
    );
    
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
  });
});
```

---

## 16. DEPLOYMENT

### 16.1 Environment Variables

```bash
# .env.development
VITE_API_BASE_URL=https://national-firearm-licensing-tracking.onrender.com/api/v1
VITE_APP_ENV=development

# .env.production
VITE_API_BASE_URL=https://national-firearm-licensing-tracking.onrender.com/api/v1
VITE_APP_ENV=production
```

---

### 16.2 Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
});
```

---

### 16.3 Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 17. DEVELOPMENT WORKFLOW

### 17.1 Getting Started

```bash
# Clone repository
git clone <repo-url>
cd nfltms-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.development

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

### 17.2 Git Workflow

```bash
# Feature branch
git checkout -b feature/application-form

# Commit changes
git add .
git commit -m "feat: add application form step 1"

# Push to remote
git push origin feature/application-form

# Create pull request on GitHub
```

---

### 17.3 Code Style

```json
// .eslintrc.cjs
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ]
}
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 18. KEY IMPLEMENTATION NOTES FOR CLAUDE CODE

### For Claude Code AI Assistant:

1. **Always use TypeScript** - All files should be `.tsx` or `.ts`

2. **Follow the folder structure** - Features in `features/`, shared components in `components/`

3. **Use RTK Query for API calls** - Don't write manual fetch/axios in components

4. **Form validation with Zod** - Use `zodResolver` with React Hook Form

5. **Protected routes** - Wrap authenticated routes with `<ProtectedRoute>`

6. **Error handling** - Use try/catch and display user-friendly error messages with toast

7. **Loading states** - Always handle loading states in UI

8. **Responsive design** - Use MUI Grid system, test mobile viewport

9. **Accessibility** - Use semantic HTML, ARIA labels, keyboard navigation

10. **Comments** - Add JSDoc comments for complex functions

11. **API endpoints** - Reference the API documentation section for correct endpoints

12. **State management** - Use Redux for global state, local state for component-specific

13. **File uploads** - Use FormData and the upload service utilities

14. **Authentication** - Token stored in localStorage, auto-refresh on 401

15. **Naming conventions**:
    - Components: PascalCase (`ApplicationForm.tsx`)
    - Hooks: camelCase with `use` prefix (`useAuth.ts`)
    - Constants: UPPER_SNAKE_CASE
    - Functions: camelCase

---

## QUICK START CHECKLIST

- [ ] Clone repository and install dependencies
- [ ] Set up environment variables
- [ ] Review API documentation and test endpoints with Postman
- [ ] Set up theme and design system
- [ ] Implement authentication flow (login, KYC, password)
- [ ] Build landing page
- [ ] Build user dashboard
- [ ] Implement application form (multi-step)
- [ ] Add document upload functionality
- [ ] Integrate payment gateway
- [ ] Build admin dashboard
- [ ] Implement application review workflow
- [ ] Add firearm search and tracking
- [ ] Build dealer portal (Phase 2)
- [ ] Deploy to Vercel/Netlify
- [ ] User acceptance testing

---

**This documentation is comprehensive and ready to be used with Claude Code for AI-assisted development. It includes all necessary context, code examples, and architectural decisions to build the NFLTMS frontend application.