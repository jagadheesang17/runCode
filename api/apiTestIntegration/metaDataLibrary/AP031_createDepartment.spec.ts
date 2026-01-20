import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { createDepartment } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

const generatedcode = generateCode();
const departmentName = FakerData.getDepartmentName();

test.describe('Creation of Department', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating Department through API', async () => {
     
        await createDepartment(departmentName, generatedcode);

    });
    test.skip(`Verify that a department can be added under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a department can be added under Metadata Library' },
            { type: 'Test Description', description: "Verify that a department can be added under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_People();
        // await metadatalibrary.departmentExpandButton();
        // await metadatalibrary.departmentSearchField(departmentName);
        await metadatalibrary.verify_Department(departmentName)
    });
});
