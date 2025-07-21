-- Create project_versions table to store historical versions
CREATE TABLE public.project_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  idea_text TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  project_outputs JSONB, -- Store the entire project output as JSON
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own project versions" 
ON public.project_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_versions.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own project versions" 
ON public.project_versions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_versions.project_id 
    AND projects.user_id = auth.uid()
  )
  AND created_by = auth.uid()
);

-- Create index for better performance
CREATE INDEX idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX idx_project_versions_created_at ON public.project_versions(created_at DESC);

-- Add a version column to projects table to track current version
ALTER TABLE public.projects ADD COLUMN current_version INTEGER NOT NULL DEFAULT 1;

-- Create function to auto-increment version numbers
CREATE OR REPLACE FUNCTION public.get_next_version_number(project_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM public.project_versions
  WHERE project_id = project_uuid;
  
  RETURN next_version;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;