import { generateOauthToken } from "../api/accessToken";
import { FakerData } from "./fakerUtils";
import { createDepartment, createUserType, createJobRole, createEmploymentType } from "../api/metaDataLibraryAPI";
import { generateCode } from "../data/apiData/formData";
import * as fs from 'fs';
import * as path from 'path';

interface MetadataItem {
    name: string;
    code: string;
}

interface CreatedMetadata {
    timestamp: string;
    testFile: string;
    department: MetadataItem;
    userType: MetadataItem;
    jobRole: MetadataItem;
    jobTitle: MetadataItem;
    employmentType: MetadataItem;
    results: {
        department: { created: boolean; error: string | null };
        userType: { created: boolean; error: string | null };
        jobRole: { created: boolean; error: string | null };
        jobTitle: { created: boolean; error: string | null };
        employmentType: { created: boolean; error: string | null };
    };
    summary?: {
        totalItems: number;
        successfullyCreated: number;
        failed: number;
        successRate: string;
    };
}

export class TestMetadataManager {
    private static createdMetadata: CreatedMetadata;
    private static accessToken: string;

    /**
     * Creates fresh metadata for a test file
     * @param testFileName - Name of the test file
     * @returns Promise<CreatedMetadata>
     */
    static async createFreshMetadata(testFileName: string): Promise<CreatedMetadata> {
        console.log(`Creating fresh metadata for: ${testFileName}`);
        
        // Generate access token
        this.accessToken = await generateOauthToken();
        console.log('Access Token Generated Successfully');

        // Generate unique test data for this specific test file
        const timestamp = Date.now();
        const testIdentifier = testFileName.replace('.spec.ts', '').replace(/[^a-zA-Z0-9]/g, '_');
        
        const departmentData = {
            name: `${FakerData.getDepartmentName()}_${testIdentifier}`,
            code: generateCode()
        };

        const userTypeData = {
            name: `${FakerData.getFirstName()}_UserType_${testIdentifier}`,
            code: generateCode()
        };

        const jobRoleData = {
            name: `${FakerData.getFirstName()}_JobRole_${testIdentifier}`,
            code: generateCode()
        };

        const jobTitleData = {
            name: `${FakerData.getFirstName()}_JobTitle_${testIdentifier}`,
            code: generateCode() + "_JT"
        };

        const employmentTypeData = {
            name: `${FakerData.getFirstName()}_EmploymentType_${testIdentifier}`,
            code: generateCode()
        };

        // Initialize metadata object
        this.createdMetadata = {
            timestamp: new Date().toISOString(),
            testFile: testFileName,
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

        // Create all metadata items
        await this.createAllMetadataItems();
        
        // Calculate summary
        this.calculateSummary();
        
        // Save to JSON file
        await this.saveMetadataToFile(testFileName);

        console.log(`Fresh metadata created successfully for ${testFileName}`);
        return this.createdMetadata;
    }

    private static async createAllMetadataItems() {
        // Create Department
        try {
            console.log(`Creating Department: ${this.createdMetadata.department.name}`);
            await createDepartment(
                this.createdMetadata.department.name, 
                this.createdMetadata.department.code, 
                { Authorization: this.accessToken }
            );
            this.createdMetadata.results.department.created = true;
            console.log(`Department created: ${this.createdMetadata.department.name}`);
        } catch (error: any) {
            this.createdMetadata.results.department.error = error.message;
            console.log(`Department creation handled: ${error.message}`);
        }

        // Create User Type
        try {
            console.log(`Creating User Type: ${this.createdMetadata.userType.name}`);
            await createUserType(
                this.createdMetadata.userType.name, 
                this.createdMetadata.userType.code, 
                { Authorization: this.accessToken }
            );
            this.createdMetadata.results.userType.created = true;
            console.log(`User Type created: ${this.createdMetadata.userType.name}`);
        } catch (error: any) {
            this.createdMetadata.results.userType.error = error.message;
            console.log(`User Type creation handled: ${error.message}`);
        }

        // Create Job Role
        try {
            console.log(`Creating Job Role: ${this.createdMetadata.jobRole.name}`);
            await createJobRole(
                this.createdMetadata.jobRole.name, 
                this.createdMetadata.jobRole.code, 
                { Authorization: this.accessToken }
            );
            this.createdMetadata.results.jobRole.created = true;
            console.log(`Job Role created: ${this.createdMetadata.jobRole.name}`);
        } catch (error: any) {
            this.createdMetadata.results.jobRole.error = error.message;
            console.log(`Job Role creation handled: ${error.message}`);
        }

        // Create Job Title (using Job Role API)
        try {
            console.log(`Creating Job Title: ${this.createdMetadata.jobTitle.name}`);
            await createJobRole(
                this.createdMetadata.jobTitle.name, 
                this.createdMetadata.jobTitle.code, 
                { Authorization: this.accessToken }
            );
            this.createdMetadata.results.jobTitle.created = true;
            console.log(`Job Title created: ${this.createdMetadata.jobTitle.name}`);
        } catch (error: any) {
            this.createdMetadata.results.jobTitle.error = error.message;
            console.log(`Job Title creation handled: ${error.message}`);
        }

        // Create Employment Type
        try {
            console.log(`Creating Employment Type: ${this.createdMetadata.employmentType.name}`);
            await createEmploymentType(
                this.createdMetadata.employmentType.name, 
                this.createdMetadata.employmentType.code, 
                { Authorization: this.accessToken }
            );
            this.createdMetadata.results.employmentType.created = true;
            console.log(`Employment Type created: ${this.createdMetadata.employmentType.name}`);
        } catch (error: any) {
            this.createdMetadata.results.employmentType.error = error.message;
            console.log(`Employment Type creation handled: ${error.message}`);
        }
    }

    private static calculateSummary() {
        const results = Object.values(this.createdMetadata.results);
        const successCount = results.filter(result => result.created).length;
        const totalCount = results.length;
        
        this.createdMetadata.summary = {
            totalItems: totalCount,
            successfullyCreated: successCount,
            failed: totalCount - successCount,
            successRate: `${((successCount / totalCount) * 100).toFixed(2)}%`
        };
    }

    private static async saveMetadataToFile(testFileName: string) {
        const sanitizedFileName = testFileName.replace(/[^a-zA-Z0-9]/g, '_');
        const outputDir = path.join(__dirname, '../data/testMetadata');
        const outputPath = path.join(outputDir, `${sanitizedFileName}_metadata.json`);
        
        try {
            // Ensure directory exists
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Write JSON file
            fs.writeFileSync(outputPath, JSON.stringify(this.createdMetadata, null, 4));
            console.log(`Metadata saved to: ${outputPath}`);
            
            // Log summary
            console.log('METADATA CREATION SUMMARY:');
            console.log(`- Total Items: ${this.createdMetadata.summary?.totalItems}`);
            console.log(`- Successfully Created: ${this.createdMetadata.summary?.successfullyCreated}`);
            console.log(`- Failed: ${this.createdMetadata.summary?.failed}`);
            console.log(`- Success Rate: ${this.createdMetadata.summary?.successRate}`);
            
        } catch (error: any) {
            console.error(`Failed to save metadata file: ${error.message}`);
        }
    }

    /**
     * Gets the created metadata (call after createFreshMetadata)
     */
    static getCreatedMetadata(): CreatedMetadata {
        return this.createdMetadata;
    }
}