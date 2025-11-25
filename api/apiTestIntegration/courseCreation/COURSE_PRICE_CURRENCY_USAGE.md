# Course Creation API - Price & Currency Configuration

## Overview
The `createCourseAPI` now supports optional **price** and **currency** parameters for creating paid courses.

---

## Method Signature

```typescript
export async function createCourseAPI(
  content: string,
  courseName: string,
  status = "published",
  instances = "single",
  sub_type = "e-learning",
  price?: string,           // Optional: Course price (e.g., "45", "100")
  currency?: string         // Optional: Currency name or code (case-insensitive)
): Promise<string>
```

---

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `content` | string | ✅ Yes | - | Content name to search and attach |
| `courseName` | string | ✅ Yes | - | Name of the course to create |
| `status` | string | No | "published" | Course status |
| `instances` | string | No | "single" | Instance type |
| `sub_type` | string | No | "e-learning" | Course sub-type |
| `price` | string | No | "" | Course price (numeric string) |
| `currency` | string | No | "" | Currency name or code |

---

## Default Behavior (Free Course)

When **no price** or **no currency** is provided, the course is created as **FREE**.

```typescript
// Creates a FREE course
await createCourseAPI(
  "Sample Content",
  "Free Course Title"
);
```

**Result:**
- `price = ""`
- `currency_type = ""`
- Course appears as **Free** in catalog

---

## Paid Course Creation

When **both price AND currency** are provided, the course is created as **PAID**.

### ✅ Valid Examples

```typescript
// Example 1: Using full currency name
await createCourseAPI(
  "Sample Content",
  "Paid Course - US Dollars",
  "published",
  "single",
  "e-learning",
  "45",                    // Price: $45
  "US Dollar"              // Currency: Full name
);

// Example 2: Using currency code (case-insensitive)
await createCourseAPI(
  "Sample Content",
  "Paid Course - Indian Rupees",
  "published",
  "single",
  "e-learning",
  "2500",                  // Price: ₹2500
  "inr"                    // Currency: Code (lowercase)
);

// Example 3: Using currency abbreviation
await createCourseAPI(
  "Sample Content",
  "Paid Course - Euros",
  "published",
  "single",
  "e-learning",
  "99.99",                 // Price: €99.99
  "EUR"                    // Currency: Abbreviation (uppercase)
);

// Example 4: Multiple word currency name
await createCourseAPI(
  "Sample Content",
  "Paid Course - British Pounds",
  "published",
  "single",
  "e-learning",
  "75",                    // Price: £75
  "British Pound"          // Currency: Full name
);
```

---

## Supported Currencies

The API supports **34 currencies** with **case-insensitive** matching.

### Currency Reference Table

| Currency Code | Currency Name | Abbreviations |
|--------------|---------------|---------------|
| `currency_001` | US Dollar | usd, us dollar |
| `currency_002` | Australian Dollar | aud, australian dollar |
| `currency_003` | Brazilian Real | brl, brazilian real |
| `currency_004` | British Pound | gbp, british pound |
| `currency_005` | Canadian Dollar | cad, canadian dollar |
| `currency_006` | Chilean Peso | clp, chilean peso |
| `currency_007` | Chinese Yuan Renminbi | cny, chinese yuan renminbi |
| `currency_008` | Czech Koruna | czk, czech koruna |
| `currency_009` | Danish Krone | dkk, danish krone |
| `currency_010` | Euro | eur, euro |
| `currency_011` | Hong Kong Dollar | hkd, hong kong dollar |
| `currency_012` | Hungarian Forint | huf, hungarian forint |
| `currency_013` | Indian Rupee | inr, indian rupee |
| `currency_014` | Indonesian Rupiah | idr, indonesian rupiah |
| `currency_015` | Israeli Shekel | ils, israeli shekel |
| `currency_016` | Japanese Yen | jpy, japanese yen |
| `currency_017` | Korean Won | krw, korean won |
| `currency_018` | Malaysian Ringgit | myr, malaysian ringgit |
| `currency_019` | Mexican Peso | mxn, mexican peso |
| `currency_020` | New Zealand Dollar | nzd, new zealand dollar |
| `currency_021` | Norwegian Krone | nok, norwegian krone |
| `currency_022` | Pakistani Rupee | pkr, pakistani rupee |
| `currency_023` | Philippine Peso | php, philippine peso |
| `currency_024` | Polish Zloty | pln, polish zloty |
| `currency_025` | Russian Ruble | rub, russian ruble |
| `currency_026` | Singapore Dollar | sgd, singapore dollar |
| `currency_027` | South African Rand | zar, south african rand |
| `currency_028` | Swedish Krona | sek, swedish krona |
| `currency_029` | Swiss Franc | chf, swiss franc |
| `currency_030` | Taiwan New Dollar | twd, taiwan new dollar |
| `currency_031` | Thai Baht | thb, thai baht |
| `currency_032` | Turkish Lira | try, turkish lira |
| `currency_033` | Venezuelan Bolivar | vef, venezuelan bolivar |
| `currency_034` | Egyptian Pound | egp, egyptian pound |

---

## Currency Input Formats

All formats are **case-insensitive**:

```typescript
// All these are VALID and equivalent:
"US Dollar"
"us dollar"
"US DOLLAR"
"USD"
"usd"

// All these are VALID for Indian Rupee:
"Indian Rupee"
"indian rupee"
"INDIAN RUPEE"
"INR"
"inr"
```

---

## Validation & Error Handling

### ❌ Error: Currency Required When Price Provided

```typescript
// This will THROW an error
await createCourseAPI(
  "Sample Content",
  "Course Name",
  "published",
  "single",
  "e-learning",
  "45",        // Price provided
  undefined    // Currency missing ❌
);

// Error: "Currency is required when price is provided"
```

### ❌ Error: Invalid Currency Name

```typescript
// This will THROW an error
await createCourseAPI(
  "Sample Content",
  "Course Name",
  "published",
  "single",
  "e-learning",
  "45",
  "Bitcoin"    // Invalid currency ❌
);

// Error: 'Invalid currency name: "Bitcoin". Please provide a valid currency name or code.'
```

---

## Console Output

### Free Course Creation
```
*** CREATE COURSE CATALOG RESPONSE ***
Status Code: 200
Response Body: {
  "course_id": 12345,
  "catalog_id": 67890
}
```

### Paid Course Creation
```
💰 Price Configuration:
   Price: 45
   Currency: US Dollar → currency_001

*** CREATE COURSE CATALOG RESPONSE ***
Status Code: 200
Response Body: {
  "course_id": 12345,
  "catalog_id": 67890
}
```

---

## Test Examples

### Test Case: Create Free Course
```typescript
import { createCourseAPI } from './createCourseAPI';

test('Create Free E-Learning Course', async () => {
  const courseName = await createCourseAPI(
    "Sample Content",
    "Free Course Title"
  );
  
  console.log(`✅ Free Course Created: ${courseName}`);
});
```

### Test Case: Create Paid Course (USD)
```typescript
test('Create Paid Course with US Dollars', async () => {
  const courseName = await createCourseAPI(
    "Sample Content",
    "Paid Course - $45",
    "published",
    "single",
    "e-learning",
    "45",
    "US Dollar"
  );
  
  console.log(`✅ Paid Course Created: ${courseName} - Price: $45`);
});
```

### Test Case: Create Paid Course (INR)
```typescript
test('Create Paid Course with Indian Rupees', async () => {
  const courseName = await createCourseAPI(
    "Sample Content",
    "Paid Course - ₹2500",
    "published",
    "single",
    "e-learning",
    "2500",
    "INR"
  );
  
  console.log(`✅ Paid Course Created: ${courseName} - Price: ₹2500`);
});
```

### Test Case: Create Multiple Courses with Different Currencies
```typescript
test('Create Multiple Paid Courses', async () => {
  const currencies = [
    { price: "45", currency: "USD", name: "US Course" },
    { price: "2500", currency: "INR", name: "India Course" },
    { price: "99", currency: "EUR", name: "EU Course" },
    { price: "75", currency: "GBP", name: "UK Course" }
  ];
  
  for (const config of currencies) {
    const courseName = await createCourseAPI(
      "Sample Content",
      config.name,
      "published",
      "single",
      "e-learning",
      config.price,
      config.currency
    );
    
    console.log(`✅ Created: ${courseName} - Price: ${config.price} ${config.currency}`);
  }
});
```

---

## Best Practices

1. **Always provide currency when price is set**
   - Price and currency are linked
   - Providing price without currency will throw an error

2. **Use standard currency codes for clarity**
   - Prefer: `"USD"`, `"INR"`, `"EUR"`
   - Also works: `"US Dollar"`, `"Indian Rupee"`, `"Euro"`

3. **Trim whitespace in price values**
   - The API automatically trims price values
   - Both `"45"` and `" 45 "` work correctly

4. **Currency input is case-insensitive**
   - `"usd"`, `"USD"`, `"Usd"` all work identically

5. **For free courses, omit both parameters**
   - Don't pass empty strings
   - Simply omit `price` and `currency` parameters

---

## API Flow

```
1. Call createCourseAPI()
   ↓
2. Check if price is provided
   ↓
3. If YES:
   - Validate currency is also provided
   - Convert currency name/code to currency_001 format
   - Log price configuration
   - Append to formData
   ↓
4. If NO:
   - Set price = ""
   - Set currency_type = ""
   - Create FREE course
   ↓
5. Create course with final configuration
```

---

## Summary

✅ **Free Course**: Don't pass `price` and `currency` parameters  
✅ **Paid Course**: Pass both `price` and `currency` parameters  
✅ **Currency**: Case-insensitive, supports 34 currencies  
✅ **Validation**: Automatic error handling for invalid inputs  
✅ **Flexible**: Accepts full names, abbreviations, or codes  

---
