import axios from "axios";
import { FakerData } from '../../../utils/fakerUtils';
import fs from 'fs';
import path from 'path';


const BASE_URL = "https://newprod.expertusoneqa.in";
const SESSION_COOKIE = fs.readFileSync(path.join(process.cwd(), 'data', 'cookies.txt'), 'utf-8');

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
    headers: {
      ...COMMON_HEADERS,
      "referer": `${BASE_URL}/admin/learning/course/create`,
    },
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
  console.log(`Response Body: ${JSON.stringify(response.data, null, 2)}\n`);
  if (response.status !== 200) {
    throw new Error("Upload Content failed");
  }
}

const description=FakerData.getDescription();
async function createCourse(
  courseName: string,
  uniqueId: string,
  status: string,
  instances: string,
  sub_type: string
): Promise<{ course_id: number; catalog_id: number }> {
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
  formData.append("portals", "2,3,4");
  formData.append("old_portals", "");
  formData.append("provider_id", "2");
  formData.append("categorys", "");
  formData.append("price", "");
  formData.append("old_course_price", "");
  formData.append("currency_type", "");
  formData.append("max_seat", "");
  formData.append("old_max_seat", "undefined");
  formData.append("contact_support", "playwrightAutomation@gmail.com");
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
  formData.append("portals", "2,3,4");

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
    throw new Error("Access Group Mapping failed");
  }
}

export async function createCourseAPI(
  content: string,
  courseName: string,
  status = "published",
  instances = "single",
  sub_type = "e-learning"
): Promise<string> {
  const uniqueId = Date.now().toString();
  const contentId = await searchContent(content);
  await listUploadedContent(contentId, uniqueId);
  const { course_id, catalog_id } = await createCourse(courseName, uniqueId, status, instances, sub_type);
  await createAccessGroupMapping(course_id, catalog_id, status);
  return courseName;
}