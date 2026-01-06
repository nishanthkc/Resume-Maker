-- Create resumes table
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User association (nullable for guest users, UUID for authenticated users)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Input data
  resume_file_type TEXT NOT NULL CHECK (resume_file_type IN ('pdf', 'docx', 'tex')),
  resume_file_name TEXT NOT NULL,
  resume_extracted_text TEXT NOT NULL,
  job_description TEXT NOT NULL,
  job_role TEXT NOT NULL,
  template TEXT NOT NULL CHECK (template IN ('modern', 'classic', 'old-school', 'your-format')),
  personalization_prompt TEXT, -- nullable, only for authenticated users
  
  -- Output data (populated after LLM processing)
  s3_url TEXT, -- nullable
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_created_at ON resumes(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_resumes_updated_at 
  BEFORE UPDATE ON resumes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own resumes (for future use cases like resume history)
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own resumes
CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow guest users to insert resumes (user_id = NULL)
CREATE POLICY "Allow guest inserts"
  ON resumes FOR INSERT
  WITH CHECK (user_id IS NULL);

