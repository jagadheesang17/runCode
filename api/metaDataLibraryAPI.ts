import { postRequest } from "../utils/requestUtils";
import { URLConstants } from "../data/apiData/apiUtil";
import { ceuGetListOfData, ceuTypeCreationData, ceuTypeUpdateData, ceuTypeDelete, generateCode, getListCategory, getListTags, tagCreation, tagEdit, departmentCreation, departmentUpdate, ceuProviderCreation, ceuProviderUpdate, providerCreation, providerUpdate, userTypeCreation, userTypeUpdate, jobRoleCreation, jobRoleUpdate, equipmentCreation, employmentTypeCreation, employmentTypeUpdate, listofInstanceDetails, listAnnouncement, assignAssessmentToCourse, assignAssessmentToProgram } from "../data/apiData/formData"
import { assertResponse, assertStatus } from "../utils/verificationUtils";

let endPointURL = URLConstants.adminEndPointUrl


export async function listCategory( order:any,authorization: any) {
    let response = await postRequest(getListCategory(order), endPointURL, authorization);
    console.log("All codes : ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}


export async function listTags( order:any,authorization: any) {
    let response = await postRequest(getListTags(order), endPointURL, authorization);
    console.log("All codes : ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}


export async function createCategory_fn(catagory:any,authorization: any){
    let response=await postRequest(catagory, endPointURL, authorization);
    console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.data.result, "success");
         await assertResponse(response.data.status, "success");

}

export async function editCategory_fn(catagory:any,authorization: any){
    let response=await postRequest(catagory, endPointURL, authorization);
    console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.data.result, "category updated success");
         await assertResponse(response.data.status, "success");

}


export async function createTag(name:string,authorization: any) {
    let response = await postRequest(tagCreation(name), endPointURL, authorization);
    console.log("All codes : ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}
export async function editTag(newTagname:string,name:string,authorization: any) {
    let response = await postRequest(tagEdit(newTagname,name), endPointURL, authorization);
    console.log("All codes : ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

// CEU Type Update API
export async function updateCEUType(code:string,newName:string,  authorization: any) {
    let response = await postRequest(ceuTypeUpdateData(code, newName), endPointURL, authorization);
    console.log("CEU Type update response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

// Department APIs
export async function createDepartment(name:string,code:string ,authorization: any) {
    const requestData = departmentCreation(name, code);
    console.log("Department creation request data: ", JSON.stringify(requestData, null, 2));
    let response = await postRequest(requestData, endPointURL, authorization);
    console.log("Department creation response: ", response.data);
    await assertStatus(response.status, 200);
    //await assertResponse(response.data.status, "success");
}

export async function updateDepartment(code:string,newName:string,  authorization: any) {
    let response = await postRequest(departmentUpdate(code,newName), endPointURL, authorization);
    console.log("Department update response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

// CEU Provider APIs
export async function createCEUProvider(name:string,code:string ,authorization: any) {
    let response = await postRequest(ceuProviderCreation(code,name), endPointURL, authorization);
    console.log("CEU Provider creation response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function updateCEUProvider(code:string,newName:string,  authorization: any) {
    let response = await postRequest(ceuProviderUpdate(code,newName), endPointURL, authorization);
    console.log("CEU Provider update response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

// Provider APIs
export async function createProvider(name:string,code:string,authorization: any) {
    let response = await postRequest(providerCreation(name,code), endPointURL, authorization);
    console.log("Provider creation response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function updateProvider( code:string,newName:string,authorization: any) {
    let response = await postRequest(providerUpdate(code,newName), endPointURL, authorization);
    console.log("Provider update response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

// User Type APIs
export async function createUserType(name:string, code:string, authorization: any) {
    let response = await postRequest(userTypeCreation(name, code), endPointURL, authorization);
    console.log("User Type creation response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function updateUserType(code:string,newName:string, authorization: any) {
    let response = await postRequest(userTypeUpdate(code,newName), endPointURL, authorization);
    console.log("User Type update response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

// Job Role APIs
export async function createJobRole(name:string, code:string, authorization: any) {
    let response = await postRequest(jobRoleCreation(name, code), endPointURL, authorization);
    console.log("Job Role creation response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function updateJobRole(code:string,newName:string, authorization: any) {
    let response = await postRequest(jobRoleUpdate(code,newName), endPointURL, authorization);
    console.log("Job Role update response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

// Equipment APIs
export async function createEquipment(name:string,authorization: any) {
    let response = await postRequest(equipmentCreation(name), endPointURL, authorization);
    console.log("Equipment creation response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

// CEU Type APIs
export async function createCEUType(name:string, code:string, authorization: any) {
    let response = await postRequest(ceuTypeCreationData(name, code), endPointURL, authorization);
    console.log("CEU Type creation response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

// Employment Type APIs
export async function createEmploymentType(name:string, code:string, authorization: any) {
    let response = await postRequest(employmentTypeCreation(name, code), endPointURL, authorization);
    console.log("Employment Type creation response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}

export async function updateEmploymentType(code:string,newName:string, authorization: any) {
    let response = await postRequest(employmentTypeUpdate(code,newName), endPointURL, authorization);
    console.log("Employment Type update response: ", response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
}