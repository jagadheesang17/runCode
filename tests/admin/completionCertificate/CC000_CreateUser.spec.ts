import { test } from "@playwright/test";
import { userCreation } from "../../../api/userAPI";
import { userCreationData } from "../../../data/apiData/formData";
import { FakerData } from "../../../utils/fakerUtils";
import * as fs from 'fs';
import * as path from 'path';

let createdUserId: any;
let generatingusername: string;
let certificateUserData: any;

test.describe('CC000 - Create Certificate Test User', () => {
    
    test('CC000 - Create dedicated user for certificate tests', async () => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC000_Create_Certificate_Test_User' },
            { type: 'Test Description', description: 'Create a dedicated learner for certificate validation tests (CC012-CC015)' }
        );

        // Generate OAuth token
        console.log('✅ Access Token will be auto-generated');

        generatingusername = FakerData.getUserId();
        console.log(`🔄 Creating user with username: ${generatingusername}`);

        const userData = userCreationData(generatingusername);
        
        createdUserId = await userCreation(userData);
        console.log(`✅ User created with ID: ${createdUserId}`);

        certificateUserData = {
            firstname: userData.first_name,
            lastname: userData.last_name,
            username: userData.username,
            password: "Welcome1@",
            userId: createdUserId,
            email: `${userData.username}`,
            createdDate: new Date().toISOString()
        };

        const dataDir = path.join(process.cwd(), 'data', 'completionCertificate');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const filePath = path.join(dataDir, 'certificateTestUser.json');
        fs.writeFileSync(filePath, JSON.stringify(certificateUserData, null, 2));

        console.log('✅ Certificate test user data saved to:', filePath);
        console.log('📋 User Details:');
        console.log(`   - First Name: ${certificateUserData.firstname}`);
        console.log(`   - Last Name: ${certificateUserData.lastname}`);
        console.log(`   - Username: ${certificateUserData.username}`);
        console.log(`   - User ID: ${certificateUserData.userId}`);
        console.log(`   - Email: ${certificateUserData.email}`);
        console.log('✅ This user will be used for CC012, CC013, CC015 certificate tests');
    });
});
