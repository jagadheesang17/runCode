import data from "../data/adminGroupsData.json";
import { environmentSetup } from "../playwright.config";
const managerName: any = data.managerName;
const commonUser: any = data.commonUser;
const internalUser: any = data.internalUser;
const externalUser: any = data.externalUser;
const teamUser1: any = data.teamUser1;
const teamUser2: any = data.teamUser2;
export let credentials: any;

switch (environmentSetup) {
  case "automation":
        credentials = {
		 CUSTOMERADMIN: {
                username: "lmsadmin@nomail.com",
            password: "Welcome1@"
        },
        CUSTOMERADMIN1: {
            username: "lmsadmin@nomail.com",
            password: "Welcome1@"
        },
        LEARNERADMIN: {
           username: "lmsadmin@nomail.com",
            password: "Welcome1@"
        },
        INSTRUCTORNAME: {
            username: "autoins",
            password: "Welcome1@"
        },
        MANAGERNAME: {
            username: "automnr",
            password: "Welcome1@"
        },
        LEARNERUSERNAME: {
             username:"tim",
            password: "Welcome1@"
        },
        COMMERCEADMIN: {
         username: "lmsadmin@nomail.com",
            password: "Welcome1@"
        },
        SUPERADMIN: {
            username: "lmsadmin@nomail.com",
            password: "Welcome1@"
        },
        PEOPLEADMIN: {
            username: "lmsadmin@nomail.com",
            password: "Welcome1@"
        },
        LEARNERPORTAL_User: {  //Portal1 user except main
            username: "portaluser",
            password: "Welcome1@"
        },
        LEARNERPORTAL_2User: { //Portal2 user except main
            username: "portal1user",
            password: "Welcome1@",
        },
        COMMONUSER: {
            username: "johnCena@123",
            password: "Welcome1@",
        },
        ENROLLADMIN: {
            username: "lmsadmin@nomail.com",
            password: "Welcome1@"
        },
        NEWCUSTOMERADMIN: {
               username: "lmsadmin@nomail.com",
            password: "Welcome1@"
        },
        INTERNALUSER: {
            username:internalUser ,
            password: "Welcome1@"
        },
        EXTERNALUSER: {
            username:externalUser,
            password: "Welcome1@"
        },
        TEAMUSER1:{
             username:"autodirect",
            password: "Welcome1@"
        }, 
        TEAMUSER2:{
             username:"autovirtual",
            password: "Welcome1@"
        },
        SSOUSER: {
            username: "arivazhaganp",
            password: "Welcome1@"
    
        },
        SSOUSEREMAIL: {
            username1: "arivazhaganp@peopleone.co",
            password1: "Welcome1@"
        },
        LearnerGroup1user: {
            username: "autouser1@DonotUse",
            password: "Welcome6@"
        },
        LearnerGroup2user: {
            username: "autouser2@DonotUse",
            password: "Welcome6@"
			}   
        }
        break;

  case "qa":
    credentials = {
      CUSTOMERADMIN: {
        username: "arivazhaganp_42",
        password: "Qwerty@123",
      },
      CUSTOMERADMIN1: {
        username: "qaadmin@nomail.com",
        password: "Welcome1@",
      },
      LEARNERADMIN: {
        username: "arivazhaganp_42",
        password: "Qwerty@123",
      },
      INSTRUCTORNAME: {
        username: "henry",
        password: "Welcome1@",
      },
      INSTRUCTOR2: {
        username: "divya",
        password: "Welcome1@",
      },
      MANAGERNAME: {
        username: "tim",
        password: "Welcome1@",
      },
      LEARNERUSERNAME: {
        username: "learner601",
        password: "Welcome6@",
      },
      COMMERCEADMIN: {
        username: "arivazhaganp_42",
        password: "Qwerty@123",
      },
      SUPERADMIN: {
        username: "qaadmin@nomail.com",
        password: "Welcome1@",
      },
      PEOPLEADMIN: {
        username: "arivazhaganp_42",
        password: "Qwerty@123",
      },
      LEARNERPORTAL_User: {
        username: "portal8user",
        password: "welcome",
      },
      LEARNERPORTAL_2User: {
        username: "qaaeagleuser",
        password: "welcome",
      },
      COMMONUSER: {
        username: commonUser,
        password: "Welcome1@",
      },
      ENROLLADMIN: {
        username: "arivazhaganp_42",
        password: "Qwerty@123",
      },
      NEWCUSTOMERADMIN: {
        username: "arivazhaganp_42",
        password: "Qwerty@123",
      },
      INTERNALUSER: {
        username: internalUser,
        password: "Welcome1@",
      },
      EXTERNALUSER: {
        username: externalUser,
        password: "Welcome1@",
      },
      TEAMUSER1: {
        username: "mcjohn",
        password: "Welcome1@",
      },
      TEAMUSER2: {
        username: "david",
        password: "Welcome1@",
      },
      SSOUSER: {
        username: "arivazhaganp",
        password: "Welcome1@",
      },
      SSOUSEREMAIL: {
        username: "arivazhaganp@peopleone.co",
        password: "Welcome1@",
      },
      LearnerGroup1user: {
        username: "autouser1@DonotUse",
        password: "Password@123",
      },
      LearnerGroup2user: {
        username: "autouser2@DonotUse",
        password: "Password@123",
      },
    };
    break;

 case "qaProduction":
    credentials = {
      CUSTOMERADMIN: {
        username: "automationtenant@nomail.com",
        password: "Welcome1@",
      },
      CUSTOMERADMIN1: {
     
        username: "automationtenant@nomail.com",
        password: "Welcome1@",
      },
      LEARNERADMIN: {
        username: "automationtenant@nomail.com",
        password: "Welcome1@",
      },
      INSTRUCTORNAME: {
        username: "autoins",
        password: "Welcome1@",
      },
      INSTRUCTOR2: {
        username: "divya",
        password: "Welcome1@",
      },
      MANAGERNAME: {
        username: "automnr",
        password: "Welcome1@",
      },
      LEARNERUSERNAME: {
        username: "jeevan",
        password: "Welcome1@",
      },
      COMMERCEADMIN: {
        username: "automationtenant@nomail.com",
        password: "Welcome1@",
      },
      SUPERADMIN: {
        username: "automationtenant@nomail.com",
        password: "Welcome1@",
      },
      PEOPLEADMIN: {
        username: "automationtenant@nomail.com",
        password: "Welcome1@",
      },
      LEARNERPORTAL_User: {
        //Portal1 user except main
        username: "portaluser",
        password: "Welcome1@",
      },
      LEARNERPORTAL_2User: {
        //Portal2 user except main
        username: "portal1user",
        password: "Welcome1@",
      },
      COMMONUSER: {
        username: "johnCena@123",
        password: "Welcome1@",
      },
      ENROLLADMIN: {
        username: "automationtenant@nomail.com",
        password: "Welcome1@",
      },
      NEWCUSTOMERADMIN: {
        username: "Clemens_Steuber@hotmail.com",
        password: "Welcome1@",
      },
      INTERNALUSER: {
        username: internalUser,
        password: "Welcome1@",
      },
      EXTERNALUSER: {
        username: externalUser,
        password: "Welcome1@",
      },
      TEAMUSER1: {
        username: "directuser12",
        password: "Welcome1@",
      },
      TEAMUSER2: {
        username: "autovirtual",
        password: "Welcome1@",
      },
      SSOUSER: {
        username: "arivazhaganp",
        password: "Welcome1@",
      },
      SSOUSEREMAIL: {
        username1: "arivazhaganp@peopleone.co",
        password1: "Welcome1@",
      },
      LearnerGroup1user: {
        username: "kathir7695",
        password: "Welcome1@",
      },
      LearnerGroup2user: {
        username: "arjun2",
        password: "Welcome6@",
      },
    };
    break;

  case "dev":
    credentials = {
      CUSTOMERADMIN: {
        username: "manikandancuadmin",
        password: "Test@123",
      },
      CUSTOMERADMIN1: {
        username: "admin",
        password: "Welcome1@",
      },
      LEARNERADMIN: {
        username: "manikandancuadmin",
        password: "Test@123",
      },
      INSTRUCTORNAME: {
        username: "instructorone",
        password: "Welcome1@",
      },
      INSTRUCTOR2: {
        username: "divya",
        password: "Welcome1@",
      },
      MANAGERNAME: {
        username: "suresh",
        password: "Welcome1@",
      },
      LEARNERUSERNAME: {
        username: "luser3",
        password: "Welcome1@",
      },
      COMMERCEADMIN: {
        username: "manikandancuadmin",
        password: "Test@123",
      },
      SUPERADMIN: {
        username: "admin",
        password: "Welcome1@",
      },
      PEOPLEADMIN: {
        username: "manikandancuadmin",
        password: "Test@123",
      },
      LEARNERPORTAL_User: {
        //Portal1 user except main
        username: "learnertwo",
        password: "Welcome1@",
      },
      LEARNERPORTAL_2User: {
        //Portal2 user except main
        username: "learnerone",
        password: "Welcome1@",
      },
      COMMONUSER: {
        username: "johnCena@123",
        password: "Welcome1@",
      },
      ENROLLADMIN: {
        username: "manikandancuadmin",
        password: "Test@123",
      },
      NEWCUSTOMERADMIN: {
        username: "manikandancuadmin",
        password: "Test@123",
      },
      INTERNALUSER: {
        username: internalUser,
        password: "Welcome1@",
      },
      EXTERNALUSER: {
        username: externalUser,
        password: "Welcome1@",
      },
      TEAMUSER1: {
        username: "luser3",
        password: "Welcome1@",
      },
      TEAMUSER2: {
        username: "arunvijay",
        password: "Welcome1@",
      },
      SSOUSER: {
        username: "arivazhaganp",
        password: "Welcome1@",
      },
      SSOUSEREMAIL: {
        username: "arivazhaganp@peopleone.co",
        password: "Welcome1@",
      },
      LearnerGroup1user: {
        username: "luser1",
        password: "Welcome1@",
      },
      LearnerGroup2user: {
        username: "luser2",
        password: "Welcome1@",
      },
    };
    break;
}
