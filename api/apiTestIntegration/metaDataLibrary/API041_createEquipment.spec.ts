import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { createEquipment } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

let access_token: string;
const equipmentName = FakerData.getEquipmentName();


test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Creation of Equipment', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating Equipment through API', async () => {
        await createEquipment(equipmentName);
    });
    test(`Verify that equipment can be added under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that equipment can be added under Metadata Library' },
            { type: 'Test Description', description: "Verify that equipment can be added under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await metadatalibrary.metaGeneralLink()
        // Add specific navigation for equipment verification
        await metadatalibrary.equipmentExpandButton();
        await metadatalibrary.equipmentSearchField(equipmentName);
        await metadatalibrary.verify_Equipment(equipmentName)
    });
});
