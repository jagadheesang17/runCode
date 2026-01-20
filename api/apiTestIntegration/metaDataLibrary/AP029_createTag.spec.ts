import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { createTag } from "../../metaDataLibraryAPI";

const tagName = FakerData.getTagNames();

test.describe('Creation of Tag', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating Tag through API', async () => {
        await createTag(tagName);
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
});


