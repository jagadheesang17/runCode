import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { createCEUProvider, updateCEUProvider } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

let access_token: string;
const ceuProviderName = FakerData.getCEUProviderName() + " " + "Provider";
const updatedCEUProviderName = FakerData.getCEUProviderName() + " " + "Updated";
const generatedcode = generateCode();

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Update CEU Provider', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating CEU Provider through API', async () => {
        await createCEUProvider(ceuProviderName, generatedcode, { Authorization: access_token });
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

    //Update CEU Provider
    test('Updating CEU Provider through API', async () => {
        await updateCEUProvider(generatedcode,updatedCEUProviderName, { Authorization: access_token });
    });

    test(`Verify that a CEU provider can be updated under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a CEU provider can be updated under Metadata Library' },
            { type: 'Test Description', description: "Verify that a CEU provider can be updated under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        // Add specific navigation for CEU provider verification
        await metadatalibrary.ceuProviderExpandButton();
        await metadatalibrary.ceuProviderSearchField(ceuProviderName);
        await metadatalibrary.noResultFoundMsgOnCEUProvider()
        await metadatalibrary.ceuProviderSearchField(updatedCEUProviderName);
        await metadatalibrary.verify_CEUProvider(updatedCEUProviderName)
    });
});
