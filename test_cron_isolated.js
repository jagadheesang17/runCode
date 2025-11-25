// Test just the cron job execution in isolation
const { courseExpiry_CronJob } = require("./tests/admin/DB/DBJobs");

async function testCronJob() {
    console.log("🧪 Testing Course Expiry Cron Job in Isolation");
    console.log("===============================================");
    
    try {
        console.log("⏰ Starting cron job execution...");
        await courseExpiry_CronJob();
        console.log("✅ Cron job completed successfully!");
        
    } catch (error) {
        console.error("❌ Cron job failed:");
        console.error("Type:", error.constructor.name);
        console.error("Message:", error.message);
        
        if (error.message.includes('ETIMEDOUT')) {
            console.log("\n🔧 TROUBLESHOOTING TIPS:");
            console.log("1. Check if database server is reachable");
            console.log("2. Verify database credentials");
            console.log("3. Check network connectivity");
            console.log("4. Verify firewall settings");
        }
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log("\n🔧 CONNECTION REFUSED - Database server may be down");
        }
        
        if (error.message.includes('ER_ACCESS_DENIED')) {
            console.log("\n🔧 ACCESS DENIED - Check username/password");
        }
    }
}

testCronJob();