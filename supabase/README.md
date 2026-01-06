# Supabase Setup and Migrations

This directory contains Supabase configuration and database migrations for the Resume Maker application.

## Prerequisites

- Supabase CLI installed (as dev dependency: `npm install --save-dev supabase`)
- Supabase project created at [supabase.com](https://supabase.com)
- Project reference ID from Supabase Dashboard

## Initial Setup

### 1. Link to Your Supabase Project

Get your project reference ID from:
- Supabase Dashboard → Settings → General → Reference ID

Then link the project:

```bash
npx supabase link --project-ref your-project-ref
```

You'll be prompted to enter your database password.

### 2. Apply Migrations

Apply all pending migrations to your Supabase database:

```bash
npx supabase db push
```

This will apply the migration file: `20260105202050_create_resumes_table.sql`

## Migration Files

Migrations are stored in `supabase/migrations/` directory with timestamped filenames:
- Format: `YYYYMMDDHHMMSS_description.sql`
- Example: `20260105202050_create_resumes_table.sql`

### Current Migrations

- **20260105202050_create_resumes_table.sql**: Creates the `resumes` table with:
  - All input fields (resume file data, job description, job role, template, personalization prompt)
  - Output field (s3_url)
  - Foreign key to `auth.users(id)` for authenticated users
  - NULL user_id for guest users
  - Indexes on user_id and created_at
  - Auto-update trigger for updated_at
  - Row Level Security (RLS) policies:
    - Users can view their own resumes
    - Users can insert their own resumes
    - Guests can insert resumes (user_id = NULL)

## Database Schema

### resumes table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated UUID |
| user_id | UUID | FK to auth.users, nullable | NULL for guests, UUID for authenticated users |
| resume_file_type | TEXT | NOT NULL, CHECK | 'pdf', 'docx', or 'tex' |
| resume_file_name | TEXT | NOT NULL | Original filename |
| resume_extracted_text | TEXT | NOT NULL | Extracted text content |
| job_description | TEXT | NOT NULL | Job description input |
| job_role | TEXT | NOT NULL | Job role/title |
| template | TEXT | NOT NULL, CHECK | 'modern', 'classic', 'old-school', or 'your-format' |
| personalization_prompt | TEXT | nullable | Optional prompt for authenticated users |
| s3_url | TEXT | nullable | S3 URL after LLM processing |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

## Useful Commands

```bash
# Check migration status
npx supabase migration list

# Create a new migration
npx supabase migration new migration_name

# Apply migrations
npx supabase db push

# Reset local database (if using local development)
npx supabase db reset
```

## Verification

After applying migrations, verify in Supabase Dashboard:

1. **Table Editor**: `resumes` table exists with all columns
2. **Authentication → Policies**: 3 RLS policies exist
3. **Database → Indexes**: 2 indexes created (user_id, created_at)
4. **Database → Functions**: `update_updated_at_column` function exists
5. **Database → Triggers**: `update_resumes_updated_at` trigger exists

## Notes

- Migrations are applied in chronological order based on timestamp
- Always test migrations in a development environment first
- Never modify existing migration files - create new migrations for changes
- The `updated_at` trigger is included for schema completeness, though UPDATE operations are not used in the application

