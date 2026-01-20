import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const departmentName: any = FakerData.getCategory()
test(`verify that a department can be added under Metadata Library - People - Department`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'verify that a department can be added under Metadata Library - People - Department' },
        { type: 'Test Description', description: "Creating a department in the Metadata Library within the People Category" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_People();
    
        
    await metadatalibrary.addDepartment()
    await metadatalibrary.name(departmentName);
    await metadatalibrary.description(FakerData.getDescription());
    await metadatalibrary.saveButton();
    await metadatalibrary.department_SearchField(departmentName);
    await metadatalibrary.verify_Department(departmentName);

})

const EmploymentType: any = FakerData.getCategory();
test(`verify that a employment type can be added under Metadata Library - People - Employment Type`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'verify that a employment type can be added under Metadata Library - People - Employment Type' },
        { type: 'Test Description', description: "Creating a employment type  in the Metadata Library within the People Category" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_People();
    await metadatalibrary.employmentTypeExpandButton();
    await metadatalibrary.addEmploymentTypeButton();
    await metadatalibrary.name(EmploymentType);
    await metadatalibrary.description(FakerData.getDescription());
    await metadatalibrary.saveButton();
    await metadatalibrary.addEmploymentType_SearchButton(EmploymentType);
    await metadatalibrary.verify_addEmploymentType(EmploymentType);


})


test(`verify that a user type can be added under Metadata Library - People - User Type`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'verify that a user type can be added under Metadata Library - People - User Type' },
        { type: 'Test Description', description: "Creating a UserType in the Metadata Library within the People Category" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_People();
    await metadatalibrary.userTypesExpandButton();
    for(let i=0;i<50;i++){
        const usertypeName: any = FakerData.getCategory()+" "+"UserType";
        await metadatalibrary.addUserTypeButton();
    await metadatalibrary.name(usertypeName);
    await metadatalibrary.description(usertypeName);
    await metadatalibrary.saveButton();
    }
    
    //await metadatalibrary.userType_SearchButton(usertypeName);
 //   await metadatalibrary.verify_UserType(usertypeName);

});

const jobRole: any = FakerData.jobRole();

test(`verify that a job role can be added under Metadata Library - People - Job Role`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'verify that a job role can be added under Metadata Library - People - Job Role' },
        { type: 'Test Description', description: "Creating a Job Role in the Metadata Library within the People Category" }
    );

    await adminHome.loadAndLogin("SUPERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_People();
    await metadatalibrary.jobRolesExpandButton();
    await metadatalibrary.addJobRole();
    await metadatalibrary.name(jobRole);
    await metadatalibrary.description(FakerData.getDescription());
    await metadatalibrary.saveButton();
    await metadatalibrary.addJobRole_SearchField(jobRole);
    await metadatalibrary.verify_JobRole(jobRole);
});


const jobTitle: any = FakerData.jobRole();

test(`verify that a job title can be added under Metadata Library - People - Job Title`, async ({ adminHome, metadatalibrary }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'verify that a job title can be added under Metadata Library - People - Job Title' },
        { type: 'Test Description', description: "Creating a Job title in the Metadata Library within the People Category" }
    );
    await adminHome.loadAndLogin("SUPERADMIN")
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_People();
    await metadatalibrary.jobTitleExpandButton();
    await metadatalibrary.addJobTitle_Button();
    await metadatalibrary.name(jobTitle);
    await metadatalibrary.description(FakerData.getDescription());
    await metadatalibrary.saveButton();
    await metadatalibrary.jobtitle_SearchField(jobTitle);
    await metadatalibrary.verify_JobTitile(jobTitle);

});