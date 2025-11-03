import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { createDepartment, createUserType, createJobRole, createEmploymentType } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";
import * as fs from 'fs';
import * as path from 'path';

let access_token: string;

// Generate test data
const departmentData = {
    name: FakerData.getDepartmentName(),
    code: generateCode()
};

const userTypeData = {
    name: FakerData.getFirstName() + "_UserType",
    code: generateCode()
};

const jobRoleData = {
    name: FakerData.getFirstName() + "_JobRole", 
    code: generateCode()
};

const jobTitleData = {
    name: FakerData.getFirstName() + "_JobTitle",
    code: generateCode() + "_JT" // Adding suffix to ensure unique code for job title
};

const employmentTypeData = {
    name: FakerData.getFirstName() + "_EmploymentType",
    code: generateCode()
};

// Object to store all created metadata
const createdMetadata: any = {
    timestamp: new Date().toISOString(),
    testRun: `MetadataCreation_${Date.now()}`,
    department: departmentData,
    userType: userTypeData,
    jobRole: jobRoleData,
    jobTitle: jobTitleData,
    employmentType: employmentTypeData,
    results: {
        department: { created: false, error: null },
        userType: { created: false, error: null },
        jobRole: { created: false, error: null },
        jobTitle: { created: false, error: null },
        employmentType: { created: false, error: null }
    }
};

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token Generated Successfully');
});

test.describe('Metadata Library Creation Suite', () => {
    test.describe.configure({ mode: "serial" });

    test('Create Department through API', async () => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Create Department via API' },
            { type: 'Test Description', description: "Create a new department through API and save to JSON" }
        );

        try {
            console.log(`Creating Department: ${departmentData.name} with code: ${departmentData.code}`);
            await createDepartment(departmentData.name, departmentData.code, { Authorization: access_token });
            createdMetadata.results.department.created = true;
            console.log(`Department created successfully: ${departmentData.name}`);
        } catch (error) {
            createdMetadata.results.department.error = error.message;
            console.error(`Failed to create department: ${error.message}`);
            throw error;
        }
    });

    test('Create User Type through API', async () => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Create User Type via API' },
            { type: 'Test Description', description: "Create a new user type through API and save to JSON" }
        );

        try {
            console.log(`Creating User Type: ${userTypeData.name} with code: ${userTypeData.code}`);
            await createUserType(userTypeData.name, userTypeData.code, { Authorization: access_token });
            createdMetadata.results.userType.created = true;
            console.log(`User Type created successfully: ${userTypeData.name}`);
        } catch (error) {
            createdMetadata.results.userType.error = error.message;
            console.error(`Failed to create user type: ${error.message}`);
            throw error;
        }
    });

    test('Create Job Role through API', async () => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Create Job Role via API' },
            { type: 'Test Description', description: "Create a new job role through API and save to JSON" }
        );

        try {
            console.log(`Creating Job Role: ${jobRoleData.name} with code: ${jobRoleData.code}`);
            await createJobRole(jobRoleData.name, jobRoleData.code, { Authorization: access_token });
            createdMetadata.results.jobRole.created = true;
            console.log(`Job Role created successfully: ${jobRoleData.name}`);
        } catch (error) {
            createdMetadata.results.jobRole.error = error.message;
            console.error(`Failed to create job role: ${error.message}`);
            throw error;
        }
    });

    test('Create Job Title through API', async () => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Create Job Title via API' },
            { type: 'Test Description', description: "Create a new job title through API and save to JSON" }
        );

        try {
            console.log(`Creating Job Title: ${jobTitleData.name} with code: ${jobTitleData.code}`);
            // Using createJobRole function as Job Title uses the same API endpoint
            await createJobRole(jobTitleData.name, jobTitleData.code, { Authorization: access_token });
            createdMetadata.results.jobTitle.created = true;
            console.log(`Job Title created successfully: ${jobTitleData.name}`);
        } catch (error) {
            createdMetadata.results.jobTitle.error = error.message;
            console.error(`Failed to create job title: ${error.message}`);
            throw error;
        }
    });

    test('Create Employment Type through API', async () => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Create Employment Type via API' },
            { type: 'Test Description', description: "Create a new employment type through API and save to JSON" }
        );

        try {
            console.log(`Creating Employment Type: ${employmentTypeData.name} with code: ${employmentTypeData.code}`);
            await createEmploymentType(employmentTypeData.name, employmentTypeData.code, { Authorization: access_token });
            createdMetadata.results.employmentType.created = true;
            console.log(`Employment Type created successfully: ${employmentTypeData.name}`);
        } catch (error) {
            createdMetadata.results.employmentType.error = error.message;
            console.error(`Failed to create employment type: ${error.message}`);
            throw error;
        }
    });

    test('Save Created Metadata to JSON File', async () => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Save Metadata to JSON' },
            { type: 'Test Description', description: "Save all created metadata information to a JSON file for future reference" }
        );

        // Add completion timestamp
        createdMetadata.completedAt = new Date().toISOString();
        
        // Calculate success summary
        const successCount = Object.values(createdMetadata.results).filter((result: any) => result.created).length;
        const totalCount = Object.keys(createdMetadata.results).length;
        
        createdMetadata.summary = {
            totalItems: totalCount,
            successfullyCreated: successCount,
            failed: totalCount - successCount,
            successRate: `${((successCount / totalCount) * 100).toFixed(2)}%`
        };

        // Save to JSON file in the metaDataLibrary folder
        const outputPath = path.join(__dirname, 'createdMetadata.json');
        
        try {
            // Ensure directory exists
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Write JSON file with proper formatting
            fs.writeFileSync(outputPath, JSON.stringify(createdMetadata, null, 4));
            console.log(`Metadata information saved to: ${outputPath}`);
            
            // Log summary
            console.log('METADATA CREATION SUMMARY:');
            console.log(`Total Items: ${createdMetadata.summary.totalItems}`);
            console.log(`Successfully Created: ${createdMetadata.summary.successfullyCreated}`);
            console.log(`Failed: ${createdMetadata.summary.failed}`);
            console.log(`Success Rate: ${createdMetadata.summary.successRate}`);
            
            // Log individual results
            console.log('\nDETAILS:');
            console.log(`Department (${departmentData.name}): ${createdMetadata.results.department.created ? 'SUCCESS' : 'FAILED'}`);
            console.log(`User Type (${userTypeData.name}): ${createdMetadata.results.userType.created ? 'SUCCESS' : 'FAILED'}`);
            console.log(`Job Role (${jobRoleData.name}): ${createdMetadata.results.jobRole.created ? 'SUCCESS' : 'FAILED'}`);
            console.log(`Job Title (${jobTitleData.name}): ${createdMetadata.results.jobTitle.created ? 'SUCCESS' : 'FAILED'}`);
            console.log(`Employment Type (${employmentTypeData.name}): ${createdMetadata.results.employmentType.created ? 'SUCCESS' : 'FAILED'}`);

        } catch (error) {
            console.error(`Failed to save metadata to JSON file: ${error.message}`);
            throw error;
        }
    });

    test.skip('Verify Created Metadata in UI (Optional)', async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify Created Metadata in UI' },
            { type: 'Test Description', description: "Optionally verify that created metadata appears in the UI" }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_People();

        // Verify Department if it was created successfully
        if (createdMetadata.results.department.created) {
            try {
                await metadatalibrary.verify_Department(departmentData.name);
                console.log(`UI Verification: Department ${departmentData.name} found in UI`);
            } catch (error) {
                console.log(`UI Verification: Department ${departmentData.name} not found in UI: ${error.message}`);
            }
        }

        console.log('UI verification completed');
    });
});