import DB from "../utils/dbUtil.js";
import data from "../data/dbData/dbCredentials.json" with { type: "json" };

async function testDatabaseConnection() {
    console.log("🔍 Testing Database Connection...");
    console.log("================================");
    
    const dataBase = new DB();
    
    try {
        console.log("📊 Environment: qaProduction");
        console.log("🏢 Database: qa_automation_iris");
        console.log("🌐 Host: mysql-dev-master-ncus.mysql.database.azure.com");
        
        // Test basic connection
        console.log("\n1️⃣ Testing basic connection...");
        const connectionTest = await dataBase.executeQuery("SELECT 1 as test");
        console.log("✅ Basic connection successful:", connectionTest);
        
        // Test timestamp query
        console.log("\n2️⃣ Testing timestamp query...");
        const timeResult = await dataBase.executeQuery("SELECT NOW() as current_time");
        console.log("✅ Current database time:", timeResult[0].current_time);
        
        // Test course_enrollment table access
        console.log("\n3️⃣ Testing course_enrollment table access...");
        const enrollmentCheck = await dataBase.executeQuery("SELECT COUNT(*) as count FROM course_enrollment LIMIT 1");
        console.log("✅ Course enrollment table accessible. Record count:", enrollmentCheck[0].count);
        
        // Test latest enrollment record
        console.log("\n4️⃣ Testing latest enrollment record...");
        const latestEnrollment = await dataBase.executeQuery("SELECT id, completion_date, expired_on FROM course_enrollment ORDER BY id DESC LIMIT 1");
        if (latestEnrollment.length > 0) {
            console.log("✅ Latest enrollment record:");
            console.log(`   • ID: ${latestEnrollment[0].id}`);
            console.log(`   • Completion Date: ${latestEnrollment[0].completion_date}`);
            console.log(`   • Expired On: ${latestEnrollment[0].expired_on}`);
        } else {
            console.log("⚠️  No enrollment records found");
        }
        
        console.log("\n🎉 All database tests passed!");
        return true;
        
    } catch (error) {
        console.error("\n❌ Database connection failed:");
        console.error("Error details:", error.message);
        console.error("Stack:", error.stack);
        return false;
    }
}

// Run the test
testDatabaseConnection()
    .then(success => {
        if (success) {
            console.log("\n✅ Database is ready for cron job execution");
        } else {
            console.log("\n❌ Database connection issues need to be resolved");
        }
    })
    .catch(error => {
        console.error("\n💥 Unexpected error:", error);
    });