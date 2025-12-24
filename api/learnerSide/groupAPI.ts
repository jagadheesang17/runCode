import { postRequest } from "../../utils/requestUtils";
import { assertResponse, assertStatus } from "../../utils/verificationUtils";
import {cancelCourseEnrollment, getCourseDetails, getCourseEnrollments, getInstancesDetails, getSessionDetails, registerCourse} from "../../data/apiData/learner_formData";
import { URLConstants } from "../../data/apiData/apiUtil";

let endPointURL = URLConstants.learnerEndPointUrl
export async function retrive_CourseDetails( userName: string,code: any) {
    let response = await postRequest(createAdminGroup(code,userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function retrive_InstancesDetails( userName: string,code: any) {
    let response = await postRequest(updateAdminGroup(code, userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function enrollCourse( userName: string,code: any) {
    let response = await postRequest(manageUserInAdminGroup(code, userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function retrive_CourseEnrollments(userName: string) {
    let response = await postRequest(manageEnrollmentsInAdminGroup(userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}


