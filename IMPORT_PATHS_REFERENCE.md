# Import Paths Reference Guide

This document lists all the correct import paths after the project reorganization.

## Why This Issue Occurred

During the project reorganization, files were moved to follow best practices, but some import paths were not updated consistently. This document serves as a reference for the correct import paths.

## Component Imports

### Layouts
```javascript
// ✅ Correct
import HeaderFooterLayout from '@/components/layouts/header-footer-layout/HeaderFooterLayout';
import MainLayout from '@/components/layouts/sidebar-layout/MainLayout';

// ❌ Wrong
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';
```

### Common Components

#### Dialogs
```javascript
// ✅ Correct
import { ContainDialog, DeleteDialog, SuccessDialog, ReferFriendDialog } from '@/components/common/dialogs';

// ❌ Wrong
import { ContainDialog } from '@/components/dialogs';
```

#### Tables
```javascript
// ✅ Correct
import { TableSkeleton, AgGridInfo, AgGridPagination } from '@/components/common/table';

// ❌ Wrong
import TableSkeleton from '@/components/table_components/TableSkeleton';
```

#### Forms
```javascript
// ✅ Correct
import { SimpleTextField, SimpleAutoComplete, SimpleDatePicker } from '@/components/common/forms';

// ❌ Wrong
import SimpleTextField from '@/components/customized_input_fields/SimpleTextField';
```

### Feature Components

#### Resume
```javascript
// ✅ Correct
import { ResumePreview, PersonalInfoSection, WorkExperienceSection } from '@/components/features/resume';

// ❌ Wrong
import ResumePreview from '@/components/resume/ResumePreview';
```

#### Home
```javascript
// ✅ Correct
import { HeroSection, FeaturedJobs, JobCategories } from '@/components/features/home';

// ❌ Wrong
import HeroSection from '@/components/home/HeroSection';
```

#### Auth
```javascript
// ✅ Correct
import ProfileMenus from '@/components/features/auth/ProfileMenus';

// ❌ Wrong
import ProfileMenus from '@/components/ProfileMenus';
```

## Database & Models

```javascript
// ✅ Correct
import clientPromise from '@/lib/db/mongodb';
import { getAllJobs, createJob } from '@/lib/db/models/Job';
import { findUserByEmail } from '@/lib/db/models/User';

// ❌ Wrong
import clientPromise from '@/lib/mongodb';
import { getAllJobs } from '@/lib/models/Job';
```

## Utils

```javascript
// ✅ Correct
import { findMatchingJobs, getNewJobsCount } from '@/utils/jobMatching';
import { generatePDF } from '@/utils/pdfGenerator';
import { getSampleResumeData } from '@/utils/sampleData';

// ❌ Wrong
import { findMatchingJobs } from '@/lib/utils/jobMatching';
```

## Hooks

```javascript
// ✅ Correct
import { useResumeForm, usePDFDownload, useAIEnhancement } from '@/hooks';

// ❌ Wrong
import { useResumeForm } from './hooks/useResumeForm';
```

## Static Assets (Public Folder)

```javascript
// ✅ Correct
const LOGO = "/assets/logo.svg";
<Image src="/assets/logo.svg" />

// ❌ Wrong
import LOGO from "@/public/assets/logo.svg";
import LOGO from "../../../../public/assets/logo.svg";
```

## Summary of Path Changes

| Old Path | New Path |
|----------|----------|
| `@/layouts/*` | `@/components/layouts/*` |
| `@/components/dialogs` | `@/components/common/dialogs` |
| `@/components/table_components` | `@/components/common/table` |
| `@/components/customized_input_fields` | `@/components/common/forms` |
| `@/components/resume` | `@/components/features/resume` |
| `@/components/home` | `@/components/features/home` |
| `@/components/ProfileMenus` | `@/components/features/auth/ProfileMenus` |
| `@/lib/mongodb` | `@/lib/db/mongodb` |
| `@/lib/models/*` | `@/lib/db/models/*` |
| `@/lib/utils/*` | `@/utils/*` |

## Quick Fix Script

If you encounter import errors, search for these patterns and replace them:

1. `@/layouts/` → `@/components/layouts/`
2. `@/components/dialogs` → `@/components/common/dialogs`
3. `@/components/table_components` → `@/components/common/table`
4. `@/components/resume` → `@/components/features/resume`
5. `@/components/home` → `@/components/features/home`
6. `@/components/ProfileMenus` → `@/components/features/auth/ProfileMenus`
7. `@/lib/mongodb` → `@/lib/db/mongodb`
8. `@/lib/models/` → `@/lib/db/models/`
9. `@/lib/utils/` → `@/utils/`


