import { FakerData, getCurrentDateFormatted } from "../../utils/fakerUtils";
import apiName from "./api_Name.json"
import { getRandomItemFromFile } from "../../utils/jsonDataHandler";
import { credentials } from "./apiUtil";
import { filePath } from "../MetadataLibraryData/filePathEnv";

let userId = credentials.data.id
let clientId = credentials.data.client_id
let clientSecret = credentials.data.client_secret

let isInternal: boolean = true;
let organizationType: string = isInternal ? "Internal" : "External";
let category = getRandomItemFromFile("../data/learningCategory.json");
let tag = getRandomItemFromFile("../data/peopleCEUTags.json");
let department = getRandomItemFromFile(filePath.department);
let empData = getRandomItemFromFile(filePath.empType);
let jobRole = getRandomItemFromFile(filePath.jobRole);
let jobTitle = getRandomItemFromFile(filePath.jobTitle);
let userType = getRandomItemFromFile(filePath.userType);
const generatedcode = generateCode();

export let customAdminOuthData = {
    user_id: userId,
    client_id: clientId,
    client_secret: clientSecret,
    scope: "LMS.API",
    grant_type: "client_credentials",
    api_name: "GenerateOauthToken",
    response_fields: "result"
};


export let userCreationData = (username: string) => ({
    user_id: userId,
    first_name: FakerData.getFirstName(),
    last_name: FakerData.getLastName(),
    username: username,
    password: "Welcome1@",
    api_name: apiName.createUser,
    response_fields: ["result", "UserId"]
});

export const getLearnerUser = (userId?: any) => ({
    user_id: userId,
    api_name: apiName.getUserDetail,
    status: "Active",
    response_fields: ["Status", "Company", "FirstName", "LastName", "Username", "Password", "PhoneNumber", "MobileNumber", "Picture"]
});

export const updateUserData = (userName: any) => ({
    api_name: apiName.updateUser,
    user_id: userId,
    first_name: FakerData.getFirstName(),
    last_name: FakerData.getLastName(),
    username: userName,
    email: FakerData.getEmail(),
    response_fields: ["result", "user_id"]
});

export function generateCode() {
    const currentMilliseconds = Date.now();
    const randomNumber = Math.floor(Math.random() * 3);
    const code = Number(currentMilliseconds.toString().slice(7)) + randomNumber;
    return code.toString();

};

export const ceuTypeCreationData = (roleName?: string, Code?: string) => ({
    user_id: userId,
    name: roleName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.createCEUType,
    response_fields: ["result"]
})

export const ceuTypeUpdateData = (Code?: string, newName?: string) => ({
    user_id: userId,
    name: newName || FakerData.getTagNames(),
    code: Code,
    api_name: apiName.updateCEUType,
    response_fields: ["result"]
})

export const ceuGetListOfData = {
    user_id: userId,
    api_name: apiName.getCeuTypeLists,
    rows: 20,
    response_fields: ["id", "name", "code", "description"]
}

export const ceuTypeDelete = (createdCode: any) => ({
    user_id: userId,
    code: createdCode,
    api_name: apiName.deleteCEUType,
    response_fields: ["ceu_Type_id"]
})

export const getListoflocation = {
    user_id: userId,
    api_name: apiName.listLocations,
    response_fields: ["location_id", "name", "building_name", "room_name", "adress", "timezone", "status", "contect_name", "contact_no", "contact_email", "latitude", "longitude", "last_update", "equipment_names"]
}

export const listUser = (userName: string) => ({
    user_id: userId,
    status: "Active",
    page: 1,
    limit: 100,
    ...(userName && { textsearch: userName }),
    api_name: apiName.listUser,
    response_fields: ["result", "UserId", "first_name", "last_name", "username", "email", "country", "country_name"]
})

export const createOrganizations = (orgName: string) => ({

    user_id: userId,
    Name: orgName,
    Description: FakerData.getDescription(),
    Type: organizationType,
    Status: 1,
    api_name: apiName.createOrganizations,
    response_fields: "result"
})

export const listofOrganization = (orgName?: string) => ({
    user_id: userId,
    textsearch: orgName,
    api_name: apiName.listOrganizations,
    response_fields: ["id", "name", "code", "description"]
})

export const listofCourse = {
    user_id: userId,
    api_name: apiName.listCourses,
    //response_fields: ["_id", "code", "description", "duration", "instance_count", "language_name", "status_name", "sub_type", 'thumbnail', 'title', "catalog_id", "error"]
    response_fields: ["_id"],
}

export const listofProgram = {
    api_name: apiName.listPrograms,
    user_id: userId,
    // tag_names:,
    response_fields: ["_id", 'code', "description", "duration", "language_name", "status_name", "sub_type", "thumbnail", "title", "catalog_id", "error"],
    language: "english",
}
export const createEnrollmentForCourse = (code: any, enrollUser: string) => ({
    user_id: userId,
    course_code: code,
    username: enrollUser,
    api_name: apiName.createEnrollmentForCourse,
    response_fields: ["result"]
})

export const updateEnrolledCourse = (code: any, enrollUser: string, statusValue: "cancel" | "completed") => ({
    user_id: userId,
    course_code: code,
    username: enrollUser,
    status: statusValue,
    api_name: apiName.updateCourseEnrollment,
    response_fields: ["result"]
})

export const listCourseEnrollment = (code: any, enrollUser: string) => ({
    user_id: userId,
    course_code: code,
    username: enrollUser,
    api_name: apiName.listCourseEnrollments,
    response_fields: [
        "id",
        "user_id",
        "user_attr_id",
        "order_id",
        "mandatory",
        "user_attribute",
        "catalog_id",
        "catalog_detail_id",
        "recurring_registration",
        "madatory",
        "is_current",
        "register_date",
        "register_status",
        "register_status_name",
        "completion_date",
        "completion_status",
        "completion_status_name",
        "pre_assessment_score",
        "progress",
        "score",
        "exempted_status",
        "updated_on",
        "register_date_format",
        "completion_date_format",
        "reg_date",
        "certificate_id",
        "content_course_id",
        "session_course_id",
        "ojt_course_id",
        "course_end_time",
        "user_name",
        "questionpro_enrollment_id",
        "external_assessments",
        "content_courses",
        "session_courses",
        "assessment_courses",
        "quprores",
        "checklistenable",
        "checklistrescount",
        "is_instructor",
        "is_admin",
        "encrypted_enrollment_id",
        "encrypted_external_assessment_id"
    ]
})

export const deleteCourse = (createdCode: any) => ({
    api_name: apiName.deleteCourse,
    user_id: userId,
    status: "active",
    code: createdCode
})

export const listofProgramEnrollment = (data: string) => ({
    api_name: apiName.getProgramEnrollmentList,
    user_id: userId,
    program_code: data,
    //  program_code:data ,
    // page: 1,
    // limit: 100,
    // ...(data && { textsearch: data }),
    // response_fields: ["course_details"],
    response_fields: ["id", "user_id", "user_name", "program_structure_id", "completion_status_name", "register_status_name", "order_id", "program_id", "completion_date", "pre_assessment_score"],
})
export let locationCreationData = (locationName: string, countryName: string, stateName: string, timeZone: string, cityName: string, zipCode: string) => ({
    user_id: userId,
    location_name: locationName,
    addr1: FakerData.getAddress(),
    country: countryName,
    state: stateName,
    timezone: timeZone,
    city: cityName,
    zipcode: zipCode,
    api_name: apiName.createLocation,
    status: "published",
    response_fields: ["location_id"]
});
export const listSingleLocationData = (locationName: string) => ({
    user_id: userId,
    status: "published",
    page: 1,
    limit: 100,
    ...(locationName && { textsearch: locationName }),
    api_name: apiName.listLocations,
    response_fields: ["location_id", "name", "address", "status"]
})
export const updateLocationData = (locationName: any) => ({
    api_name: apiName.updateLocation,
    user_id: userId,
    location_name: locationName,
    addr1: FakerData.getAddress(),
    response_fields: ["location_id"]
});
export const listofOrganizationData = ({
    user_id: userId,
    api_name: apiName.listOrganizations,
    response_fields: ["id", "name", "code", "description"]
})

export const listofUser = {
    user_id: userId,
    status: "Active",
    page: 1,
    limit: 100,
    api_name: apiName.listUser,
    //response_fields: ["result", "UserId", "first_name", "last_name", "username", "email", "country", "country_name"]
    response_fields: ["result", "UserId", "FirstName", "LastName", "Username", "Email", "country", "country_name"]
}
export const listofAttachedCoursesFromProgram = (data: string) => ({
    api_name: apiName.listAttachedCoursesFromTrainingPlan,
    user_id: userId,
    program_code: data,
    response_fields: ["module_name",
        "module_id",
        "module_sequence",
        "module_level_completion_rule",
        "mandatory_completion_count",
        "optional_completion_count"],
})

//Arivu Test
export const listofLocations = {
    api_name: apiName.listLocations,
    user_id: userId,
    response_fields: ["location_id,name,building_name,room_name,adress,timezone,status,contect_name,contact_no,contact_email,latitude,longitude,last_update,equipment_names"],
}

//Admin->getgetInstanceCourseAPI 
export const getInstanceCourseList = (data: string) => ({
    api_name: apiName.listInstanceFromCourse,
    user_id: userId,
    entity_code: data,
    response_fields: ["title,code"],
})

//Admin->attachCourses
export const attachCourses = (crs_code: any, prgm_code: any) => ({
    api_name: apiName.attachCourses,
    user_id: userId,
    selected_course_codes: crs_code,
    program_code: prgm_code,
    //module_id:module_id,
    response_fields: ["result"],
})

//for user creation mandatory and optional combination
export let userCreationDataWithOptional = (username: string, role?: "manager" | "instructor", countryName?: string, stateName?: string, timeZone?: string, cityName?: string, zipCode?: string,) => {
    if (countryName && stateName && timeZone && cityName && zipCode) {
        return {
            user_id: userId,
            first_name: FakerData.getFirstName(),
            last_name: FakerData.getLastName(),
            username: username,
            password: "Welcome1@",
            email: FakerData.getEmail(),
            addr1: FakerData.getAddress(),
            addr2: FakerData.getAddress(),
            role: role,
            country: countryName,
            state: stateName,
            timezone: "tmz_0303",
            phone_no: FakerData.getMobileNumber(),
            mobile_no: FakerData.getMobileNumber(),
            user_type: userType,
            employment_type: empData,
            department: department,
            job_title: jobTitle,
            JobRole: jobRole,
            city: cityName,
            zipcode: zipCode,
            organization_type: organizationType,
            api_name: apiName.createUser,
            response_fields: ["result", "UserId"]
        };
    } else {
        return {
            user_id: userId,
            first_name: FakerData.getFirstName(),
            last_name: FakerData.getLastName(),
            username: username,
            password: "Welcome1@",
            api_name: apiName.createUser,
            response_fields: ["result", "UserId"]
        };
    }
};
//for user updation mandatory and optional combination
export let userUpdationDataWithOptional = (username: string, role?: "manager" | "instructor", countryName?: string, stateName?: string, timeZone?: string, cityName?: string, zipCode?: string) => {
    if (countryName && stateName && timeZone && cityName && zipCode) {
        return {
            user_id: userId,
            first_name: FakerData.getFirstName(),
            last_name: FakerData.getLastName(),
            username: username,
            password: "Welcome1@",
            email: FakerData.getEmail(),
            addr1: FakerData.getAddress(),
            addr2: FakerData.getAddress(),
            role: role,
            country: countryName,
            state: stateName,
            timezone: "tmz_0303",
            phone_no: FakerData.getMobileNumber(),
            mobile_no: FakerData.getMobileNumber(),
            user_type: userType,
            employment_type: empData,
            department: department,
            job_title: jobTitle,
            JobRole: jobRole,
            city: cityName,
            zipcode: zipCode,
            organization_type: organizationType,
            api_name: apiName.updateUser,
            response_fields: ["result", "UserId"]
        };
    } else {
        return {
            user_id: userId,
            first_name: FakerData.getFirstName(),
            last_name: FakerData.getLastName(),
            username: username,
            password: "Welcome1@",
            api_name: apiName.updateUser,
            response_fields: ["result", "UserId"]
        };
    }
}


export const createCourseEnrollmentForProgram = (code: any, courseCode: string, enrollUser: string) => ({
    user_id: userId,
    Program_code: code,
    course_code: courseCode,
    username: enrollUser,
    api_name: apiName.createCourseEnrollmentForProgram,
    response_fields: ["result"]
})


export const updateEnrollmentForCourse = (code: any, enrollUser: string) => ({
    user_id: userId,
    course_code: code,
    username: enrollUser,
    status: "completed",
    api_name: apiName.updateCourseEnrollment,
    response_fields: ["result"]
})

export const createEnrollmentForProgram = (code: any, enrollUser: string) => ({
    user_id: userId,
    Program_code: code,
    username: enrollUser,
    api_name: apiName.createProgramEnrollment,
    response_fields: ["result"]
})
export const updateEnrollmentForProgram = (code: any, enrollUser: string, statusValue: "cancel" | "completed") => ({
    user_id: userId,
    program_code: code,
    username: enrollUser,
    status: statusValue,
    completion_date:getCurrentDateFormatted(),
    api_name: apiName.updateProgramEnrollment,
    response_fields: ["result"]
})


export const updateOrganizations = (org_Code: string, description: string) => ({
    user_id: userId,
    Code: org_Code,
    Description: description,
    api_name: apiName.editOrganizations,
    response_fields: ["result"]
})

export const getListCategory =(Order_value?: "a-z" | "z-a" | "new-old"|"old-new") => ({
    user_id: userId,
    api_name: apiName.listCategory,
    rows: 20,
    order:Order_value,
    response_fields: ["id","name","code","description","to_date","creator_name","parent_category_name","parent_category_code"]
})
export const getListTags =(Order_value?: "a-z" | "z-a" | "new-old"|"old-new") => ({
    user_id: userId,
    api_name: apiName.ListTags,
    rows: 20,
    order:Order_value,
    response_fields: ["id","name","count","mapped_entities"]
})

export let createCategory = (code:any, name:any,description:any,pcategory?:any) => {
if (pcategory) {
    return {
    user_id: userId,
    code: code,
    name: name,
    description: description,
    parent_code: pcategory,
    api_name: apiName.createCategory,
    response_fields: ["result"]
    };
} else {
    return {
        user_id: userId,
        code: code,
        name: name,
        description: description,
        api_name: apiName.createCategory,
        response_fields: ["result"]
    };
}
}

export let editCategory = (code:any, name:any,description:any,pcategory?:any) => {
if (pcategory) {
    return {
    user_id: userId,
    code: code,
    name: name,
    description: description,
    parent_code: pcategory,
    api_name: apiName.updateCategory,
    response_fields: ["result"]
    };
} else {
    return {
        user_id: userId,
        code: code,
        name: name,
        description: description,
        api_name: apiName.updateCategory,
        response_fields: ["result"]
    };
}
}

export let createAdminGroup = (title: any,code: any,admin_roles:any,status:any,included_users?:any,valid_till?:any) => {

    if (valid_till && included_users) {
        return{
    user_id: userId,
    title: title,
    code: code,
    valid_till: valid_till,
    included_users: included_users,
    admin_roles: admin_roles,
    status:status,
    api_name: apiName.createAdminGroup,
    response_fields: ["result"]
        }
    }else {
        return{
            user_id: userId,
    title: title,
    code: code,
    admin_roles: admin_roles,
    status:status,
    api_name: apiName.createAdminGroup,
    response_fields: ["result"]
        }
    }
}

export let updateAdminGroup = (title: any,code: any,status:any,admin_roles?:any,included_users?:any,valid_till?:any) => {

    if (valid_till && included_users) {
        return{
    user_id: userId,
    title: title,
    code: code,
    valid_till: valid_till,
    included_users: included_users,
    admin_roles: admin_roles,
    status:status,
    api_name: apiName.updateAdminGroup,
    response_fields: ["result"]
        }
    }else {
        return{
    user_id: userId,
    title: title,
    code: code,
    admin_roles: admin_roles,
    status:status,
    api_name: apiName.updateAdminGroup,
    response_fields: ["result"]
        }
    }
}

export let addUsersInAdminGroup =(uname:any,admingrpcode:any,action:"add"|"remove") => ({
   user_id:userId,
   user_name:uname,
   admin_group_code:admingrpcode,
   action:action,
   api_name: apiName.manageUserInAdminGroup,
   response_fields: ["result"]
})

export let addOrganizationInAdminGroup =(orgCode:any,admingrpcode:any,action:"add"|"remove") => ({
   user_id:userId,
   org_code:orgCode,
   admin_group_code:admingrpcode,
   action:action,
   api_name: apiName.manageOrganizationInAdminGroup,
   response_fields: ["result"]
})

//30-04-2025 for list of category and tags

export const tagCreation = (tageName?: string) => ({
    user_id: userId,
    tag_name: tageName,
    api_name: apiName.createTag,
    response_fields: ["result"]
})

export const tagEdit = (oldTag?: string, tageName?: string) => ({
    user_id: userId,
    old_tag_name: oldTag,
    new_tag_name: tageName,
    api_name: apiName.editTag,
    response_fields: ["result"]
})

export const categoryCreation = {
    user_id: userId,
    name: FakerData.getTagNames(),
    api_name: apiName.createCategory,
    response_fields: ["result"]
}

// Department APIs
export const departmentCreation = (deptName?: string, Code?: string) => ({
    user_id: userId,
    name: deptName,
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.createDepartment,
    response_fields: ["result"]
})

export const departmentUpdate = (newName?: string, Code?: string) => ({
    user_id: userId,
    name: newName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.updateDepartment,
    response_fields: ["result"]
})

// CEU Provider APIs
export const ceuProviderCreation = (providerName?: string, Code?: string) => ({
    user_id: userId,
    name: providerName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.createCEUProvider,
    response_fields: ["result"]
})

export const ceuProviderUpdate = (newName?: string, Code?: string) => ({
    user_id: userId,
    name: newName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.updateCEUProvider,
    response_fields: ["result"]
})

// Provider APIs
export const providerCreation = (providerName?: string, Code?: string) => ({
    user_id: userId,
    name: providerName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.createProvider,
    response_fields: ["result"]
})

export const providerUpdate = (Code?: string, newName?: string) => ({
    user_id: userId,
    name: newName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.updateProvider,
    response_fields: ["result"]
})

// User Type APIs
export const userTypeCreation = (typeName?: string, Code?: string) => ({
    user_id: userId,
    name: typeName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.createUserType,
    response_fields: ["result"]
})

export const userTypeUpdate = (Code?: string, newName?: string) => ({
    user_id: userId,
    name: newName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.updateUserType,
    response_fields: ["result"]
})

// Job Role APIs
export const jobRoleCreation = (roleName?: string, Code?: string) => ({
    user_id: userId,
    name: roleName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.createJobRole,
    response_fields: ["result"]
})

export const jobRoleUpdate = (Code?: string, newName?: string) => ({
    user_id: userId,
    name: newName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.updateJobRole,
    response_fields: ["result"]
})

// Equipment APIs
export const equipmentCreation = (equipmentName?: string) => ({
    user_id: userId,
    name: equipmentName || FakerData.getTagNames(),
    description: FakerData.getDescription(),
    api_name: apiName.CreateEquipment,
    response_fields: ["result"]
})

// Employment Type APIs
export const employmentTypeCreation = (empTypeName?: string, Code?: string) => ({
    user_id: userId,
    name: empTypeName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.createEmploymentType,
    response_fields: ["result"]
})

export const employmentTypeUpdate = (Code?: string, newName?: string) => ({
    user_id: userId,
    name: newName || FakerData.getTagNames(),
    code: Code,
    description: FakerData.getDescription(),
    api_name: apiName.updateEmploymentType,
    response_fields: ["result"]
})

//List Instance Details API

export const listofInstanceDetails = (data: string, locationName: string) => ({
    api_name: apiName.listInstanceDetails,
    user_id: userId,
    course_code: data,
    location_name: locationName,
    response_fields: [
        "title",
        "code",
        "description",
        "language_name",
        "language_code",
        "sub_type",
        "status_name",
        "max_seat",
        "waitlist_seat",
        "seat_left",
        "count_enroll",
        "registration_end_on",
        "delivery_type",
        "training_type",
        "session.session_master_id",
        "session.name",
        "session.start_date",
        "session.start_time",
        "session.end_date",
        "session.end_time",
        "session.timezone",
        "session.timezone_name",
        "session.timezone_code",
        "session.location",
        "session.sessioninstructor"
    ]
})

// List Announcement API
export const listAnnouncement = (searchText?: string, priority?: "low" | "high", fromDate?: string, toDate?: string, status: "draft" | "published" | "unpublished" | "deleted" = "published", order?: "a-z" | "z-a" | "new-old" | "old-new", page?: number, rows?: number) => ({
    user_id: userId,
    ...(searchText && { search_text: searchText }),
    ...(priority && { priority: priority }),
    ...(fromDate && { from_date: fromDate }),
    ...(toDate && { to_date: toDate }),
    status: status,
    ...(order && { order: order }),
    ...(page && { page: page }),
    ...(rows && { rows: rows }),
    api_name: apiName.ListAnnouncement,
    response_fields: ["announcement_id", "title", "description", "from_date", "to_date", "creator_name", "priority"]
})

// Assign Assessment to Course API
export const assignAssessmentToCourse = (trainingCode: string, assessmentCode: string, assessmentType: "pre-assessment" | "post-assessment", noOfAttempts: number, inherit: "yes" | "no", testoutOption: 0 | 1, reviewOption: 0 | 1) => ({
    user_id: userId,
    training_code: trainingCode,
    assessment_code: assessmentCode,
    assessment_type: assessmentType,
    no_of_attempts: noOfAttempts,
    inherit: inherit,
    testout_option: testoutOption,
    review_option: reviewOption,
    api_name: apiName.assignAssessmentToCourse,
    response_fields: ["result"]
})

export const assignAssessmentToProgram = (programCode: string, assessmentCode: string, assessmentType: "pre-assessment" | "post-assessment", noOfAttempts: number, inherit: "yes" | "no", reviewOption: 0 | 1) => ({
    user_id: userId,
    program_code: programCode,
    assessment_code: assessmentCode,
    assessment_type: assessmentType,
    no_of_attempts: noOfAttempts,
    inherit: inherit,
    review_option: reviewOption,
    api_name: apiName.assignAssessmentToProgram,
    response_fields: ["result"]
})