import { getRequest, postRequest } from "../../utils/requestUtils";
import { assertResponse, assertStatus } from "../../utils/verificationUtils";
import { cancelTPEnrollment, getProgramCourseDetails, getProgramDetails, getProgramEnrollments, getProgramModulesDetails, registerProgram, registerProgramCourse } from "../../data/apiData/learner_formData";
import { URLConstants } from "../../data/apiData/apiUtil";
let endPointURL = URLConstants.learnerEndPointUrl

export async function retrive_ProgramDetails( userName: string,code: any) {
    let response = await postRequest(getProgramDetails(code, userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}


export async function enrollTrainingPlan( userName: string,code: any) {
    let response = await postRequest(registerProgram(code,userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function retrive_ProgramEnrollments(userName: string) {
    let response = await postRequest(getProgramEnrollments(userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function enrollProgramCourse(code: any,courseCode:string, userName: string) {
    let response = await postRequest(registerProgramCourse(code, courseCode,userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function retrive_ProgramModulesDetails(userName: string,code: any) {
    let response = await postRequest(getProgramModulesDetails(code, userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function retrive_ProgramCourseDetails(userName: string,code: any) {
    let response = await postRequest(getProgramCourseDetails(code, userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function cancelProgramEnrollment(userName: string,code: any) {
    let response = await postRequest(cancelTPEnrollment(code,userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}
export async function getTPEnrollmentCount(userName: string,code: any) {
    let response = await postRequest(cancelTPEnrollment(code,userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}