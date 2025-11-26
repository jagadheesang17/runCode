import { environmentSetup } from "../../playwright.config";
export let filePath: any;
switch (environmentSetup) {
    case "automationtenant":
        filePath = {
            tags: "../data/MetadataLibraryData/AutomationTenant/tags.json",
            ceuData: "../data/MetadataLibraryData/AutomationTenant/ceuData.json",
            ceuProvider : "../data/MetadataLibraryData/AutomationTenant/ceuProvider.json",
            provider : "../data/MetadataLibraryData/AutomationTenant/provider.json",
            department : "../data/MetadataLibraryData/AutomationTenant/department.json",
            empType : "../data/MetadataLibraryData/AutomationTenant/empType.json",
            jobRole : "../data/MetadataLibraryData/AutomationTenant/jobRole.json",
            jobTitle : "../data/MetadataLibraryData/AutomationTenant/jobTitle.json",
            userType : "../data/MetadataLibraryData/AutomationTenant/userType.json",
            catagory: "../data/MetadataLibraryData/AutomationTenant/catagory.json",
            location: "../data/MetadataLibraryData/AutomationTenant/location.json",
        }
        break;
    case "qa":
        filePath = {
            tags: "../data/MetadataLibraryData/QA/tags.json",
            ceuData: "../data/MetadataLibraryData/QA/ceuData.json",
            ceuProvider : "../data/MetadataLibraryData/QA/ceuProvider.json",
            provider : "../data/MetadataLibraryData/QA/provider.json",
            department : "../data/MetadataLibraryData/QA/department.json",
            empType : "../data/MetadataLibraryData/QA/empType.json",
            jobRole : "../data/MetadataLibraryData/QA/jobRole.json",
            jobTitle : "../data/MetadataLibraryData/QA/jobTitle.json",
            userType : "../data/MetadataLibraryData/QA/userType.json",
            catagory: "../data/MetadataLibraryData/QA/catagory.json",
            location: "../data/MetadataLibraryData/QA/location.json",
        }
        break;
    case "dev":
        filePath = {
            tags: "../data/MetadataLibraryData/QA/tags.json",
            ceuData: "../data/MetadataLibraryData/QA/ceuData.json",
            ceuProvider : "../data/MetadataLibraryData/QA/ceuProvider.json",
            provider : "../data/MetadataLibraryData/QA/provider.json",
            department : "../data/MetadataLibraryData/QA/department.json",
            empType : "../data/MetadataLibraryData/QA/empType.json",
            jobRole : "../data/MetadataLibraryData/QA/jobRole.json",
            jobTitle : "../data/MetadataLibraryData/QA/jobTitle.json",
            userType : "../data/MetadataLibraryData/QA/userType.json",
            catagory: "../data/MetadataLibraryData/QA/catagory.json",
            location: "../data/MetadataLibraryData/QA/location.json",
        }
        break;
    case "automation":
        filePath = {
            tags: "../data/MetadataLibraryData/QA/tags.json",
            ceuData: "../data/MetadataLibraryData/QA/ceuData.json",
            ceuProvider : "../data/MetadataLibraryData/QA/ceuProvider.json",
            provider : "../data/MetadataLibraryData/QA/provider.json",
            department : "../data/MetadataLibraryData/QA/department.json",
            empType : "../data/MetadataLibraryData/QA/empType.json",
            jobRole : "../data/MetadataLibraryData/QA/jobRole.json",
            jobTitle : "../data/MetadataLibraryData/QA/jobTitle.json",
            userType : "../data/MetadataLibraryData/QA/userType.json",
            catagory: "../data/MetadataLibraryData/QA/catagory.json",
            location: "../data/MetadataLibraryData/QA/location.json",
        }
        break;
    case "qaProduction":
        filePath = {
            tags: "../data/MetadataLibraryData/Production/tags.json",
            ceuData: "../data/MetadataLibraryData/Production/ceuData.json",
            ceuProvider : "../data/MetadataLibraryData/Production/ceuProvider.json",
            provider : "../data/MetadataLibraryData/Production/provider.json",
            department : "../data/MetadataLibraryData/Production/department.json",
            empType : "../data/MetadataLibraryData/Production/empType.json",
            jobRole : "../data/MetadataLibraryData/Production/jobRole.json",
            jobTitle : "../data/MetadataLibraryData/Production/jobTitle.json",
            userType : "../data/MetadataLibraryData/Production/userType.json",
            catagory: "../data/MetadataLibraryData/Production/catagory.json",
            location: "../data/MetadataLibraryData/Production/location.json",
        }
        break;
    default:
        throw new Error(`Invalid environment setup: ${environmentSetup}`);
}
