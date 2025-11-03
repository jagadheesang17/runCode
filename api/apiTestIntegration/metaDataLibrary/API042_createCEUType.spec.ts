import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { createCEUType } from "../../metaDataLibraryAPI";

let access_token: string;
const ceuTypeCode = generateCode();
const ceuTypeName = FakerData.getTagNames() + Date.now();

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Creation of CEU Type', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating CEU Type through API', async () => {
        await createCEUType(ceuTypeName,ceuTypeCode,{ Authorization: access_token });
    });
    test(`Verify that a CEU type can be added under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a CEU type can be added under Metadata Library' },
            { type: 'Test Description', description: "Verify that a CEU type can be added under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        // Add specific navigation for CEU type verification
        await metadatalibrary.CEU_TypeExpandButton();
        await metadatalibrary.ceuTypeSearchField(ceuTypeName);
        await metadatalibrary.verify_CEUType(ceuTypeName)
    });
});
