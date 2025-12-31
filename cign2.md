# NFLTMS - User Flow Documentation
## National Firearm Licensing & Tracking Management System
**Ghana Police Service | Ministry of Interior**

---

**Document Version:** 1.0  
**Date:** December 31, 2025  
**Prepared For:** Backend Development Team  
**Purpose:** Complete user journey mapping for frontend implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Legal Framework & Parties Involved](#legal-framework)
4. [Individual Gun Owner Flow](#individual-flow)
5. [Dealer Registration & Operations Flow](#dealer-flow)
6. [API Integration Requirements](#api-requirements)
7. [State Management & Data Flow](#state-management)
8. [Key Differences: Individual vs Dealer](#comparison)
9. [Appendices](#appendices)

---

## 1. Executive Summary {#executive-summary}

### 1.1 Document Purpose
This document provides comprehensive user flow documentation for the NFLTMS platform, detailing every step from user registration to license issuance and ongoing operations for both individual gun owners and licensed dealers.

### 1.2 Key Stakeholders
- **Individual Gun Owners** - Citizens applying for firearm licenses
- **Licensed Dealers/Importers** - Businesses selling firearms
- **Ghana Police Service** - Application review and approval
- **Ministry of Interior** - Policy oversight and dealer approvals
- **System Users** - All authenticated platform users

### 1.3 Core User Journeys
This documentation covers two primary user types:

1. **Individual Gun Owner Journey** (9 stages, ~21 days processing)
   - Account creation via KYC
   - License application
   - Police verification
   - License issuance
   - Firearm acquisition
   - Ongoing compliance

2. **Dealer Journey** (5 stages, ~45-60 days processing)
   - Pre-qualification
   - Business registration
   - Facility inspection
   - License approval
   - Inventory & sales operations

---

## 2. System Overview {#system-overview}

### 2.1 Platform Components

```
┌─────────────────────────────────────────────────────┐
│                 Public Web Portal                    │
│  - Landing page with information                     │
│  - License status checker (no auth)                  │
│  - Educational content                               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│            KYC & Authentication System               │
│  - Ghana Card verification (Smile ID)                │
│  - OTP verification                                  │
│  - Password setup                                    │
│  - Auto-login after KYC                             │
└─────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│  User Dashboard  │          │ Dealer Dashboard  │
│  - Applications  │          │  - Inventory      │
│  - Firearms      │          │  - Sales          │
│  - Payments      │          │  - Reports        │
│  - Renewals      │          │  - Compliance     │
└──────────────────┘          └──────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│            Police/Admin Dashboard                    │
│  - Application review                                │
│  - Background checks                                 │
│  - Site inspections                                  │
│  - License issuance                                  │
│  - Firearms registry                                 │
└─────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

**Frontend:**
- Framework: React 18+ with TypeScript
- Routing: React Router v6
- State Management: Redux Toolkit + RTK Query
- UI Library: Material-UI (MUI) v5
- Forms: React Hook Form + Zod validation
- File Upload: React Dropzone

**Backend API:**
- Base URL: `https://national-firearm-licensing-tracking.onrender.com/api/v1`
- Authentication: JWT (Access + Refresh tokens)
- All endpoints documented in existing API specification

### 2.3 Design Principles

1. **KYC-First Approach** - Users express intent before account creation
2. **Progressive Disclosure** - Show information as needed per step
3. **Auto-save** - Draft applications saved automatically
4. **Mobile-First** - Responsive design for all screen sizes
5. **Accessibility** - WCAG 2.1 AA compliance
6. **Real-time Feedback** - Immediate validation and status updates

---

## 3. Legal Framework & Parties Involved {#legal-framework}

### 3.1 Governing Legislation
- **Arms and Ammunition Act, 1972 (NRCD 9)** - Primary legislation
- **Arms and Ammunition Regulations, 1972 (L.I. 1140)** - Implementation rules
- **Police Service Act, 1970 (Act 350)** - Police authority

### 3.2 All Parties in the Process

| Party | Role | System Access |
|-------|------|---------------|
| **Applicant** | Apply for license | Public portal + User dashboard |
| **Ghana Police - Regional** | Initial verification & home visits | Admin dashboard (regional view) |
| **Ghana Police - HQ** | Final approval, license issuance | Admin dashboard (full access) |
| **CID** | Criminal background checks | Read-only access to checks |
| **Medical Facilities** | Issue medical certificates | External (certificates uploaded) |
| **NIA** | Ghana Card verification | API integration |
| **Firearm Dealers** | Sell firearms, maintain records | Dealer dashboard |
| **Customs (GRA)** | Import clearance | External (documents uploaded) |
| **Ministry of Interior** | Policy oversight, dealer approvals | Admin dashboard (oversight) |
| **Security Agencies** | Bulk license applications | Agency dashboard |

### 3.3 Document Requirements

**For Individual License:**
1. Ghana Card (verified via API)
2. Medical Certificate (<6 months old)
3. Police Clearance Certificate
4. Proof of Address (utility bill/rental agreement)
5. Passport photos (2 copies)
6. Storage facility photos
7. Character references (2 persons)
8. Game license (hunters) / Shooting club membership (sport shooters)

**For Dealer Registration:**
1. All individual license requirements (director must be licensed)
2. Business registration certificate
3. TIN certificate
4. Property documents (ownership/lease)
5. Facility photos (exterior, interior, vault)
6. Security system documentation
7. Fire safety certificate
8. Insurance policy (minimum GHS 500,000)
9. Bank statements (proof of capital)
10. Directors' licenses

---

## 4. Individual Gun Owner Flow {#individual-flow}

### Stage 1: Discovery & Intent Capture

**Entry Point:** Landing page (`/`)

**User Actions:**
1. User reads about firearm licensing requirements
2. Reviews fees and processing timeline
3. Clicks "Apply for License" button

**Route:** `/applications/intent`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ What brings you here today?              │
│                                          │
│ ○ Apply for NEW firearm license         │
│   First-time gun owner                   │
│   Timeline: 21 days | Fee: GHS 400-500  │
│                                          │
│ ○ Renew existing license                │
│   Before expiry to avoid penalties       │
│   Timeline: 3-5 days | Fee: GHS 200     │
│                                          │
│ ○ Register firearm I already own        │
│   Regularize unregistered firearm        │
│                                          │
│ ○ Replace lost/damaged license          │
│   Get replacement certificate            │
│                                          │
│ [Continue]                               │
└──────────────────────────────────────────┘
```

**Backend Integration:**
- No API call yet
- Intent saved in session: `sessionStorage.setItem('userIntent', 'NEW_LICENSE')`
- Redirect to KYC start

---

### Stage 2: KYC & Account Creation

This is a **critical stage** where users create accounts through identity verification.

#### Step 2.1: KYC Start

**Route:** `/kyc/start`  
**Authentication Required:** No

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Welcome to NFLTMS                        │
│ Let's verify your identity               │
│                                          │
│ Email or Phone Number:                   │
│ [_______________________________]        │
│                                          │
│ Already have an account?                 │
│ [Login here]                            │
│                                          │
│ [Get Started]                           │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
// Check if user exists
GET /kyc/get-session?identifier=0244123456

Response (if new user):
{
  "exists": false,
  "message": "User not found, proceed with registration"
}

// Start KYC
POST /kyc/start
Body: {
  "emailOrPhone": "0244123456"
}

Response:
{
  "sessionId": "kyc_session_xyz123",
  "otpSent": true,
  "medium": "SMS",
  "message": "OTP sent to 0244******56"
}
```

**Frontend Actions:**
- Store `sessionId` in state
- Redirect to OTP verification page
- Display masked phone number

---

#### Step 2.2: OTP Verification

**Route:** `/kyc/verify-otp`  
**Authentication Required:** No (uses sessionId)

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Enter Verification Code                 │
│ Sent to: 0244******56                   │
│                                          │
│ [_] [_] [_] [_] [_] [_]                 │
│                                          │
│ Didn't receive code?                    │
│ [Resend OTP] (available in 30s)         │
│                                          │
│ [Verify]                                │
└──────────────────────────────────────────┘
```

**API Calls:**
```javascript
// Verify OTP
POST /kyc/verify-otp
Body: {
  "sessionId": "kyc_session_xyz123",
  "otp": "123456"
}

Response:
{
  "userId": "usr_abc123",
  "tempToken": "temp_token_def456",
  "kycStatus": "PHONE_VERIFIED",
  "nextStep": "GHANA_CARD_VERIFICATION",
  "message": "Phone verified successfully"
}

// If OTP is wrong:
Response (400):
{
  "error": "INVALID_OTP",
  "message": "Incorrect verification code",
  "attemptsRemaining": 2
}

// Resend OTP
POST /kyc/resend-otp
Body: {
  "sessionId": "kyc_session_xyz123"
}

Response:
{
  "otpSent": true,
  "message": "New OTP sent"
}
```

**Frontend Actions:**
- Auto-focus next input on digit entry
- Submit automatically when 6 digits entered
- Store `userId` and `tempToken`
- Redirect to Ghana Card verification

---

#### Step 2.3: Ghana Card Verification

**Route:** `/kyc/ghana-card`  
**Authentication Required:** No (uses tempToken)

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Verify Your Identity                    │
│                                          │
│ We'll use Smile ID to verify your       │
│ Ghana Card and take a selfie             │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │                                    │  │
│ │   [Smile ID Widget Embedded]       │  │
│ │                                    │  │
│ │   1. Take a selfie                 │  │
│ │   2. Scan Ghana Card (both sides)  │  │
│ │   3. Verify match                  │  │
│ │                                    │  │
│ └────────────────────────────────────┘  │
│                                          │
│ [Start Verification]                    │
└──────────────────────────────────────────┘
```

**Integration Flow:**
1. Frontend embeds Smile ID widget
2. User completes biometric verification
3. Smile ID sends webhook to backend
4. Frontend polls for verification status

**API Calls:**
```javascript
// Poll for verification status
GET /kyc/user-status?userId=usr_abc123

Response (while processing):
{
  "kycStatus": "GHANA_CARD_PENDING",
  "message": "Verification in progress"
}

Response (after webhook):
{
  "kycStatus": "VERIFIED",
  "ghanaCardData": {
    "ghanaCardNumber": "GHA-123456789-1",
    "fullName": "Kwame Mensah",
    "dateOfBirth": "1985-03-15",
    "gender": "MALE",
    "address": "GA-123-4567, Accra, Greater Accra",
    "photo": "base64_encoded_photo"
  },
  "nextStep": "PASSWORD_SETUP"
}
```

**Webhook (Backend receives):**
```javascript
POST /webhooks/smile-id
Headers: {
  "X-Signature": "webhook_signature"
}

Body: {
  "userId": "usr_abc123",
  "verified": true,
  "ghanaCardNumber": "GHA-123456789-1",
  "fullName": "Kwame Mensah",
  "dateOfBirth": "1985-03-15",
  "address": "GA-123-4567, Accra",
  "confidence": 0.98
}
```

**Frontend Actions:**
- Show loading state during verification
- Poll every 3 seconds (max 20 attempts)
- On success, show preview of extracted data
- Redirect to confirmation page

---

#### Step 2.4: Confirm Ghana Card Data

**Route:** `/kyc/confirm-details`  
**Authentication Required:** No (uses tempToken)

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Confirm Your Information                │
│                                          │
│ Please verify the details from your      │
│ Ghana Card are correct                   │
│                                          │
│ Full Name:                               │
│ Kwame Mensah                             │
│                                          │
│ Ghana Card Number:                       │
│ GHA-123456789-1                          │
│                                          │
│ Date of Birth:                           │
│ March 15, 1985 (40 years old)            │
│                                          │
│ Address:                                 │
│ GA-123-4567, Accra, Greater Accra        │
│                                          │
│ Contact Information:                     │
│ Phone: 0244123456                        │
│ Email: [kwame@email.com    ]             │
│                                          │
│ ☑ Information is correct                │
│                                          │
│ [Continue]                               │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
// No API call - just confirmation
// Email is added by user, saved to proceed
```

---

#### Step 2.5: Password Setup

**Route:** `/kyc/password-setup`  
**Authentication Required:** No (uses tempToken)

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Secure Your Account                     │
│                                          │
│ Create a strong password                 │
│                                          │
│ Password:                                │
│ [________________] 👁                    │
│                                          │
│ Password Strength: Strong ████████░░     │
│                                          │
│ Requirements:                            │
│ ✓ At least 12 characters                │
│ ✓ One uppercase letter                  │
│ ✓ One lowercase letter                  │
│ ✓ One number                             │
│ ✓ One special character                 │
│                                          │
│ Confirm Password:                        │
│ [________________] 👁                    │
│                                          │
│ [Complete Setup]                        │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
POST /auth/password/setup
Headers: {
  "Authorization": "Bearer temp_token_def456"
}
Body: {
  "password": "SecureP@ssw0rd123"
}

Response:
{
  "success": true,
  "message": "Account setup complete",
  "user": {
    "id": "usr_abc123",
    "email": "kwame@email.com",
    "fullName": "Kwame Mensah",
    "ghanaCardNumber": "GHA-123456789-1",
    "role": "OWNER",
    "kycStatus": "COMPLETE",
    "hasCompletedOnboarding": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Frontend Actions:**
- Store both tokens in localStorage
- Update Redux auth state
- **AUTO-LOGIN** - Do not redirect to login page
- Redirect to user type selection page

---

### Stage 3: User Type Selection

**Route:** `/onboarding/select-user-type`  
**Authentication Required:** Yes

**Purpose:** Bridge between KYC completion and application start

**UI Screen:**
```
┌──────────────────────────────────────────────────┐
│ 🎉 Welcome, Kwame Mensah!                        │
│ Your account has been verified                   │
│                                                  │
│ Ghana Card: GHA-123456789-1                      │
│                                                  │
│ What would you like to do today?                 │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ 🔫 Apply for Individual Firearm License   │  │
│ │                                            │  │
│ │ Get licensed to own a pistol, rifle, or   │  │
│ │ shotgun for personal use                   │  │
│ │                                            │  │
│ │ Fee: GHS 400-500                           │  │
│ │ Timeline: 21 working days                  │  │
│ │                                            │  │
│ │                          [Select →]        │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ 🏢 Register as Licensed Dealer             │  │
│ │                                            │  │
│ │ Import and sell firearms commercially      │  │
│ │                                            │  │
│ │ ⚠️ Requires gun owner license first        │  │
│ │ Fee: GHS 2,000-7,000                       │  │
│ │                                            │  │
│ │                          [Select →]        │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ 🛡️ Register Security Agency                │  │
│ │                                            │  │
│ │ Manage firearms for security personnel     │  │
│ │                          [Select →]        │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ 🔄 Renew Existing License                  │  │
│ │                                            │  │
│ │ Already licensed? Renew here               │  │
│ │                          [Select →]        │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ [Skip for now]                                  │
└──────────────────────────────────────────────────┘
```

**API Call:**
```javascript
// Update user's onboarding intent
PATCH /users/me
Body: {
  "onboardingIntent": "INDIVIDUAL_LICENSE",
  "hasCompletedOnboarding": true
}

Response:
{
  "success": true,
  "user": {
    ...updated user object
  }
}
```

**Frontend Actions:**
- On "Individual License": Redirect to `/applications/new`
- On "Dealer": Check if user has gun license, if not show error modal
- On "Skip": Redirect to `/dashboard` (empty state)

---

### Stage 4: License Application - Multi-Step Form

**Route:** `/applications/new`  
**Authentication Required:** Yes

This is a **7-step wizard** with auto-save functionality.

#### Step 4.1: Application Type & Firearm Selection

**Progress:** `[●]─────────── Step 1 of 7`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ New License Application                  │
│                                          │
│ Select Firearm Type:                     │
│ ○ Pistol/Handgun                        │
│   Personal defense, sport shooting      │
│   License Fee: GHS 500                   │
│                                          │
│ ● Rifle                                 │
│   Hunting, sport shooting               │
│   License Fee: GHS 400                   │
│                                          │
│ ○ Shotgun                               │
│   Hunting, clay shooting                │
│   License Fee: GHS 350                   │
│                                          │
│ Purpose of Ownership:                    │
│ ● Hunting                               │
│ ○ Sport Shooting                        │
│ ○ Personal Security                     │
│ ○ Business (Security Guard)             │
│                                          │
│ Do you already own this firearm?         │
│ ○ Yes - Need to register it             │
│ ● No - Will purchase after license      │
│                                          │
│ [Next]                                  │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
// Create draft application
POST /applications
Body: {
  "type": "NEW",
  "firearmType": "RIFLE",
  "purpose": "HUNTING",
  "alreadyOwned": false,
  "status": "DRAFT"
}

Response:
{
  "applicationId": "app_xyz789",
  "trackingId": "NFL-2025-001234",
  "status": "DRAFT",
  "createdAt": "2025-12-31T10:00:00Z"
}
```

**Frontend Actions:**
- Store `applicationId` in state
- All subsequent steps update this application
- Auto-save on field blur

---

#### Step 4.2: Firearm Details

**Progress:** `[●●]────────── Step 2 of 7`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Firearm Specifications                   │
│                                          │
│ Make/Manufacturer:                       │
│ [Remington ▼]                           │
│                                          │
│ Model:                                   │
│ [Model 700          ]                   │
│                                          │
│ Caliber:                                 │
│ [.308 Winchester    ]                   │
│                                          │
│ Serial Number (if known):                │
│ [________________] Optional              │
│                                          │
│ Storage Details:                         │
│ Describe your secure storage facility    │
│ ┌────────────────────────────────────┐  │
│ │ I have a steel gun safe bolted to  │  │
│ │ the floor of my bedroom closet.    │  │
│ │ Only I have the key...             │  │
│ └────────────────────────────────────┘  │
│ (Min 50 characters)                      │
│                                          │
│ Storage Location Address:                │
│ ● Same as Ghana Card address            │
│ ○ Different address (provide proof)     │
│                                          │
│ [Back] [Next]                           │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
// Update application
PATCH /applications/app_xyz789
Body: {
  "firearmDetails": {
    "make": "Remington",
    "model": "Model 700",
    "caliber": ".308 Winchester",
    "serialNumber": null,
    "storageDetails": "I have a steel gun safe...",
    "storageAddress": "SAME_AS_GHANA_CARD"
  }
}

Response:
{
  "success": true,
  "application": {
    ...updated application object
  }
}
```

---

#### Step 4.3: Document Upload

**Progress:** `[●●●]───────── Step 3 of 7`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Required Documents                       │
│                                          │
│ 1. Medical Certificate ⚠️ REQUIRED      │
│    From approved hospital, <6 months     │
│    ┌──────────────────────────────┐     │
│    │ 📄 Drop files here           │     │
│    │    or click to upload        │     │
│    └──────────────────────────────┘     │
│    ✓ medical_cert.pdf (2.3 MB)          │
│    [✓ Verified] [× Remove]              │
│                                          │
│ 2. Police Clearance ⚠️ REQUIRED         │
│    ✓ police_clearance.pdf (1.8 MB)      │
│                                          │
│ 3. Proof of Address ⚠️ REQUIRED         │
│    ✓ ecg_bill.pdf (890 KB)              │
│                                          │
│ 4. Storage Photos ⚠️ REQUIRED           │
│    ✓ safe_photo1.jpg, safe_photo2.jpg   │
│                                          │
│ 5. Game License (Hunters) ✓ Optional    │
│    ✓ game_license.pdf (1.2 MB)          │
│                                          │
│ 6. Character References ⚠️ REQUIRED     │
│    2 letters required                    │
│    [ Upload files ]                      │
│                                          │
│ [Back] [Save Draft] [Next]              │
└──────────────────────────────────────────┘
```

**API Calls:**
```javascript
// For each document upload
POST /uploads/licence/app_xyz789/documents
Content-Type: multipart/form-data

FormData:
{
  "file": <binary>,
  "documentType": "MEDICAL_CERT"
}

Response:
{
  "documentId": "doc_abc123",
  "fileName": "medical_cert.pdf",
  "fileSize": 2359296,
  "documentType": "MEDICAL_CERT",
  "uploadedAt": "2025-12-31T10:15:00Z",
  "url": "/uploads/documents/doc_abc123"
}

// List uploaded documents
GET /uploads/licence/app_xyz789/documents

Response:
{
  "documents": [
    {
      "documentId": "doc_abc123",
      "documentType": "MEDICAL_CERT",
      "fileName": "medical_cert.pdf",
      "fileSize": 2359296,
      "uploadedAt": "2025-12-31T10:15:00Z"
    },
    ...
  ]
}

// Delete document if needed
DELETE /uploads/documents/doc_abc123
```

**Frontend Validation:**
- File types: PDF, JPG, PNG only
- Max size: 5MB per file
- Virus scan on upload (backend)
- Show upload progress bar
- Preview uploaded files

---

#### Step 4.4: Address & Contact Verification

**Progress:** `[●●●●]──────── Step 4 of 7`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Verify Your Address                      │
│                                          │
│ Residential Address:                     │
│ ● Use Ghana Card address                │
│   GA-123-4567, Accra, Greater Accra     │
│                                          │
│ ○ Use different address                 │
│   (Upload proof of address)              │
│                                          │
│ GPS Coordinates (Optional):              │
│ [________________]                       │
│ [📍 Use Current Location]                │
│                                          │
│ Region: [Greater Accra ▼]               │
│ District: [Accra Metropolis ▼]          │
│                                          │
│ Police Station for Home Visit:           │
│ [Accra Central Police Station ▼]        │
│                                          │
│ Emergency Contact:                       │
│ Name: [________________]                │
│ Phone: [________________]               │
│ Relationship: [Spouse ▼]                │
│                                          │
│ [Back] [Next]                           │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
// Get available regions
GET /regions

Response:
{
  "regions": [
    {
      "id": "region_1",
      "name": "Greater Accra",
      "districts": [
        { "id": "dist_1", "name": "Accra Metropolis" },
        { "id": "dist_2", "name": "Tema Metropolis" }
      ]
    },
    ...
  ]
}

// Update application
PATCH /applications/app_xyz789
Body: {
  "addressInfo": {
    "useGhanaCardAddress": true,
    "gpsCoordinates": "GA-123-4567",
    "regionId": "region_1",
    "districtId": "dist_1",
    "preferredPoliceStation": "Accra Central Police Station",
    "emergencyContact": {
      "name": "Ama Mensah",
      "phone": "0244987654",
      "relationship": "SPOUSE"
    }
  }
}
```

---

#### Step 4.5: Background Information

**Progress:** `[●●●●●]─────── Step 5 of 7`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Additional Information                   │
│                                          │
│ Employment Status:                       │
│ ● Employed                              │
│ ○ Self-employed                         │
│ ○ Unemployed                            │
│ ○ Retired                               │
│                                          │
│ Employer/Business Name:                  │
│ [Ghana Natl Petroleum Corp]             │
│                                          │
│ Occupation/Position:                     │
│ [Geologist              ]               │
│                                          │
│ Previous Firearm Ownership:              │
│ Have you owned a firearm before?         │
│ ○ Yes ● No                              │
│                                          │
│ Criminal History:                        │
│ Have you been convicted of any crime?    │
│ ○ Yes ● No                              │
│                                          │
│ Medical Conditions:                      │
│ Any condition affecting firearm use?     │
│ ○ Yes ● No                              │
│                                          │
│ [Back] [Next]                           │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
PATCH /applications/app_xyz789
Body: {
  "backgroundInfo": {
    "employmentStatus": "EMPLOYED",
    "employer": "Ghana National Petroleum Corp",
    "occupation": "Geologist",
    "previousOwnership": false,
    "criminalHistory": false,
    "medicalConditions": false
  }
}
```

---

#### Step 4.6: Fee Payment

**Progress:** `[●●●●●●]────── Step 6 of 7`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Application Fee                          │
│                                          │
│ License Type: Rifle License              │
│ Application Fee: GHS 400.00              │
│ Processing Fee: GHS 50.00                │
│ ─────────────────────────                │
│ Total Amount: GHS 450.00                 │
│                                          │
│ Payment Method:                          │
│ ● Mobile Money                          │
│   ○ MTN Mobile Money                    │
│   ● Vodafone Cash                       │
│   ○ AirtelTigo Money                    │
│                                          │
│   Phone Number:                          │
│   [0244123456]                          │
│                                          │
│ ○ Bank Card                             │
│   Visa, Mastercard                      │
│                                          │
│ [Back] [Proceed to Payment]             │
└──────────────────────────────────────────┘
```

**API Calls:**
```javascript
// Get fee structure
GET /settings/licence-fees

Response:
{
  "fees": {
    "newPistol": 500,
    "newRifle": 400,
    "newShotgun": 350,
    "renewal": 200,
    "processingFee": 50,
    "latePenalty1to6months": 50,
    "latePenalty6to12months": 150
  }
}

// Initiate payment
POST /payments/initiate
Body: {
  "applicationId": "app_xyz789",
  "amount": 450,
  "paymentMethod": "MOBILE_MONEY",
  "provider": "VODAFONE",
  "phoneNumber": "0244123456"
}

Response:
{
  "paymentId": "pay_123456",
  "status": "PENDING",
  "provider": "VODAFONE",
  "message": "Payment prompt sent to your phone",
  "expiresAt": "2025-12-31T10:35:00Z"
}

// Poll payment status
GET /payments/pay_123456

Response (pending):
{
  "paymentId": "pay_123456",
  "status": "PENDING",
  "amount": 450
}

Response (success):
{
  "paymentId": "pay_123456",
  "status": "SUCCESSFUL",
  "amount": 450,
  "paidAt": "2025-12-31T10:25:00Z",
  "transactionId": "VF-TXN-20251231102500",
  "receipt": "/payments/pay_123456/receipt"
}

// Webhook from payment provider (backend receives)
POST /payments/webhook/vodafone
Body: {
  "transactionId": "VF-TXN-20251231102500",
  "paymentId": "pay_123456",
  "status": "SUCCESS",
  "amount": 450,
  "phone": "0244123456"
}
```

**Frontend Flow:**
1. User clicks "Proceed to Payment"
2. API initiates payment
3. User receives mobile money prompt on phone
4. User approves on phone
5. Frontend polls payment status every 3 seconds
6. On success, show success message and proceed

---

#### Step 4.7: Review & Submit

**Progress:** `[●●●●●●●]───── Step 7 of 7`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Review Your Application                  │
│                                          │
│ Applicant Information        ✏️ Edit    │
│ ├─ Kwame Mensah                         │
│ ├─ GHA-123456789-1                      │
│ └─ 0244123456                           │
│                                          │
│ Firearm Details              ✏️ Edit    │
│ ├─ Type: Rifle                          │
│ ├─ Remington Model 700                  │
│ ├─ .308 Winchester                      │
│ └─ Purpose: Hunting                     │
│                                          │
│ Documents Uploaded           ✏️ Edit    │
│ ├─ ✓ Medical Certificate                │
│ ├─ ✓ Police Clearance                   │
│ ├─ ✓ Proof of Address                   │
│ ├─ ✓ Storage Photos                     │
│ ├─ ✓ Game License                       │
│ └─ ✓ Character References               │
│                                          │
│ Payment Status                           │
│ └─ ✓ PAID - GHS 450.00                  │
│                                          │
│ ─────────────────────────────────        │
│                                          │
│ ☐ I declare all information is true     │
│ ☐ I agree to Terms & Conditions         │
│                                          │
│ [Back] [Submit Application]             │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
// Submit application (changes status from DRAFT to SUBMITTED)
POST /applications/app_xyz789/submit
or
PATCH /applications/app_xyz789
Body: {
  "status": "SUBMITTED",
  "submittedAt": "2025-12-31T10:30:00Z"
}

Response:
{
  "success": true,
  "application": {
    "applicationId": "app_xyz789",
    "trackingId": "NFL-2025-001234",
    "status": "SUBMITTED",
    "submittedAt": "2025-12-31T10:30:00Z",
    "estimatedCompletionDate": "2026-01-21"
  }
}
```

**Backend Actions:**
- Change application status to SUBMITTED
- Assign to regional police queue
- Send email confirmation
- Send SMS confirmation
- Create notification record

---

### Stage 5: Confirmation & Notifications

**Route:** `/applications/submitted`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ ✅ Application Submitted Successfully!   │
│                                          │
│ Your application has been received       │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ Tracking ID: NFL-2025-001234       │  │
│ │ Application: app_xyz789            │  │
│ │ Submitted: Dec 31, 2025            │  │
│ │ Est. Completion: Jan 21, 2026      │  │
│ │                                    │  │
│ │ [📋 Copy Tracking ID]              │  │
│ └────────────────────────────────────┘  │
│                                          │
│ What Happens Next?                       │
│                                          │
│ ✓ Week 1: Document verification         │
│ ⏳ Week 2: Background check             │
│ ⏳ Week 3: Home visit & interview        │
│ ⏳ Week 4: Police HQ review             │
│ ⏳ Week 5: License issuance             │
│                                          │
│ You'll receive SMS/Email updates         │
│                                          │
│ [Go to Dashboard] [Track Application]   │
└──────────────────────────────────────────┘
```

**Notifications Sent:**

**Email:**
```
Subject: Application Received - NFL-2025-001234

Dear Kwame Mensah,

Your firearm license application has been successfully submitted.

Tracking ID: NFL-2025-001234
Application Type: New Rifle License
Submitted: December 31, 2025

Estimated processing time: 21 working days

You can track your application status at:
https://nfltms.gov.gh/applications/NFL-2025-001234

Next Steps:
1. Document verification (1 week)
2. Background check (1 week)
3. Home visit (scheduled separately)
4. Police HQ review (1 week)

You will receive SMS and email notifications at each stage.

Ghana Police Service
Arms & Ammunition Unit
```

**SMS:**
```
NFLTMS: Your firearm license application NFL-2025-001234 
has been submitted. Track at nfltms.gov.gh or call 0302773906.
```

---

### Stage 6: Police Processing (Backend Workflow)

This stage happens in the **Admin Dashboard** - users can only track status.

#### Week 1: Regional Police Review

**Police Dashboard View:**
```
Route: /admin/applications (Police login)

New Application Queue:
┌────────────────────────────────────────────────┐
│ NFL-2025-001234                                │
│ Kwame Mensah | Rifle License                   │
│ Submitted: Dec 31, 2025                        │
│ Status: SUBMITTED                              │
│ Region: Greater Accra                          │
│                                                │
│ [Review Application]                           │
└────────────────────────────────────────────────┘
```

**Officer Actions:**
```javascript
// Assign to officer
PATCH /applications/app_xyz789
Body: {
  "status": "UNDER_REVIEW",
  "assignedOfficerId": "officer_123",
  "assignedAt": "2026-01-02T09:00:00Z"
}

// Officer reviews documents
GET /applications/app_xyz789
GET /uploads/licence/app_xyz789/documents

// Add review notes
POST /applications/app_xyz789/notes
Body: {
  "note": "All documents present. Medical cert verified with hospital. 
          Proceeding to background check.",
  "isInternal": true
}

// Update status
PATCH /applications/app_xyz789
Body: {
  "status": "DOCUMENTS_VERIFIED",
  "documentsVerifiedAt": "2026-01-05T14:00:00Z"
}
```

**User Notification:**
```
Email: "Your application is under review"
SMS: "NFL-2025-001234: Documents verified. Background check in progress."
```

---

#### Week 2: Background Check & Home Visit Scheduling

**API Calls:**
```javascript
// Background check (automated or manual)
POST /admin/background-checks
Body: {
  "applicationId": "app_xyz789",
  "ghanaCardNumber": "GHA-123456789-1",
  "checkTypes": ["CRIMINAL_RECORD", "EMPLOYMENT", "REFERENCES"]
}

Response:
{
  "checkId": "bgcheck_456",
  "status": "COMPLETE",
  "results": {
    "criminalRecord": "CLEAR",
    "employment": "VERIFIED",
    "references": "VERIFIED"
  },
  "completedAt": "2026-01-08T10:00:00Z"
}

// Schedule home visit
POST /admin/site-visits/schedule
Body: {
  "applicationId": "app_xyz789",
  "scheduledDate": "2026-01-12",
  "scheduledTime": "10:00",
  "officerId": "officer_123",
  "applicantPhone": "0244123456"
}

Response:
{
  "visitId": "visit_789",
  "scheduledAt": "2026-01-12T10:00:00Z"
}
```

**User Notification:**
```
SMS: "NFL-2025-001234: Home visit scheduled for Jan 12, 2026 
at 10:00 AM. Officer will inspect storage facility."

Email with details and what to prepare
```

---

#### Week 3: Home Visit Conducted

**Officer Mobile/Tablet Interface:**
```
Site Visit Checklist - NFL-2025-001234

Applicant: Kwame Mensah
Address: GA-123-4567, Accra

☐ Verify physical address
☐ Inspect storage facility
  ☐ Gun safe present
  ☐ Adequate security
  ☐ Proper location
☐ Interview applicant
  ☐ Knowledge of firearm safety
  ☐ Reason for ownership
☐ Check neighborhood
☐ Take photos

Recommendation:
○ Approve
○ Reject
○ Request more info

[Upload Photos] [Submit Report]
```

**API Call:**
```javascript
POST /admin/site-visits/visit_789/report
Content-Type: multipart/form-data

FormData: {
  "storageAdequate": true,
  "securityAdequate": true,
  "applicantKnowledgeable": true,
  "neighborhoodCheck": "CLEAR",
  "photos": [file1, file2, file3],
  "recommendation": "APPROVE",
  "notes": "Storage facility meets requirements. Applicant 
           demonstrated good knowledge of firearm safety. 
           Recommend approval.",
  "visitedAt": "2026-01-12T10:30:00Z"
}

Response:
{
  "reportId": "report_999",
  "recommendation": "APPROVE"
}

// Update application
PATCH /applications/app_xyz789
Body: {
  "status": "SITE_VISIT_COMPLETE",
  "siteVisitReportId": "report_999",
  "regionalRecommendation": "APPROVE"
}
```

**User Notification:**
```
SMS: "NFL-2025-001234: Site visit completed. 
Application forwarded to Police HQ for final review."
```

---

#### Week 4: Police HQ Final Review

**HQ Director Dashboard:**
```javascript
// Applications ready for HQ review
GET /applications?status=SITE_VISIT_COMPLETE&region=GREATER_ACCRA

// Director reviews
GET /applications/app_xyz789
GET /admin/site-visits/visit_789/report
GET /admin/background-checks/bgcheck_456

// Final decision
POST /applications/app_xyz789/approve
Body: {
  "approvalNotes": "All requirements met. Background check clear. 
                    Site visit satisfactory. Approved for 3-year license.",
  "approvedBy": "director_001",
  "approvedAt": "2026-01-18T15:00:00Z",
  "licenceValidityYears": 3
}

Response:
{
  "success": true,
  "licenceNumber": "NFL-2026-001234",
  "validFrom": "2026-01-19",
  "validUntil": "2029-01-19"
}
```

---

### Stage 7: License Issuance

**Backend Auto-Process:**
```javascript
// System automatically creates license
POST /licences/issue
Body: {
  "applicationId": "app_xyz789",
  "userId": "usr_abc123",
  "licenceNumber": "NFL-2026-001234",
  "firearmType": "RIFLE",
  "validFrom": "2026-01-19",
  "validUntil": "2029-01-19",
  "status": "ACTIVE"
}

Response:
{
  "licenceId": "lic_xyz999",
  "licenceNumber": "NFL-2026-001234",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "pdfUrl": "/licences/NFL-2026-001234/download",
  "digitalCardUrl": "/licences/NFL-2026-001234/card"
}

// Update application status
PATCH /applications/app_xyz789
Body: {
  "status": "APPROVED",
  "licenceId": "lic_xyz999"
}
```

**User Notifications:**

**Email:**
```
Subject: 🎉 Your Firearm License is Approved!

Dear Kwame Mensah,

Congratulations! Your firearm license has been approved.

License Number: NFL-2026-001234
Type: Rifle License
Valid From: January 19, 2026
Valid Until: January 19, 2029

Your digital license is now available:
- Download PDF: [Link]
- View Digital Card: [Link]

Next Steps:
1. Download your license
2. You can now purchase a rifle from licensed dealers
3. Register your firearm within 7 days of purchase

Visit your dashboard: https://nfltms.gov.gh/dashboard

Ghana Police Service
Arms & Ammunition Unit
```

**SMS:**
```
NFLTMS: Congratulations! Your firearm license NFL-2026-001234 
is approved. Download at nfltms.gov.gh/dashboard
```

---

### Stage 8: User Dashboard - License Active

**Route:** `/dashboard`

**UI Screen:**
```
┌──────────────────────────────────────────────────┐
│ Dashboard - Kwame Mensah                         │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ 🎉 Your License is Ready!                  │  │
│ │                                            │  │
│ │ License: NFL-2026-001234                   │  │
│ │ Type: Rifle License                        │  │
│ │ Status: ✅ ACTIVE                          │  │
│ │ Valid: Jan 19, 2026 - Jan 19, 2029         │  │
│ │                                            │  │
│ │ [📄 Download PDF] [📱 View Digital Card]   │  │
│ │ [🖨️ Print] [📧 Email Copy]                 │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Next Steps:                                      │
│ ┌────────────────────────────────────────────┐  │
│ │ 📋 Permit to Purchase                      │  │
│ │    Ready to buy your firearm               │  │
│ │    Valid for 90 days                       │  │
│ │    Show this to licensed dealers           │  │
│ │                                            │  │
│ │    [Download Permit]                       │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Quick Actions:                                   │
│ [🔫 Find Licensed Dealers]                      │
│ [📋 Register Firearm After Purchase]            │
│ [📖 View Safety Guidelines]                     │
└──────────────────────────────────────────────────┘
```

**API Calls:**
```javascript
// Get user dashboard
GET /dashboard

Response:
{
  "summary": {
    "activeLicenses": 1,
    "pendingApplications": 0,
    "expiringSoon": 0,
    "totalFirearms": 0
  },
  "licenses": [
    {
      "licenceId": "lic_xyz999",
      "licenceNumber": "NFL-2026-001234",
      "firearmType": "RIFLE",
      "status": "ACTIVE",
      "validFrom": "2026-01-19",
      "validUntil": "2029-01-19",
      "daysUntilExpiry": 1095,
      "pdfUrl": "/licences/NFL-2026-001234/download",
      "qrCodeUrl": "/licences/NFL-2026-001234/qrcode"
    }
  ],
  "firearms": [],
  "recentApplications": [
    {
      "applicationId": "app_xyz789",
      "trackingId": "NFL-2025-001234",
      "type": "NEW",
      "status": "APPROVED",
      "submittedAt": "2025-12-31",
      "completedAt": "2026-01-19"
    }
  ]
}

// Download license PDF
GET /licences/NFL-2026-001234/download

Response: Binary PDF file
```

---

### Stage 9: Firearm Acquisition & Registration

#### Sub-stage 9.1: Purchase from Dealer

**User Journey:**
1. User visits licensed dealer with phone/printed license
2. Shows QR code or license number
3. Dealer scans/verifies
4. Completes purchase
5. User registers firearm within 7 days

**Dealer-Side Verification:**
```javascript
// Dealer scans QR code or enters license number
GET /licences/validate-buyer?licenceNumber=NFL-2026-001234

Response:
{
  "valid": true,
  "licenceNumber": "NFL-2026-001234",
  "ownerName": "Kwame Mensah",
  "ghanaCardNumber": "GHA-123456789-1",
  "licenceType": "RIFLE",
  "status": "ACTIVE",
  "expiryDate": "2029-01-19",
  "canPurchase": true,
  "restrictions": [],
  "existingFirearms": 0
}

// If invalid/expired:
Response (400):
{
  "valid": false,
  "reason": "LICENSE_EXPIRED",
  "message": "This license expired on 2025-12-31"
}
```

**Dealer Processes Sale:**
```javascript
// See Dealer Flow section for complete sale process
POST /firearms/{firearmId}/transfer
Body: {
  "firearmId": "firearm_SN12345",
  "newOwnerId": "usr_abc123",
  "salePrice": 5000,
  "transferFee": 50,
  "paymentMethod": "CASH"
}
```

---

#### Sub-stage 9.2: Register Acquired Firearm

**Route:** `/firearms/register-acquired`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Register Your Firearm                    │
│                                          │
│ ⚠️ Register within 7 days of purchase   │
│                                          │
│ Firearm Serial Number:                   │
│ [SN-123456789]                          │
│                                          │
│ Date of Purchase:                        │
│ [Jan 25, 2026 📅]                       │
│                                          │
│ Dealer:                                  │
│ [SafeArms Ghana Ltd ▼]                  │
│                                          │
│ Purchase Receipt/Invoice:                │
│ [📄 Upload Receipt]                     │
│ ✓ receipt.pdf                           │
│                                          │
│ Your License:                            │
│ NFL-2026-001234 (Rifle) ✓               │
│                                          │
│ [Submit for Verification]               │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
POST /firearms/register
Body: {
  "licenceId": "lic_xyz999",
  "serialNumber": "SN-123456789",
  "purchaseDate": "2026-01-25",
  "dealerId": "dealer_123",
  "receiptUrl": "/uploads/receipts/receipt_001.pdf"
}

Response:
{
  "firearmId": "firearm_001",
  "serialNumber": "SN-123456789",
  "status": "PENDING_VERIFICATION",
  "message": "Please bring firearm to police station for physical verification"
}
```

**User must visit police station for final verification.**

---

### Stage 10: Ongoing Compliance & Renewal

#### Renewal Reminders (Automated)

**90 Days Before Expiry:**
```
Email Subject: License Renewal Reminder

Your firearm license NFL-2026-001234 expires in 3 months 
(January 19, 2029).

Renew online now to avoid penalties:
https://nfltms.gov.gh/licences/NFL-2026-001234/renew

SMS: "NFLTMS: License NFL-2026-001234 expires in 3 months. 
Renew at nfltms.gov.gh to avoid penalties."
```

**30 Days Before:**
```
Urgent reminder with increased urgency
```

**After Expiry:**
```
"Your license has expired. Late renewal penalties apply."
```

#### Renewal Process

**Route:** `/licences/{licenceId}/renew`

**API Call:**
```javascript
POST /licences/lic_xyz999/renew
Body: {
  "medicalCertificateUrl": "/uploads/docs/medical_2029.pdf",
  "storageStillSecure": true,
  "addressUnchanged": true
}

Response:
{
  "renewalApplicationId": "renewal_001",
  "status": "PENDING_APPROVAL",
  "fee": 200,
  "estimatedApproval": "3-5 days"
}
```

**Simplified renewal** - only requires:
- Updated medical certificate (if >2 years old)
- Payment of GHS 200
- Confirmation of address/storage
- Quick police verification (no home visit unless flagged)

---

## 5. Dealer Registration & Operations Flow {#dealer-flow}

### Stage 1: Pre-Qualification Check

**Entry Point:** Landing page → "Licensed Dealer" card

**Route:** `/dealer/pre-check`

**UI Screen:**
```
┌──────────────────────────────────────────────────┐
│ Dealer Registration Requirements                 │
│                                                  │
│ Before applying, you must have:                  │
│                                                  │
│ ✓ Personal firearm owner license (active)       │
│ ✓ Registered business in Ghana                  │
│ ✓ Tax Identification Number (TIN)               │
│ ✓ Physical shop or warehouse                    │
│ ✓ Minimum capital: GHS 50,000                   │
│ ✓ Insurance policy (min GHS 500,000)            │
│ ✓ Secure storage facility (vault/safe)          │
│                                                  │
│ Application Fee: GHS 2,000                       │
│ Annual License Fee: GHS 5,000                    │
│ Processing Time: 45-60 days                      │
│                                                  │
│ Do you meet all requirements?                    │
│                                                  │
│ ○ Yes, proceed to registration                  │
│ ○ No, I need gun owner license first            │
│ ○ No, still preparing                           │
│                                                  │
│ [Continue]                                      │
└──────────────────────────────────────────────────┘
```

**Logic:**
```javascript
if (selection === "need_license_first") {
  redirect("/applications/new");
} else if (selection === "yes") {
  // Check if user has active gun owner license
  GET /users/me
  
  if (!user.hasActiveLicense) {
    showModal("You must have an active gun owner license first");
    redirect("/applications/new");
  } else {
    redirect("/dealer/register");
  }
}
```

---

### Stage 2: Account Creation

If user doesn't have account, goes through **same KYC flow** as individual (Stage 2 above).

After KYC, on User Type Selection page, selects "Register as Dealer".

---

### Stage 3: Dealer Registration - Multi-Step Form

**Route:** `/dealer/register`

This is a **6-step wizard**.

#### Step 3.1: Business Information

**Progress:** `[●]─────────── Step 1 of 6`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Business Information                     │
│                                          │
│ Company Name:                            │
│ [SafeArms Ghana Limited]                │
│                                          │
│ Business Registration Number:            │
│ [BN-123456789]                          │
│                                          │
│ Tax Identification Number (TIN):         │
│ [TIN-987654321]                         │
│                                          │
│ Year Established:                        │
│ [2020 ▼]                                │
│                                          │
│ Business Type:                           │
│ ● Retail Dealer                         │
│ ○ Importer                              │
│ ○ Both Dealer & Importer                │
│                                          │
│ Estimated Annual Sales:                  │
│ ○ 1-50 firearms                         │
│ ● 51-200 firearms                       │
│ ○ 200+ firearms                         │
│                                          │
│ [Next]                                  │
└──────────────────────────────────────────┘
```

**API Call:**
```javascript
POST /dealers/register
Body: {
  "companyName": "SafeArms Ghana Limited",
  "businessRegNumber": "BN-123456789",
  "tin": "TIN-987654321",
  "yearEstablished": 2020,
  "dealerType": "RETAIL",
  "estimatedAnnualSales": "51-200",
  "status": "DRAFT"
}

Response:
{
  "dealerId": "dealer_123",
  "status": "DRAFT"
}
```

---

#### Step 3.2: Directors/Owners

**Progress:** `[●●]────────── Step 2 of 6`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Company Directors                        │
│                                          │
│ Director 1 (Primary - You):             │
│ Name: Kwame Mensah                       │
│ Ghana Card: GHA-123456789-1              │
│ License: NFL-2026-001234 ✓              │
│ Ownership: 60%                           │
│                                          │
│ Director 2:                              │
│ Ghana Card Number:                       │
│ [GHA-987654321-5]                       │
│ [Verify Director]                       │
│                                          │
│ ✓ Verified: Ama Owusu                   │
│   License: NFL-2024-005678 ✓            │
│   Ownership: 40%                         │
│                                          │
│ [+ Add Another Director]                │
│                                          │
│ Note: All directors must have active     │
│ firearm licenses                         │
│                                          │
│ [Back] [Next]                           │
└──────────────────────────────────────────┘
```

**API Calls:**
```javascript
// Verify additional director
POST /dealers/verify-director
Body: {
  "ghanaCardNumber": "GHA-987654321-5"
}

Response:
{
  "verified": true,
  "name": "Ama Owusu",
  "hasActiveLicense": true,
  "licenseNumber": "NFL-2024-005678"
}

// Add director to dealer
PATCH /dealers/dealer_123
Body: {
  "directors": [
    {
      "userId": "usr_abc123", // Kwame (primary)
      "ghanaCardNumber": "GHA-123456789-1",
      "ownership": 60
    },
    {
      "ghanaCardNumber": "GHA-987654321-5",
      "name": "Ama Owusu",
      "ownership": 40
    }
  ]
}
```

---

#### Step 3.3: Business Location & Facilities

**Progress:** `[●●●]───────── Step 3 of 6`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Physical Location                        │
│                                          │
│ Shop/Warehouse Address:                  │
│ [123 Liberation Road, Osu]              │
│                                          │
│ GPS Coordinates:                         │
│ [GA-456-7890]                           │
│ [📍 Get Current Location]               │
│                                          │
│ Region: [Greater Accra ▼]               │
│ District: [Accra Metropolis ▼]          │
│                                          │
│ Property Status:                         │
│ ● Owned                                 │
│ ○ Rented (3+ year lease)                │
│                                          │
│ Upload Facility Photos:                  │
│                                          │
│ 1. Exterior View (Required)             │
│    [Upload] ✓ 2 photos uploaded         │
│                                          │
│ 2. Interior/Display (Required)           │
│    [Upload] ✓ 3 photos uploaded         │
│                                          │
│ 3. Storage Vault (Required)              │
│    [Upload] ✓ 2 photos uploaded         │
│                                          │
│ [Back] [Next]                           │
└──────────────────────────────────────────┘
```

**API Calls:**
```javascript
// Upload each photo
POST /uploads/dealer/dealer_123/documents
FormData: {
  file: <binary>,
  documentType: "EXTERIOR_PHOTO"
}

// Update dealer info
PATCH /dealers/dealer_123
Body: {
  "location": {
    "address": "123 Liberation Road, Osu",
    "gpsCoordinates": "GA-456-7890",
    "regionId": "region_1",
    "districtId": "dist_1",
    "propertyStatus": "OWNED"
  }
}
```

---

#### Step 3.4: Security & Safety

**Progress:** `[●●●●]──────── Step 4 of 6`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Security Systems                         │
│                                          │
│ ☑ CCTV Cameras                          │
│   Number of cameras: [8]                │
│   Recording retention: [30 days ▼]      │
│   Provider: [SecureWatch Ghana]         │
│                                          │
│ ☑ Alarm System                          │
│   Provider: [SecureWatch Ghana]         │
│   Monitoring: ● 24/7 ○ Business hours  │
│                                          │
│ ☑ Vault/Gun Safe                        │
│   Type: ● Commercial vault             │
│   Capacity: [200 firearms]              │
│   Fire-rated: ☑ Yes                    │
│                                          │
│ ☑ Armed Security Guards                │
│   Number: [2]                           │
│   Upload guard licenses: [Upload]       │
│                                          │
│ Fire Safety Certificate:                 │
│ [Upload] ✓ fire_cert.pdf                │
│                                          │
│ [Back] [Next]                           │
└──────────────────────────────────────────┘
```

---

#### Step 3.5: Financial & Insurance

**Progress:** `[●●●●●]─────── Step 5 of 6`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Financial Information                    │
│                                          │
│ Bank Account:                            │
│ Bank: [Ecobank Ghana ▼]                 │
│ Account: [1234567890]                   │
│ Name: [SafeArms Ghana Ltd]              │
│                                          │
│ Proof of Capital (min GHS 50,000):      │
│ [Upload] ✓ bank_statement.pdf           │
│                                          │
│ Insurance Policy:                        │
│ Provider: [Enterprise Insurance]         │
│ Policy Number: [POL-2025-456]           │
│ Coverage: [GHS 750,000]                 │
│ Valid Until: [Dec 31, 2026]             │
│ [Upload] ✓ insurance_policy.pdf         │
│                                          │
│ Business Operating License:              │
│ [Upload] ✓ business_license.pdf         │
│                                          │
│ [Back] [Next]                           │
└──────────────────────────────────────────┘
```

---

#### Step 3.6: Review & Submit

**Progress:** `[●●●●●●]────── Step 6 of 6`

**UI Screen:**
```
┌──────────────────────────────────────────┐
│ Review Dealer Application                │
│                                          │
│ Business Info                ✏️ Edit    │
│ SafeArms Ghana Ltd                       │
│ BN-123456789 | TIN-987654321            │
│                                          │
│ Directors                    ✏️ Edit    │
│ Kwame Mensah (60%)                       │
│ Ama Owusu (40%)                          │
│                                          │
│ Location                     ✏️ Edit    │
│ 123 Liberation Rd, Osu, Accra           │
│                                          │
│ Documents Uploaded           ✏️ Edit    │
│ ✓ All required documents (15 files)     │
│                                          │
│ Fees:                                    │
│ Application Fee: GHS 2,000               │
│ First Year License: GHS 5,000            │
│ Total: GHS 7,000                         │
│                                          │
│ [Pay & Submit Application]              │
└──────────────────────────────────────────┘
```

**API Calls:**
```javascript
// Pay fees
POST /payments/initiate
Body: {
  "dealerId": "dealer_123",
  "amount": 7000,
  "description": "Dealer application and first year license"
}

// Submit application
POST /dealers/dealer_123/submit
or
PATCH /dealers/dealer_123
Body: {
  "status": "PENDING_INSPECTION"
}

Response:
{
  "dealerId": "dealer_123",
  "applicationRef": "DLR-APP-2026-001",
  "status": "PENDING_INSPECTION",
  "estimatedApproval": "45-60 days"
}
```

---

### Stage 4: Police & Ministry Processing

#### Week 1-2: Document Verification

**Police Admin API:**
```javascript
GET /dealers/admin/pending

// Review dealer application
GET /dealers/dealer_123
GET /uploads/dealer/dealer_123/documents

// Verify documents
PATCH /dealers/dealer_123
Body: {
  "status": "DOCUMENTS_VERIFIED",
  "verificationNotes": "All documents verified"
}
```

---

#### Week 3-4: Physical Inspection

**API:**
```javascript
// Schedule inspection
POST /admin/dealer-inspections/schedule
Body: {
  "dealerId": "dealer_123",
  "inspectionDate": "2026-02-15",
  "inspectors": ["officer_456", "fire_officer_789"]
}

// After inspection
POST /admin/dealer-inspections/{inspectionId}/report
FormData: {
  "vaultAdequate": true,
  "securityAdequate": true,
  "fireCompliant": true,
  "photos": [files],
  "recommendation": "APPROVE",
  "notes": "Facility meets all requirements"
}
```

**Notification:**
```
SMS to Dealer: "Inspection scheduled for Feb 15, 2026"
```

---

#### Week 5-6: Ministry Approval

**API:**
```javascript
// Forward to Ministry
PATCH /dealers/dealer_123
Body: {
  "status": "FORWARDED_TO_MINISTRY",
  "policeRecommendation": "APPROVE"
}

// Ministry approves
POST /dealers/dealer_123/approve
Body: {
  "approvalDate": "2026-03-01",
  "licenceNumber": "DLR-2026-001",
  "validUntil": "2029-03-01"
}

// System issues license
POST /dealers/dealer_123/issue-licence
Response: {
  "licenceId": "dlr_lic_001",
  "licenceNumber": "DLR-2026-001",
  "qrCode": "...",
  "pdfUrl": "..."
}
```

**Notification:**
```
Email: "🎉 Dealer License Approved - DLR-2026-001"
SMS: "Your dealer license is ready. Login to download."
```

---

### Stage 5: Dealer Operations

#### Dashboard

**Route:** `/dealer/dashboard`

**API:**
```javascript
GET /dealers/me

Response:
{
  "dealerId": "dealer_123",
  "companyName": "SafeArms Ghana Ltd",
  "licenceNumber": "DLR-2026-001",
  "status": "ACTIVE",
  "validUntil": "2029-03-01",
  "inventory": {
    "total": 87,
    "pistols": 45,
    "rifles": 30,
    "shotguns": 12
  },
  "sales": {
    "thisMonth": 23,
    "revenue": 456800
  }
}
```

---

#### Import Firearms

**Route:** `/dealer/import/new`

**API:**
```javascript
POST /dealers/import/register
Body: {
  "dealerId": "dealer_123",
  "invoiceNumber": "INV-2026-12345",
  "cifValue": 375000,
  "firearms": [
    {
      "make": "Smith & Wesson",
      "model": "M&P15",
      "caliber": "5.56mm",
      "quantity": 10,
      "unitPrice": 1200
    }
  ]
}

Response:
{
  "importId": "import_001",
  "importFee": 8100,
  "status": "PENDING_PAYMENT"
}

// After payment
POST /firearms/bulk-register
Body: {
  "dealerId": "dealer_123",
  "importId": "import_001",
  "firearms": [...]
}

Response:
{
  "firearms": [
    { "firearmId": "firearm_001", "serialNumber": "SN-001" },
    { "firearmId": "firearm_002", "serialNumber": "SN-002" },
    ...
  ]
}
```

---

#### Process Sale

**Route:** `/dealer/sales/new`

**API Flow:**
```javascript
// 1. Verify buyer license
GET /licences/validate-buyer?licenceNumber=NFL-2026-001234

Response:
{
  "valid": true,
  "ownerName": "Kwame Mensah",
  "licenceType": "RIFLE",
  "canPurchase": true
}

// 2. Process transfer
POST /firearms/firearm_SN001/transfer
Body: {
  "firearmId": "firearm_SN001",
  "newOwnerId": "usr_abc123",
  "salePrice": 18000,
  "transferFee": 50,
  "paymentMethod": "CASH"
}

Response:
{
  "transferId": "transfer_001",
  "status": "COMPLETE",
  "receiptUrl": "/receipts/REC-2026-001.pdf"
}

// System automatically:
// - Updates firearm ownership
// - Updates dealer inventory
// - Notifies police
// - Emails buyer
```

---

#### Monthly Reporting

**Route:** `/dealer/reports/monthly`

**API:**
```javascript
// Auto-generate monthly report
GET /dealers/reports/monthly?month=2026-03

Response:
{
  "month": "2026-03",
  "openingInventory": 75,
  "imports": 25,
  "sales": 23,
  "closingInventory": 77,
  "revenue": 456800,
  "reportPdfUrl": "/dealers/reports/2026-03.pdf"
}

// Submit to police
POST /dealers/reports/submit
Body: {
  "dealerId": "dealer_123",
  "month": "2026-03",
  "reportUrl": "/dealers/reports/2026-03.pdf"
}
```

---

## 6. API Integration Requirements {#api-requirements}

### 6.1 Third-Party Integrations

| Integration | Purpose | Endpoints |
|-------------|---------|-----------|
| **Ghana Card (NIA)** | Identity verification | Via Smile ID webhook |
| **Smile ID** | Biometric verification | Widget + webhook |
| **Mobile Money** | Payments | MTN, Vodafone, AirtelTigo APIs |
| **SMS Gateway** | Notifications | Hubtel or Africa's Talking |
| **Email Service** | Notifications | SendGrid or AWS SES |

### 6.2 Internal APIs

All backend endpoints are documented in the existing API specification at:
`https://national-firearm-licensing-tracking.onrender.com/api/v1`

**Key endpoint categories:**
- `/kyc/*` - KYC and onboarding
- `/auth/*` - Authentication
- `/applications/*` - License applications
- `/licences/*` - License management
- `/firearms/*` - Firearm registry
- `/dealers/*` - Dealer operations
- `/payments/*` - Payment processing
- `/uploads/*` - Document management
- `/admin/*` - Police/admin operations
- `/reports/*` - Reporting

### 6.3 Webhook Endpoints (Backend Receives)

```javascript
// Smile ID verification result
POST /webhooks/smile-id
Headers: { "X-Signature": "..." }
Body: { userId, verified, ghanaCardData }

// Payment confirmation
POST /payments/webhook/vodafone
POST /payments/webhook/mtn
POST /payments/webhook/airtel
Body: { paymentId, status, transactionId }
```

---

## 7. State Management & Data Flow {#state-management}

### 7.1 Redux Store Structure

```typescript
{
  auth: {
    isAuthenticated: boolean,
    user: User | null,
    tokens: { access: string, refresh: string }
  },
  
  kyc: {
    sessionId: string | null,
    currentStep: string,
    ghanaCardData: object | null
  },
  
  application: {
    currentApplicationId: string | null,
    draftData: object | null,
    currentStep: number,
    uploadedDocuments: Document[]
  },
  
  dealer: {
    dealerId: string | null,
    inventory: Firearm[],
    sales: Sale[]
  },
  
  ui: {
    loading: boolean,
    notifications: Notification[]
  }
}
```

### 7.2 Session Storage (Temporary)

```javascript
sessionStorage:
- userIntent: "INDIVIDUAL_LICENSE" | "DEALER" | "RENEWAL"
- kycProgress: { step, sessionId }
- applicationDraft: { step, data }
```

### 7.3 LocalStorage (Persistent)

```javascript
localStorage:
- accessToken: string
- refreshToken: string
- user: User object (serialized)
```

---

## 8. Key Differences: Individual vs Dealer {#comparison}

| Aspect | Individual | Dealer |
|--------|-----------|--------|
| **Prerequisites** | None | Active gun owner license |
| **Application Fee** | GHS 400-500 | GHS 2,000 + GHS 5,000 |
| **Processing Time** | 21 days | 45-60 days |
| **Approval Authority** | Police HQ | Ministry of Interior |
| **Physical Inspection** | Home visit | Full facility inspection |
| **License Validity** | 3 years | 3 years |
| **Renewal Fee** | GHS 200 | GHS 5,000 |
| **Can Sell Firearms** | No | Yes |
| **Can Import** | No | Yes |
| **Ongoing Obligations** | Annual inspection | Monthly reports |
| **Document Count** | ~8 documents | ~15 documents |

---

## 9. Appendices {#appendices}

### Appendix A: Fee Structure

| Service | Fee (GHS) |
|---------|-----------|
| New Pistol License | 500 |
| New Rifle License | 400 |
| New Shotgun License | 350 |
| License Renewal | 200 |
| Late Penalty (1-6 months) | 50 |
| Late Penalty (6-12 months) | 150 |
| Dealer Application | 2,000 |
| Dealer Annual License | 5,000 |
| Import Registration Fee | 2% of CIF value |
| Per Firearm Import Fee | 20 |
| Transfer Fee | 50 |

### Appendix B: Processing Timeline

**Individual License Application:**
- Week 1: Document verification
- Week 2: Background check
- Week 3: Home visit
- Week 4: HQ review & approval
- Total: 21-28 days

**Dealer Registration:**
- Week 1-2: Document verification
- Week 3-4: Facility inspection
- Week 5-6: Ministry review
- Week 7-8: License issuance
- Total: 45-60 days

### Appendix C: Document Requirements Summary

**Individual License:**
1. Ghana Card (verified via Smile ID)
2. Medical Certificate
3. Police Clearance
4. Proof of Address
5. Passport Photos
6. Storage Photos
7. Character References (2)
8. Game License (hunters) OR Shooting Club Membership

**Dealer Registration:**
- All individual requirements PLUS:
9. Business Registration Certificate
10. TIN Certificate
11. Property Documents
12. Facility Photos (exterior, interior, vault)
13. Security System Documentation
14. Fire Safety Certificate
15. Insurance Policy
16. Bank Statements
17. Directors' Licenses

### Appendix D: Status Flow

**Application Statuses:**
```
DRAFT → SUBMITTED → UNDER_REVIEW → DOCUMENTS_VERIFIED 
→ SITE_VISIT_SCHEDULED → SITE_VISIT_COMPLETE 
→ APPROVED / REJECTED
```

**License Statuses:**
```
ACTIVE → EXPIRING_SOON (90 days) → EXPIRED 
→ REVOKED / SUSPENDED
```

**Firearm Statuses:**
```
IN_DEALER_INVENTORY → SOLD → REGISTERED → ACTIVE 
→ LOST / STOLEN / SEIZED / DESTROYED
```

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 31, 2025 | Development Team | Initial documentation |

**Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Lead Developer | | | |
| Product Owner | | | |

---

## 10. Police/Admin Dashboard Workflows {#admin-workflows}

### 10.1 Admin Dashboard Overview

**Route:** `/admin/dashboard`

**API Call:**
```javascript
GET /admin/dashboard

Response:
{
  "summary": {
    "pendingApplications": 45,
    "approvedToday": 12,
    "rejectedToday": 3,
    "expiringLicenses": 120,
    "totalFirearms": 15420,
    "activeDealers": 45
  },
  "recentApplications": [...],
  "alerts": [
    {
      "type": "WARNING",
      "message": "120 licenses expiring in next 30 days"
    }
  ]
}
```

**Dashboard Sections:**
1. **Statistics Cards** - Pending, approved, rejected counts
2. **Applications Queue** - Sorted by submission date
3. **Expiring Licenses** - Alert dashboard
4. **Recent Activity** - Timeline of actions
5. **Quick Actions** - Bulk operations, reports

---

### 10.2 Application Review Workflow

**Route:** `/admin/applications/{id}/review`

**Step-by-Step Process:**

#### Stage 1: Initial Review (Regional Officer)

**Actions Available:**
```javascript
// View application
GET /admin/licences/applications/{id}

Response:
{
  "applicationId": "app_xyz789",
  "applicant": {
    "name": "Kwame Mensah",
    "ghanaCard": "GHA-123456789-1",
    "phone": "0244123456"
  },
  "firearm": {
    "type": "RIFLE",
    "make": "Remington",
    "model": "Model 700"
  },
  "documents": [...],
  "status": "SUBMITTED",
  "submittedAt": "2025-12-31T10:30:00Z"
}

// Assign to self
PATCH /admin/licences/applications/{id}
Body: {
  "assignedOfficer": "officer_123",
  "status": "UNDER_REVIEW"
}

// Add review notes
POST /admin/licences/applications/{id}/notes
Body: {
  "note": "Documents verified. Proceeding to background check.",
  "isInternal": true
}
```

**UI Components:**
- Document viewer with zoom/download
- Applicant information panel
- Action buttons: Approve to next stage, Request more info, Reject
- Internal notes section
- Timeline of all actions

---

#### Stage 2: Schedule Home Visit

**API Call:**
```javascript
POST /admin/site-visits/schedule
Body: {
  "applicationId": "app_xyz789",
  "scheduledDate": "2026-01-10",
  "scheduledTime": "10:00",
  "officerId": "officer_123",
  "applicantPhone": "0244123456"
}

Response:
{
  "visitId": "visit_123",
  "scheduledAt": "2026-01-10T10:00:00Z",
  "smsNotificationSent": true
}
```

**Notification to Applicant:**
```
SMS: "NFLTMS: Home visit scheduled for Jan 10, 2026 at 10:00 AM. 
Officer Kofi Adjei will inspect your storage facility. 
Ensure you are available."
```

---

#### Stage 3: Conduct Site Visit (Mobile/Tablet)

**Mobile Interface Checklist:**
```javascript
// Officer submits visit report
POST /admin/site-visits/{visitId}/report
FormData: {
  "storageAdequate": true,
  "securityAdequate": true,
  "applicantKnowledgeable": true,
  "photos": [photo1, photo2, photo3],
  "recommendation": "APPROVE",
  "notes": "Storage meets requirements. Applicant demonstrated 
           good knowledge of firearm safety.",
  "gpsLocation": "5.6037,-0.1870"
}
```

---

#### Stage 4: HQ Final Review

**Director Dashboard View:**
```javascript
// Get applications ready for final review
GET /admin/licences/applications?status=SITE_VISIT_COMPLETE

// Review individual application
GET /admin/licences/applications/{id}
GET /admin/site-visits/{visitId}/report

// Make final decision
POST /admin/licences/applications/{id}/approve
Body: {
  "approvalNotes": "All requirements satisfied. Approved.",
  "licenceValidityYears": 3
}

OR

POST /admin/licences/applications/{id}/reject
Body: {
  "reason": "Storage facility does not meet security standards",
  "detailedExplanation": "..."
}
```

---

### 10.3 Firearm Search & Tracking

**Route:** `/admin/firearms/search`

**Search Capabilities:**
```javascript
GET /firearms/search?query={searchTerm}&status={status}

Search by:
- Serial number
- Owner name
- Ghana Card number
- License number
- Make/Model
- Status (REGISTERED, LOST, STOLEN, SEIZED)

Response:
{
  "firearms": [
    {
      "firearmId": "firearm_001",
      "serialNumber": "SN-123456789",
      "type": "RIFLE",
      "make": "Remington",
      "status": "REGISTERED",
      "owner": {
        "name": "Kwame Mensah",
        "ghanaCard": "GHA-123456789-1",
        "licenseNumber": "NFL-2026-001234"
      },
      "registeredDate": "2026-02-01"
    }
  ],
  "total": 1
}

// Get ownership history
GET /firearms/{id}/ownership-history

Response:
{
  "firearm": {...},
  "history": [
    {
      "ownerId": "usr_abc123",
      "ownerName": "Kwame Mensah",
      "fromDate": "2026-02-01",
      "toDate": null,
      "transferType": "PURCHASE"
    }
  ]
}
```

**UI Features:**
- Advanced filters panel
- Export to CSV/Excel
- Map view of firearm locations
- Bulk actions (flag for inspection, mark lost/stolen)

---

### 10.4 Dealer Management

**Route:** `/admin/dealers`

**Pending Dealer Applications:**
```javascript
GET /dealers/admin/pending

Response:
{
  "dealers": [
    {
      "dealerId": "dealer_123",
      "companyName": "SafeArms Ghana Ltd",
      "applicationRef": "DLR-APP-2026-001",
      "status": "PENDING_INSPECTION",
      "submittedAt": "2026-02-01",
      "documents": [...]
    }
  ]
}

// Approve dealer
POST /dealers/{id}/approve
Body: {
  "licenceNumber": "DLR-2026-001",
  "validUntil": "2029-03-01",
  "approvalNotes": "All requirements met"
}

// Reject dealer
POST /dealers/{id}/reject
Body: {
  "reason": "Inadequate security measures"
}
```

---

## 11. Notifications System {#notifications}

### 11.1 Notification Types

**Email Notifications:**
1. **Application Received** - Sent immediately after submission
2. **Application Under Review** - When officer starts review
3. **Home Visit Scheduled** - 48 hours before visit
4. **Application Approved** - With download link
5. **Application Rejected** - With reason
6. **License Expiring Soon** - 90, 60, 30 days before
7. **Payment Successful** - With receipt
8. **Dealer Sale Notification** - To police when dealer sells firearm

**SMS Notifications:**
1. **OTP Codes** - For verification
2. **Application Status Changes** - Key milestones
3. **Home Visit Reminder** - Day before visit
4. **License Expiry Alert** - 30 days before
5. **Payment Confirmation** - Transaction ID

**In-App Notifications:**
1. **Dashboard alerts** - For urgent actions
2. **Status updates** - Real-time progress
3. **System announcements** - Maintenance, new features

---

### 11.2 Email Templates

**Template: Application Received**
```
Subject: Application Received - NFL-2025-{trackingId}

Dear {fullName},

Your firearm license application has been successfully submitted.

APPLICATION DETAILS:
- Tracking ID: {trackingId}
- Application Type: {type}
- Submitted: {submittedDate}
- Estimated Completion: {estimatedDate}

NEXT STEPS:
1. Document verification (1 week)
2. Background check (1 week)
3. Home visit (will be scheduled)
4. Final review (1 week)

You can track your application at:
https://nfltms.gov.gh/applications/{trackingId}

Questions? Contact us:
Phone: 0302-773906
Email: support@nfltms.gov.gh

Ghana Police Service
Arms & Ammunition Unit
```

**Template: License Approved**
```
Subject: 🎉 License Approved - {licenseNumber}

Dear {fullName},

Congratulations! Your firearm license has been approved.

LICENSE DETAILS:
- License Number: {licenseNumber}
- Type: {firearmType}
- Valid From: {validFrom}
- Valid Until: {validUntil}

DOWNLOAD YOUR LICENSE:
{downloadLink}

NEXT STEPS:
1. Download and print your license
2. You can now purchase your firearm from licensed dealers
3. Register your firearm within 7 days of purchase

Find licensed dealers:
https://nfltms.gov.gh/dealers

Ghana Police Service
Arms & Ammunition Unit
```

---

### 11.3 Notification Preferences

**User Dashboard Settings:**
```javascript
PATCH /users/me/notifications
Body: {
  "emailNotifications": {
    "applicationUpdates": true,
    "expiryReminders": true,
    "promotions": false
  },
  "smsNotifications": {
    "criticalAlerts": true,
    "statusUpdates": true
  }
}
```

**UI Component:**
- Toggle switches for each notification type
- Save preferences button
- Test notification button

---

## 12. Mobile Application Considerations {#mobile-app}

### 12.1 Mobile App Features (Phase 4)

**React Native Architecture:**
```
NFLTMS Mobile App
├── Shared API Layer (same endpoints)
├── Offline Mode Support
│   ├── SQLite local database
│   ├── Sync queue for pending actions
│   └── Cached documents
├── Native Features
│   ├── Camera integration (document upload)
│   ├── QR code scanner (license verification)
│   ├── Push notifications (FCM)
│   ├── Biometric authentication
│   └── GPS location services
└── Platform-Specific
    ├── iOS (Swift/SwiftUI components)
    └── Android (Kotlin components)
```

---

### 12.2 QR Code License Verification

**QR Code Content:**
```json
{
  "licenseNumber": "NFL-2026-001234",
  "ownerName": "Kwame Mensah",
  "ghanaCard": "GHA-123456789-1",
  "firearmType": "RIFLE",
  "expiryDate": "2029-01-19",
  "signature": "digital_signature_hash"
}
```

**Dealer Scanning Flow:**
```javascript
// Dealer scans QR code
// App sends verification request
GET /licences/validate-buyer?licenceNumber=NFL-2026-001234

// Instant verification
Response:
{
  "valid": true,
  "status": "ACTIVE",
  "canPurchase": true
}
```

**Offline Verification:**
- QR code includes cryptographic signature
- App can verify signature locally
- Online check for real-time status

---

### 12.3 Push Notifications

**Firebase Cloud Messaging Integration:**

**Register Device:**
```javascript
POST /users/me/devices
Body: {
  "fcmToken": "firebase_token_xyz",
  "platform": "IOS",
  "deviceId": "device_123"
}
```

**Push Notification Triggers:**
1. Application status change
2. Home visit scheduled
3. License expiring soon (30 days)
4. New message from police
5. Payment required
6. License approved/rejected

**Payload Example:**
```json
{
  "notification": {
    "title": "License Approved!",
    "body": "Your firearm license NFL-2026-001234 is ready",
    "icon": "nfltms_icon"
  },
  "data": {
    "type": "LICENSE_APPROVED",
    "licenseId": "lic_xyz999",
    "action": "VIEW_LICENSE"
  }
}
```

---

## 13. Security & Compliance {#security}

### 13.1 Data Protection

**Sensitive Data Handling:**
1. **Ghana Card Numbers** - Encrypted at rest, masked in UI (show last 4 digits)
2. **Passwords** - Bcrypt hashing, never logged
3. **Documents** - Encrypted storage (S3 with AES-256)
4. **Payment Info** - Never stored, handled by payment provider
5. **Location Data** - Anonymized after 90 days

**API Security:**
- HTTPS only (TLS 1.3)
- JWT tokens with short expiry (15 min access, 7 day refresh)
- Rate limiting (100 requests/min per user)
- CORS configuration (whitelist specific domains)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)

---

### 13.2 Audit Logging

**All Actions Logged:**
```javascript
POST /admin/system/audit-logs

Logged Events:
- User login/logout
- Application submission
- Application approval/rejection
- Firearm registration
- Ownership transfer
- License renewal
- Document upload/download
- Settings changes
- Admin actions

Log Entry Format:
{
  "timestamp": "2026-01-15T10:30:00Z",
  "userId": "usr_abc123",
  "action": "APPLICATION_APPROVED",
  "entityType": "APPLICATION",
  "entityId": "app_xyz789",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "changes": {
    "status": {
      "from": "SITE_VISIT_COMPLETE",
      "to": "APPROVED"
    }
  }
}
```

**Admin View:**
```javascript
GET /admin/system/audit-logs?userId={id}&action={action}&from={date}
```

---

### 13.3 Compliance Requirements

**Ghana Data Protection Act Compliance:**
1. **User Consent** - Explicit consent for data collection
2. **Right to Access** - Users can download their data
3. **Right to Erasure** - Delete account (after license expiry)
4. **Data Portability** - Export user data in JSON/PDF
5. **Breach Notification** - Notify users within 72 hours

**Arms and Ammunition Act Compliance:**
1. **Record Retention** - 10 years minimum
2. **Police Access** - Real-time access to all records
3. **Monthly Reporting** - Automated reports to Ministry
4. **Audit Trail** - Complete history of all firearms

---

## 14. Analytics & Reporting {#analytics}

### 14.1 Admin Reports

**Available Reports:**

**1. Summary Statistics:**
```javascript
GET /reports/summary?from={date}&to={date}

Response:
{
  "period": {
    "from": "2026-01-01",
    "to": "2026-01-31"
  },
  "applications": {
    "submitted": 450,
    "approved": 320,
    "rejected": 45,
    "pending": 85,
    "approvalRate": 0.88
  },
  "licenses": {
    "active": 15420,
    "expired": 234,
    "expiringSoon": 120
  },
  "firearms": {
    "registered": 15650,
    "transfers": 23,
    "reported": {
      "lost": 5,
      "stolen": 2
    }
  },
  "dealers": {
    "active": 45,
    "sales": 123,
    "imports": 450
  },
  "revenue": {
    "applications": 180000,
    "renewals": 24000,
    "transfers": 1150,
    "total": 205150
  }
}
```

**2. Firearms by Region (CSV Export):**
```javascript
GET /reports/firearms-by-region

CSV Output:
Region,Pistols,Rifles,Shotguns,Total
Greater Accra,4500,3200,2100,9800
Ashanti,2100,1800,1500,5400
...
```

**3. Dealer Activity Report:**
```javascript
GET /reports/dealer-activity

Response:
{
  "dealers": [
    {
      "dealerId": "dealer_123",
      "companyName": "SafeArms Ghana Ltd",
      "sales": 45,
      "imports": 120,
      "revenue": 450000,
      "compliance": {
        "monthlyReports": "SUBMITTED",
        "lastInspection": "2026-01-15"
      }
    }
  ]
}
```

**4. Payment Reconciliation:**
```javascript
GET /reports/payments-reconciliation?month=2026-01

Response:
{
  "totalTransactions": 450,
  "totalAmount": 205150,
  "byMethod": {
    "MOBILE_MONEY": 150000,
    "BANK_CARD": 55150
  },
  "failed": 12,
  "refunded": 3
}
```

---

### 14.2 User Analytics

**Dashboard Analytics:**
- Most popular firearm types
- Average processing time by region
- Application approval trends
- Peak application periods
- User satisfaction ratings

**Visualization:**
- Charts: Line, bar, pie (using Recharts)
- Maps: Regional distribution (using Leaflet)
- Tables: Sortable, filterable (using MUI DataGrid)

---

## 15. Error Handling & Edge Cases {#error-handling}

### 15.1 Common Error Scenarios

**1. Payment Failures:**
```javascript
// Payment timeout
{
  "error": "PAYMENT_TIMEOUT",
  "message": "Payment was not completed within 5 minutes",
  "action": "RETRY"
}

// User Action:
- Show "Payment Failed" modal
- Offer to retry payment
- Save application as draft
- Allow user to continue later
```

**2. Document Upload Failures:**
```javascript
// File too large
{
  "error": "FILE_TOO_LARGE",
  "message": "File size exceeds 5MB limit",
  "maxSize": 5242880
}

// Corrupted file
{
  "error": "INVALID_FILE",
  "message": "File is corrupted or invalid format"
}

// User Action:
- Show error toast with specific message
- Allow user to re-upload
- Suggest compressing large files
```

**3. Session Expiry During Application:**
```javascript
// Middleware detects expired token
// Auto-save form data to localStorage
localStorage.setItem('draftApplication', JSON.stringify(formData));

// Redirect to login
navigate('/auth/login', { 
  state: { 
    returnTo: '/applications/new',
    hasDraft: true 
  } 
});

// After login, restore draft
const draft = localStorage.getItem('draftApplication');
if (draft) {
  showModal("Resume your application?");
}
```

**4. Network Errors:**
```javascript
// Offline detection
window.addEventListener('offline', () => {
  showOfflineBanner("You are offline. Changes will be saved locally.");
});

// Queue actions for later
const pendingActions = [];
pendingActions.push({ type: 'SUBMIT_APPLICATION', data: formData });

// Retry when online
window.addEventListener('online', () => {
  processPendingActions();
});
```

---

### 15.2 Validation Errors

**Frontend Validation:**
```javascript
// Ghana Card format
const ghanaCardRegex = /^GHA-\d{9}-\d$/;

// Phone number format
const phoneRegex = /^(0|\+233)[0-9]{9}$/;

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength
const passwordRequirements = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true
};
```

**Backend Validation:**
- Schema validation with Joi/Zod
- Business logic validation
- Database constraints
- Return detailed error messages

---

### 15.3 User-Friendly Error Messages

**Instead of:**
```
Error: Invalid request parameter
```

**Show:**
```
❌ Invalid Ghana Card Number
Please enter your Ghana Card number in the format: GHA-123456789-1
```

**Error Message Guidelines:**
1. **Be specific** - Tell user exactly what went wrong
2. **Be helpful** - Suggest how to fix it
3. **Be polite** - Never blame the user
4. **Be concise** - Keep it short and clear

---

## 16. Performance Optimization {#performance}

### 16.1 Frontend Optimization

**Code Splitting:**
```javascript
// Lazy load routes
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));

<Route 
  path="/admin/dashboard" 
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboard />
    </Suspense>
  }
/>
```

**Image Optimization:**
- Use WebP format
- Lazy load images below fold
- Use CDN for static assets
- Implement progressive image loading

**Bundle Optimization:**
```javascript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom'],
        'mui': ['@mui/material'],
        'redux': ['@reduxjs/toolkit', 'react-redux']
      }
    }
  }
}
```

---

### 16.2 API Optimization

**Caching Strategy:**
```javascript
// RTK Query cache configuration
getDashboard: builder.query({
  query: () => '/dashboard',
  keepUnusedDataFor: 300, // Cache for 5 minutes
  providesTags: ['Dashboard']
})
```

**Pagination:**
```javascript
GET /applications?page=1&limit=20

Response:
{
  "applications": [...],
  "pagination": {
    "total": 450,
    "page": 1,
    "limit": 20,
    "pages": 23
  }
}
```

**Debouncing Search:**
```javascript
// Custom hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage in search
const searchTerm = useDebounce(query, 500);
const { data } = useSearchFirearmsQuery(searchTerm);
```

---

### 16.3 Database Optimization

**Indexing Strategy:**
```sql
-- Backend database indexes
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_firearms_serial ON firearms(serial_number);
CREATE INDEX idx_licenses_expiry ON licenses(expiry_date);
CREATE INDEX idx_users_ghana_card ON users(ghana_card_number);
```

**Query Optimization:**
- Use select specific columns instead of SELECT *
- Implement database connection pooling
- Use read replicas for reporting
- Cache frequently accessed data (Redis)

---

## Appendix D: Troubleshooting Guide {#troubleshooting}

### Common Issues & Solutions

**Issue: "Session expired" error during application**
```
Solution:
1. Form data is auto-saved to localStorage
2. After login, user is redirected back
3. Draft is automatically restored
```

**Issue: Payment shows "pending" for too long**
```
Solution:
1. Check payment provider webhook logs
2. Manually verify payment status
3. Police can override and mark as paid
4. Refund and retry if necessary
```

**Issue: Document upload fails**
```
Solutions:
1. Check file size (< 5MB)
2. Verify file format (PDF, JPG, PNG only)
3. Try different browser
4. Check internet connection
5. Contact support with error code
```

**Issue: Ghana Card verification stuck**
```
Solutions:
1. Check Smile ID service status
2. Retry verification after 5 minutes
3. Use alternative verification method
4. Contact support with session ID
```

---

## Appendix E: Support & Contact Information {#support}

### User Support

**Ghana Police Service - Arms & Ammunition Unit**
- **Address:** Police Headquarters, Ring Road, Accra
- **Phone:** 0302-773906
- **Email:** support@nfltms.gov.gh
- **Hours:** Monday - Friday, 8:00 AM - 5:00 PM

**Technical Support (System Issues)**
- **Email:** tech@nfltms.gov.gh
- **Response Time:** Within 24 hours

**Emergency (Lost/Stolen Firearms)**
- **Phone:** 191 (Police Emergency)
- **Available:** 24/7

### FAQ

**Q: How long does license processing take?**
A: Average 21 working days from submission to approval.

**Q: Can I track my application?**
A: Yes, use your tracking ID at nfltms.gov.gh/track

**Q: What if my license expires?**
A: Late renewal penalties apply. Renew within 6 months to avoid reapplication.

**Q: How do I report a lost firearm?**
A: Login → My Firearms → Select firearm → Report Lost/Stolen

**Q: Can I transfer my firearm to someone?**
A: Yes, but buyer must have valid license. Visit licensed dealer for transfer.

---

**END OF DOCUMENT**

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 31, 2025 | Development Team | Initial documentation |
| 1.1 | Dec 31, 2025 | Development Team | Added Admin workflows, Mobile considerations, Security, Analytics, Error handling |

**Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Lead Developer | | | |
| Product Owner | | | |
| Ghana Police - Director, Arms & Ammunition | | | |

---

*This document is confidential and proprietary to the Ghana Police Service and Ministry of Interior. Unauthorized distribution is prohibited.*