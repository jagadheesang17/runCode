# Metadata Library Creation Test Suite

## Overview
This test suite creates multiple metadata library items through API calls and saves the results to a JSON file for tracking and reference.

## What it Creates
- **Department**: Creates a new department with generated name and code
- **User Type**: Creates a new user type with generated name and code  
- **Job Role**: Creates a new job role with generated name and code
- **Job Title**: Creates a new job title with generated name and code
- **Employment Type**: Creates a new employment type with generated name and code

## Features
- **API-based Creation**: Uses REST API calls for reliable metadata creation
- **Data Generation**: Uses Faker library to generate realistic test data
- **JSON Output**: Saves all created items and results to `createdMetadata.json`
- **Error Handling**: Continues execution even if individual items fail
- **Summary Reporting**: Provides success/failure statistics
- **UI Verification**: Optional step to verify items appear in the UI

## Generated JSON Structure
```json
{
    "timestamp": "2025-10-23T10:00:27.468Z",
    "testRun": "MetadataCreation_1761213627468",
    "department": {
        "name": "Industrial",
        "code": "627470"
    },
    "userType": {
        "name": "Alberta_UserType", 
        "code": "627468"
    },
    "jobRole": {
        "name": "Alec_JobRole",
        "code": "627469"
    },
    "jobTitle": {
        "name": "Sarah_JobTitle",
        "code": "627471"
    },
    "employmentType": {
        "name": "Horacio_EmploymentType",
        "code": "627470"
    },
    "results": {
        "department": { "created": true, "error": null },
        "userType": { "created": true, "error": null },
        "jobRole": { "created": true, "error": null },
        "jobTitle": { "created": true, "error": null },
        "employmentType": { "created": true, "error": null }
    },
    "summary": {
        "totalItems": 5,
        "successfullyCreated": 5,
        "failed": 0,
        "successRate": "100.00%"
    }
}
```

## Usage
Run the test using Playwright:
```bash
npx playwright test api/apiTestIntegration/metaDataLibrary/AP_CreateMetadataLibraryItems.spec.ts
```

## Output Files
- `createdMetadata.json` - Contains all created metadata information and results

## Test Steps
1. **Generate Access Token** - Authenticates with the API
2. **Create Department** - Creates department via API call
3. **Create User Type** - Creates user type via API call  
4. **Create Job Role** - Creates job role via API call
5. **Create Job Title** - Creates job title via API call
6. **Create Employment Type** - Creates employment type via API call
7. **Save to JSON** - Writes all data and results to JSON file
8. **UI Verification** - Optional verification that items appear in UI

## Benefits
- **Reusable Data**: Generated JSON can be used by other tests
- **Audit Trail**: Complete record of what was created and when
- **Batch Creation**: Creates multiple metadata types in one test run
- **Error Resilience**: Individual failures don't stop the entire process