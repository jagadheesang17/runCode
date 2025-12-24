import { URLConstants } from "../data/apiData/apiUtil";
import { createEnrollmentForCourse, deleteCourse, getInstanceCourseList, listCourseEnrollment, listofCourse, updateEnrolledCourse } from "../data/apiData/formData";
import { postRequest } from "../utils/requestUtils";
import { assertResponse, assertStatus } from "../utils/verificationUtils";

let endPointURL = URLConstants.adminEndPointUrl
export async function retrive_listofCourse() {
    let response = await postRequest(listofCourse, endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function enrollCourse(code: any, userName: string) {
    let response = await postRequest(createEnrollmentForCourse(code, userName), endPointURL);
    console.log(response.data);

}

export async function completeEnrolledCourse(code: any, userName: string) {
    let response = await postRequest(updateEnrolledCourse(code, userName, "completed"), endPointURL);
    console.log(response.data);

}

export async function CancelEnrolledCourse(code: any, userName: string) {
    let response = await postRequest(updateEnrolledCourse(code, userName, "cancel"), endPointURL);
    console.log(response.data);

}

export async function listEnrolledCourse(code: any, userName: string) {
    let response = await postRequest(listCourseEnrollment(code, userName), endPointURL);
    console.log(response.data); 

}

export async function deleteTheCreatedCourse(code: any) {
    let response = await postRequest(deleteCourse(code), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");

}

//Admin->getgetInstanceCourseAPI
export async function getInstanceCourseAPI(entity_code: any) {
    let response = await postRequest(getInstanceCourseList(entity_code), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");

}

export async function updateCourseEnrollment(code: any,userName: string,status: any) {
    let response = await postRequest(updateEnrolledCourse(code,userName,status), endPointURL);
    console.log(response.data);
}