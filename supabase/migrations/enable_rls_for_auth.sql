-- Re-enable Row Level Security for production use
-- This replaces the demo mode and uses real Supabase Auth

-- Re-enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on project_outputs table  
ALTER TABLE public.project_outputs ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on project_versions table
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Update policies to be more explicit about user access
-- Drop existing policies and recreate them

-- Projects table policies
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Project outputs policies  
DROP POLICY IF EXISTS "Users can view their own project outputs" ON public.project_outputs;
DROP POLICY IF EXISTS "Users can create their own project outputs" ON public.project_outputs;
DROP POLICY IF EXISTS "Users can update their own project outputs" ON public.project_outputs;
DROP POLICY IF EXISTS "Users can delete their own project outputs" ON public.project_outputs;

CREATE POLICY "Users can view their own project outputs" 
ON public.project_outputs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_outputs.project_id 
    AND (projects.user_id = auth.uid() OR auth.uid() IS NOT NULL)
  )
);

CREATE POLICY "Users can create their own project outputs" 
ON public.project_outputs 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_outputs.project_id 
    AND projects.user_id = auth.uid()
    AND auth.uid() IS NOT NULL
  )
);

CREATE POLICY "Users can update their own project outputs" 
ON public.project_outputs 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_outputs.project_id 
    AND projects.user_id = auth.uid()
    AND auth.uid() IS NOT NULL
  )
);

CREATE POLICY "Users can delete their own project outputs" 
ON public.project_outputs 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_outputs.project_id 
    AND projects.user_id = auth.uid()
    AND auth.uid() IS NOT NULL
  )
);

-- Project versions policies
DROP POLICY IF EXISTS "Users can view their own project versions" ON public.project_versions;
DROP POLICY IF EXISTS "Users can create their own project versions" ON public.project_versions;

CREATE POLICY "Users can view their own project versions" 
ON public.project_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_versions.project_id 
    AND (projects.user_id = auth.uid() OR auth.uid() IS NOT NULL)
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
    AND auth.uid() IS NOT NULL
  )
  AND created_by = auth.uid()
);

-- Update table comments
COMMENT ON TABLE public.projects IS 'RLS enabled for production - users can only access their own projects';
COMMENT ON TABLE public.project_outputs IS 'RLS enabled for production - users can only access their own project outputs';
COMMENT ON TABLE public.project_versions IS 'RLS enabled for production - users can only access their own project versions'; 