import { test } from "../../../customFixtures/expertusFixture";
import { generateOauthToken } from "../../accessToken";
import { FakerData } from "../../../utils/fakerUtils";
import { createTag, editTag } from "../../metaDataLibraryAPI";

let access_token: string;
const tagName = FakerData.getTagNames()+" "+"Tag";
const updatedTagName = FakerData.getTagNames()+" "+"Tag";

test.beforeAll('Generate Access Tokken', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe('Creation of Tag', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating Tag through API', async () => {
        await createTag(tagName, { Authorization: access_token });
    });
    test(`Verify that a tags can be added under Metadata Library - Learning - Tags`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Tamilvanan' },
            { type: 'TestCase', description: 'Verify that a tags can be added under Metadata Library - Learning - Tags' },
            { type: 'Test Description', description: "Verify that a tags can be added under Metadata Library - Learning - Tags" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        await metadatalibrary.tagsExpandButton();
        await metadatalibrary.tagsSearchField(tagName);
        await metadatalibrary.verify_Tags(tagName)
    });

    //Edit Tag
        test('Editing Tag through API', async () => {
        await editTag(tagName, updatedTagName,{ Authorization: access_token });
    });

       test(`Verify that a new tags can be added under Metadata Library - Learning - Tags`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Tamilvanan' },
            { type: 'TestCase', description: 'Verify that a new tag can be added under Metadata Library - Learning - Tags' },
            { type: 'Test Description', description: "Verify that a new tag can be added under Metadata Library - Learning - Tags" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        await metadatalibrary.tagsExpandButton();
        await metadatalibrary.tagsSearchField(tagName);
        await metadatalibrary.noResultFoundMsgOnTag()
        await metadatalibrary.tagsSearchField(updatedTagName);
        await metadatalibrary.verify_Tags(updatedTagName)
    });

});


