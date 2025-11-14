# Install PDF Parse Package

Run this command in the terminal to install the pdf-parse package:

```powershell
npm install pdf-parse
```

Or if you prefer to add it as a dev dependency:

```powershell
npm install --save-dev pdf-parse
```

After installation, the `verifyPDFDownloaded()` method will be able to:
1. Extract text from the PDF certificate
2. Verify the learner's name is present
3. Verify the course/certification/learning path title is present

## Updated Method Signature

```typescript
async verifyPDFDownloaded(
  pdfPath: string, 
  learnerName: string, 
  trainingTitle: string, 
  trainingType: 'Course' | 'Certification' | 'Learning Path'
)
```

## Example Usage

```typescript
// For Course
await catalog.verifyPDFDownloaded(pdfPath, "Bala Learner", courseName, "Course");

// For Certification/Training Plan
await catalog.verifyPDFDownloaded(pdfPath, "Bala Learner", tpName, "Learning Path");
```
