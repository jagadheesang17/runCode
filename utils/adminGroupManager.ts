import { AdminGroupPage } from "../pages/AdminGroupPage";
import { AdminHomePage } from "../pages/AdminHomePage";
import { getItemByProperty } from "./jsonDataHandler";

/**
 * Utility class for managing admin groups in tests
 * Provides functions to check if groups exist and create them only if needed
 */
export class AdminGroupManager {
    
    /**
     * Get environment folder based on playwright config
     * @returns string - Environment folder name
     */
    private static getEnvironmentFolder(): string {
        const { environmentSetup } = require("../playwright.config");
        
        switch (environmentSetup) {
            case "qa":
                return "QA";
            case "dev":
                return "Dev";
            case "automation":
                return "Automation";
            case "qaProduction":
            default:
                return "Production";
        }
    }
    
    /**
     * Check if admin group exists in the UI
     * @param adminGroup - AdminGroupPage instance
     * @param groupTitle - Name of the group to check
     * @returns Promise<boolean> - true if group exists, false otherwise
     */
    static async checkGroupExists(adminGroup: AdminGroupPage, groupTitle: string): Promise<boolean> {
        try {
            // Use the existing searchAdmin method to search for the group
            await adminGroup.searchAdmin(groupTitle);
            
            // Wait for search results and check if group appears
            await adminGroup.page.waitForTimeout(2000); // Give time for search results
            return true;
        } catch (error) {
            // If search fails, group doesn't exist
            console.log(`Group '${groupTitle}' not found in UI`);
            return false;
        }
    }

    /**
     * Create admin group with specified role if it doesn't exist
     * @param adminHome - AdminHomePage instance
     * @param adminGroup - AdminGroupPage instance  
     * @param groupData - Group data object with title, role, and description
     */
    static async ensureGroupExists(adminHome: AdminHomePage, adminGroup: AdminGroupPage, groupData: any): Promise<void> {
        // Navigate to admin groups page
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();

        // Check if group already exists
        const exists = await this.checkGroupExists(adminGroup, groupData.groupTitle);
        
        if (!exists) {
            console.log(`Creating admin group: ${groupData.groupTitle}`);
            
            // Create the group
            await adminGroup.clickCreateGroup();
            await adminGroup.enterGroupTitle(groupData.groupTitle);
            
            // Select the role for the group
            await adminGroup.selectroleAdmin(groupData.roleName);
            
            // Activate the group
            await adminGroup.clickActivate();
            
            // Save the group
            await adminGroup.clickSave();
            
            // Handle proceed dialog if it appears
            try {
                await adminGroup.clickProceed();
            } catch (error) {
                // Proceed dialog may not appear, continue
                console.log("Proceed dialog not present, continuing...");
            }
            
            console.log(`Successfully created admin group: ${groupData.groupTitle}`);
        } else {
            console.log(`Admin group '${groupData.groupTitle}' already exists, skipping creation`);
        }
    }

    /**
     * Get custom group data by test type from JSON file (environment-aware)
     * @param testType - Type of test (basic, advanced, manager, search, export, system_default)
     * @param fileName - Name of the JSON file (optional, auto-determined based on testType)
     * @returns Promise<any> - Group data object
     */
    static async getGroupDataByType(testType: string, fileName?: string): Promise<any> {
        const environmentFolder = this.getEnvironmentFolder();

        // Auto-determine fileName based on testType if not provided
        if (!fileName) {
            if (testType === "system_default" || testType === "default") {
                fileName = "DefaultAdminGroups.json";
            } else {
                fileName = "CustomAdminGroups.json";
            }
        }

        const filePath = `./data/MetadataLibraryData/${environmentFolder}/${fileName}`;
        const group = getItemByProperty(filePath, "testType", testType);
        
        if (!group) {
            throw new Error(`No custom group found for test type: ${testType} in file: ${filePath}`);
        }

        return group;
    }

    /**
     * Store created group data in custom JSON for cross-test usage
     * @param groupTitle - Title of the created group
     * @param roleName - Associated role name
     * @param description - Description of the group
     * @param testType - Test type identifier for retrieval
     */
    static async storeCreatedGroup(groupTitle: string, roleName: string, description: string = "Custom admin group created for testing", testType: string = "AG009"): Promise<void> {
        const fs = require('fs');
        const environmentFolder = this.getEnvironmentFolder();
        const groupsPath = `./data/MetadataLibraryData/${environmentFolder}/CustomAdminGroups.json`;
        
        try {
            let groups = [];
            
            // Try to read existing file, if it doesn't exist create empty array
            try {
                groups = JSON.parse(fs.readFileSync(groupsPath, 'utf8'));
            } catch (readError) {
                console.log(`CustomAdminGroups.json not found in ${environmentFolder}, creating new file`);
                groups = [];
            }
            
            const newGroup = {
                "groupTitle": groupTitle,
                "roleName": roleName,
                "description": description,
                "testType": testType,
                "isActive": true
            };
            
            // Add to groups if not already exists
            const exists = groups.find((group: any) => group.groupTitle === groupTitle);
            if (!exists) {
                groups.push(newGroup);
                fs.writeFileSync(groupsPath, JSON.stringify(groups, null, 4));
                console.log(`Group '${groupTitle}' stored in ${environmentFolder}/CustomAdminGroups.json`);
            } else {
                console.log(`Group '${groupTitle}' already exists in ${environmentFolder}/CustomAdminGroups.json`);
            }
        } catch (error) {
            console.error(`Error storing group '${groupTitle}' in ${environmentFolder}:`, error);
        }
    }
}