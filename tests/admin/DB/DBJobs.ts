
import DB from "../../../utils/dbUtil";
import data from "../../../data/dbData/dbCredentials.json"
import { format, addMinutes, addDays, subDays } from 'date-fns';
import { environmentSetup } from "../../../playwright.config";
data.qa_production_database_config["DBTenant_&_Portal"].portal_ID

const dataBase = new DB();
let dbName: string;


switch (environmentSetup) {
    case "qa":
        dbName = "qa_features_database_config";
        break;
    case "automation":
        dbName = "qa_auto_database_config";
        break;
    case "qaProduction":
        dbName = "qa_production_database_config";
        break;
        case "dev":
        dbName = "dev_database_config";
        break;
    default:
        throw new Error(`Invalid environment setup: ${environmentSetup}`);
}
let tenant_ID = data[dbName]["DBTenant_&_Portal"].tenant_ID;
let portal_ID = data[dbName]["DBTenant_&_Portal"].portal_ID;

//passwordHistoryStatusUpdate cron job
//This cron job is used to update the password history status in the database
 async function passwordHistoryStatusUpdate() {
    const currentTimeResult = await dataBase.executeQuery("SELECT NOW()");
    const currentTimeString = currentTimeResult[0]['NOW()'];
    const currentTime = new Date(currentTimeString);
    console.log("Current Time : " + currentTime);
    const newTime = (subDays(currentTime, 1));
    const previousDate = format(newTime, 'yyyy-MM-dd');
    console.log("Previous Date :" + previousDate);
    let passwordHistoryStatusUpdate_master = await dataBase.executeQuery(`UPDATE cron_master SET status='1' WHERE name = 'Password History Status Update' AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}'`)
    let passwordHistoryStatusUpdate_details = await dataBase.executeQuery(`UPDATE cron_details SET status = '1', next_run = '${previousDate}',current_status= 'waiting', previous_status = '' WHERE tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' AND name='Password History Status Update';`)
    console.log(passwordHistoryStatusUpdate_master);
    console.log(passwordHistoryStatusUpdate_details);
    return passwordHistoryStatusUpdate
}

//Cron_master (SELECT AND UPDATE)
export async function autoRegister() {
    let AutoRegister = await dataBase.executeQuery(` SELECT * FROM cron_master WHERE name = 'Autoregister' and tenant_id='${tenant_ID}'`);
    let updatedAutoRegister = await dataBase.executeQuery(`UPDATE cron_master SET status='1' WHERE name = 'Autoregister' and tenant_id='${tenant_ID}'`);
    console.log(AutoRegister);
    console.log(updatedAutoRegister);
}

//Cron_details (Static Method)
export async function courseAutoRegister() {
    let courseAutoRegister = await dataBase.executeQuery(`SELECT * FROM cron_details WHERE name = 'Course Autoregister' AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}'`);
    console.log(courseAutoRegister);
    let updateCourseAutoRegister = await dataBase.executeQuery(`UPDATE cron_details SET status='1' WHERE name = 'Course Autoregister' AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}'`)
    console.log(updateCourseAutoRegister);
    return courseAutoRegister

}

async function certificationExpiry_CronJob() {
    try {


        const currentTimeResult = await dataBase.executeQuery("SELECT NOW()");
        const currentTimeString = currentTimeResult[0]['NOW()'];

        const currentTime = new Date(currentTimeString);
        const pastDate = currentTime.setDate(currentTime.getDate() - 2);
        const formattedPreviousDate = format(pastDate, 'yyyy-MM-dd HH:mm:ss');

        //Query to retrive the data
        const programEnrollment = await dataBase.executeQuery(`SELECT * FROM program_enrollment ORDER BY id DESC LIMIT 1;`)
        console.log(programEnrollment);

        const idString = String(programEnrollment[0].id);
        console.log("Retrived Id = " + idString);

        //Query to UPDATE the ProgramEnrollment 

        const formattedCurrentTime = format(currentTime, 'yyyy-MM-dd HH:mm:ss');
        console.log('Formatted Current Time:', formattedCurrentTime);
        currentTime.setDate(currentTime.getDate() + 2)
        const newTime = new Date(currentTime.getTime() - 15 * 60 * 1000);
        const formattedNewTime = format(newTime, 'yyyy-MM-dd HH:mm:ss');
        console.log('Formatted New Time (15 mins subtracted):', formattedNewTime);
        const updateProgramEnrollment = await dataBase.executeQuery(`UPDATE program_enrollment SET completion_date='${formattedPreviousDate}',expired_on='${formattedNewTime}' WHERE id='${idString}' AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}';`)
        console.log(updateProgramEnrollment);

        await dataBase.executeQuery(`UPDATE cron_master SET status='1' WHERE tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}'AND name='Expire Certification';`)
        const verification = await dataBase.executeQuery(`SELECT * FROM program_enrollment WHERE id=${idString} ;`)
        const completionDate = verification[0].completion_date
        console.log("The Updated Completion date = " + completionDate);


  

        const cronJob = await dataBase.executeQuery(`UPDATE cron_details SET next_run='${formattedNewTime}',current_status='waiting', previous_status=''  WHERE name='Expire Certification' AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}';`)
        console.log(cronJob);

    } catch (error) {
        console.log("Not executed " + error);
    }

}
async function updatecronForBanner() {
    try {
        const currentTimeResult = await dataBase.executeQuery("SELECT NOW()");
        const currentTimeString = currentTimeResult[0]['NOW()'];
        const currentTime = new Date(currentTimeString);
        const formattedCurrentTime = format(currentTime, 'yyyy-MM-dd HH:mm:ss');
        console.log('Formatted Current Time:', formattedCurrentTime);
        const newTime = addMinutes(subDays(currentTime, 1), 15);
        const formattedNewTime = format(newTime, 'yyyy-MM-dd HH:mm:ss');
        console.log('Formatted New Time (after 15 minutes):', formattedNewTime);


        const banner = await dataBase.executeQuery(`SELECT * FROM banner ORDER BY id DESC LIMIT 1;`)
        console.log(banner);
        const idString = String(banner[0].id);
        console.log("Retrived Id = " + idString);
        const updateBanner = await dataBase.executeQuery(`UPDATE banner SET date_activate='${formattedNewTime}',date_deactivate='${formattedNewTime}' WHERE id=${idString} AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}';`)
        console.log(updateBanner);



    } catch (error) {
        console.log("Not executed " + error);
    }
}



async function updatetableForAnnoncement() {
    try {
        const currentTimeResult = await dataBase.executeQuery("SELECT NOW()");
        const currentTimeString = currentTimeResult[0]['NOW()'];
        const currentTime = new Date(currentTimeString);
        const formattedCurrentTime = format(currentTime, 'yyyy-MM-dd HH:mm:ss');
        console.log('Formatted Current Time:', formattedCurrentTime);
        const newTime = addMinutes(subDays(currentTime, 1), 15);
        const formattedNewTime = format(newTime, 'yyyy-MM-dd HH:mm:ss');
        console.log('Formatted New Time (after 15 minutes):', formattedNewTime);
        const announcement = await dataBase.executeQuery(`SELECT * FROM announcement ORDER BY id DESC LIMIT 1;`);
        console.log(announcement);
        const idString = String(announcement[0].id);
        console.log("Retrived Id = " + idString);
        const updateAnnouncement = await dataBase.executeQuery(` UPDATE announcement SET from_date='${formattedNewTime}',to_date='${formattedNewTime}' WHERE id=${idString} AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}';`)
        console.log(updateAnnouncement);
    } catch (error) {
        console.log("Not executed " + error);
    }

}
//To register compliance certification:-

async function updateCertificationComplianceFlow() {
    await autoRegister();
    let learningPlanAndCertification = await dataBase.executeQuery(`SELECT * FROM cron_details WHERE name = 'LearningPlan and Certification AutoRegister' AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}';`);
    console.log(learningPlanAndCertification);
    const currentTimeResult = await dataBase.executeQuery("SELECT NOW()");
    const currentTimeString = currentTimeResult[0]['NOW()'];
    const currentTime = new Date(currentTimeString);
    const pastDate = currentTime.setDate(currentTime.getDate());
    const formattedPreviousDate = format(pastDate, 'yyyy-MM-dd HH:mm:ss');
    console.log(formattedPreviousDate);
    const newTime = new Date(currentTime.getTime() - 15 * 60 * 1000);
    const formattedNewTime = format(newTime, 'yyyy-MM-dd HH:mm:ss');
    console.log('Formatted New Time (15 mins subtracted):', formattedNewTime);
    let updateLearningPlan = await dataBase.executeQuery(`UPDATE cron_details SET status = '1', next_run='${formattedNewTime}',current_status='waiting',previous_status=''  WHERE name='LearningPlan AND Certification AutoRegister' and tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}';`);
    console.log(updateLearningPlan);
}


//To run cron details 
//Course Auto-register
async function updateSingleInstanceAutoRegister() {
    await autoRegister(); //To Run cron master
    let courseAutoRegiter = await dataBase.executeQuery(`SELECT * FROM cron_details WHERE name = 'Course Autoregister' AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}'`);
    let fetchCronID = String(courseAutoRegiter[0].cron_id);
    console.log("Retrived learningPlanId is : " + fetchCronID);
    const currentTimeResult = await dataBase.executeQuery("SELECT NOW()");
    const currentTimeString = currentTimeResult[0]['NOW()'];
    const currentTime = new Date(currentTimeString);
    const newTime = new Date(currentTime.getTime() - 15 * 60 * 1000);
    const formattedNewTime = format(newTime, 'yyyy-MM-dd HH:mm:ss');
    console.log('Formatted New Time (15 mins subtracted):', formattedNewTime);
    let updateCourseAutoRegister = await dataBase.executeQuery(`UPDATE cron_details SET status = '1', next_run='${formattedNewTime}',current_status = 'waiting', previous_status ='' WHERE name='Course AutoRegister' AND tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}'`)
    console.log(updateCourseAutoRegister);



}


async function courseEnrollmentCron() {
    const currentTimeResult = await dataBase.executeQuery("SELECT NOW()");
    const currentTimeString = currentTimeResult[0]['NOW()'];
    const currentTime = new Date(currentTimeString);
    console.log("Current Time : " + currentTime);
    const newTime = (subDays(currentTime, 1));
    const previousDate = format(newTime, 'yyyy-MM-dd');
    console.log("Previous Date :" + previousDate);
    /*  let lastRecord = await dataBase.executeQuery(`SELECT * FROM catalog_compliance ORDER BY id DESC LIMIT 1;`);
     let latestId = lastRecord[0].id;
     console.log(latestId); */
    let catalog_compliance = await dataBase.executeQuery(`UPDATE  catalog_compliance  SET  complete_date  = '${previousDate}' WHERE  tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' ORDER BY id desc limit 1;`);
    console.log(catalog_compliance);
    let updateCourseEnrollment = await dataBase.executeQuery(`UPDATE course_enrollment  SET  register_date  = '${previousDate}' WHERE  tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' ORDER BY id desc limit 1;`);
    console.log(updateCourseEnrollment);
    await dataBase.executeQuery(`UPDATE cron_master SET  status  = '1' WHERE tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' AND name='Enrollment Updates'`);
    const cronRunTime = new Date(currentTime.getTime() - 15 * 60 * 1000);
    const subTime = format(cronRunTime, 'yyyy-MM-dd HH:mm:ss');
    console.log('Formatted New Time (15 mins subtracted):', subTime);
    let cronDetails = await dataBase.executeQuery(`UPDATE cron_details SET status = '1', next_run= '${subTime}' ,current_status= 'waiting', previous_status = '' WHERE tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' AND name='Course Enrollment Update';`);
    console.log(cronDetails);
}

async function programEnrollmentCron() {
    const currentTimeResult = await dataBase.executeQuery("SELECT NOW()");
    const currentTimeString = currentTimeResult[0]['NOW()'];
    const currentTime = new Date(currentTimeString);
    console.log("Current Time : " + currentTime);
    const newTime = (subDays(currentTime, 1));
    const previousDate = format(newTime, 'yyyy-MM-dd');
    console.log("Previous Date :" + previousDate);
    /*  let lastRecord = await dataBase.executeQuery(`SELECT * FROM catalog_compliance ORDER BY id DESC LIMIT 1;`);
     let latestId = lastRecord[0].id;
     console.log(latestId); */
    let catalog_compliance = await dataBase.executeQuery(`UPDATE  program_structure  SET  complete_date  = '${previousDate}' WHERE  tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' ORDER BY id desc limit 1;`);
    console.log(catalog_compliance);
    let updateCourseEnrollment = await dataBase.executeQuery(`UPDATE program_enrollment  SET  register_date  = '${previousDate}' WHERE  tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' ORDER BY id desc limit 1;`);
    console.log(updateCourseEnrollment);
    await dataBase.executeQuery(`UPDATE cron_master SET  status  = '1' WHERE tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' AND name='Enrollment Updates'`);
    const cronRunTime = new Date(currentTime.getTime() - 15 * 60 * 1000);
    const subTime = format(cronRunTime, 'yyyy-MM-dd HH:mm:ss');
    console.log('Formatted New Time (15 mins subtracted):', subTime);
   // let cronDetails = await dataBase.executeQuery(`UPDATE cron_details SET status = '1', next_run= '${subTime}' ,current_status= 'waiting', //previous_status = '' WHERE tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' AND name='Course Enrollment Update';`);
	let cronDetails = await dataBase.executeQuery(`UPDATE cron_details SET status = '1', next_run= '${subTime}' ,current_status= 'waiting', previous_status = '' WHERE tenant_id='${tenant_ID}' AND portal_id ='${portal_ID}' AND name='Program Enrollment Update';`);
    console.log(cronDetails);
}


async function catalogDetail() {
    let catalog_detail = await dataBase.executeQuery(`SELECT * FROM catalog_details WHERE portal_id=${portal_ID} AND tenant_id=${tenant_ID}  ORDER BY id DESC LIMIT 1 ;`);
    console.log("Created ILT fetched Code = " + catalog_detail[0].code);
    return catalog_detail[0].code

}
async function course_session_details() {
    let course_session = await dataBase.executeQuery(`SELECT * FROM course_session_details WHERE portal_id=${portal_ID} AND tenant_id=${tenant_ID} ORDER BY ID DESC LIMIT 1 ;`);
    let featchedDate = course_session[0].date
    const date = new Date(featchedDate);
    const formattedDate = date.toISOString().split('T')[0];
    console.log("Featched date fro ILT Course = " + formattedDate);
    return formattedDate;

}

//DB Verification for user GUID in customer_custom_id
async function verifyUserGuidInDatabase(userId: string, expectedGuid: string) {
    try {
        console.log(`🔍 Verifying GUID in database for UserID: ${userId}, Expected GUID: ${expectedGuid}`);
        
        const query = `SELECT * FROM users_view WHERE userid='${userId}' AND customer_custom_id='${expectedGuid}' AND tenant_id=${tenant_ID} AND portal_id=${portal_ID}`;
        console.log(`📋 Executing query: ${query}`);
        
        const result = await dataBase.executeQuery(query);
        console.log(`📊 Query result:`, result);
        
        if (result && result.length > 0) {
            console.log(`✅ GUID verification successful: Found user with ID ${userId} and GUID ${expectedGuid}`);
            console.log(`📋 User details: Username: ${result[0].username}, Customer Custom ID: ${result[0].customer_custom_id}`);
            return true;
        } else {
            console.log(`❌ GUID verification failed: No user found with ID ${userId} and GUID ${expectedGuid}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Database verification error:`, error);
        throw error;
    }
}

export { courseEnrollmentCron,programEnrollmentCron, certificationExpiry_CronJob, updatecronForBanner,catalogDetail, course_session_details,updatetableForAnnoncement, updateCertificationComplianceFlow, updateSingleInstanceAutoRegister,passwordHistoryStatusUpdate,verifyUserGuidInDatabase}