import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";
test.describe(`TC019_Verify_metadataLibrary_Learning.spec.ts`, async () => {
    const categoryName: any = FakerData.getCategory();
    test(`Ensure that a new category can be created successfully`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Ajay Michael' },
            { type: 'TestCase', description: 'Ensure that a new category can be created successfully' },
            { type: 'Test Description', description: "Ensure that a new category can be created successfully" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        await metadatalibrary.addCategory();
        await metadatalibrary.name(categoryName);
        await metadatalibrary.description(FakerData.getDescription());
        await metadatalibrary.saveButton();
        await metadatalibrary.categorySearchfield(categoryName);
        await metadatalibrary.verifyCategory(categoryName)

    })

    const providerName = FakerData.getCategory();
    test(`Ensure that a new provider can be created successfully`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Ajay Michael' },
            { type: 'TestCase', description: 'Ensure that a new provider can be created successfully' },
            { type: 'Test Description', description: "Ensure that a new provider can be created successfully" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        await metadatalibrary.providerExpandButton();
        await metadatalibrary.addProvider();
        await metadatalibrary.name(providerName);
        await metadatalibrary.description(FakerData.getDescription());
        await metadatalibrary.saveButton();
        await metadatalibrary.providerSearchField(providerName);
        await metadatalibrary.verifyProvider(providerName);
    })


    const CEU_ProviderName = FakerData.getCategory();
    test(`Verify that a CEU provider can be added under Metadata Library - Learning - CEU Provider`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Ajay Michael' },
            { type: 'TestCase', description: 'Verify that a CEU provider can be added under Metadata Library - Learning - Ceu Provider' },
            { type: 'Test Description', description: "Creaing a CEU provider in Metadata Library with in the Learning - Ceu Provider" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        await metadatalibrary.CEU_ProviderExpandButton();
        await metadatalibrary.add_CEU_Provider();
        await metadatalibrary.name(CEU_ProviderName);
        await metadatalibrary.description(FakerData.getDescription());
        await metadatalibrary.saveButton();
        await metadatalibrary.ceuProviderSearchField(CEU_ProviderName);
        await metadatalibrary.verifyceuProvider(CEU_ProviderName);

    })

    const ceuTypeName = FakerData.getCategory();
    test(`Verify that a CEU Type can be added under Metadata Library - Learning - CEU Type`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Ajay Michael' },
            { type: 'TestCase', description: 'Verify that a CEU Type can be added under Metadata Library - Learning - CEU Type' },
            { type: 'Test Description', description: "Creaing a CEU Type in Metadata Library with in the Learning CEU Type" }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        await metadatalibrary.CEU_TypeExpandButton();
        await metadatalibrary.addCEU_Type();
        await metadatalibrary.name(ceuTypeName);
        await metadatalibrary.description(FakerData.getDescription());
        await metadatalibrary.saveButton();
        await metadatalibrary.ceuTypeSearchField(ceuTypeName);
        await metadatalibrary.verify_ceuType(ceuTypeName)
    })

    const tagName = FakerData.getCategory();
    test(`Verify that a tags can be added under Metadata Library - Learning - Tags`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Ajay Michael' },
            { type: 'TestCase', description: 'Verify that a tags can be added under Metadata Library - Learning - Tags' },
            { type: 'Test Description', description: "Creaing a Tags in Metadata Library with in the Learning Tags" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_learning();
        await metadatalibrary.tagsExpandButton();
        await metadatalibrary.addTags();
        await metadatalibrary.name(tagName);
        await metadatalibrary.saveButton();
        await metadatalibrary.tagsSearchField(tagName);
        await metadatalibrary.verify_Tags(tagName)
    });

})