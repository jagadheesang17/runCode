import axios from "axios";
import { FakerData, getRandomFutureDate, getRandomPastDate } from '../../../utils/fakerUtils';
import fs from 'fs';
import path from 'path';
import { URLConstants } from '../../../constants/urlConstants';
import { setupCourseCreation } from '../../../utils/cookieSetup';

const BASE_URL = URLConstants.adminURL.replace('/backdoor', '');

// Helper to get fresh cookies every time
function getSessionCookie(): string {
  return fs.readFileSync(path.join(process.cwd(), 'data', 'cookies.txt'), 'utf-8').trim();
}

// Track last cookie refresh time
let lastCookieRefresh = Date.now();
const COOKIE_REFRESH_INTERVAL = 18 * 60 * 1000; // 18 minutes

/**
 * Refresh cookies if more than 18 minutes have passed
 */
async function refreshCookiesIfNeeded(): Promise<void> {
  const now = Date.now();
  const timeSinceRefresh = now - lastCookieRefresh;
  
  if (timeSinceRefresh >= COOKIE_REFRESH_INTERVAL) {
    const minutesSinceRefresh = Math.floor(timeSinceRefresh / 60000);
    console.log(`🔄 Cookies expired (${minutesSinceRefresh} mins). Refreshing...`);
    await setupCourseCreation();
    lastCookieRefresh = Date.now();
    console.log('✅ Cookies refreshed');
  }
}

const CURRENCY_MAP: { [key: string]: string } = {
  'us dollar': 'currency_001',
  'usd': 'currency_001',
  'australian dollar': 'currency_002',
  'aud': 'currency_002',
  'brazilian real': 'currency_003',
  'brl': 'currency_003',
  'british pound': 'currency_004',
  'gbp': 'currency_004',
  'canadian dollar': 'currency_005',
  'cad': 'currency_005',
  'chilean peso': 'currency_006',
  'clp': 'currency_006',
  'chinese yuan renminbi': 'currency_007',
  'cny': 'currency_007',
  'czech koruna': 'currency_008',
  'czk': 'currency_008',
  'danish krone': 'currency_009',
  'dkk': 'currency_009',
  'euro': 'currency_010',
  'eur': 'currency_010',
  'hong kong dollar': 'currency_011',
  'hkd': 'currency_011',
  'hungarian forint': 'currency_012',
  'huf': 'currency_012',
  'indian rupee': 'currency_013',
  'inr': 'currency_013',
  'indonesian rupiah': 'currency_014',
  'idr': 'currency_014',
  'israeli shekel': 'currency_015',
  'ils': 'currency_015',
  'japanese yen': 'currency_016',
  'jpy': 'currency_016',
  'korean won': 'currency_017',
  'krw': 'currency_017',
  'malaysian ringgit': 'currency_018',
  'myr': 'currency_018',
  'mexican peso': 'currency_019',
  'mxn': 'currency_019',
  'new zealand dollar': 'currency_020',
  'nzd': 'currency_020',
  'norwegian krone': 'currency_021',
  'nok': 'currency_021',
  'pakistani rupee': 'currency_022',
  'pkr': 'currency_022',
  'philippine peso': 'currency_023',
  'php': 'currency_023',
  'polish zloty': 'currency_024',
  'pln': 'currency_024',
  'russian ruble': 'currency_025',
  'rub': 'currency_025',
  'singapore dollar': 'currency_026',
  'sgd': 'currency_026',
  'south african rand': 'currency_027',
  'zar': 'currency_027',
  'swedish krona': 'currency_028',
  'sek': 'currency_028',
  'swiss franc': 'currency_029',
  'chf': 'currency_029',
  'taiwan new dollar': 'currency_030',
  'twd': 'currency_030',
  'thai baht': 'currency_031',
  'thb': 'currency_031',
  'turkish lira': 'currency_032',
  'try': 'currency_032',
  'venezuelan bolivar': 'currency_033',
  'vef': 'currency_033',
  'egyptian pound': 'currency_034',
  'egp': 'currency_034'
};

const CLASSROOM_LOCATIONS = [
  { id: 5, name: 'Bahringer Cape', capacity: 100 },
  { id: 9, name: 'Barton Place', capacity: 100 },
  { id: 3, name: 'Bergstrom Junction', capacity: 100 },
  { id: 13, name: 'Castle Lane', capacity: 100 },
  { id: 11, name: 'Chennai', capacity: 100 },
  { id: 6, name: 'EcoTech', capacity: 100 },
  { id: 10, name: 'Harris Common', capacity: 100 },
  { id: 8, name: 'Larch Close', capacity: 100 },
  { id: 4, name: 'Cultivate Architectures', capacity: 100 },
  { id: 7, name: 'Mepz', capacity: 100 }
];

/**
 * Convert currency name to currency code
 * @param currencyName - Currency name (case-insensitive) e.g., "US Dollar", "usd", "Indian Rupee"
 * @returns Currency code e.g., "currency_001"
 */
function getCurrencyCode(currencyName: string): string {
  const normalizedName = currencyName.toLowerCase().trim();
  const currencyCode = CURRENCY_MAP[normalizedName];
  
  if (!currencyCode) {
    throw new Error(`Invalid currency name: "${currencyName}". Please provide a valid currency name or code.`);
  }
  
  return currencyCode;
}

const COMMON_HEADERS = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
  "priority": "u=1, i",
  "sec-ch-ua": '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  // "Authorization": "Bearer ...",
  "x-requested-with": "XMLHttpRequest"
};

// Helper to get headers with fresh cookie
function getHeaders(referer?: string) {
  const headers: any = {
    ...COMMON_HEADERS,
    "Cookie": getSessionCookie()
  };
  if (referer) headers["referer"] = referer;
  return headers;
}

async function searchContent(contentName: string): Promise<number> {
  const params = new URLSearchParams({
    textsearch: contentName,
    status: 'published',
    page: '1',
    limit: '6',
    'document_library[]': 'No',
    uploaded_contents: '',
    callFrom: 'courseContentLibrary',
    search_type: 'title'
  });
  
  const url = `${BASE_URL}/ajax/admin/manage/content/list?${params.toString()}`;
  const response = await axios.get(url, {
    headers: getHeaders(`${BASE_URL}/admin/learning/course/create`),
    maxBodyLength: Infinity,
  });
  
  console.log(`\n*** SEARCH CONTENT RESPONSE ***`);
  console.log(`Status Code: ${response.status}`);
  console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
  
  if (response.status !== 200 || !Array.isArray(response.data) || response.data.length === 0 || !response.data[0]._id) {
    throw new Error("Search Content failed");
  }
  
  return response.data[0]._id;
}

async function listUploadedContent(contentId: number, uniqueId: string): Promise<void> {
  // Single request with content_ids (matching working Postman request)
  const formData = new URLSearchParams();
  formData.append("create_course_unique_id", uniqueId);
  formData.append("content_ids", contentId.toString());
  formData.append("page", "1");

  const response = await axios.post(
    `${BASE_URL}/ajax/admin/manage/content/list_uploaded_content`,
    formData,
    {
      headers: {
        ...COMMON_HEADERS,
        "origin": `${BASE_URL}`,
        "referer": `${BASE_URL}/admin/learning/course/create`,
        "content-type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    }
  );

  console.log(`\n*** UPLOAD CONTENT RESPONSE ***`);
  console.log(`Status Code: ${response.status}`);
  // Don't log response body as it may not be needed
  
  if (response.status !== 200) {
    throw new Error("Upload Content failed");
  }
}

const description=FakerData.getDescription();

/**
 * Get random location from predefined list
 */
function getRandomLocation(): { id: number; name: string; capacity: number } {
  const randomIndex = Math.floor(Math.random() * CLASSROOM_LOCATIONS.length);
  return CLASSROOM_LOCATIONS[randomIndex];
}

 


/**
 * Generate random time in AM/PM format
 */
function getRandomTime(): string {
  const hours = Math.floor(Math.random() * 12) + 1; // 1-12
  const minutes = Math.random() < 0.5 ? '00' : '30';
  const period = Math.random() < 0.5 ? 'AM' : 'PM';
  return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
}

/**
 * Calculate end time (1 hour after start)
 */
function getEndTime(startTime: string): string {
  const [time, period] = startTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let endHour = hours + 1;
  let endPeriod = period;
  
  if (endHour === 12) {
    endPeriod = period === 'AM' ? 'PM' : 'AM';
  } else if (endHour > 12) {
    endHour = 1;
    endPeriod = period === 'AM' ? 'PM' : 'AM';
  }
  
  return `${String(endHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${endPeriod}`;
}

async function createCourse(
  courseName: string,
  uniqueId: string,
  status: string,
  instances: string,
  sub_type: string,
  contentId: number,
  price?: string,
  currency?: string
): Promise<{ course_id: number; catalog_id: number }> {
  // Handle price and currency
  let priceValue = "";
  let currencyCode = "";
  
  if (price && price.trim() !== "") {
    priceValue = price.trim();
    
    if (!currency || currency.trim() === "") {
      throw new Error("Currency is required when price is provided");
    }
    
    currencyCode = getCurrencyCode(currency);
    console.log(`\n💰 Price Configuration:`);
    console.log(`   Price: ${priceValue}`);
    console.log(`   Currency: ${currency} → ${currencyCode}\n`);
  }

  // Build formData exactly as Postman request
  const formData = new URLSearchParams();
  formData.append("single_registration", "1");
  formData.append("changedFields", "[]");
  formData.append("skipconflictValidation", "false");
  formData.append("description", `<p>${description}</p>`);
  formData.append("master_title", courseName);
  formData.append("master_code", "");
  formData.append("title", courseName);
  formData.append("code", "");
  formData.append("language", "lang_00002");
  formData.append("old_course_languages", "");
  formData.append("language_name", "English");
  formData.append("portals", "5,7,8");
  formData.append("old_portals", "");
  formData.append("provider_id", "4");
  formData.append("categorys", "");
  formData.append("price", priceValue);
  formData.append("old_course_price", "");
  formData.append("currency_type", currencyCode);
  formData.append("max_seat", "");
  formData.append("old_max_seat", "undefined");
  formData.append("contact_support", "Ashly58@gmail.com");
  formData.append("duration", "");
  formData.append("instances", instances);
  formData.append("type", "course");
  formData.append("sub_type", sub_type);
  formData.append("old_sub_type", "");
  formData.append("old_course_title", "");
  formData.append("overdue_status", "");
  formData.append("waitlist_seat", "");
  formData.append("registration_end_on", "");
  formData.append("additional_info", "");
  formData.append("addn_catalog_show", "0");
  formData.append("addn_notify_show", "0");
  formData.append("discussion", "");
  formData.append("published_on", "");
  formData.append("no_of_instance", "1");
  formData.append("catalog_id", "null");
  formData.append("categoryflag", "false");
  formData.append("status", status);
  formData.append("enforce_sequence", "0");
  formData.append("content_validity_type", "");
  formData.append("content_validity_date", "");
  formData.append("content_validity_days", "");
  formData.append("content", contentId.toString());
  formData.append("endpoints", "[]");
  formData.append("complianceExists", "0");
  formData.append("is_compliance", "0");
  formData.append("compliance_validity", "");
  formData.append("validity_date", "");
  formData.append("validity_days", "");
  formData.append("complete_by_rule", "0");
  formData.append("complete_by", "date");
  formData.append("complete_by_date", "");
  formData.append("exceeds_deadline_status", "incomplete");
  formData.append("complete_days", "");
  formData.append("min_seat", "");
  formData.append("expiry_data", '{\r\n  "expiry_type": "",\r\n  "specific_date": "",\r\n  "completion_date": {},\r\n  "anniversary_date": {}\r\n}');
  formData.append("thumbnail", '{"filename":{"square":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/06/28/20240628110724-367460c8-sq.jpg","width":120,"height":120},"thumb":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/06/28/20240628110724-367460c8-th.jpg","width":144,"height":82},"2small":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/06/28/20240628110724-367460c8-2s.jpg","width":240,"height":137},"xsmall":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/06/28/20240628110724-367460c8-xs.jpg","width":432,"height":246},"small":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/06/28/20240628110724-367460c8-sm.jpg","width":576,"height":329},"medium":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/06/28/20240628110724-367460c8-me.jpg","width":792,"height":452},"large":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/06/28/20240628110724-367460c8-la.jpg","width":1008,"height":576},"xlarge":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/06/28/20240628110724-367460c8-xl.jpg","width":1224,"height":699},"xxlarge":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/06/28/20240628110724-367460c8-xx.jpg","width":1656,"height":946}}}');
  formData.append("is_primary", "1");
  formData.append("is_single", "1");
  formData.append("course_view", "1");
  formData.append("class_view", "1");
  formData.append("create_course_unique_id", uniqueId);

  const response = await axios.post(
    `${BASE_URL}/ajax/admin/learning/catalog/create`,
    formData,
    {
      headers: {
        ...COMMON_HEADERS,
        "origin": `${BASE_URL}`,
        "referer": `${BASE_URL}/admin/learning/course/create`,
        "content-type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    }
  );

  console.log(`\n*** CREATE COURSE CATALOG RESPONSE ***`);
  console.log(`Status Code: ${response.status}`);
  console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
  
  if (response.status !== 200 || !response.data.course_id || !response.data.catalog_id) {
    throw new Error("Create Course failed");
  }
  
  return { course_id: response.data.course_id, catalog_id: response.data.catalog_id };
}

/**
 * Create Classroom Course (Multi-Instance)
 */
async function createClassroomCourse(
  courseName: string,
  uniqueId: string,
  status: string,
  price?: string,
  currency?: string
): Promise<{ course_id: number; catalog_id: number }> {
  // Handle price and currency
  let priceValue = "";
  let currencyCode = "";
  
  if (price && price.trim() !== "") {
    priceValue = price.trim();
    
    if (!currency || currency.trim() === "") {
      throw new Error("Currency is required when price is provided");
    }
    
    currencyCode = getCurrencyCode(currency);
    console.log(`\n💰 Price Configuration:`);
    console.log(`   Price: ${priceValue}`);
    console.log(`   Currency: ${currency} → ${currencyCode}\n`);
  }

  const formData = new URLSearchParams();
  formData.append("changedFields", "[]");
  formData.append("skipconflictValidation", "false");
  formData.append("description", `<p>${description}</p>`);
  formData.append("master_title", courseName);
  formData.append("master_code", "");
  formData.append("title", courseName);
  formData.append("code", "");
  formData.append("language", "lang_00002");
  formData.append("old_course_languages", "");
  formData.append("language_name", "English");
  formData.append("portals", "5");
  formData.append("old_portals", "");
  formData.append("provider_id", "4");
  formData.append("categorys", "");
  formData.append("price", priceValue);
  formData.append("old_course_price", "");
  formData.append("currency_type", currencyCode);
  formData.append("max_seat", "");
  formData.append("old_max_seat", "undefined");
  formData.append("contact_support", "automationtenant@nomail.com");
  formData.append("duration", "");
  formData.append("instances", "multiple");
  formData.append("type", "course");
  formData.append("sub_type", "classroom");
  formData.append("old_sub_type", "");
  formData.append("old_course_title", "");
  formData.append("overdue_status", "");
  formData.append("waitlist_seat", "");
  formData.append("registration_end_on", "");
  formData.append("additional_info", "");
  formData.append("addn_catalog_show", "0");
  formData.append("addn_notify_show", "0");
  formData.append("discussion", "");
  formData.append("published_on", "");
  formData.append("no_of_instance", "1");
  formData.append("catalog_id", "null");
  formData.append("categoryflag", "false");
  formData.append("status", status);
  formData.append("is_recurring", "0");
  formData.append("session_list", "[]");
  formData.append("complianceExists", "0");
  formData.append("is_compliance", "0");
  formData.append("compliance_validity", "");
  formData.append("validity_date", "");
  formData.append("validity_days", "");
  formData.append("complete_by_rule", "0");
  formData.append("complete_by", "date");
  formData.append("complete_by_date", "");
  formData.append("exceeds_deadline_status", "incomplete");
  formData.append("complete_days", "");
  formData.append("min_seat", "");
  formData.append("expiry_data", '{\r\n  "expiry_type": "",\r\n  "specific_date": "",\r\n  "completion_date": {},\r\n  "anniversary_date": {}}');
  formData.append("thumbnail", '{"filename":{"square":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703095247-31874d97-sq.png","width":120,"height":120},"thumb":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703095247-31874d97-th.png","width":144,"height":87},"2small":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/07/03/20240703095247-31874d97-2s.png","width":240,"height":146},"xsmall":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703095247-31874d97-xs.png","width":432,"height":263},"small":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703095247-31874d97-sm.png","width":576,"height":351},"medium":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/07/03/20240703095247-31874d97.png","width":"598","height":"365"},"large":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/07/03/20240703095247-31874d97.png","width":"598","height":"365"},"xlarge":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/07/03/20240703095247-31874d97.png","width":"598","height":"365"},"xxlarge":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/07/03/20240703095247-31874d97.png","width":"598","height":"365"}}}');
  formData.append("is_primary", "1");
  formData.append("is_single", "0");
  formData.append("course_view", "1");
  formData.append("class_view", "0");
  formData.append("create_course_unique_id", uniqueId);

  const response = await axios.post(
    `${BASE_URL}/ajax/admin/learning/catalog/create`,
    formData,
    {
      headers: {
        ...COMMON_HEADERS,
        "origin": `${BASE_URL}`,
        "referer": `${BASE_URL}/admin/learning/course/create`,
        "content-type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    }
  );

  console.log(`\n*** CREATE CLASSROOM COURSE RESPONSE ***`);
  console.log(`Status Code: ${response.status}`);
  console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
  
  if (response.status !== 200 || !response.data.course_id || !response.data.catalog_id) {
    console.error("❌ Create Classroom Course failed!");
    console.error(`Full Response Data:`);
    console.error(JSON.stringify(response.data, null, 2));
    throw new Error("Create Classroom Course failed - no course_id or catalog_id returned");
  }
  
  // Note: API may return result: "error" but still create the course successfully
  if (response.data.result === "error") {
    console.warn("⚠️ API returned result: 'error' but course was created (course_id: " + response.data.course_id + ")");
  }
  
  return { course_id: response.data.course_id, catalog_id: response.data.catalog_id };
}

async function createAccessGroupMapping(
  course_id: number,
  catalog_id: number,
  status: string
): Promise<void> {
  const formData = new URLSearchParams();
  formData.append("entity_id", course_id.toString());
  formData.append("catalog_id", catalog_id.toString());
  formData.append("entity_type", "course");
  formData.append("status", status);
  formData.append("is_compliance", "0");
  formData.append("portals", "5");

  try {
    const response = await axios.post(
      `${BASE_URL}/ajax/admin/learning/catalog/create_default_access_group_mapping`,
      formData,
      {
        headers: {
          ...COMMON_HEADERS,
          "origin": `${BASE_URL}`,
          "referer": `${BASE_URL}/admin/learning/course/create`,
          "content-type": "application/x-www-form-urlencoded",
        },
        maxBodyLength: Infinity,
      }
    );

    console.log(`\n*** CREATE ACCESS GROUP MAPPING RESPONSE ***`);
    console.log(`Status Code: ${response.status}`);
    console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
    if (response.status !== 200 || response.data.result !== "success") {
      console.warn("⚠️ Access Group Mapping failed but continuing...");
    }
  } catch (error: any) {
    console.warn("⚠️ Access Group Mapping API failed - this is optional, continuing...");
    console.warn(`Error: ${error.message}`);
    // Don't throw error - access group mapping is optional
  }
}

/**
 * Add Classroom Instances
 */
async function addClassroomInstances(
  course_id: number,
  courseName: string,
  instanceCount: number,
  status: string,
  dateType: string = "future"
): Promise<void> {
  // Generate instance data
  const initSessions = [];
  const sessionList = [];
  
  for (let i = 0; i < instanceCount; i++) {
    const startDate = dateType.toLowerCase() === "pastclass" 
      ? getRandomPastDate() 
      : getRandomFutureDate();
    const startTime = getRandomTime();
    const endTime = getEndTime(startTime);
    const location = getRandomLocation();
    
    // Init session structure
    initSessions.push({
      Id: 0,
      code: "",
      name: "",
      start_date: "",
      end_date: "",
      days: [],
      start_time: "",
      end_time: "",
      instructors: [],
      location: {},
      maxSeat: "50",
      wailtList: "",
      isStatusChecked: true
    });
    
    // Actual session data
    // When instanceCount = 1, API uses course name without suffix
    // When instanceCount > 1, API uses "courseName instance 1", "instance 2", etc.
    const instanceName = instanceCount === 1 ? courseName : `${courseName} instance ${i + 1}`;
    
    sessionList.push({
      Id: 0,
      code: "",
      name: instanceName,
      start_date: startDate,
      end_date: "",
      days: [],
      start_time: startTime,
      end_time: endTime,
      instructors: [],
      location: location,
      maxSeat: "45",
      wailtList: "",
      isStatusChecked: i === instanceCount - 1, // Last instance checked
      disableStatusCheckbox: i === 0, // First instance disabled
      hasTimeError: false,
      status: "noconflict",
      duration: 60
    });
  }
  
  const instanceData = {
    createInstanceCount: instanceCount,
    deliveryType: "classroom",
    access: true,
    accessSettings: true,
    assessment: true,
    businessRule: true,
    observationCheckList: true,
    category: true,
    ceu: true,
    files: true,
    survey: true,
    tags: true,
    certificate: true,
    esignature: true,
    instanceClassName: courseName,
    initSessions: initSessions
  };

  const formData = new URLSearchParams();
  formData.append("id", course_id.toString());
  formData.append("createInstanceCount", instanceCount.toString());
  formData.append("language", "lang_00002");
  formData.append("language_name", "English");
  formData.append("courseStatus", status);
  formData.append("deliveryType", "classroom");
  formData.append("instanceData", JSON.stringify(instanceData));
  formData.append("session_list", JSON.stringify(sessionList));
  formData.append("instance_title", courseName);
  formData.append("is_recurring", "0");
  formData.append("skipconflictValidation", "true");
  formData.append("callFrom", "bulkClassCreation");

  const response = await axios.post(
    `${BASE_URL}/ajax/admin/learning/catalog/create_instance`,
    formData,
    {
      headers: {
        ...COMMON_HEADERS,
        "origin": `${BASE_URL}`,
        "referer": `${BASE_URL}/admin/learning/course/edit`,
        "content-type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    }
  );

  console.log(`\n*** ADD CLASSROOM INSTANCES RESPONSE ***`);
  console.log(`Status Code: ${response.status}`);
  console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
  
  if (response.status !== 200) {
    throw new Error("Add Classroom Instances failed");
  }
}

export async function createCourseAPI(
  content: string,
  courseName: string,
  status = "published",
  instances = "single",
  sub_type = "e-learning",
  price?: string,
  currency?: string
): Promise<string> {
  // Auto-refresh cookies if 18+ minutes old
  await refreshCookiesIfNeeded();
  
  const uniqueId = Date.now().toString();
  const contentId = await searchContent(content);
  await listUploadedContent(contentId, uniqueId);
  const { course_id, catalog_id } = await createCourse(courseName, uniqueId, status, instances, sub_type, contentId, price, currency);
  await createAccessGroupMapping(course_id, catalog_id, status);
  return courseName;
}

/**
 * Create Classroom Multi-Instance Course (ILT)
 * @param courseName - Name of the classroom course
 * @param status - Course status (default: "published")
 * @param instanceCount - Number of instances to create (default: 2)
 * @param dateType - Date type for instances: "future" (default) or "pastclass" for past dates
 * @param price - Optional price for the course
 * @param currency - Optional currency (required if price is provided)
 * @returns Array of instance names
 */
export async function createILTMultiInstance(
  courseName: string,
  status = "published",
  instanceCount = 2,
  dateType: string = "future",
  price?: string,
  currency?: string
): Promise<string[]> {
  // Auto-refresh cookies if 18+ minutes old
  await refreshCookiesIfNeeded();
  
  console.log(`\n🎓 Creating Classroom Multi-Instance Course: ${courseName}`);
  console.log(`📊 Instance Count: ${instanceCount}`);
  console.log(`📅 Date Type: ${dateType}\n`);
  
  const uniqueId = Date.now().toString();
  
  // Step 1: Create Classroom Course
  const { course_id, catalog_id } = await createClassroomCourse(
    courseName,
    uniqueId,
    status,
    price,
    currency
  );
  
  await createAccessGroupMapping(course_id, catalog_id, status);
  
  await addClassroomInstances(course_id, courseName, instanceCount, status, dateType);
  
  // Generate instance names array based on actual API behavior:
  // - Single instance (1): API returns course name without suffix
  // - Multiple instances (2+): API returns "courseName instance 1", "instance 2", etc.
  const instanceNames: string[] = [];
  if (instanceCount === 1) {
    instanceNames.push(courseName);
  } else {
    for (let i = 0; i < instanceCount; i++) {
      instanceNames.push(`${courseName} instance ${i + 1}`);
    }
  }
  
  console.log(`\n✅ Successfully created Classroom Multi-Instance Course: ${courseName}`);
  console.log(`   Course ID: ${course_id}`);
  console.log(`   Catalog ID: ${catalog_id}`);
  console.log(`   Instances Created: ${instanceCount}`);
  console.log(`   Date Type: ${dateType}`);
  console.log(`   Instance Names:`, instanceNames);
  console.log();
  
  return instanceNames;
}

/**
 * Create Virtual Classroom Course (Multi-Instance)
 */
async function createVirtualClassroomCourse(
  courseName: string,
  uniqueId: string,
  status: string,
  price?: string,
  currency?: string
): Promise<{ course_id: number; catalog_id: number }> {
  let priceValue = "";
  let currencyCode = "";
  
  if (price && price.trim() !== "") {
    priceValue = price.trim();
    
    if (!currency || currency.trim() === "") {
      throw new Error("Currency is required when price is provided");
    }
    
    currencyCode = getCurrencyCode(currency);
    console.log(`\n💰 Price Configuration:`);
    console.log(`   Price: ${priceValue}`);
    console.log(`   Currency: ${currency} → ${currencyCode}\n`);
  }

  const formData = new URLSearchParams();
  formData.append("changedFields", "[]");
  formData.append("skipconflictValidation", "false");
  formData.append("description", `<p>${description}</p>`);
  formData.append("master_title", courseName);
  formData.append("master_code", "");
  formData.append("title", courseName);
  formData.append("code", "");
  formData.append("language", "lang_00002");
  formData.append("old_course_languages", "");
  formData.append("language_name", "English");
  formData.append("portals", "5");
  formData.append("old_portals", "");
  formData.append("provider_id", "4");
  formData.append("categorys", "");
  formData.append("price", priceValue);
  formData.append("old_course_price", "");
  formData.append("currency_type", currencyCode);
  formData.append("max_seat", "");
  formData.append("old_max_seat", "undefined");
  formData.append("contact_support", "automationtenant@nomail.com");
  formData.append("duration", "");
  formData.append("instances", "multiple");
  formData.append("type", "course");
  formData.append("sub_type", "virtual-class");
  formData.append("old_sub_type", "");
  formData.append("old_course_title", "");
  formData.append("overdue_status", "");
  formData.append("waitlist_seat", "");
  formData.append("registration_end_on", "");
  formData.append("additional_info", "");
  formData.append("addn_catalog_show", "0");
  formData.append("addn_notify_show", "0");
  formData.append("discussion", "");
  formData.append("published_on", "");
  formData.append("no_of_instance", "1");
  formData.append("catalog_id", "null");
  formData.append("categoryflag", "false");
  formData.append("status", status);
  formData.append("virtualClass_details", "[]");
  formData.append("is_recurring", "0");
  formData.append("session_list", "[]");
  formData.append("complianceExists", "0");
  formData.append("is_compliance", "0");
  formData.append("compliance_validity", "");
  formData.append("validity_date", "");
  formData.append("validity_days", "");
  formData.append("complete_by_rule", "0");
  formData.append("complete_by", "date");
  formData.append("complete_by_date", "");
  formData.append("exceeds_deadline_status", "incomplete");
  formData.append("complete_days", "");
  formData.append("min_seat", "");
  formData.append("expiry_data", '{\r\n  "expiry_type": "",\r\n  "specific_date": "",\r\n  "completion_date": {},\r\n  "anniversary_date": {}\r\n}');
  formData.append("thumbnail", '{"filename":{"square":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-sq.png","width":120,"height":120},"thumb":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-th.png","width":144,"height":81},"2small":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/07/03/20240703061636-dedf890d-2s.png","width":240,"height":135},"xsmall":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-xs.png","width":432,"height":243},"small":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-sm.png","width":576,"height":324},"medium":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-me.png","width":792,"height":445},"large":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/07/03/20240703061636-dedf890d-la.png","width":1008,"height":567},"xlarge":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-xl.png","width":1224,"height":688},"xxlarge":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/07/03/20240703061636-dedf890d.png","width":"1280","height":"720"}}}');
  formData.append("is_primary", "1");
  formData.append("is_single", "0");
  formData.append("course_view", "1");
  formData.append("class_view", "0");
  formData.append("create_course_unique_id", uniqueId);

  const response = await axios.post(
    `${BASE_URL}/ajax/admin/learning/catalog/create`,
    formData,
    {
      headers: {
        ...COMMON_HEADERS,
        "origin": `${BASE_URL}`,
        "referer": `${BASE_URL}/admin/learning/course/create`,
        "content-type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    }
  );

  console.log(`\n*** CREATE VIRTUAL CLASSROOM COURSE RESPONSE ***`);
  console.log(`Status Code: ${response.status}`);
  console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
  
  if (response.status !== 200 || !response.data.course_id || !response.data.catalog_id) {
    console.error("❌ Create Virtual Classroom Course failed!");
    console.error(`Full Response Data:`);
    console.error(JSON.stringify(response.data, null, 2));
    throw new Error("Create Virtual Classroom Course failed - no course_id or catalog_id returned");
  }
  
  if (response.data.result === "error") {
    console.warn("⚠️ API returned result: 'error' but course was created (course_id: " + response.data.course_id + ")");
  }
  
  return { course_id: response.data.course_id, catalog_id: response.data.catalog_id };
}

/**
 * Create Virtual Classroom Instance
 */
async function createVCInstance(
  course_id: number,
  courseName: string,
  instanceCount: number
): Promise<number[]> {
  const instanceData = {
    createInstanceCount: instanceCount,
    deliveryType: "virtual-class",
    access: true,
    accessSettings: true,
    assessment: true,
    businessRule: true,
    observationCheckList: true,
    category: true,
    ceu: true,
    files: true,
    survey: true,
    tags: true,
    certificate: true,
    esignature: true,
    instanceClassName: courseName
  };

  console.log(`\n📤 Creating ${instanceCount} VC Instance(s) - Bulk API Call`);
  console.log(`   Course ID: ${course_id}`);
  console.log(`   Instance Count: ${instanceCount}`);
  console.log(`   Base Name sent to API: "${courseName}"`);
  console.log(`   (API will create ${instanceCount} instance(s) with this base name)\n`);

  const formData = new URLSearchParams();
  formData.append("id", course_id.toString());
  formData.append("createInstanceCount", instanceCount.toString());
  formData.append("deliveryType", "virtual-class");
  formData.append("instanceData", JSON.stringify(instanceData));
  formData.append("is_recurring", "0");

  const response = await axios.post(
    `${BASE_URL}/ajax/admin/learning/catalog/create_instance`,
    formData,
    {
      headers: {
        ...COMMON_HEADERS,
        "origin": `${BASE_URL}`,
        "referer": `${BASE_URL}/admin/learning/course/edit`,
        "content-type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    }
  );

  console.log(`\n*** CREATE VC INSTANCE RESPONSE ***`);
  console.log(`Status Code: ${response.status}`);
  console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}`);
  
  // Log what titles the API actually returned
  if (response.data.result_arr && Array.isArray(response.data.result_arr)) {
    console.log(`\n📊 API Response - Instance Titles Created:`);
    response.data.result_arr.forEach((item: any, index: number) => {
      console.log(`   Instance ${index + 1}: ID=${item.id}, Title="${item.title}"`);
    });
  }
  console.log();
  
  if (response.status !== 200 || response.data.result !== "success") {
    throw new Error("Create VC Instance failed");
  }

  // Extract instance IDs from result_arr
  const instanceIds: number[] = response.data.result_arr.map((item: any) => item.id);
  return instanceIds;
}

/**
 * Update Virtual Classroom Instance with session details
 */
async function updateVCInstance(
  instance_id: number,
  catalog_id: number,
  courseName: string,
  courseCode: string,
  sessionName: string,
  dateType: string = "future",
  status: string = "published"
): Promise<void> {
  const startDate = dateType.toLowerCase() === "pastclass" 
    ? getRandomPastDate() 
    : getRandomFutureDate();
  const startTime = getRandomTime();
  const endTime = getEndTime(startTime);

  const sessionDetails = [{
    session_course_id: 0,
    Id: 0,
    is_recurring: 0,
    vc_meeting_type: "6",
    name: sessionName,
    start_date: startDate,
    end_date: "",
    days: [],
    start_time: startTime,
    end_time: endTime,
    instructors: [],
    location: "",
    audio_setting: [],
    join_before_host: "",
    timezone: {
      id: 303,
      code: "tmz_0303",
      name: "(GMT+05:30) Indian Standard Time/Kolkata",
      gmt_area: "Asia/Kolkata"
    },
    vcDays: "",
    disableFields: false,
    sessionTypeField: false,
    activateSavesession: false,
    attendee_url: "https://docs.google.com/",
    presenter_url: "https://docs.google.com/",
    hostname: "",
    TZname: ""
  }];

  const formData = new URLSearchParams();
  formData.append("changedFields", '["new_session_details"]');
  formData.append("skipconflictValidation", "false");
  formData.append("description", `<p>${description}</p>`);
  formData.append("master_title", courseName);
  formData.append("master_code", courseCode);
  formData.append("title", courseName);
  formData.append("code", courseCode);
  formData.append("language", "lang_00002");
  formData.append("old_course_languages", "lang_00002");
  formData.append("language_name", "English");
  formData.append("portals", "5");
  formData.append("old_portals", "5");
  formData.append("provider_id", "4");
  formData.append("categorys", "");
  formData.append("price", "0.00");
  formData.append("old_course_price", "0.00");
  formData.append("currency_type", "");
  formData.append("max_seat", "50");
  formData.append("old_max_seat", "50");
  formData.append("contact_support", "automationtenant@nomail.com");
  formData.append("duration", "60");
  formData.append("instances", "multiple");
  formData.append("type", "course");
  formData.append("sub_type", "virtual-class");
  formData.append("old_sub_type", "virtual-class");
  formData.append("old_course_title", courseName);
  formData.append("overdue_status", "");
  formData.append("waitlist_seat", "");
  formData.append("registration_end_on", "");
  formData.append("additional_info", "");
  formData.append("addn_catalog_show", "0");
  formData.append("addn_notify_show", "0");
  formData.append("discussion", "");
  formData.append("published_on", new Date().toISOString().slice(0, 19).replace('T', ' '));
  formData.append("no_of_instance", "0");
  formData.append("catalog_id", catalog_id.toString());
  formData.append("categoryflag", "false");
  formData.append("status", status);
  formData.append("virtualClass_details", JSON.stringify(sessionDetails));
  formData.append("is_recurring", "0");
  formData.append("session_list", JSON.stringify(sessionDetails));
  formData.append("complianceExists", "0");
  formData.append("is_compliance", "0");
  formData.append("compliance_validity", "");
  formData.append("validity_date", "");
  formData.append("validity_days", "");
  formData.append("complete_by_rule", "0");
  formData.append("complete_by", "date");
  formData.append("complete_by_date", "");
  formData.append("exceeds_deadline_status", "incomplete");
  formData.append("complete_days", "");
  formData.append("min_seat", "");
  formData.append("expiry_data", '{\r\n  "expiry_type": "",\r\n  "specific_date": "",\r\n  "completion_date": {},\r\n  "anniversary_date": {}\r\n}');
  formData.append("is_primary", "0");
  formData.append("course_view", "0");
  formData.append("is_single", "0");
  formData.append("thumbnail", '{"filename":{"square":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-sq.png","width":120,"height":120},"thumb":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-th.png","width":144,"height":81},"2small":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/07/03/20240703061636-dedf890d-2s.png","width":240,"height":135},"xsmall":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-xs.png","width":432,"height":243},"small":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-sm.png","width":576,"height":324},"medium":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-me.png","width":792,"height":445},"large":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/07/03/20240703061636-dedf890d-la.png","width":1008,"height":567},"xlarge":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/07/03/20240703061636-dedf890d-xl.png","width":1224,"height":688},"xxlarge":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/07/03/20240703061636-dedf890d.png","width":"1280","height":"720"}}}');
  formData.append("id", instance_id.toString());
  formData.append("cancel_reason", "");
  formData.append("parent_catalog_status", "1");

  const response = await axios.post(
    `${BASE_URL}/ajax/admin/learning/catalog/update`,
    formData,
    {
      headers: {
        ...COMMON_HEADERS,
        "origin": `${BASE_URL}`,
        "referer": `${BASE_URL}/admin/learning/course/edit`,
        "content-type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    }
  );

  console.log(`\n*** UPDATE VC INSTANCE RESPONSE ***`);
  console.log(`Status Code: ${response.status}`);
  console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
  
  if (response.status !== 200) {
    throw new Error("Update VC Instance failed");
  }
}

/**
 * Create Virtual Classroom Multi-Instance Course
 * @param courseName - Name of the virtual classroom course
 * @param status - Course status (default: "published")
 * @param instanceCount - Number of instances to create (default: 1)
 * @param dateType - Date type for instances: "future" (default) or "pastclass" for past dates
 * @param price - Optional price for the course
 * @param currency - Optional currency (required if price is provided)
 * @returns Instance name as string if instanceCount is 1, array of instance names if instanceCount > 1
 */
export async function createVCMultiInstance(
  courseName: string,
  status = "published",
  instanceCount = 1,
  dateType: string = "future",
  price?: string,
  currency?: string
): Promise<string | string[]> {
  // Auto-refresh cookies if 18+ minutes old
  await refreshCookiesIfNeeded();
  
  console.log(`\n🎥 Creating Virtual Classroom Course: ${courseName}`);
  console.log(`📊 Instance Count: ${instanceCount}`);
  console.log(`📅 Date Type: ${dateType}\n`);
  
  const uniqueId = Date.now().toString();
  
  // Step 1: Create Virtual Classroom Course
  const { course_id, catalog_id } = await createVirtualClassroomCourse(
    courseName,
    uniqueId,
    status,
    price,
    currency
  );
  
  // Step 2: Create Access Group Mapping
  await createAccessGroupMapping(course_id, catalog_id, status);
  
  // Step 3: Create all instances in ONE bulk API call
  const instanceIds = await createVCInstance(course_id, courseName, instanceCount);
  
  // Step 4: Update each instance with session details
  const instanceNames: string[] = [];
  
  for (let i = 0; i < instanceIds.length; i++) {
    const sessionName = instanceCount === 1 ? `${courseName} Session` : `${courseName} Session ${i + 1}`;
    const courseCode = `CLS-VC-${String(instanceIds[i]).padStart(5, '0')}`;
    
    // Instance title to send in update API
    const instanceTitle = instanceCount === 1 ? courseName : `${courseName} instance ${i + 1}`;
    
    console.log(`\n📝 Updating VC Instance ${i + 1}/${instanceCount}:`);
    console.log(`   Instance ID: ${instanceIds[i]}`);
    console.log(`   Title being sent to API: "${instanceTitle}"`);
    console.log(`   Code: ${courseCode}`);
    console.log(`   Session Name: "${sessionName}"`);
    
    await updateVCInstance(
      instanceIds[i],
      catalog_id,
      instanceTitle,
      courseCode,
      sessionName,
      dateType,
      status
    );
    
    // Store the instance name that was sent to update API
    instanceNames.push(instanceTitle);
  }
  
  console.log(`\n✅ Successfully created Virtual Classroom Course: ${courseName}`);
  console.log(`   Course ID: ${course_id}`);
  console.log(`   Catalog ID: ${catalog_id}`);
  console.log(`   Instances Created: ${instanceCount}`);
  console.log(`   Instance Names:`, instanceNames);
  console.log(`   Date Type: ${dateType}`);
  console.log();
  
  // Return string if single instance, array if multiple
  return instanceCount === 1 ? instanceNames[0] : instanceNames;
}
