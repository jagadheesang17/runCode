import { URLConstants } from "../data/apiData/apiUtil";
import { customAdminOuthData } from "../data/apiData/formData";
import { postRequest } from "../utils/requestUtils";
import { assertResponse } from "../utils/verificationUtils";

let endPointURL = URLConstants.adminEndPointUrl

async function generateOauthToken() {
    try {
        const response = await postRequest(customAdminOuthData, endPointURL);        
    //    await assertResponse(response.status, 200);
        if (response.data && response.data.access_token) {
            return "Bearer " + response.data.access_token
        } else {
            throw new Error("Access token not found in response");
        }
    } catch (error) {
        console.error("Failed to generate OAuth token:", error);
        throw error;
    }
} 


/* generateOauthToken()
    .then(response => {
        console.log("Received response:", response);
    })
    .catch(error => {
        console.error("Error occurred:", error);
    });
 */

export { generateOauthToken }