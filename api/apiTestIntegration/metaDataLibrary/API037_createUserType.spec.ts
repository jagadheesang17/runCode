import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { createUserType } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

const userTypeName = FakerData.getUserTypeName();
const generatedcode = generateCode();

test.describe('Creation of User Type', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating User Type through API', async () => {
        await createUserType(userTypeName,generatedcode);
    });
    test(`Verify that a user type can be added under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a user type can be added under Metadata Library' },
            { type: 'Test Description', description: "Verify that a user type can be added under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
         await adminHome.meta_People();
        // Add specific navigation for user type verification
        await metadatalibrary.userTypeExpandButton();
        await metadatalibrary.userTypeSearchField(userTypeName);
        await metadatalibrary.verify_UserType(userTypeName)
    });
});
