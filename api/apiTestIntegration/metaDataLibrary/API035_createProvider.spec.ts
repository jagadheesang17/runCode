import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { createProvider } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

const providerName = FakerData.getProviderName();
const generatedcode = generateCode();

test.describe('Creation of Provider', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating Provider through API', async () => {
        await createProvider(providerName,generatedcode);
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
});
