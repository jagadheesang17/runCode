
import * as fs from 'fs';
import * as path from 'path';
import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { 
    createDepartment, 
    createUserType, 
    createJobRole, 
    createEmploymentType,
    createTag,
    createCEUProvider,
    createCEUType,
    createProvider
} from "../../metaDataLibraryAPI";

// All unique metadata values from your dataset
const uniqueMetadataValues = {
    category: ["Cultivate Architectures", "Aggregate Paradigms", "Generate Technologies"],
    ceuData: ["Cultivate Architectures", "Unleash Interfaces"],
    ceuProvider: ["Cultivate Architectures", "Synthesize Networks", "Enable Content"],
    department: ["Cultivate Architectures", "Mesh Niches", "Extend Bandwidth"],
    employmentType: ["Cultivate Architectures", "Leverage Solutions", "Seize Networks"],
    jobRole: ["Cultivate Architectures", "Central Solutions Officer3", "Direct Markets Manager2"],
    jobTitle: ["Cultivate Architectures", "Direct Branding Designer1", "Principal Security Supervisor2"],
    location: ["Cultivate Architectures", "Wellington Road", "Faustino Shore"],
    tags: ["Cultivate Architectures", "Aggregate Schemas", "Transform Interfaces"],
    userType: ["Cultivate Architectures", "Mesh Synergies", "vendor"]
};

// Track results
const createdMetadata: any = {
    timestamp: new Date().toISOString(),
    testRun: `MetadataCreation_${Date.now()}`,
    results: {}
};

let access_token: string;

// ----- Generate Access Token -----
test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('✅ Access Token Generated Successfully');
});

// ----- Metadata Creation Tests -----
test.describe('Unique Metadata Creation Suite', () => {
    test.describe.configure({ mode: "serial" });

    for (const [metaType, values] of Object.entries(uniqueMetadataValues)) {
        for (const value of values) {
            test(`Create ${metaType} -> "${value}"`, async () => {
                test.info().annotations.push(
                    { type: 'Author', description: 'Automation Team' },
                    { type: 'TestCase', description: `Create ${metaType} via API` },
                    { type: 'Test Description', description: `Create unique ${metaType} entry: "${value}"` }
                );

                try {
                    console.log(`🔹 Creating ${metaType}: "${value}"`);

                    const generatedCode = generateCode();
                    
                    switch (metaType) {
                        case "department":
                            await createDepartment(value, generatedCode, { Authorization: access_token });
                            break;
                        case "userType":
                            await createUserType(value, generatedCode, { Authorization: access_token });
                            break;
                        case "jobRole":
                            await createJobRole(value, generatedCode, { Authorization: access_token });
                            break;
                        case "jobTitle":
                            await createJobRole(value, generatedCode, { Authorization: access_token }); // jobTitle uses same API
                            break;
                        case "employmentType":
                            await createEmploymentType(value, generatedCode, { Authorization: access_token });
                            break;
                        case "tags":
                            await createTag(value, { Authorization: access_token });
                            break;
                        case "ceuProvider":
                            await createCEUProvider(value, generatedCode, { Authorization: access_token });
                            break;
                        case "ceuData":
                            await createCEUType(value, generatedCode, { Authorization: access_token }); // CEU Data uses CEU Type API
                            break;
                        case "location":
                            await createProvider(value, generatedCode, { Authorization: access_token }); // Location uses Provider API
                            break;
                        case "category":
                            console.log(`⚠ No direct API available for ${metaType}, needs UI automation`);
                            break;
                        default:
                            console.log(`⚠ Skipping API creation for ${metaType}, no endpoint mapped`);
                    }

                    // Mark success
                    createdMetadata.results[`${metaType}_${value}`] = { created: true, error: null };
                    console.log(`✅ ${metaType} "${value}" created successfully`);
                } catch (error: any) {
                    createdMetadata.results[`${metaType}_${value}`] = { created: false, error: error.message || 'Unknown error' };
                    console.error(`❌ Failed to create ${metaType} "${value}": ${error.message}`);
                }
            });
        }
    }

    // ----- Save Results to JSON -----
    test('Save Created Metadata to JSON File', async () => {
        createdMetadata.completedAt = new Date().toISOString();

        const successCount = Object.values(createdMetadata.results).filter((r: any) => r.created).length;
        const totalCount = Object.keys(createdMetadata.results).length;

        createdMetadata.summary = {
            totalItems: totalCount,
            successfullyCreated: successCount,
            failed: totalCount - successCount,
            successRate: `${((successCount / totalCount) * 100).toFixed(2)}%`
        };

        const outputPath = path.join(__dirname, 'createdMetadata.json');

        try {
            if (!fs.existsSync(path.dirname(outputPath))) {
                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            }
            fs.writeFileSync(outputPath, JSON.stringify(createdMetadata, null, 4));
            console.log(`📄 Metadata information saved to: ${outputPath}`);
            console.log('SUMMARY:', createdMetadata.summary);
        } catch (error: any) {
            console.error(`❌ Failed to save metadata to JSON: ${error.message}`);
        }
    });
});
