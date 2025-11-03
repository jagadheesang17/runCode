import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { createCEUProvider } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

let access_token: string;
const ceuProviderName = FakerData.getCEUProviderName();
const generatedcode = generateCode();

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Creation of CEU Provider', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating CEU Provider through API', async () => {
        await createCEUProvider(generatedcode,ceuProviderName, { Authorization: access_token });
    });
    test(`Verify that a CEU provider can be added under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a CEU provider can be added under Metadata Library' },
            { type: 'Test Description', description: "Verify that a CEU provider can be added under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        // Add specific navigation for CEU provider verification
        await metadatalibrary.ceuProviderExpandButton();
        await metadatalibrary.ceuProviderSearchField(ceuProviderName);
        await metadatalibrary.verify_CEUProvider(ceuProviderName)
    });
}); 
