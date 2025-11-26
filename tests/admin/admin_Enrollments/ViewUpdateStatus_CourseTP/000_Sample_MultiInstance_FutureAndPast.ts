import { test } from "../../../../customFixtures/expertusFixture"
import { createILTMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";

test.describe("Sample: Multi-Instance ILT Creation - Future and Past Dates", () => {
    let futureCourseName: string;
    let pastCourseName: string;
    let futureInstanceNames: string[];
    let pastInstanceNames: string[];

    // test("Test 1: Create Multi-Instance ILT Course with Future Dates", async () => {
    //     console.log("\n🎓 TEST 1: Creating Multi-Instance ILT Course with Future Dates");
        
    //     // Create course with 3 future instances
    //     futureCourseName = `Future ILT ${Date.now()}`;
    //     futureInstanceNames = await createILTMultiInstance(
    //         futureCourseName,
    //         "published",
    //         3,  // 3 instances
    //         "future"  // Future dates
    //     );
        
    //     console.log(`✅ Created Future ILT Course: ${futureCourseName}`);
    //     console.log(`📋 Instance Names:`, futureInstanceNames);
    //     console.log(`   - ${futureInstanceNames[0]}`);
    //     console.log(`   - ${futureInstanceNames[1]}`);
    //     console.log(`   - ${futureInstanceNames[2]}`);
    // });

    test("Test 2: Create Multi-Instance ILT Course with Past Dates", async () => {
        console.log("\n🎓 TEST 2: Creating Multi-Instance ILT Course with Past Dates");
        
        // Create course with 3 past instances
        pastCourseName = `Past ILT ${Date.now()}`;
        pastInstanceNames = await createILTMultiInstance(
            pastCourseName,
            "published",
            3,  // 3 instances
            "pastclass"  // Past dates
        );
        
        console.log(`✅ Created Past ILT Course: ${pastCourseName}`);
        console.log(`📋 Instance Names:`, pastInstanceNames);
        console.log(`   - ${pastInstanceNames[0]}`);
        console.log(`   - ${pastInstanceNames[1]}`);
        console.log(`   - ${pastInstanceNames[2]}`);
    });

});
