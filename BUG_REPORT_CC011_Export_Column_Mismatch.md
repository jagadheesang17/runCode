# 🐛 Bug Report: Change Log Export - Column Data Mismatch

---

## Bug ID
**CC011-EXPORT-001**

## Priority
**HIGH** ⚠️

## Module
**Completion Certificate - Change Log Export**

---

## Summary
When exporting the Change Log data to Excel, the **"WHAT CHANGED" column contains incorrect data** (shows Field Name values instead of action types like "Inserted"/"Updated"), causing a column alignment/data mismatch issue.

---

## Environment
- **Test Date:** November 10, 2025
- **Module:** Learning > Completion Certificate > Change Log
- **Export Format:** Excel (.xlsx)
- **Test Case:** CC011_Verify_change_log.spec.ts
- **Browser:** Chromium (Playwright)

---

## Steps to Reproduce

1. Login as **Customer Admin**
2. Navigate to: **Admin Home > Learning > Completion Certificate**
3. Click **"CREATE COMPLETION CERTIFICATE"**
4. Fill in certificate details:
   - Select template type
   - Enter title
   - Design certificate
5. Click **"PUBLISH"** and then **"PROCEED"**
6. Click **"EDIT CERTIFICATE"**
7. Click **"Change Log"** icon to open Change Log section
8. Observe the UI data displayed
9. Click **"Export"** icon
10. Select **"Export as Excel"**
11. Open the downloaded Excel file
12. Compare Excel data with UI data

---

## Expected Result

### UI Display (6 columns):
```
┌──────────────┬─────────────────────┬───────────┬──────────────────────┬────────────┬──────────────┐
│ WHAT CHANGED │ FIELD NAME          │ OLD VALUE │ NEW VALUE            │ CHANGED BY │ CHANGED DATE │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼──────────────┤
│ Inserted     │ Domain              │           │ newprod, portal1,    │ new admin  │ Nov 10, 2025 │
│              │                     │           │ portal2              │            │              │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼──────────────┤
│ Inserted     │ Title               │           │ yourself feather     │ new admin  │ Nov 10, 2025 │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼──────────────┤
│ Inserted     │ Status              │           │ Published            │ new admin  │ Nov 10, 2025 │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼──────────────┤
│ Updated      │ Status              │ Draft     │ Published            │ new admin  │ Nov 10, 2025 │
└──────────────┴─────────────────────┴───────────┴──────────────────────┴────────────┴──────────────┘
```

### Excel Export Should Match:
```
┌──────────────┬─────────────────────┬───────────┬──────────────────────┬────────────┬──────────────┐
│ WHAT CHANGED │ FIELD NAME          │ OLD VALUE │ NEW VALUE            │ CHANGED BY │ CHANGED DATE │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼──────────────┤
│ Inserted     │ Domain              │           │ newprod, portal1,    │ new admin  │ Nov 10, 2025 │
│              │                     │           │ portal2              │            │              │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼──────────────┤
│ Inserted     │ Title               │           │ yourself feather     │ new admin  │ Nov 10, 2025 │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼──────────────┤
│ Inserted     │ Status              │           │ Published            │ new admin  │ Nov 10, 2025 │
└──────────────┴─────────────────────┴───────────┴──────────────────────┴────────────┴──────────────┘
```

---

## Actual Result

### Excel Export (INCORRECT - Column Misalignment):
```
┌──────────────┬─────────────────────┬───────────┬──────────────────────┬────────────┬────────────────────┐
│ WHAT CHANGED │ FIELD NAME          │ OLD VALUE │ NEW VALUE            │ CHANGED BY │ CHANGED DATE       │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼────────────────────┤
│ Domain       │ Domain              │           │ newprod, portal1,    │ new admin  │ 2025-11-10 11:24:  │
│              │                     │           │ portal2              │            │                    │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼────────────────────┤
│ Title        │ Title               │           │ after popcorn        │ new admin  │ 2025-11-10 11:24:  │
├──────────────┼─────────────────────┼───────────┼──────────────────────┼────────────┼────────────────────┤
│ Status       │ Status              │ Draft     │ Published            │ new admin  │ 2025-11-10 11:24:  │
└──────────────┴─────────────────────┴───────────┴──────────────────────┴────────────┴────────────────────┘
```

---

## Issues Identified

### 🔴 **Issue 1: "WHAT CHANGED" Column Shows Wrong Data**
- **Expected:** "Inserted", "Updated", etc.
- **Actual:** Shows "FIELD NAME" values (Domain, Title, Status, etc.)
- **Impact:** Users cannot identify what type of change occurred (Insert vs Update)

### 🔴 **Issue 2: Date Format Inconsistency**
- **UI Format:** `Nov 10, 2025` (Human-readable)
- **Excel Format:** `2025-11-10 11:24:...` (Timestamp format)
- **Impact:** Inconsistent date presentation

### 🔴 **Issue 3: Data Integrity**
- **Missing Data:** "Inserted"/"Updated" action type is completely missing from Excel export
- **Impact:** Critical audit information is lost in exported file

---

## Test Validation Results

### Automated Test Output:
```
Found 9 change log rows
Row data: Inserted | Domain | newprod, portal1, portal2 | new admin | Nov 10, 2025
Row data: Inserted | Completion Certificate | Added | new admin | Nov 10, 2025
Row data: Inserted | Title | yourself feather | new admin | Nov 10, 2025
Row data: Inserted | Status | Published | new admin | Nov 10, 2025

Extracted 9 change log entries from UI

=== EXCEL VALIDATION REPORT ===
JSON Change Log Entries: 9

Detailed Validation Results:
1. Entry: Inserted | Domain | newprod, portal1, portal2 | new admin | Nov 10, 2025
   Result: MISSING
   Missing fields: Inserted, Nov 10, 2025

2. Entry: Inserted | Title | yourself feather | new admin | Nov 10, 2025
   Result: MISSING
   Missing fields: Inserted, Nov 10, 2025

Validation Summary:
Total Entries: 9
Found: 0
Missing: 9
Result: VALIDATION FAILED ❌
```

---

## Root Cause Analysis

### Suspected Issue:
The export functionality appears to be **skipping the first column** or **incorrectly mapping column data** during the Excel generation process.

### Technical Details:
- **UI Structure:** Data is stored in `<div class="row lms-tbl-row py-2">` with `<div class="col-2">` columns
- **Export Process:** Column mapping logic incorrectly assigns FIELD_NAME value to WHAT_CHANGED column
- **Missing Mapping:** The "Inserted"/"Updated" value is not being included in the export

---

## Impact Assessment

### Business Impact:
- **HIGH** - Audit trail is incomplete in exported files
- Users rely on exported data for compliance and reporting
- Missing action types (Inserted/Updated) makes it impossible to track change history accurately

### User Impact:
- **HIGH** - Cannot determine what type of change occurred from exported file
- Requires cross-referencing with UI for complete information
- Affects regulatory compliance if audit logs are required

### Data Integrity:
- **CRITICAL** - Exported data does not match UI display
- Loss of critical audit information

---

## Reproducibility
- **Frequency:** 100% reproducible
- **Occurrence:** Every export operation
- **Manual Test:** Confirmed - Same issue occurs in manual export
- **Automated Test:** Confirmed - Test automation catches this issue consistently

---

## Workaround
**None Available** - Users must manually review UI and copy data if accurate "WHAT CHANGED" information is needed.

---

## Recommended Fix

### Backend/Export Logic:
1. **Review column mapping** in the Change Log export service
2. **Include "WHAT CHANGED" field** in the export data model
3. **Ensure column order matches UI:**
   ```
   Column 0: WHAT_CHANGED (Inserted/Updated)
   Column 1: FIELD_NAME
   Column 2: OLD_VALUE
   Column 3: NEW_VALUE
   Column 4: CHANGED_BY
   Column 5: CHANGED_DATE
   ```
4. **Standardize date format** between UI and export (recommend: Nov 10, 2025 or MM/DD/YYYY)

### Testing Required After Fix:
- [ ] Verify "WHAT CHANGED" column contains correct values (Inserted/Updated)
- [ ] Verify date format consistency between UI and Excel
- [ ] Verify all 6 columns export correctly
- [ ] Test with multiple change types (Insert, Update, Delete)
- [ ] Test with large data sets (100+ rows)
- [ ] Test CSV export as well

---

## Screenshots

### Screenshot 1: UI Display (Correct)
![UI Change Log](./screenshots/CC011_UI_ChangeLog.png)
- Shows "Inserted" in WHAT CHANGED column
- Shows "Nov 10, 2025" format

### Screenshot 2: Excel Export (Incorrect)
![Excel Export](./screenshots/CC011_Excel_Export.png)
- Shows "Domain", "Title", "Status" in WHAT CHANGED column (WRONG!)
- Shows "2025-11-10 11:24:..." format

---

## Test Case Reference
- **Test File:** `tests/admin/completionCertificate/CC011_Verify_change_log.spec.ts`
- **Page Object:** `pages/CompletionCertificationPage.ts`
- **Validation Method:** `getChangeLogData()`
- **Export Validator:** `utils/ExportValidator.ts`

---

## Related Information

### Test Execution:
```powershell
npx playwright test CC011_Verify_change_log.spec.ts
```

### JSON Data Extracted from UI:
```json
[
  {
    "data": ["Inserted", "Domain", "newprod, portal1, portal2", "new admin", "Nov 10, 2025"]
  },
  {
    "data": ["Inserted", "Title", "yourself feather", "new admin", "Nov 10, 2025"]
  },
  {
    "data": ["Inserted", "Status", "Published", "new admin", "Nov 10, 2025"]
  }
]
```

### Exported Excel Data (Actual):
```
Row 1: Domain | Domain | (empty) | newprod, portal1, portal2 | new admin | 2025-11-10 11:24
Row 2: Title | Title | (empty) | yourself feather | new admin | 2025-11-10 11:24
Row 3: Status | Status | Draft | Published | new admin | 2025-11-10 11:24
```

---

## Severity Classification
**HIGH** ⚠️

### Criteria:
- ✅ Affects core functionality (Export)
- ✅ Data integrity issue (Missing critical information)
- ✅ 100% reproducible
- ✅ No workaround available
- ✅ Impacts audit compliance
- ✅ Affects all users

---

## Assignment
- **Reported By:** QA Automation Team (Kathir A)
- **Date Reported:** November 10, 2025
- **Assigned To:** Development Team - Completion Certificate Module
- **Target Fix Version:** Next Release

---

## Additional Notes
- This issue was caught by **automated export validation** in test case CC011
- The validation framework compares UI data with exported file data field-by-field
- Same validation framework can be used to verify the fix once implemented

---

## Verification Checklist (Post-Fix)
After the fix is deployed, verify:

- [ ] "WHAT CHANGED" column shows "Inserted"/"Updated" correctly
- [ ] All column data matches UI display exactly
- [ ] Date format is consistent (UI vs Excel)
- [ ] No data loss in export
- [ ] CSV export also works correctly
- [ ] Automated test CC011 passes
- [ ] Manual verification confirms fix

---

**Bug Report Generated:** November 10, 2025  
**Report Version:** 1.0  
**Status:** Open / Under Investigation
