<!-- 🚀 COPILOT START -->
# 🤖 Copilot Integration Guide for Playwright TypeScript Automation

## 🎯 Purpose
This guide tells Copilot exactly how to convert raw recorded flows from Playwright Codegen into structured framework-based automation scripts.

---

## 🧩 Input Source
- Playwright recorded files: `/recordedFlows/*.spec.ts`
- Framework folders:
  - `/tests/`
  - `/pages/`
  - `/fixtures/`
  - `/utils/`
- Config file: `/playwright.config.ts`

---

## 🧠 Copilot Rules

1. Always use Page Object pattern.  
   Example: place reusable selectors under `/pages`.

2. Never hardcode locators — prefer `data-testid` or role-based selectors.

3. Reuse existing methods if found in `/pages` or `/utils`.

4. Follow naming pattern:  
   - Test files → `test.<module>.spec.ts`
   - Page files → `<Module>Page.ts`

5. Maintain async-await flow strictly.

6. If additional logic like **conditional login or validation** is mentioned in the extra prompt, integrate it cleanly using framework utilities, not inline waits.

7. Comments must explain logical steps, not UI actions.

8. Preserve code readability — 4-space indentation, no unused imports.

---

## 🧩 Copilot Output Format

When converting recorded flow:
```ts
// test.course.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CoursePage } from '../pages/CoursePage';

test('Course creation flow', async ({ page }) => {
  const login = new LoginPage(page);
  const course = new CoursePage(page);

  await login.loginAsAdmin();
  await course.navigateToCourses();
  await course.createNewCourse('Automation 101');
  await expect(course.successToast).toBeVisible();
});
```

---

## 🧠 Integration Example

If the recorded flow has just raw clicks, rewrite into reusable page calls like:

```ts
await page.getByRole('textbox', { name: 'Username' }).fill('admin');
```
👇 becomes:
```ts
await login.enterUsername('admin');
```

---

## 💬 Copilot Action Guide
Whenever I say:
> "Integrate my recorded flow for {module} with extra condition {X}"

You should:
1. Locate the matching recorded flow in `/recordedFlows`
2. Read this guide
3. Generate a new test file under `/tests`
4. Respect all framework rules and naming patterns
5. Add conditional logic if mentioned
6. Output the final formatted TypeScript file

---

## 🧾 Optional: Export to PDF

After file creation, use Markdown PDF or `markdown-pdf` VSCode extension to export:
`copilot_integration_prompt.pdf`

---

## 🏁 Notes

✅ All generated scripts must run lint-free and align with framework structure.  
✅ Do not duplicate locators or hardcode timeouts.  
✅ Always modularize new functionality into `/pages` and `/utils`.

<!-- 🚀 COPILOT END -->