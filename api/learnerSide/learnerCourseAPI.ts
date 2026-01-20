import { postRequest } from "../../utils/requestUtils";
import { assertResponse, assertStatus } from "../../utils/verificationUtils";
import {cancelCourseEnrollment, getCourseDetails, getCourseEnrollments, getInstancesDetails, getSessionDetails, registerCourse} from "../../data/apiData/learner_formData";
import { URLConstants } from "../../data/apiData/apiUtil";

let endPointURL = URLConstants.learnerEndPointUrl
export async function retrive_CourseDetails( userName: string,code: any) {
    let response = await postRequest(getCourseDetails(code,userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function retrive_InstancesDetails( userName: string,code: any) {
    let response = await postRequest(getInstancesDetails(code, userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function enrollCourse( userName: string,code: any) {
    let response = await postRequest(registerCourse(code, userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function retrive_CourseEnrollments(userName: string) {
    let response = await postRequest(getCourseEnrollments(userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function retrive_SessionDetails(userName: string,instance_code: any) {
    let response = await postRequest(getSessionDetails(instance_code,userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}


export async function cancelCourseEnrollment_fn(userName: any,instCode: any) {
    let response = await postRequest(cancelCourseEnrollment(userName,instCode), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
    await assertResponse(response.data.message, "1 enrollment updated.");
}


