import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { createCEUType, updateCEUType } from "../../metaDataLibraryAPI";

let access_token: string;
const ceuTypeCode = generateCode();
const updatedCeuTypeCode = generateCode();
const ceuTypeName = FakerData.getTagNames() + Date.now();
const updatedCeuTypeName = FakerData.getTagNames() + " Updated " + Date.now();

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Update CEU Type', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating CEU Type through API', async () => {
        await createCEUType(ceuTypeName,ceuTypeCode, { Authorization: access_token });
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

    //Update CEU Type
    test('Updating CEU Type through API', async () => {
        await updateCEUType(ceuTypeCode,updatedCeuTypeName,{ Authorization: access_token });
    });

    test(`Verify that a CEU type can be updated under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a CEU type can be updated under Metadata Library' },
            { type: 'Test Description', description: "Verify that a CEU type can be updated under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        // Add specific navigation for CEU type verification
        await metadatalibrary.CEU_TypeExpandButton();
        await metadatalibrary.ceuTypeSearchField(ceuTypeName);
        await metadatalibrary.noResultFoundMsgOnCEUType()
        await metadatalibrary.ceuTypeSearchField(updatedCeuTypeName);
        await metadatalibrary.verify_CEUType(updatedCeuTypeName)
    });
});
