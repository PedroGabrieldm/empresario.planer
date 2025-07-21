-- Disable RLS for demo mode to allow anonymous access
-- This migration allows the application to work without authentication

-- Temporarily disable RLS for demo purposes
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_outputs DISABLE ROW LEVEL SECURITY; 
ALTER TABLE public.project_versions DISABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

DROP POLICY IF EXISTS "Users can view their own project outputs" ON public.project_outputs;
DROP POLICY IF EXISTS "Users can create their own project outputs" ON public.project_outputs;
DROP POLICY IF EXISTS "Users can update their own project outputs" ON public.project_outputs;
DROP POLICY IF EXISTS "Users can delete their own project outputs" ON public.project_outputs;

DROP POLICY IF EXISTS "Users can view their own project versions" ON public.project_versions;
DROP POLICY IF EXISTS "Users can create their own project versions" ON public.project_versions;

-- Re-enable RLS but with permissive policies for demo
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Create permissive demo policies that allow anonymous access
CREATE POLICY "Demo mode - anyone can view projects" 
ON public.projects 
FOR SELECT 
USING (true);  -- Allow all reads

CREATE POLICY "Demo mode - anyone can create projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (true);  -- Allow all creates

CREATE POLICY "Demo mode - anyone can update projects" 
ON public.projects 
FOR UPDATE 
USING (true);  -- Allow all updates

CREATE POLICY "Demo mode - anyone can delete projects" 
ON public.projects 
FOR DELETE 
USING (true);  -- Allow all deletes

-- Project outputs demo policies
CREATE POLICY "Demo mode - anyone can view project outputs" 
ON public.project_outputs 
FOR SELECT 
USING (true);

CREATE POLICY "Demo mode - anyone can create project outputs" 
ON public.project_outputs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Demo mode - anyone can update project outputs" 
ON public.project_outputs 
FOR UPDATE 
USING (true);

CREATE POLICY "Demo mode - anyone can delete project outputs" 
ON public.project_outputs 
FOR DELETE 
USING (true);

-- Project versions demo policies
CREATE POLICY "Demo mode - anyone can view project versions" 
ON public.project_versions 
FOR SELECT 
USING (true);

CREATE POLICY "Demo mode - anyone can create project versions" 
ON public.project_versions 
FOR INSERT 
WITH CHECK (true);

-- Update table comments to indicate demo mode
COMMENT ON TABLE public.projects IS 'Demo mode enabled - permissive policies allow anonymous access';
COMMENT ON TABLE public.project_outputs IS 'Demo mode enabled - permissive policies allow anonymous access';  
COMMENT ON TABLE public.project_versions IS 'Demo mode enabled - permissive policies allow anonymous access';

-- Allow anonymous access to functions
GRANT EXECUTE ON FUNCTION public.get_next_version_number(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_next_version_number(UUID) TO authenticated; 