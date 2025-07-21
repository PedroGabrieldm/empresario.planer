-- Create project_outputs table to store AI-generated business plan data
CREATE TABLE public.project_outputs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  market_analysis TEXT,
  swot JSONB,
  personas JSONB,
  customer_journey TEXT,
  value_proposition TEXT,
  business_model TEXT,
  marketing_strategy TEXT,
  pricing TEXT,
  financial_projection JSONB,
  pitch TEXT,
  sales_script TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_outputs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own project outputs" 
ON public.project_outputs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_outputs.project_id 
    AND projects.user_id = auth.uid()
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
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_outputs_updated_at
  BEFORE UPDATE ON public.project_outputs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();