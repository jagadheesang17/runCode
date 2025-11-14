# Certificate Test User Setup

## Overview
Certificate validation tests (CC012-CC015) use a dedicated test user created specifically for these tests.

## Setup Steps

### 1. Create the Certificate Test User (ONE TIME ONLY)

Run this command **FIRST** before running any certificate tests:

```powershell
npx playwright test CC000_CreateUser
```

This will:
- Create a new learner user via API
- Save user details to `data/completionCertificate/certificateTestUser.json`
- User details include:
  - First Name: Certificate
  - Last Name: Testuser
  - Username: (auto-generated unique ID)
  - Password: Welcome1@
  - User ID: (from API)

### 2. Run Certificate Tests

After creating the user, you can run the certificate tests:

```powershell
# Run all certificate tests
npx playwright test CC012 CC013 CC015

# Or run individually
npx playwright test CC012
npx playwright test CC013
npx playwright test CC015
```

## File Structure

```
data/
  └── completionCertificate/
      └── certificateTestUser.json          # Stores test user data

tests/admin/completionCertificate/
  ├── CC000_CreateUser.spec.ts              # Creates the test user
  ├── CC012_Course_Certificate_Validation.spec.ts
  ├── CC013_Certification_Certificate_Validation.spec.ts
  └── CC015_Certificate_Unpublish_Restriction_And_Assessment_Validation.spec.ts

utils/
  └── certificateTestUserHelper.ts          # Helper functions to read user data
```

## Helper Functions

```typescript
import { 
    getCertificateTestUser,           // Get full user object
    getCertificateTestUserFullName,   // Get "Certificate Testuser"
    getCertificateTestUsername        // Get username
} from "../../../utils/certificateTestUserHelper";

// Usage in tests
const certUser = getCertificateTestUser();
await learnerHome.basicLogin(certUser.username, "DefaultPortal");
await catalog.verifyPDFDownloaded(pdfPath, getCertificateTestUserFullName(), courseName, "Course");
```

## Changes from Previous Approach

### Before:
```typescript
import { credentials } from "../../../constants/credentialData";

// Using shared learner account
await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
await catalog.verifyPDFDownloaded(pdfPath, 
    credentials.LEARNERUSERNAME.firstname + ' ' + credentials.LEARNERUSERNAME.lastname, 
    courseName, "Course");
```

### After:
```typescript
import { getCertificateTestUser, getCertificateTestUserFullName } from "../../../utils/certificateTestUserHelper";

const certUser = getCertificateTestUser();

// Using dedicated certificate test user
await learnerHome.basicLogin(certUser.username, "DefaultPortal");
await catalog.verifyPDFDownloaded(pdfPath, 
    getCertificateTestUserFullName(), 
    courseName, "Course");
```

## Benefits

1. **Test Isolation**: Each certificate test suite has its own dedicated user
2. **No Conflicts**: Multiple test runs won't interfere with each other
3. **Clean State**: Fresh user with no previous enrollments or certificates
4. **Easy Cleanup**: Simply delete the JSON file and re-run CC000 to get a new user
5. **Predictable Data**: Known firstname ("Certificate") and lastname ("Testuser") for PDF validation

## Troubleshooting

### Error: Certificate test user file not found

**Solution**: Run `npx playwright test CC000_CreateUser` first

### Want to create a new user?

1. Delete the file: `data/completionCertificate/certificateTestUser.json`
2. Run: `npx playwright test CC000_CreateUser`
3. Run your certificate tests again

### Check current test user

View the JSON file at:
```
data/completionCertificate/certificateTestUser.json
```

## Notes

- Password is hardcoded as `Welcome1@` for all certificate test users
- Username is auto-generated with unique ID (e.g., `certtest_1699876543210`)
- User is created in the system and persists until manually deleted
- The JSON file is not committed to Git (add to .gitignore if needed)
