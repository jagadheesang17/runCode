import { environmentSetup } from "../playwright.config";
export let URLConstants: any
//export let URLConstants
switch (environmentSetup) {
    case "automation":
        URLConstants = {
            adminURL: "https://qaautomation.expertusoneqa.cloud/backdoor",
            leanerURL: "https://automation.expertusoneqa.in/learner/e1internal/",
            learnerportal: "https://automation.expertusoneqa.in/learner/learnerportal/",
            learnerportal2: "https://automation.expertusoneqa.in/learner/learnerportal2/",
            portal1: "E1Internal",
            portal2: "LearnerPortal",
            portal3: "LearnerPortal2",
            LearnerGroup1: "AutoLG1(Do not Use)",   
            LearnerGroup2: "AutoLG2(Do not Use)",
            creditCardNumber: "4111111111111111",
            cardExpiryDate: "10/27",
            cVV: "111",
            USPS_Client_Id:"ScI6WsAHlUa6YC27zLRbQ0otldGLFdGG",
            USPS_Client_Secret:"AG0WP7HYj4a00VXh",
            USPS_API_URL:"https://api-cat.usps.com/",
            EasyPost_API_Key:"EZTK507eedb9b0d14160837c7513d7462d84YnEE9NZqer80LS1xPq0irg",
        }
        break;
    case "qa":
        URLConstants = {
            adminURL: "https://qa.expertusoneqa.com/backdoor",
            leanerURL: "https://qa.expertusoneqa.com/learner/qa/",
            learnerportal: "https://qa.expertusoneqa.com/learner/qaagleenew/",
            learnerportal2: "https://qa.expertusoneqa.com/learner/portal8/",
            portal1: "qa",
            portal2: "qaagleenew",
            portal3: "portal8",
            LearnerGroup1: "New Auto LG1_42",
            LearnerGroup2: "New Auto LG2_42",
            creditCardNumber: "4111111111111111",
            cardExpiryDate: "10/27",
            cVV: "111",
            USPS_Client_Id:"ScI6WsAHlUa6YC27zLRbQ0otldGLFdGG",
            USPS_Client_Secret:"AG0WP7HYj4a00VXh",
            USPS_API_URL:"https://api-cat.usps.com/",
            EasyPost_API_Key:"EZTK507eedb9b0d14160837c7513d7462d84YnEE9NZqer80LS1xPq0irg",
        }
        break;
    case "qaProduction":
        URLConstants = {
            adminURL: "https://newprod.expertusoneqa.in/backdoor",
            leanerURL: "https://newprod.expertusoneqa.in/learner/newprod/",
            learnerportal: "https://newprod.expertusoneqa.in/learner/learnerportal/",
            learnerportal2: "https://newprod.expertusoneqa.in/learner/autoportal1/",
            portal1: "newprod",
            portal2: "portal1",
            portal3: "portal2",
            LearnerGroup1: "AutoLG1(Do not Use)",
            LearnerGroup2: "AutoLG2(Do not Use)",
            creditCardNumber: "4111111111111111",
            cardExpiryDate: "10/27",
            cVV: "111",
            USPS_Client_Id:"ScI6WsAHlUa6YC27zLRbQ0otldGLFdGG",
            USPS_Client_Secret:"AG0WP7HYj4a00VXh",
            USPS_API_URL:"https://api-cat.usps.com/",
            EasyPost_API_Key:"EZTK507eedb9b0d14160837c7513d7462d84YnEE9NZqer80LS1xPq0irg"
        }
        break;
        case "dev":
            URLConstants = {
                adminURL: "https://lms.expertusonedev.com/backdoor",
                leanerURL: "https://lms.expertusonedev.com/learner/expertusone",
                learnerportal: "https://lms.expertusonedev.com/learner/expertusthree",
                learnerportal2: "https://lms.expertusonedev.com/learner/expertusfour",
                portal1: "ExpertusONE",
                portal2: "ExpertusTHREE",
                portal3: "ExpertusFOUR",
                LearnerGroup1: "AutoLG1(Do not Use)",
                LearnerGroup2: "AutoLG2(Do not Use)",
                creditCardNumber: "4111111111111111",
                cardExpiryDate: "10/27",
                cVV: "111",
                USPS_Client_Id:"ScI6WsAHlUa6YC27zLRbQ0otldGLFdGG",
            USPS_Client_Secret:"AG0WP7HYj4a00VXh",
            USPS_API_URL:"https://api-cat.usps.com/",
            EasyPost_API_Key:"EZTK507eedb9b0d14160837c7513d7462d84YnEE9NZqer80LS1xPq0irg",
            }
            break;
}