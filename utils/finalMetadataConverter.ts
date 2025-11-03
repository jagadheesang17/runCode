import * as fs from 'fs';
import * as path from 'path';

export class FinalMetadataConverter {
    private static learnersGroupPath = path.join(process.cwd(), 'tests', 'learnersgroup');
    
    private static userCreationFiles = [
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

    static async convertAllFiles(): Promise<void> {
        console.log('Starting final conversion of User Creation test files...');
        
        for (const fileName of this.userCreationFiles) {
            const filePath = path.join(this.learnersGroupPath, fileName);
            
            if (fs.existsSync(filePath)) {
                console.log(`Converting: ${fileName}`);
                await this.convertFile(filePath, fileName);
                console.log(`✅ Successfully converted: ${fileName}`);
            } else {
                console.log(`⚠️  File not found: ${fileName}`);
            }
        }
        
        console.log('Final conversion completed!');
    }

    private static async convertFile(filePath: string, fileName: string): Promise<void> {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add TestMetadataManager import if not present
        if (!content.includes('TestMetadataManager')) {
            content = content.replace(
                /import { readDataFromCSV } from '\.\.\/\.\.\/utils\/csvUtil';/,
                `import { readDataFromCSV } from '../../utils/csvUtil';\nimport { TestMetadataManager } from '../../utils/testMetadataManager';`
            );
        }

        // Add fresh metadata variable if not present
        if (!content.includes('let freshMetadata: any;')) {
            // Find the position after the last variable declaration
            const lines = content.split('\n');
            let insertIndex = -1;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('test.describe(')) {
                    insertIndex = i;
                    break;
                }
            }
            
            if (insertIndex > -1) {
                lines.splice(insertIndex, 0, '', '// Store fresh metadata for this test', 'let freshMetadata: any;', '');
                content = lines.join('\n');
            }
        }

        // Add beforeAll hook if not present
        if (!content.includes('test.beforeAll(\'Create Fresh Metadata\'')) {
            content = content.replace(
                /(test\.describe\.configure\({ mode: "serial" }\);)/,
                `$1

    test.beforeAll('Create Fresh Metadata', async () => {
        // Create fresh metadata for this test file
        freshMetadata = await TestMetadataManager.createFreshMetadata('${fileName}');
        console.log('Fresh metadata created:', freshMetadata.summary);
    });`
            );
        }

        // Replace testData references with freshMetadata
        content = content.replace(/testData\./g, 'freshMetadata.');
        
        // Fix specific testDataComplete references
        content = content.replace(/testDataComplete\./g, 'freshMetadata.');
        
        // Remove testData import and related definitions
        content = content.replace(/import { testData } from '\.\.\/\.\.\/data\/testData';?\n?/g, '');
        content = content.replace(/import testData from '\.\.\/\.\.\/data\/testData';?\n?/g, '');
        
        // Remove testDataComplete definitions
        const testDataCompleteRegex = /\/\/ Create a merged object for backward compatibility[\s\S]*?};/g;
        content = content.replace(testDataCompleteRegex, '');
        
        // Remove standalone testDataComplete assignment
        content = content.replace(/const testDataComplete = {[\s\S]*?};/g, '');
        
        // Clean up extra empty lines
        content = content.replace(/\n\n\n+/g, '\n\n');
        
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

// Run the converter
FinalMetadataConverter.convertAllFiles().catch(console.error);