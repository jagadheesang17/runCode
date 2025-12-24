import { getRequest, postRequest } from "../utils/requestUtils";
import { attachCourses, createCourseEnrollmentForProgram, createEnrollmentForProgram, listofAttachedCoursesFromProgram, listofProgram, listofProgramEnrollment, updateEnrollmentForProgram } from "../data/apiData/formData";
import { assertResponse, assertStatus } from "../utils/verificationUtils";
import { URLConstants } from "../data/apiData/apiUtil";

let endPointURL = URLConstants.adminEndPointUrl
export async function getListofPrograms() {
    let response = await postRequest(listofProgram, endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function getListofProgramEnrollment(programCode: string) {
    let response = await postRequest(listofProgramEnrollment(programCode), endPointURL);
    console.log(response.data);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.status, "success");
        // //const courseDetails = response.data.data[0].course_details;
        // const courseDetails = response.data.data[0].module_id; 
        // return [courseDetails];
}

export async function enrollProgram(code: any, userName: string) {
    let response = await postRequest(createEnrollmentForProgram(code, userName), endPointURL);
    console.log(response.data);
}

export async function getListAttachedCoursesFromPrograms(programCode: string) {
    let response = await postRequest(listofAttachedCoursesFromProgram(programCode), endPointURL);
    console.log(response.data);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.status, "success");
        //const courseDetails = response.data.data[0].course_details;
        const courseDetails = response.data.data[0].module_id;
        return [courseDetails];
}

//Admin->attachCourses to the training plan:-
export async function attachCoursestotp(crs_code:any,prgm_code:any){
    let response=await postRequest(attachCourses(crs_code,prgm_code), endPointURL);
    console.log(response.data);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.status, "success");
}


export async function updateProgramEnrollment(code: any, userName: string) {
    const response = await postRequest(updateEnrollmentForProgram(code, userName, "completed"), endPointURL);
    console.log(response.data);

    await assertStatus(response.status, 200);

    // ✅ Access nested status field
    const actualStatus = response.data?.[0]?.[0]?.status;
    await assertResponse(actualStatus, "success");
}

export async function enrollCourseForProgram(code: any,courseCode:string, userName: string) {
    let response = await postRequest(createCourseEnrollmentForProgram(code, courseCode,userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}
export async function getListofAttachedCoursesFromProgram(programCode: string) {
    let response = await postRequest(listofAttachedCoursesFromProgram(programCode), endPointURL);
    console.log(response.data.new_course_enrollments);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.status, "success");
}






