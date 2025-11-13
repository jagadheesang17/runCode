import axios from "axios";
import fs from 'fs';
import path from 'path';
import { URLConstants } from '../../../constants/urlConstants';

const BASE_URL = URLConstants.adminURL.replace('/backdoor', '');
const SESSION_COOKIE = fs.readFileSync(path.join(process.cwd(), 'data', 'cookies.txt'), 'utf-8');

const COMMON_HEADERS = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
  "priority": "u=1, i",
  "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
  "x-access-token": "",
  "x-requested-with": "XMLHttpRequest",
  "Cookie": SESSION_COOKIE,
};

async function getCategoryList(): Promise<any> {
  const params = new URLSearchParams({
    order: 'a-z',
    page: '1',
    rows: '2000'
  });
  const url = `${BASE_URL}/ajax/admin/metadatalibrary/learningcategory/list?${params.toString()}`;
  
  const response = await axios.get(url, {
    headers: {
      ...COMMON_HEADERS,
      "referer": `${BASE_URL}/admin/metadatalibrary/learning`,
    },
    maxBodyLength: Infinity,
  });

  if (response.status !== 200) {
    throw new Error(`Get Category List failed with status: ${response.status}`);
  }
  
  return response.data;
}

async function getLanguageList(): Promise<any> {
  const params = new URLSearchParams({
    order: 'new-old',
    page: '1',
    rows: '100'
  });
  const url = `${BASE_URL}/ajax/admin/people/user/fetch_languages?${params.toString()}`;
  
  const response = await axios.get(url, {
    headers: {
      ...COMMON_HEADERS,
      "referer": `${BASE_URL}/admin/metadatalibrary/learning`,
    },
    maxBodyLength: Infinity,
  });

  if (response.status !== 200) {
    throw new Error(`Get Language List failed with status: ${response.status}`);
  }
  
  return response.data;
}

async function getCountryList(): Promise<any> {
  const params = new URLSearchParams({
    order: 'a-z',
    page: '1',
    rows: '2000'
  });
  const url = `${BASE_URL}/ajax/admin/metadatalibrary/country/list?${params.toString()}`;
  
  const response = await axios.get(url, {
    headers: {
      ...COMMON_HEADERS,
      "referer": `${BASE_URL}/admin/metadatalibrary/learning`,
    },
    maxBodyLength: Infinity,
  });

  if (response.status !== 200) {
    throw new Error(`Get Country List failed with status: ${response.status}`);
  }
  
  return response.data;
}

async function getTagList(): Promise<any> {
  const params = new URLSearchParams({
    order: 'a-z',
    page: '1',
    rows: '2000'
  });
  const url = `${BASE_URL}/ajax/admin/metadatalibrary/tag/list?${params.toString()}`;
  
  const response = await axios.get(url, {
    headers: {
      ...COMMON_HEADERS,
      "referer": `${BASE_URL}/admin/metadatalibrary/learning`,
    },
    maxBodyLength: Infinity,
  });

  if (response.status !== 200) {
    throw new Error(`Get Tag List failed with status: ${response.status}`);
  }
  
  return response.data;
}

async function getSkillsList(): Promise<any> {
  const params = new URLSearchParams({
    order: 'a-z',
    page: '1',
    rows: '2000'
  });
  const url = `${BASE_URL}/ajax/admin/metadatalibrary/skill/list?${params.toString()}`;
  
  const response = await axios.get(url, {
    headers: {
      ...COMMON_HEADERS,
      "referer": `${BASE_URL}/admin/metadatalibrary/learning`,
    },
    maxBodyLength: Infinity,
  });

  if (response.status !== 200) {
    throw new Error(`Get Skills List failed with status: ${response.status}`);
  }
  
  return response.data;
}

async function getLocationList(): Promise<any> {
  const params = new URLSearchParams({
    order: 'a-z',
    page: '1',
    rows: '2000'
  });
  const url = `${BASE_URL}/ajax/admin/metadatalibrary/location/list?${params.toString()}`;
  
  const response = await axios.get(url, {
    headers: {
      ...COMMON_HEADERS,
      "referer": `${BASE_URL}/admin/metadatalibrary/learning`,
    },
    maxBodyLength: Infinity,
  });

  if (response.status !== 200) {
    throw new Error(`Get Location List failed with status: ${response.status}`);
  }
  
  return response.data;
}

export async function getCategories(): Promise<any> {
  return await getCategoryList();
}

export async function getLanguages(): Promise<any> {
  return await getLanguageList();
}

export async function getCountries(): Promise<any> {
  return await getCountryList();
}

export async function getTags(): Promise<any> {
  return await getTagList();
}

export async function getSkills(): Promise<any> {
  return await getSkillsList();
}

export async function getLocations(): Promise<any> {
  return await getLocationList();
}

// Get category names from API response (all returned categories are active)
export async function getCategoryNames(): Promise<string[]> {
  const categoryList = await getCategoryList();
  if (Array.isArray(categoryList)) {
    const categoryNames = categoryList.map((category: any) => category.name);
    console.log(`\n*** CATEGORY NAMES ***`);
    console.log(categoryNames);
    console.log(`Total Categories: ${categoryNames.length}\n`);
    return categoryNames;
  }
  return [];
}

// Get both active and inactive language names in one API call - filters by status (1=active, 0=inactive)
export async function getLanguageNamesByStatus(): Promise<{ activeNames: string[], inactiveNames: string[] }> {
  const languageList = await getLanguageList();
  
  // Response is wrapped in an array: [[{...languages...}]]
  if (Array.isArray(languageList) && languageList.length > 0 && Array.isArray(languageList[0])) {
    const languages = languageList[0];
    
    const activeLanguages = languages.filter((language: any) => language.status === 1);
    const inactiveLanguages = languages.filter((language: any) => language.status === 0);
    const activeNames = activeLanguages.map((language: any) => language.name);
    const inactiveNames = inactiveLanguages.map((language: any) => language.name);
    
    console.log(`\n*** LANGUAGE NAMES ***`);
    console.log(`Active (status=1): ${activeNames}`);
    console.log(`Inactive (status=0): ${inactiveNames}`);
    console.log(`Total Active: ${activeNames.length}, Total Inactive: ${inactiveNames.length}\n`);
    
    return { activeNames, inactiveNames };
  }
  return { activeNames: [], inactiveNames: [] };
}

// Backward compatibility - returns only active language names
export async function getLanguageNames(): Promise<string[]> {
  const { activeNames } = await getLanguageNamesByStatus();
  return activeNames;
}

// Backward compatibility - returns only inactive language names
export async function getInactiveLanguageNames(): Promise<string[]> {
  const { inactiveNames } = await getLanguageNamesByStatus();
  return inactiveNames;
}

// Get country names from API response (all returned countries are active)
export async function getCountryNames(): Promise<string[]> {
  const countryList = await getCountryList();
  
  if (Array.isArray(countryList)) {
    const countryNames = countryList.map((country: any) => country.name);
    console.log(`\n*** COUNTRY NAMES ***`);
    console.log(`Total Countries: ${countryNames.length}\n`);
    return countryNames;
  }
  return [];
}

// Get skill names from API response (all returned skills are active)
export async function getSkillNames(): Promise<string[]> {
  const skillsList = await getSkillsList();
  
  if (Array.isArray(skillsList)) {
    const skillNames = skillsList.map((skill: any) => skill.name);
    console.log(`\n*** SKILL NAMES ***`);
    console.log(`Total Skills: ${skillNames.length}\n`);
    return skillNames;
  }
  return [];
}

// Get tag names from API response (all returned tags are active)
export async function getTagNames(): Promise<string[]> {
  const tagList = await getTagList();
  
  if (Array.isArray(tagList)) {
    const tagNames = tagList.map((tag: any) => tag.name);
    console.log(`\n*** TAG NAMES ***`);
    console.log(`Total Tags: ${tagNames.length}\n`);
    return tagNames;
  }
  return [];
}

// Get location names from API response (all returned locations are active)
export async function getLocationNames(): Promise<string[]> {
  const locationList = await getLocationList();
  
  if (Array.isArray(locationList)) {
    const locationNames = locationList.map((location: any) => location.name);
    console.log(`\n*** LOCATION NAMES ***`);
    console.log(`Total Locations: ${locationNames.length}\n`);
    return locationNames;
  }
  return [];
}
