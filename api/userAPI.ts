import { URLConstants } from "../data/apiData/apiUtil";
import { userCreationData, userCreationWithGuidData, updateCustomGuidData, getLearnerUser, updateUserData, listUser, listofUser } from "../data/apiData/formData";
import { postRequest } from "../utils/requestUtils";
import { assertStatus, assertResponse } from "../utils/verificationUtils";

let endPointURL = URLConstants.adminEndPointUrl
let learnerEndPointUrl = URLConstants.learnerEndPointUrl

export async function userCreation(userData: any) {
    try {

        let response = await postRequest(userData, endPointURL);
        console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.result, "success");
        return response.data.user_id
    } catch (error) {
        console.error("Failed to execute", error);
        throw error;
    }
}

export async function userCreationWithGuid(userData: any) {
    try {
        let response = await postRequest(userData, endPointURL);
        console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.result, "success");
        return response.data.user_id
    } catch (error) {
        console.error("Failed to execute userCreationWithGuid", error);
        throw error;
    }
}

export async function updateCustomGuid(userData: any) {
    try {
        let response = await postRequest(userData, endPointURL);
        console.log(response);
        await assertStatus(response.status, 200);
        await assertResponse(response.data.status, "success");
        return userData.user_id; // Return the user_id from input data since API doesn't return it
    } catch (error) {
        console.error("Failed to execute updateCustomGuid", error);
        throw error;
    }
}

export async function getUserDetail(retrivied_userID: any) {
    let response = await postRequest(getLearnerUser(retrivied_userID), learnerEndPointUrl);
    await assertStatus(response.status, 200);
    console.log("User Data:", response.data.data.user_data);
    console.log("User Name:", response.data.data.user_data.Username);
    return response.data.data.user_data.Username

}

export async function updateUser(username: any) {
    let response = await postRequest(updateUserData(username), endPointURL);
    await assertStatus(response.status, 200);
    //await assertResponse(response.data.result, "success");
    //await assertResponse(response.data.message, "Request Successful");
    return response.data
}

export async function listSingleUser(userName: string) {
    let response = await postRequest(listUser(userName), endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
    await assertResponse(response.data.status, "success");
   // await assertResponse(response.data.message, "Request Successful");
    const userId = response.data.data[0].UserId;
    const username = response.data.data[0].Username;
    return [userId, username];
}
export async function getListofUser() {
    let response = await postRequest(listofUser, endPointURL);
    console.log(response.data);
    await assertStatus(response.status, 200);
}

export async function userUpdation(userData: any) {
    try {
        let response = await postRequest(userData, endPointURL);
        console.log(response);
        console.log(response.data.result);
        await assertStatus(response.status, 200);
        return response.data.user_id
    } catch (error) {
        console.error("Failed to execute", error);
        throw error;
    }
}