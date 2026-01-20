import { URLConstants } from "../data/apiData/apiUtil";
import { customAdminOuthData } from "../data/apiData/formData";
import { postRequest } from "../utils/requestUtils";
import { assertResponse } from "../utils/verificationUtils";

let endPointURL = URLConstants.adminEndPointUrl

async function generateOauthToken() {
    try {
        const response = await postRequest(customAdminOuthData, endPointURL);
        // Some environments wrap payload as { data: { access_token } }, others as { access_token }
        const token = response?.data?.access_token ?? response?.data?.data?.access_token;
        if (token) {
            return "Bearer " + token;
        }
        // Provide better diagnostics for debugging
        console.error("OAuth response payload:", JSON.stringify(response?.data));
        throw new Error("Access token not found in response payload");
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