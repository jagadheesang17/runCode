import * as fs from 'fs';
import * as path from 'path';

const LEARNER_GROUP_FOLDER = path.join(__dirname, '../tests/learnersgroup');

const USER_CREATION_FILES = [
    'User_Creation_With_EmploymentType.spec.ts',
    'User_Creation_With_JobRole.spec.ts',
    'User_Creation_With_Metadata.spec.ts',
    'User_Creation_With_Role.spec.ts',
    'User_Creation_With_State.spec.ts',
    'User_Creation_With_LanguageCountry.spec.ts',
    'User_Creation_With_HireDate.spec.ts',
    'User_Creation_With_Complete_Attributes.spec.ts',
    'User_Creation_With_Domain_Department.spec.ts',
    'User_Creation_With_Domain_Only.spec.ts',
    'User_Creation_With_Two_Departments.spec.ts',
    'User_Creation_And_Deletion.spec.ts'
];

class MetadataConverter {
    static async convertAllFiles() {
        console.log('Starting conversion of User Creation test files...');
        
        for (const fileName of USER_CREATION_FILES) {
            const filePath = path.join(LEARNER_GROUP_FOLDER, fileName);
            
            if (fs.existsSync(filePath)) {
                console.log(`Converting: ${fileName}`);
                await this.convertFile(filePath, fileName);
            } else {
                console.log(`File not found: ${fileName}`);
            }
        }
        
        console.log('Conversion completed!');
    }

    static async convertFile(filePath: string, fileName: string) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');

            // 1. Update imports
            content = this.updateImports(content);

            // 2. Add metadata variable
            content = this.addMetadataVariable(content);

            // 3. Add beforeAll hook
            content = this.addBeforeAllHook(content, fileName);

            // 4. Replace metadata references
            content = this.replaceMetadataReferences(content);

            // 5. Update test descriptions
            content = this.updateTestDescriptions(content);

            // Write back to file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Successfully converted: ${fileName}`);

        } catch (error) {
            console.error(`❌ Error converting ${fileName}:`, error.message);
        }
    }

    static updateImports(content: string): string {
        // Replace testData import with TestMetadataManager import
        content = content.replace(
            /import \* as testData from[^;]+;/g,
            ''
        );

        // Add TestMetadataManager import after existing imports
        if (!content.includes('TestMetadataManager')) {
            content = content.replace(
                /import { readDataFromCSV } from[^;]+;/,
                `import { readDataFromCSV } from '../../utils/csvUtil';\nimport { TestMetadataManager } from '../../utils/testMetadataManager';`
            );
        }

        return content;
    }

    static addMetadataVariable(content: string): string {
        if (!content.includes('let freshMetadata: any;')) {
            // Find the last variable declaration and add after it
            const variableSection = content.match(/let\s+\w+\s*=\s*[^;]+;[^\n]*\n/g);
            if (variableSection) {
                const lastVariable = variableSection[variableSection.length - 1];
                content = content.replace(
                    lastVariable,
                    lastVariable + '\n// Store fresh metadata for this test\nlet freshMetadata: any;\n'
                );
            }
        }
        return content;
    }

    static addBeforeAllHook(content: string, fileName: string): string {
        if (!content.includes('Create Fresh Metadata')) {
            const hookCode = `
    test.beforeAll('Create Fresh Metadata', async () => {
        // Create fresh metadata for this test file
        freshMetadata = await TestMetadataManager.createFreshMetadata('${fileName}');
        console.log('Fresh metadata created:', freshMetadata.summary);
    });
`;

            // Add hook after test.describe.configure
            content = content.replace(
                /test\.describe\.configure\([^}]+\};\n/,
                (match) => match + hookCode
            );
        }
        return content;
    }

    static replaceMetadataReferences(content: string): string {
        // Replace common metadata references
        const replacements = [
            // Department references
            { 
                pattern: /await createUser\.selectDepartmentWithTestData\(testData\.department\);/g,
                replacement: `console.log(\`Using fresh Department: \${freshMetadata.department.name}\`);\n            await createUser.selectDepartmentWithTestData(freshMetadata.department.name);`
            },
            // Employment Type references
            { 
                pattern: /await createUser\.selectEmploymentTypeWithTestData\(testData\.employmentType\);/g,
                replacement: `console.log(\`Using fresh Employment Type: \${freshMetadata.employmentType.name}\`);\n            await createUser.selectEmploymentTypeWithTestData(freshMetadata.employmentType.name);`
            },
            { 
                pattern: /await createUser\.selectEmploymentTypeWithTestData\(employmentType\);/g,
                replacement: `console.log(\`Using fresh Employment Type: \${freshMetadata.employmentType.name}\`);\n            await createUser.selectEmploymentTypeWithTestData(freshMetadata.employmentType.name);`
            },
            // User Type references
            { 
                pattern: /await createUser\.selectUserTypeWithTestData\(testData\.userType\);/g,
                replacement: `console.log(\`Using fresh User Type: \${freshMetadata.userType.name}\`);\n            await createUser.selectUserTypeWithTestData(freshMetadata.userType.name);`
            },
            // Job Role/Title references
            { 
                pattern: /await createUser\.selectJobTitleWithTestData\(testData\.jobTitle\);/g,
                replacement: `console.log(\`Using fresh Job Role: \${freshMetadata.jobRole.name}\`);\n            await createUser.selectJobTitleWithTestData(freshMetadata.jobRole.name);`
            },
            { 
                pattern: /await createUser\.selectJobTitleWithTestData\(testData\.jobRole\);/g,
                replacement: `console.log(\`Using fresh Job Role: \${freshMetadata.jobRole.name}\`);\n            await createUser.selectJobTitleWithTestData(freshMetadata.jobRole.name);`
            },
            // Learner Group references
            { 
                pattern: /await learnerGroup\.selectDepartment\(testData\.department\);/g,
                replacement: `console.log(\`Creating learner group with fresh Department: \${freshMetadata.department.name}\`);\n        await learnerGroup.selectDepartment(freshMetadata.department.name);`
            },
            { 
                pattern: /await learnerGroup\.selectEmploymentType\(testData\.employmentType\);/g,
                replacement: `console.log(\`Adding fresh Employment Type: \${freshMetadata.employmentType.name}\`);\n        await learnerGroup.selectEmploymentType(freshMetadata.employmentType.name);`
            },
            { 
                pattern: /await learnerGroup\.selectEmploymentType\(employmentType\);/g,
                replacement: `console.log(\`Adding fresh Employment Type: \${freshMetadata.employmentType.name}\`);\n        await learnerGroup.selectEmploymentType(freshMetadata.employmentType.name);`
            },
            { 
                pattern: /await learnerGroup\.selectJobRole\(jobRole\);/g,
                replacement: `console.log(\`Adding fresh Job Role: \${freshMetadata.jobRole.name}\`);\n        await learnerGroup.selectJobRole(freshMetadata.jobRole.name);`
            },
            { 
                pattern: /await learnerGroup\.selectJobRole\(testData\.jobRole\);/g,
                replacement: `console.log(\`Adding fresh Job Role: \${freshMetadata.jobRole.name}\`);\n        await learnerGroup.selectJobRole(freshMetadata.jobRole.name);`
            }
        ];

        for (const replacement of replacements) {
            content = content.replace(replacement.pattern, replacement.replacement);
        }

        // Remove old variable references
        content = content.replace(/let\s+employmentType\s*=\s*testData\.employmentType;/g, '');
        content = content.replace(/let\s+jobRole\s*=\s*testData\.jobRole;/g, '');
        content = content.replace(/let\s+department\s*=\s*testData\.department;/g, '');

        return content;
    }

    static updateTestDescriptions(content: string): string {
        content = content.replace(
            /from JSON test data/g,
            'using fresh metadata created via API'
        );
        content = content.replace(
            /from JSON file/g,
            'using fresh metadata created via API'
        );
        content = content.replace(
            /with all metadata attributes from JSON/g,
            'with fresh metadata attributes created via API'
        );
        
        return content;
    }
}

// Export for direct execution
if (require.main === module) {
    MetadataConverter.convertAllFiles().catch(console.error);
}

export { MetadataConverter };