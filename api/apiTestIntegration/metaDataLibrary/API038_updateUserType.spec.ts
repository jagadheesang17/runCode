import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { createUserType, updateUserType } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

let access_token: string;
const userTypeName = FakerData.getUserTypeName() + " " + "Type";
const updatedUserTypeName = FakerData.getUserTypeName() + " " + "Updated";
const generatedcode = generateCode();

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Update User Type', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating User Type through API', async () => {
        await createUserType(userTypeName,generatedcode, { Authorization: access_token });
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

    //Update User Type
    test('Updating User Type through API', async () => {
        await updateUserType(generatedcode,updatedUserTypeName, { Authorization: access_token });
    });

    test(`Verify that a user type can be updated under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a user type can be updated under Metadata Library' },
            { type: 'Test Description', description: "Verify that a user type can be updated under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
         await adminHome.meta_People();
        // Add specific navigation for user type verification
        await metadatalibrary.userTypeExpandButton();
        await metadatalibrary.userTypeSearchField(userTypeName);
        await metadatalibrary.noResultFoundMsgOnUserType()
        await metadatalibrary.userTypeSearchField(updatedUserTypeName);
        await metadatalibrary.verify_UserType(updatedUserTypeName)
    });
});
