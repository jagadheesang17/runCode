import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { createDepartment, updateDepartment } from "../../metaDataLibraryAPI";
import { generateCode } from "../../../data/apiData/formData";

const departmentName = FakerData.getDepartmentName() + " " + "Dept";
const updatedDepartmentName = FakerData.getDepartmentName() + " " + "Updated";
const generatedcode = generateCode();


test.describe('Update Department', () => {
    test.describe.configure({ mode: "serial" });
    test('Creating Department through API', async () => {
        await createDepartment(departmentName, generatedcode);
    });
    test(`Verify that a department can be added under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a department can be added under Metadata Library' },
            { type: 'Test Description', description: "Verify that a department can be added under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_People();
        // Add specific navigation for department verification
        await metadatalibrary.departmentExpandButton();
        await metadatalibrary.departmentSearchField(departmentName);
        await metadatalibrary.verify_Department(departmentName)
    });

    //Update Department
    test('Updating Department through API', async () => {
        await updateDepartment(generatedcode,updatedDepartmentName);
    });

    test(`Verify that a department can be updated under Metadata Library`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Automation Team' },
            { type: 'TestCase', description: 'Verify that a department can be updated under Metadata Library' },
            { type: 'Test Description', description: "Verify that a department can be updated under Metadata Library" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
           await adminHome.meta_People();
        // Add specific navigation for department verification
        await metadatalibrary.departmentExpandButton();
        await metadatalibrary.departmentSearchField(departmentName);
        await metadatalibrary.noResultFoundMsgOnDepartment()
        await metadatalibrary.departmentSearchField(updatedDepartmentName);
        await metadatalibrary.verify_Department(updatedDepartmentName)
    });
});
