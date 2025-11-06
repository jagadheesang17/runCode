# Filter Verification Method - Usage Guide

## Method Overview
The `verifyAppliedFilter()` method validates that filters are correctly applied on the learner catalog page after generating a URL.

## Method Signature
```typescript
async verifyAppliedFilter(filterName: string, expectedValues: string | string[]): Promise<void>
```

## Parameters
- **filterName**: The filter category name (e.g., "Training Type", "Price", "Rating", "Language")
- **expectedValues**: Single value (string) or multiple values (string array)

---

## Usage Examples

### 1. Training Type Filter

#### Single Training Type
```typescript
// Verify only Course is applied
await dynamicShareableLinks.verifyAppliedFilter("Training Type", "Course");
```

#### Multiple Training Types
```typescript
// Verify multiple training types are applied
await dynamicShareableLinks.verifyAppliedFilter("Training Type", [
    "Course",
    "Certification",
    "Learning Path"
]);
```

---

### 2. Price Filter

#### Free Trainings Only
```typescript
// Verify Free filter is applied
await dynamicShareableLinks.verifyAppliedFilter("Price", "Free");
```

#### Paid Trainings (With Min/Max)
```typescript
// Verify Paid filter with min/max is applied
await dynamicShareableLinks.verifyAppliedFilter("Price", "Min:  Max:");

// Or with specific values
await dynamicShareableLinks.verifyAppliedFilter("Price", "Min: 10 Max: 100");
```

#### Both Free and Paid
```typescript
// If system allows both
await dynamicShareableLinks.verifyAppliedFilter("Price", ["Free", "Min:  Max:"]);
```

---

### 3. Rating Filter

#### Single Rating
```typescript
// Verify 4-star rating is applied
await dynamicShareableLinks.verifyAppliedFilter("Rating", "4");
```

#### Multiple Ratings
```typescript
// Verify multiple ratings are applied
await dynamicShareableLinks.verifyAppliedFilter("Rating", ["4", "5"]);
```

---

### 4. Language Filter

#### Single Language
```typescript
await dynamicShareableLinks.verifyAppliedFilter("Language", "Spanish");
```

#### Multiple Languages
```typescript
await dynamicShareableLinks.verifyAppliedFilter("Language", ["Spanish", "French", "German"]);
```

---

### 5. Delivery Type Filter

```typescript
await dynamicShareableLinks.verifyAppliedFilter("Delivery Type", "Classroom");

// Multiple delivery types
await dynamicShareableLinks.verifyAppliedFilter("Delivery Type", [
    "Classroom",
    "On Demand",
    "Virtual Classroom"
]);
```

---

## Complete Test Example

### DSL010 - Rating Filter Test
```typescript
test('DSL010b: Verify rating filter with 4 stars', async ({ expertusFixture }) => {
    const { page, context, adminHome, dynamicShareableLinks } = expertusFixture;

    // 1. Login and Navigate
    await adminHome.expertusAdminLogin('SuperUser');
    await adminHome.navigateToDynamicShareableLinks();

    // 2. Select Domain
    await dynamicShareableLinks.selectDomainOption("newprod");

    // 3. Select Rating
    await dynamicShareableLinks.selectRating("4");

    // 4. Generate URL
    const url = await dynamicShareableLinks.clickGenerateURL();

    // 5. Open URL (Switch to Learner View)
    await dynamicShareableLinks.openGeneratedURL(url);

    // 6. Verify Rating Filter is Applied
    await dynamicShareableLinks.verifyAppliedFilter("Rating", "4");

    // 7. Verify Trainings with Selected Rating
    await dynamicShareableLinks.verifyTrainingsWithSelectedRating("4");
});
```

### DSL011 - Price Filter Test
```typescript
test('DSL011c: Verify Free trainings displayed', async ({ expertusFixture }) => {
    const { page, context, adminHome, dynamicShareableLinks } = expertusFixture;

    await adminHome.expertusAdminLogin('SuperUser');
    await adminHome.navigateToDynamicShareableLinks();
    await dynamicShareableLinks.selectDomainOption("newprod");

    // Select Free checkbox
    await dynamicShareableLinks.selectFreeCheckbox();

    const url = await dynamicShareableLinks.clickGenerateURL();
    await dynamicShareableLinks.openGeneratedURL(url);

    // Verify Free filter is applied
    await dynamicShareableLinks.verifyAppliedFilter("Price", "Free");

    // Verify only free trainings are shown
    await dynamicShareableLinks.verifyFreeTrainingsDisplayed();
});
```

### DSL005 - Training Type Filter Test
```typescript
test('DSL005c: Verify multiple training types', async ({ expertusFixture }) => {
    const { page, context, adminHome, dynamicShareableLinks } = expertusFixture;

    await adminHome.expertusAdminLogin('SuperUser');
    await adminHome.navigateToDynamicShareableLinks();
    await dynamicShareableLinks.selectDomainOption("newprod");

    // Select multiple training types
    await dynamicShareableLinks.selectTrainingType([
        "Course",
        "Certification",
        "Learning Path"
    ]);

    const url = await dynamicShareableLinks.clickGenerateURL();
    await dynamicShareableLinks.openGeneratedURL(url);

    // Verify all training types are applied
    await dynamicShareableLinks.verifyAppliedFilter("Training Type", [
        "Course",
        "Certification",
        "Learning Path"
    ]);
});
```

---

## How It Works Internally

### Single Value
```typescript
await verifyAppliedFilter("Training Type", "Course");
// Checks: //span[text()='Training Type']//following::span[contains(text(),'Course')]
```

### Multiple Values (Loop)
```typescript
await verifyAppliedFilter("Training Type", ["Course", "Certification"]);
// Iteration 1: //span[text()='Training Type']//following::span[contains(text(),'Course')]
// Iteration 2: //span[text()='Training Type']//following::span[contains(text(),'Certification')]
```

---

## Filter Name Reference

| Filter Category | Filter Name (Case-Sensitive) | Example Values |
|----------------|------------------------------|----------------|
| Training Type  | `"Training Type"`            | Course, Certification, Learning Path |
| Price          | `"Price"`                    | Free, Min:  Max:, Min: 10 Max: 100 |
| Rating         | `"Rating"`                   | 1, 2, 3, 4, 5 |
| Language       | `"Language"`                 | Spanish, French, German |
| Delivery Type  | `"Delivery Type"`            | Classroom, On Demand, Virtual Classroom |
| Category       | `"Category"`                 | Technology, Business, Compliance |
| Duration       | `"Duration"`                 | 0-1 hours, 1-3 hours |
| Date Range     | `"Date Range"`               | Jan 1 2025 - Dec 31 2025 |

---

## Error Handling

If a filter is not applied correctly, the method will:
1. Log detailed error message
2. Throw an exception with context
3. Fail the test with clear indication of what went wrong

```typescript
❌ Failed: Training Type = "Course" not found
Error: Filter verification failed: Training Type with value "Course" is not applied or visible
```

---

## Best Practices

1. **Always verify filters AFTER opening the generated URL** (on learner catalog page)
2. **Use exact text matching** - Filter names and values are case-sensitive
3. **Wait for page load** - The method includes built-in waits
4. **Handle special characters** - For Price filter, use exact format: `"Min:  Max:"` (two spaces)
5. **Verify before validating trainings** - Ensure filters are applied before checking training content

---

## Notes
- Filter names must match exactly as they appear on the learner catalog page
- The method automatically handles single or multiple values
- Special handling for "Price" vs "price" (case normalization)
- All verifications include detailed console logging for debugging
