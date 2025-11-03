import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { createProvider, updateProvider } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

let access_token: string;
const providerName = FakerData.getProviderName()
const updatedProviderName = FakerData.getProviderName() + " " + "Updated";
const generatedcode = generateCode();

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Update Provider', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating Provider through API', async () => {
        await createProvider(providerName,generatedcode, { Authorization: access_token });
    });
    test(`Verify that a provider can be added under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a provider can be added under Metadata Library' },
            { type: 'Test Description', description: "Verify that a provider can be added under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
             await adminHome.meta_learning();
        // Add specific navigation for provider verification
        await metadatalibrary.providerExpandButton();
        await metadatalibrary.providerSearchField(providerName);
        await metadatalibrary.verify_Provider(providerName)
    });

    //Update Provider
    test('Updating Provider through API', async () => {
        await updateProvider(generatedcode,updatedProviderName, { Authorization: access_token });
    });

    test(`Verify that a provider can be updated under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a provider can be updated under Metadata Library' },
            { type: 'Test Description', description: "Verify that a provider can be updated under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        // Add specific navigation for provider verification
        await metadatalibrary.providerExpandButton();
        await metadatalibrary.providerSearchField(providerName);
        await metadatalibrary.noResultFoundMsgOnProvider()
        await metadatalibrary.providerSearchField(updatedProviderName);
        await metadatalibrary.verify_Provider(updatedProviderName)
    });
});
