import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { createEmploymentType } from "../../metaDataLibraryAPI";

let access_token: string;
const employmentTypeCode = generateCode();
const employmentTypeName = FakerData.getJobRoleName() + " Employment Type";

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Creation of Employment Type', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating Employment Type through API', async () => {
        await createEmploymentType(employmentTypeName, employmentTypeCode, { Authorization: access_token });
    });
    test(`Verify that an employment type can be added under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that an employment type can be added under Metadata Library' },
            { type: 'Test Description', description: "Verify that an employment type can be added under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_People();
        // Add specific navigation for employment type verification
        await metadatalibrary.employmentTypeExpandButton();
        await metadatalibrary.employmentTypeSearchField(employmentTypeName);
        await metadatalibrary.verify_EmploymentType(employmentTypeName)
    });
});
