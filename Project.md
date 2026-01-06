# Resume Maker V0 - Project Documentation

## Project Overview
The application is used to make tailored resumes for users. Users provide their current resume (PDF/DOCX/LaTeX), job description, job title, output resume template, and optional personalization prompt. The system processes all inputs and outputs a tailored resume for the specific job.

**Note:** Keep updating README.md and Project.md(tick and update) files before every step while making code changes.

---

## Tech Stack
- **Frontend:** React + Next.js + Tailwind CSS
- **Backend:** Next.js API Route Handlers
- **Auth:** Supabase Auth (Google OAuth2)
- **Database:** Supabase Postgres
- **File Processing:** mammoth (DOCX), pdfjs-dist (PDF)
- **LLM:** OpenAI API
- **Storage:** AWS S3
- **Hosting:** Vercel

---

## Application Workflow

### 1. Landing Page
A landing page with a brief description of the application and a "Get Started" button that navigates to Step 1. The page should be visually appealing and interactive.

### 2. Step 1: Resume Upload & Job Description
- User uploads their current resume (PDF, DOCX, or LaTeX)
- User provides the Job Description (JD) of the target job
- **File Processing:**
  - **DOCX files:** Use `mammoth` to extract all text data
  - **PDF files:** Use `pdfjs-dist` to extract all text data
  - **LaTeX files:** Read file content directly
- Store extracted content in application state

### 3. Step 2: Job Role & Template Selection
- User inputs the Job Role Name
- User selects a resume template:
  - **For PDF/DOCX files:** 3 options (Modern, Classic, Old-school)
  - **For LaTeX files:** 4 options (Modern, Classic, Old-school, Your Format)
- Templates displayed as selectable cards/tiles with:
  - Preview image
  - Template name
  - Single selection only

### 4. Step 3: Personalization Prompt (Optional)
- Optional text input for user suggestions
- Example: "Add a project I did with React, Next.js, and AWS"
- **Authentication Required:**
  - Input is **disabled by default**
  - Enabled only when user logs in via Google OAuth2
  - Guest users can skip this step
- Requires Supabase setup for Google OAuth2
- Database needed to store user data

### 5. Step 4: LLM Processing & Output
- **LLM Processing:**
  - Combine all user inputs into a system prompt:
    - Resume content (extracted text)
    - Job description
    - Job title
    - Template selection
    - Personalization prompt (if provided)
  - Send to OpenAI API
  - Receive LaTeX code for tailored resume
- **AWS S3 Storage:**
  - Store generated LaTeX file in S3 bucket (`latex-snips-001/snips/`)
  - Generate Overleaf link
  - Redirect user to Overleaf for further editing

---

## Incremental Build Plan

### Phase 0: Foundation & Setup

#### Task 0.1: Project Setup & Dependencies
- [x] Verify Next.js 16.1.1 setup
- [x] Install core dependencies:
  - `mammoth` (for DOCX extraction)
  - `pdfjs-dist` (for PDF extraction)
  - `@supabase/supabase-js` (for auth & database)
  - `openai` (for LLM integration)
- [x] Configure TypeScript paths and aliases
- [x] Set up environment variables structure

#### Task 0.2: Design System & UI Foundation
- [x] Define color palette and theme
- [x] Create reusable UI components (Button, Input, Card, etc.)
- [x] Set up Tailwind configuration
- [x] Create layout components

---

### Phase 1: Multi-Step Form Infrastructure

#### Task 1.1: Form State Management
- [x] Create `ResumeFormContext` with React Context API
- [x] Define TypeScript interfaces for form data
- [x] ~~Implement form state persistence (localStorage for guest users)~~ - Not needed, state resets on refresh
- [x] Add form validation utilities (placeholders ready for implementation)

#### Task 1.2: Routing Structure
- [x] Set up Next.js routing:
  - `/` - Landing page
  - `/resume-builder` - Main multi-step form
- [ ] Implement route protection (if needed) - Deferred to Phase 5

---

### Phase 2: Landing Page

#### Task 2.1: Landing Page Design & Implementation
- [x] Design hero section with value proposition
- [x] Create "Get Started" CTA button
- [x] Add interactive elements (animations, hover effects)
- [x] Make it responsive (mobile, tablet, desktop)
- [x] Test navigation to resume builder

---

### Phase 3: Step 1 - Resume Upload & Job Description

#### Task 3.1: File Upload Component
- [x] Create drag-and-drop file upload area
- [x] Add file type validation (PDF, DOCX, .tex)
- [x] Add file size validation (10MB limit)
- [x] Show file preview/confirmation
- [x] Handle file removal

#### Task 3.2: DOCX Text Extraction
- [x] Install and configure `mammoth` (already installed)
- [x] Create utility function: `extractDocxText()` in `utils/text-extraction.ts`
- [x] Implement DOCX text extraction (client-side)
- [x] Handle extraction errors
- [x] Integrate with file upload handler
- [x] Store extracted text in form context

#### Task 3.3: PDF Text Extraction
- [x] Install and configure `pdfjs-dist` (already installed)
- [x] Create utility function: `extractPdfText()` in `utils/text-extraction.ts`
- [x] Implement PDF text extraction (client-side, handle multi-page)
- [x] Handle extraction errors
- [x] Integrate with file upload handler
- [x] Store extracted text in form context

#### Task 3.4: LaTeX File Reading
- [x] Create utility function: `readLatexFile()` in `utils/text-extraction.ts`
- [x] Read file content directly (client-side using FileReader)
- [x] Integrate with file upload handler
- [x] Store LaTeX content in form context

#### Task 3.5: Job Description Input
- [x] Create textarea for job description
- [x] Validate minimum length (required field)
- [x] Store in form context

#### Task 3.6: Step 1 Integration
- [x] Combine file upload + job description in Step 1 component
- [x] Add validation (both required)
- [x] Add "Next" button (disabled until valid)
- [x] Test all file types

#### Task 3.7: Step Navigation System
- [x] Create `StepIndicator` component with progress visualization
- [x] Implement step navigation logic (next/back)
- [x] Add step validation before allowing progression
- [x] Create smooth transitions between steps

---

### Phase 4: Step 2 - Job Role & Template Selection

#### Task 4.1: Job Role Input
- [x] Create input field for job role/title
- [x] Add autocomplete suggestions (optional enhancement)
- [x] Store in form context

#### Task 4.2: Template Selection UI
- [x] Design template card components:
  - Modern template card
  - Classic template card
  - Old-school template card
  - "Your Format" card (only for LaTeX files)
- [x] Add template preview images/placeholders
- [x] Implement single-selection logic
- [x] Add visual feedback (selected state)

#### Task 4.3: Conditional Template Display
- [x] Show 3 templates for PDF/DOCX files
- [x] Show 4 templates (including "Your Format") for LaTeX files
- [x] Implement conditional rendering logic

#### Task 4.4: Step 2 Integration
- [x] Combine job role + template selection
- [x] Add validation (both required)
- [x] Add "Back" and "Next" buttons
- [x] Test template selection flow

---

### Phase 5: Authentication & Database Setup

#### Task 5.1: Supabase Project Setup
- [x] Create Supabase project
- [x] Get Supabase URL and anon key
- [x] Add Supabase credentials to `.env.local`
- [x] Install Supabase client library
- [x] Install `@supabase/ssr` for Next.js App Router support

#### Task 5.2: Google OAuth Configuration
- [x] Create Google OAuth 2.0 credentials
- [x] Configure OAuth in Supabase dashboard
- [x] Set up redirect URLs
- [x] Implement PKCE flow for secure OAuth
- [x] Test OAuth flow
- **📖 See [OAuth-signin.md](./OAuth-signin.md) for detailed implementation documentation**

#### Task 5.3: Database Schema Design
- [x] Design database tables:
  - `resumes` table with all input/output fields (id, user_id, resume_file_type, resume_file_name, resume_extracted_text, job_description, job_role, template, personalization_prompt, s3_url, created_at, updated_at)
  - user_id: UUID with foreign key to auth.users(id), NULL for guest users
- [x] Create migrations in Supabase using Supabase CLI
- [x] Set up Row Level Security (RLS) policies (3 policies: SELECT, INSERT for users, INSERT for guests)
- [x] Create indexes for performance (user_id, created_at)
- [x] Create trigger function and trigger for auto-updating updated_at
- **📖 See [supabase/README.md](./supabase/README.md) for migration setup instructions**

#### Task 5.4: Supabase Client Setup
- [x] Create Supabase client utility (client-side and server-side)
- [x] Set up client-side auth hooks
- [x] Create auth context/provider
- [x] Implement login/logout functions
- [x] Integrate auth state management in navbar

---

### Phase 6: Step 3 - Personalization Prompt (Optional)

#### Task 6.1: Personalization Input Component
- [x] Create textarea for personalization prompt
- [x] Add placeholder text with examples
- [x] Add helpful description text explaining the field's purpose

#### Task 6.2: Authentication-Based Enable/Disable
- [x] Check authentication status
- [x] Disable input for guest users
- [x] Enable input for authenticated users
- [x] Show login prompt for guests (prominent banner + overlay)
- [x] Implement sessionStorage persistence for form state during OAuth redirect
- [x] Restore form state after authentication (preserves step and all inputs)

#### Task 6.3: Step 3 Integration
- [x] Combine personalization input with auth logic
- [x] Store prompt in form context (empty string for guests)
- [x] Add "Back" and "Next" buttons
- [ ] Test both authenticated and guest flows (manual testing required)

---

### Phase 7: Step 4 - LLM Processing & S3 Upload

#### Task 7.1: System Prompt Engineering
- [ ] Design LLM system prompt structure:
  - Include resume content
  - Include job description
  - Include job role
  - Include template selection
  - Include personalization prompt (if provided)
  - Include LaTeX formatting instructions
- [ ] Create prompt template function
- [ ] Test prompt with sample data

#### Task 7.2: OpenAI API Integration
- [ ] Install OpenAI SDK
- [ ] Create API route: `/api/generate-resume`
- [ ] Implement OpenAI API call:
  - Use GPT-4 or GPT-3.5-turbo
  - Set appropriate temperature
  - Handle streaming (optional) or wait for complete response
- [ ] Add error handling
- [ ] Validate LaTeX output format

#### Task 7.3: S3 Upload Integration
- [ ] Verify existing S3 upload route works
- [ ] Update route to handle generated LaTeX from LLM
- [ ] Ensure proper file naming (`snips/resume-{uuid}.tex`)
- [ ] Test S3 upload with generated content

#### Task 7.4: Overleaf Link Generation
- [ ] Generate Overleaf form with S3 URL
- [ ] Create success page/component
- [ ] Display Overleaf link button
- [ ] Test Overleaf integration

#### Task 7.5: Step 4 Integration
- [ ] Create loading state during LLM processing
- [ ] Show progress indicator
- [ ] Handle errors gracefully
- [ ] Display success state with Overleaf link
- [ ] Add "Back" button (optional)

#### Task 7.6: Database Storage (Optional Enhancement)
- [ ] Save resume generation to Supabase
- [ ] Link to user account (if authenticated)
- [ ] Store generation metadata
- [ ] Create history page (future enhancement)

---

### Phase 8: Polish & Testing

#### Task 8.1: Error Handling
- [ ] Add error boundaries
- [ ] Handle API errors gracefully
- [ ] Show user-friendly error messages
- [ ] Add retry mechanisms where appropriate

#### Task 8.2: Loading States
- [ ] Add loading spinners for all async operations
- [ ] Show progress for file uploads
- [ ] Show progress for LLM processing
- [ ] Disable buttons during processing

#### Task 8.3: Form Validation
- [ ] Validate all inputs at each step
- [ ] Show validation errors clearly
- [ ] Prevent progression with invalid data
- [ ] Add client-side validation

#### Task 8.4: Responsive Design
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Test on desktop
- [ ] Fix any layout issues

#### Task 8.5: Accessibility
- [ ] Add ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Ensure color contrast

#### Task 8.6: Performance Optimization
- [ ] Optimize file uploads
- [ ] Add code splitting
- [ ] Optimize images
- [ ] Add loading states

---

### Phase 9: Documentation & Deployment

#### Task 9.1: README Updates
- [ ] Update README with project description
- [ ] Add setup instructions
- [ ] Add environment variables documentation
- [ ] Add deployment instructions

#### Task 9.2: Code Documentation
- [ ] Add JSDoc comments to functions
- [ ] Document API routes
- [ ] Document component props
- [ ] Add inline comments for complex logic

#### Task 9.3: Vercel Deployment
- [ ] Configure Vercel project
- [ ] Set up environment variables in Vercel
- [ ] Configure build settings
- [ ] Deploy to production
- [ ] Test production deployment

#### Task 9.4: Post-Deployment
- [ ] Test all flows in production
- [ ] Monitor error logs
- [ ] Set up analytics (optional)
- [ ] Create user documentation

---

## Environment Variables

```env
# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# S3 (already configured)
# Bucket: latex-snips-001
# Region: us-east-1
```

---

## Recommended Development Order

1. **Phase 0** → Foundation & Setup
2. **Phase 1** → Multi-Step Form Infrastructure
3. **Phase 2** → Landing Page
4. **Phase 3** → Step 1 (Resume Upload & JD)
5. **Phase 4** → Step 2 (Job Role & Templates)
6. **Phase 5** → Auth Setup (can be done in parallel with Phase 6)
7. **Phase 6** → Step 3 (Personalization)
8. **Phase 7** → Step 4 (LLM + S3)
9. **Phase 8** → Polish & Testing
10. **Phase 9** → Documentation & Deployment

---

## Important Notes

- Test each phase before moving to the next
- Update README after each major phase
- Keep environment variables secure (never commit `.env.local`)
- Consider adding unit tests for critical functions
- Consider adding E2E tests for the full flow
- **Authentication Documentation:** See [OAuth-signin.md](./OAuth-signin.md) for comprehensive Google OAuth implementation details, setup instructions, and troubleshooting guide

---

## Progress Summary

### Phase 0: Foundation & Setup ✅

#### Task 0.1: Project Setup & Dependencies ✅
**Completed:**
- Verified Next.js 16.1.1 setup
- Installed all core dependencies:
  - `mammoth` (v1.11.0) for DOCX extraction
  - `pdfjs-dist` (v5.4.530) for PDF extraction
  - `@supabase/supabase-js` (v2.89.0) for auth & database
  - `@supabase/ssr` for Next.js App Router cookie-based auth
  - `openai` (v6.15.0) for LLM integration
  - `uuid` (v13.0.0) for unique identifiers
- TypeScript paths and aliases configured (`@/*` mapping)
- Environment variables structure documented

#### Task 0.2: Design System & UI Foundation ✅
**Completed:**
- Implemented comprehensive dark/light theme system using `next-themes`
- Created CSS variable system with semantic color names (background, foreground, accent, error, success, navbar colors)
- Built reusable UI components:
  - `Button` component with primary, secondary, and outline variants
  - `Accordion` component for FAQ sections
  - `Navbar` with theme toggle integration
  - `LogoStrip`, `ProcessSection`, `FAQSection`, `FooterCTA` components
- Refactored all styling to use CSS variables (no hardcoded colors)
- Created utility classes for status colors (text-error, bg-success, etc.)
- Standardized hover patterns and transitions
- Added comprehensive styling guidelines to `.cursorrules`
- All components are theme-aware and work seamlessly in dark/light modes

### Phase 1: Multi-Step Form Infrastructure ✅

#### Task 1.1: Form State Management ✅
**Completed:**
- Created TypeScript interfaces in `types/resume-form.ts`:
  - `ResumeFileType`, `ResumeTemplate` types
  - `ResumeFileData`, `ResumeFormData`, `ValidationResult` interfaces
  - `ResumeFormContextValue` interface for context API
- Created validation utilities in `utils/validation.ts`:
  - `validateStep1()` - placeholder for resume file & job description validation
  - `validateStep2()` - placeholder for job role & template validation (includes LaTeX template logic)
  - `validateStep3()` - placeholder for optional personalization prompt validation
- Created `ResumeFormContext` in `context/resume-form-context.tsx`:
  - Full React Context implementation with state management
  - Update functions for all form fields (resume file, job description, job role, template, personalization prompt)
  - `nextStep()` function with validation before advancing
  - `prevStep()` function for backward navigation
  - `useResumeForm()` custom hook with error handling
  - Supports authentication state for Step 3 logic
- Integrated `ResumeFormProvider` in `app/resume-builder/page.tsx`
- **Note:** No localStorage persistence (state resets on refresh as per requirements)

#### Task 1.2: Routing Structure ✅
**Completed:**
- Next.js App Router routes set up:
  - `/` - Landing page (`app/page.tsx`) ✅
  - `/resume-builder` - Main multi-step form (`app/resume-builder/page.tsx`) ✅
  - `/auth/callback` - OAuth callback route ✅
  - `/auth/auth-code-error` - OAuth error page ✅
- Navigation between routes working correctly
- Route protection deferred (authentication is now implemented in Phase 5)

### Phase 2: Landing Page ✅

#### Task 2.1: Landing Page Design & Implementation ✅
**Completed:**
- Hero section with value proposition ("The truly Limitless resume builder")
- "Get Started" CTA button linking to `/resume-builder`
- Process section explaining the 3-step workflow
- FAQ section with accordion component
- Footer CTA section with contact information
- Logo strip component showing company logos
- Fully responsive design (mobile, tablet, desktop)
- All interactive elements styled with theme-aware colors
- Smooth hover effects and transitions

### Phase 5: Authentication & Database Setup ✅

#### Task 5.1: Supabase Project Setup ✅
**Completed:**
- Installed `@supabase/supabase-js` (v2.89.0) and `@supabase/ssr` for Next.js App Router support
- Created Supabase client utilities:
  - `utils/supabase/client.ts` - Client-side Supabase client using `createBrowserClient`
  - `utils/supabase/server.ts` - Server-side Supabase client using `createServerClient` with cookie management
- Environment variables structure documented:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- **Note:** Manual setup required: Create Supabase project and add credentials to `.env.local`

#### Task 5.2: Google OAuth Configuration ✅
**Completed:**
- Implemented Google OAuth with PKCE (Proof Key for Code Exchange) flow for enhanced security
- Created OAuth callback route (`app/auth/callback/route.ts`):
  - Handles authorization code exchange for session
  - Saves session to HTTP-only cookies
  - Redirects user back to original page after authentication
- Created error page (`app/auth/auth-code-error/page.tsx`) for OAuth failures
- **📖 Detailed documentation:** See [OAuth-signin.md](./OAuth-signin.md) for:
  - Complete implementation details
  - Setup instructions for Google Cloud Console
  - Code explanations and architecture
  - Troubleshooting guide
  - Reference links to Supabase and Next.js documentation

#### Task 5.3: Database Schema Design ✅
**Completed:**
- Designed and created `resumes` table schema with:
  - **Input fields**: resume_file_type, resume_file_name, resume_extracted_text, job_description, job_role, template, personalization_prompt
  - **Output field**: s3_url (populated after LLM processing)
  - **Metadata**: id (UUID primary key), user_id (UUID foreign key to auth.users, nullable for guests), created_at, updated_at
- **User association**: 
  - Authenticated users: `user_id = auth.uid()` (UUID from auth.users)
  - Guest users: `user_id = NULL`
  - Foreign key constraint: `REFERENCES auth.users(id) ON DELETE CASCADE`
- Created migration file using Supabase CLI:
  - `supabase/migrations/20260105202050_create_resumes_table.sql`
  - Includes table creation, indexes, trigger function, trigger, and RLS policies
- Set up Row Level Security (RLS) with 3 policies:
  - **"Users can view own resumes"**: SELECT policy for authenticated users to view their resume history
  - **"Users can insert own resumes"**: INSERT policy for authenticated users
  - **"Allow guest inserts"**: INSERT policy for guest users (user_id = NULL)
- Created performance indexes:
  - `idx_resumes_user_id` on `resumes(user_id)`
  - `idx_resumes_created_at` on `resumes(created_at DESC)`
- Created trigger function and trigger:
  - `update_updated_at_column()` function
  - `update_resumes_updated_at` trigger (BEFORE UPDATE) for auto-updating updated_at
- Created `supabase/README.md` with:
  - Supabase CLI setup instructions
  - Migration workflow documentation
  - Database schema documentation
  - Verification checklist

**Key Implementation Details:**
- **Foreign Key Constraint**: Ensures data integrity with auth.users table
- **Cascade Delete**: Automatically deletes user's resumes when user is deleted
- **Type Safety**: UUID type for user_id (more efficient than TEXT)
- **Guest Support**: NULL user_id for guest users, allowing them to use the app without authentication
- **Read-Only Operations**: Only INSERT and SELECT operations (no UPDATE or DELETE needed)

**Manual Steps Required:**
1. Link Supabase project: `npx supabase link --project-ref <project-ref>`
2. Apply migration: `npx supabase db push`
3. Verify in Supabase Dashboard (table, policies, indexes, triggers)
4. **📖 See [supabase/README.md](./supabase/README.md) for detailed setup instructions**

#### Task 5.4: Supabase Client Setup ✅
**Completed:**
- Created client-side Supabase client utility (`utils/supabase/client.ts`)
- Created server-side Supabase client utility (`utils/supabase/server.ts`)
- Created authentication context (`context/auth-context.tsx`):
  - Manages user session state with React Context API
  - Provides `signIn()` function that triggers Google OAuth flow
  - Provides `signOut()` function for user logout
  - Real-time auth state synchronization via `onAuthStateChange` listener
  - Exports `useAuth()` hook for consuming components
- Created auth provider wrapper (`components/providers/auth-provider.tsx`)
- Integrated `AuthProvider` in root layout (`app/layout.tsx`)
- Updated navbar (`components/layout/navbar.tsx`):
  - Shows "Sign In" button when user is not authenticated
  - Shows user email/name and "Sign Out" button when authenticated
  - Handles loading states gracefully
  - Triggers OAuth flow directly from navbar button

**Key Implementation Details:**
- **PKCE Flow:** Uses secure code exchange flow recommended for Next.js App Router
- **Cookie-Based Sessions:** Sessions stored in HTTP-only cookies for security
- **Server-Side Rendering Safe:** Compatible with Next.js App Router SSR
- **Type-Safe:** Full TypeScript support with proper type definitions
- **Real-Time Updates:** Auth state automatically syncs across the application

**Manual Configuration Required:**
1. Create Supabase project and get URL/anon key
2. Configure Google OAuth in Supabase Dashboard (Authentication → Providers → Google)
3. Set up Google Cloud Console OAuth credentials
4. Add authorized redirect URIs in Google Console
5. See [OAuth-signin.md](./OAuth-signin.md) for detailed setup instructions

---

## Implementation Notes

### Theme System
- Uses `next-themes` for SSR-safe theme management
- All colors defined as CSS variables for maintainability
- Automatic theme switching with smooth 500ms transitions
- System preference detection supported

### Form State Management
- Context-based state management for multi-step form
- Type-safe with full TypeScript coverage
- Validation utilities ready for implementation when building steps
- Simple navigation: only forward/backward one step at a time

### Code Quality
- No hardcoded colors (all use CSS variables)
- Consistent naming conventions (kebab-case files, PascalCase components)
- Proper TypeScript types throughout
- Error handling for context hook usage
- DRY principles followed (shared utilities, reusable components)
- Real-time error clearing for better UX
- Component-level and step-level validation separation

---

## Phase 3: Step 1 - Resume Upload & Job Description ✅

#### Task 3.1: File Upload Component ✅
**Completed:**
- Created `FileUpload` component (`components/file-upload.tsx`) with:
  - Drag-and-drop file upload zone with visual feedback
  - Click-to-browse file input
  - File type validation (PDF, DOCX, .tex) - case-insensitive
  - File size validation (10MB limit)
  - File preview showing name, size, and type icon
  - Remove button to clear selected file
  - Error display with red border styling
  - Component-level validation (immediate feedback)
  - Theme-aware styling using CSS variables
- Created shared file utilities (`utils/file-utils.ts`):
  - `getFileExtension()`, `getFileTypeFromExtension()`, `getFileTypeFromFilename()`
  - `formatFileSize()`, `getFileTypeIcon()`
  - Constants: `ACCEPTED_EXTENSIONS`, `MAX_FILE_SIZE`
- Error handling: Component-level errors take precedence over step-level errors

#### Task 3.5: Job Description Input ✅
**Completed:**
- Created textarea for job description in Step 1
- Integrated with `ResumeFormContext`
- Real-time error clearing when text becomes valid
- Error border styling when validation fails
- Error message display below textarea

#### Task 3.6: Step 1 Integration ✅
**Completed:**
- Combined file upload + job description in Step 1 component
- Implemented `validateStep1()` in `utils/validation.ts`:
  - Validates resume file is provided
  - Validates job description is non-empty (after trim)
  - Returns appropriate error messages
- Step validation runs on "Next" button click
- Real-time error clearing when fields become valid
- Error UI with red borders and error messages

#### Task 3.7: Step Navigation System ✅
**Completed:**
- Created `StepIndicator` component (`components/step-indicator.tsx`):
  - Visual progress indicator showing current, completed, and pending steps
  - Theme-aware styling
  - Reusable component
- Created `StepNavigation` component (`components/step-navigation.tsx`):
  - Back/Next buttons with proper disabled states
  - Customizable labels (e.g., "Complete" for last step)
  - Reusable across all steps
- Implemented step navigation logic in context:
  - `nextStep()` validates current step before advancing
  - `prevStep()` allows backward navigation without validation
  - Step validation prevents progression with invalid data
- Smooth transitions between steps

### Additional Improvements
- **Error UI System:**
  - Added `border-error` utility class to CSS
  - Red borders on form elements when errors exist
  - Error messages displayed below fields
- **Real-time Validation:**
  - Errors clear immediately when fields become valid
  - Component-level validation for immediate feedback
  - Step-level validation on "Next" click
- **Code Quality:**
  - Extracted duplicate error clearing logic to helper function
  - Fixed error precedence (component-level errors take priority)
  - Follows DRY principles
  - Clean, maintainable code structure

#### Task 3.2: DOCX Text Extraction ✅
**Completed:**
- Created `extractDocxText()` function in `utils/text-extraction.ts`
- Uses `mammoth` library for DOCX text extraction
- Client-side processing (no API routes needed)
- Error handling with user-friendly error messages
- Integrated with file upload handler in `app/resume-builder/page.tsx`
- Extracted text stored in `ResumeFileData.extractedText` field

#### Task 3.3: PDF Text Extraction ✅
**Completed:**
- Created `extractPdfText()` function in `utils/text-extraction.ts`
- Uses `pdfjs-dist` library with dynamic import (to avoid SSR issues)
- PDF.js worker setup: Worker file copied to `public/pdf.worker.min.mjs`
- Multi-page PDF support (iterates through all pages)
- Client-side processing (no API routes needed)
- Error handling with user-friendly error messages
- Integrated with file upload handler
- Extracted text stored in `ResumeFileData.extractedText` field

#### Task 3.4: LaTeX File Reading ✅
**Completed:**
- Created `readLatexFile()` function in `utils/text-extraction.ts`
- Uses browser's native `FileReader.readAsText()` API
- No external library needed (LaTeX files are plain text)
- Promise-based implementation for async/await compatibility
- UTF-8 encoding for proper text reading
- Error handling with user-friendly error messages
- Integrated with file upload handler
- LaTeX content stored in `ResumeFileData.extractedText` field

### Key Learnings: Client-Side Text Extraction

**1. Client-Side vs Server-Side Processing**
- All text extraction (DOCX, PDF, LaTeX) is performed client-side using browser APIs
- No API routes needed - reduces server load and improves user experience
- Files are processed directly in the browser after upload

**2. PDF.js Worker Setup for Next.js App Router**
- `pdfjs-dist` requires a worker file for PDF processing
- Worker file must be accessible from the browser (placed in `public/` folder)
- Dynamic import (`await import('pdfjs-dist')`) is essential to avoid SSR errors
- Browser-only libraries like `pdfjs-dist` cannot be imported at module level in Next.js
- Error: "DOMMatrix is not defined" occurs when browser-only code runs during SSR

**3. Dynamic Imports for Browser-Only Libraries**
- Libraries that use browser APIs (like `pdfjs-dist`) must be dynamically imported
- Top-level imports cause SSR errors because Node.js doesn't have browser APIs
- Solution: Use `await import('pdfjs-dist')` inside the function that uses it
- This ensures the library only loads on the client side when actually needed

**4. FileReader API for Plain Text Files**
- LaTeX files are plain text, so no library is needed
- `FileReader.readAsText()` is a browser-native API
- Wrapped in Promise for async/await compatibility
- UTF-8 encoding ensures proper character handling

**5. Error Handling Patterns**
- Consistent error handling across all extraction functions
- User-friendly error messages displayed via FileUpload component
- Errors don't prevent file metadata from being stored (user can see error and retry)
- Extraction errors are separate from file validation errors

**6. Multi-Page PDF Handling**
- PDFs can have multiple pages
- Extract text from each page using a loop
- Concatenate page texts with double newlines (`\n\n`) for separation
- All pages processed sequentially to maintain order

**7. File Processing Flow**
- File upload → File validation (type, size) → Text extraction → Store in context
- Extraction happens asynchronously after file selection
- User sees loading state during extraction
- Errors are displayed inline without blocking the UI
