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
- [ ] Verify Next.js 16.1.1 setup
- [ ] Install core dependencies:
  - `mammoth` (for DOCX extraction)
  - `pdfjs-dist` (for PDF extraction)
  - `@supabase/supabase-js` (for auth & database)
  - `openai` (for LLM integration)
- [ ] Configure TypeScript paths and aliases
- [ ] Set up environment variables structure

#### Task 0.2: Design System & UI Foundation
- [ ] Define color palette and theme
- [ ] Create reusable UI components (Button, Input, Card, etc.)
- [ ] Set up Tailwind configuration
- [ ] Create layout components

---

### Phase 1: Multi-Step Form Infrastructure

#### Task 1.1: Form State Management
- [ ] Create `ResumeFormContext` with React Context API
- [ ] Define TypeScript interfaces for form data
- [ ] Implement form state persistence (localStorage for guest users)
- [ ] Add form validation utilities

#### Task 1.2: Step Navigation System
- [ ] Create `StepIndicator` component with progress visualization
- [ ] Implement step navigation logic (next/back)
- [ ] Add step validation before allowing progression
- [ ] Create smooth transitions between steps

#### Task 1.3: Routing Structure
- [ ] Set up Next.js routing:
  - `/` - Landing page
  - `/resume-builder` - Main multi-step form
- [ ] Implement route protection (if needed)

---

### Phase 2: Landing Page

#### Task 2.1: Landing Page Design & Implementation
- [ ] Design hero section with value proposition
- [ ] Create "Get Started" CTA button
- [ ] Add interactive elements (animations, hover effects)
- [ ] Make it responsive (mobile, tablet, desktop)
- [ ] Test navigation to resume builder

---

### Phase 3: Step 1 - Resume Upload & Job Description

#### Task 3.1: File Upload Component
- [ ] Create drag-and-drop file upload area
- [ ] Add file type validation (PDF, DOCX, .tex)
- [ ] Add file size validation (10MB limit)
- [ ] Show file preview/confirmation
- [ ] Handle file removal

#### Task 3.2: DOCX Text Extraction
- [ ] Install and configure `mammoth`
- [ ] Create API route: `/api/extract-docx`
- [ ] Implement DOCX text extraction
- [ ] Handle extraction errors
- [ ] Store extracted text in form context

#### Task 3.3: PDF Text Extraction
- [ ] Install and configure `pdfjs-dist`
- [ ] Create API route: `/api/extract-pdf`
- [ ] Implement PDF text extraction (handle multi-page)
- [ ] Handle extraction errors
- [ ] Store extracted text in form context

#### Task 3.4: LaTeX File Reading
- [ ] Create file reader for .tex files
- [ ] Read file content directly (client-side)
- [ ] Store LaTeX content in form context

#### Task 3.5: Job Description Input
- [ ] Create textarea for job description
- [ ] Add character count (optional)
- [ ] Validate minimum length
- [ ] Store in form context

#### Task 3.6: Step 1 Integration
- [ ] Combine file upload + job description in Step 1 component
- [ ] Add validation (both required)
- [ ] Add "Next" button (disabled until valid)
- [ ] Test all file types

---

### Phase 4: Step 2 - Job Role & Template Selection

#### Task 4.1: Job Role Input
- [ ] Create input field for job role/title
- [ ] Add autocomplete suggestions (optional enhancement)
- [ ] Store in form context

#### Task 4.2: Template Selection UI
- [ ] Design template card components:
  - Modern template card
  - Classic template card
  - Old-school template card
  - "Your Format" card (only for LaTeX files)
- [ ] Add template preview images/placeholders
- [ ] Implement single-selection logic
- [ ] Add visual feedback (selected state)

#### Task 4.3: Conditional Template Display
- [ ] Show 3 templates for PDF/DOCX files
- [ ] Show 4 templates (including "Your Format") for LaTeX files
- [ ] Implement conditional rendering logic

#### Task 4.4: Step 2 Integration
- [ ] Combine job role + template selection
- [ ] Add validation (both required)
- [ ] Add "Back" and "Next" buttons
- [ ] Test template selection flow

---

### Phase 5: Authentication & Database Setup

#### Task 5.1: Supabase Project Setup
- [ ] Create Supabase project
- [ ] Get Supabase URL and anon key
- [ ] Add Supabase credentials to `.env.local`
- [ ] Install Supabase client library

#### Task 5.2: Google OAuth Configuration
- [ ] Create Google OAuth 2.0 credentials
- [ ] Configure OAuth in Supabase dashboard
- [ ] Set up redirect URLs
- [ ] Test OAuth flow

#### Task 5.3: Database Schema Design
- [ ] Design database tables:
  - `resumes` table (id, user_id, resume_content, job_description, job_role, template, personalization_prompt, created_at, updated_at)
- [ ] Create migrations in Supabase
- [ ] Set up Row Level Security (RLS) policies

#### Task 5.4: Supabase Client Setup
- [ ] Create Supabase client utility
- [ ] Set up client-side auth hooks
- [ ] Create auth context/provider
- [ ] Implement login/logout functions

---

### Phase 6: Step 3 - Personalization Prompt (Optional)

#### Task 6.1: Personalization Input Component
- [ ] Create textarea for personalization prompt
- [ ] Add placeholder text with examples
- [ ] Add character limit (optional)

#### Task 6.2: Authentication-Based Enable/Disable
- [ ] Check authentication status
- [ ] Disable input for guest users
- [ ] Enable input for authenticated users
- [ ] Show login prompt for guests
- [ ] Add "Skip" button for guests

#### Task 6.3: Step 3 Integration
- [ ] Combine personalization input with auth logic
- [ ] Store prompt in form context (empty string for guests)
- [ ] Add "Back" and "Next" buttons
- [ ] Test both authenticated and guest flows

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
- Document Supabase setup process thoroughly (as you're new to it)
