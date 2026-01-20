import axios from "axios";
import { FakerData, getRandomFutureDate, getRandomPastDate } from '../../../utils/fakerUtils';
import fs from 'fs';
import path from 'path';
import { URLConstants } from '../../../constants/urlConstants';

const BASE_URL = URLConstants.adminURL.replace('/backdoor', '');
const SESSION_COOKIE = fs.readFileSync(path.join(process.cwd(), 'data', 'cookies.txt'), 'utf-8').trim();

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
  "x-requested-with": "XMLHttpRequest",
  "Cookie": SESSION_COOKIE,
};

async function searchContent(contentName: string): Promise<number> {
  // Attempts 1-3: original strict filters with short waits (indexing)
  for (let attempt = 1; attempt <= 3; attempt++) {
    const strictParams = new URLSearchParams({
      textsearch: contentName,
      status: 'published',
      page: '1',
      limit: '10',
      'document_library[]': 'No',
      uploaded_contents: '',
      callFrom: 'courseContentLibrary',
      search_type: 'title',
    });
    const url = `${BASE_URL}/ajax/admin/manage/content/list?${strictParams.toString()}`;
    const response = await axios.get(url, {
      headers: {
        ...COMMON_HEADERS,
        referer: `${BASE_URL}/admin/learning/course/create`,
      },
      maxBodyLength: Infinity,
      validateStatus: () => true,
    });
    console.log(`\n*** SEARCH CONTENT RESPONSE (strict attempt ${attempt}/3) ***`);
    console.log(`Status Code: ${response.status}`);
    console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
    if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0 && response.data[0]._id) {
      return response.data[0]._id;
    }
    // small wait to allow indexing
    await new Promise(res => setTimeout(res, attempt * 500));
  }

  // Final attempt: relaxed filters
  const relaxedParams = new URLSearchParams({
    textsearch: contentName,
    page: '1',
    limit: '10',
    search_type: 'title',
  });
  const relaxedUrl = `${BASE_URL}/ajax/admin/manage/content/list?${relaxedParams.toString()}`;
  const relaxedResp = await axios.get(relaxedUrl, {
    headers: {
      ...COMMON_HEADERS,
      referer: `${BASE_URL}/admin/learning/course/create`,
    },
    maxBodyLength: Infinity,
    validateStatus: () => true,
  });
  console.log(`\n*** SEARCH CONTENT RESPONSE (relaxed attempt) ***`);
  console.log(`Status Code: ${relaxedResp.status}`);
  console.log(`Response Body: ${JSON.stringify(relaxedResp.data, null, 2)}\n`);
  if (relaxedResp.status === 200 && Array.isArray(relaxedResp.data) && relaxedResp.data.length > 0 && relaxedResp.data[0]._id) {
    return relaxedResp.data[0]._id;
  }

  throw new Error('Search Content failed');
}

async function listUploadedContent(contentId: number, uniqueId: string): Promise<void> {
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
  // console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
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
  price?: string,
  currency?: string
): Promise<{ course_id: number; catalog_id: number }> {
  // Handle price and currency
  let priceValue = "";
  let currencyCode = "";
  
  if (price && price.trim() !== "") {
    priceValue = price.trim();
    
    // If price is provided, currency is required
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
  formData.append("single_registration", "undefined");
  formData.append("enforce_sequence", "0");
  formData.append("content_validity_type", "");
  formData.append("content_validity_date", "");
  formData.append("content_validity_days", "");
  formData.append("content", "28");
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
  formData.append("thumbnail", '{"filename":{"square":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/06/28/20240628094606-4d3b34cf-sq.png","width":120,"height":120},"thumb":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/06/28/20240628094606-4d3b34cf-th.png","width":144,"height":93},"2small":{"url":"http://gallery.expertusoneqa.com/i.php?/upload/admin/2024/06/28/20240628094606-4d3b34cf-2s.png","width":240,"height":155},"xsmall":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/06/28/20240628094606-4d3b34cf-xs.png","width":432,"height":279},"small":{"url":"http://gallery.expertusoneqa.com/_data/i/upload/admin/2024/06/28/20240628094606-4d3b34cf-sm.png","width":576,"height":373},"medium":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/06/28/20240628094606-4d3b34cf.png","width":"642","height":"416"},"large":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/06/28/20240628094606-4d3b34cf.png","width":"642","height":"416"},"xlarge":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/06/28/20240628094606-4d3b34cf.png","width":"642","height":"416"},"xxlarge":{"url":"http://gallery.expertusoneqa.com/upload/admin/2024/06/28/20240628094606-4d3b34cf.png","width":"642","height":"416"}}}');
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
      maxSeat: "",
      wailtList: "",
      isStatusChecked: true
    });
    
    // Actual session data
    sessionList.push({
      Id: 0,
      code: "",
      name: `${courseName} instance ${i + 1}`,
      start_date: startDate,
      end_date: "",
      days: [],
      start_time: startTime,
      end_time: endTime,
      instructors: [],
      location: location,
      maxSeat: "12",
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
  const uniqueId = Date.now().toString();
  const contentId = await searchContent(content);
  await listUploadedContent(contentId, uniqueId);
  const { course_id, catalog_id } = await createCourse(courseName, uniqueId, status, instances, sub_type, price, currency);
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
  
  // Generate instance names array
  const instanceNames: string[] = [];
  for (let i = 0; i < instanceCount; i++) {
    instanceNames.push(`${courseName} instance ${i + 1}`);
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
