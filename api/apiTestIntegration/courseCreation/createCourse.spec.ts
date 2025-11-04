import { test, expect } from '@playwright/test';
import { createCourseAPI } from './createCourseAPI';
import { FakerData } from '../../../utils/fakerUtils';


test('should create a published e-learning course via API', async () => {
const content='content testing-001';
const courseName =  FakerData.getCourseName();  

  const result = await createCourseAPI(
    content,
    courseName,
    'published',   // status--Show in catalog
    'single',      // instances
    'e-learning'   // sub_type/delivery type
  );

  expect(result).toBe(courseName);
  console.log(` Successfully created course: "${courseName}"`);
});
