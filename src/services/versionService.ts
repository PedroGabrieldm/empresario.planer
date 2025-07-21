import { supabase } from "@/integrations/supabase/client";

interface ProjectVersion {
  id: string;
  project_id: string;
  version_number: number;
  title: string;
  idea_text: string;
  is_premium: boolean;
  project_outputs: any;
  created_at: string;
  created_by: string;
}

interface Project {
  id: string;
  title: string;
  idea_text: string;
  is_premium: boolean;
  current_version: number;
  updated_at: string;
}

interface ProjectOutput {
  market_analysis: string;
  swot: any;
  personas: any;
  customer_journey: string;
  value_proposition: string;
  business_model: string;
  marketing_strategy: string;
  pricing: string;
  financial_projection: any;
  pitch: string;
  sales_script: string;
}

export class VersionService {
  
  /**
   * Create a new version when project is updated
   */
  static async createVersion(
    projectId: string,
    project: Project,
    projectOutput: ProjectOutput | null
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Skip authentication check - allow anonymous versions

      // Get next version number
      const { data: versionData, error: versionError } = await supabase
        .rpc('get_next_version_number', { project_uuid: projectId });

      if (versionError) {
        console.error('Error getting version number:', versionError);
        return { success: false, error: versionError.message };
      }

      const nextVersion = versionData as number;

      // Create version record
      const { error: insertError } = await supabase
        .from('project_versions')
        .insert({
          project_id: projectId,
          version_number: nextVersion,
          title: project.title,
          idea_text: project.idea_text,
          is_premium: project.is_premium,
          project_outputs: projectOutput ? JSON.parse(JSON.stringify(projectOutput)) : null,
          created_by: null // Anonymous version
        });

      if (insertError) {
        console.error('Error creating version:', insertError);
        return { success: false, error: insertError.message };
      }

      // Update project's current version
      const { error: updateError } = await supabase
        .from('projects')
        .update({ current_version: nextVersion })
        .eq('id', projectId);

      if (updateError) {
        console.error('Error updating project version:', updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in createVersion:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all versions for a project
   */
  static async getVersions(projectId: string): Promise<{ versions: ProjectVersion[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('version_number', { ascending: false });

      if (error) {
        console.error('Error fetching versions:', error);
        return { versions: [], error: error.message };
      }

      return { versions: data || [] };
    } catch (error: any) {
      console.error('Error in getVersions:', error);
      return { versions: [], error: error.message };
    }
  }

  /**
   * Restore a specific version
   */
  static async restoreVersion(
    projectId: string,
    versionId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get the version to restore
      const { data: versionData, error: versionError } = await supabase
        .from('project_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (versionError) {
        console.error('Error fetching version:', versionError);
        return { success: false, error: versionError.message };
      }

      const version = versionData as ProjectVersion;

      // Update the main project with version data
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          title: version.title,
          idea_text: version.idea_text,
          is_premium: version.is_premium,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (projectError) {
        console.error('Error updating project:', projectError);
        return { success: false, error: projectError.message };
      }

      // Update or create project_outputs if version has outputs
      if (version.project_outputs) {
        const { error: outputError } = await supabase
          .from('project_outputs')
          .upsert({
            project_id: projectId,
            ...version.project_outputs,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'project_id'
          });

        if (outputError) {
          console.error('Error updating project outputs:', outputError);
          return { success: false, error: outputError.message };
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in restoreVersion:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current project with version info
   */
  static async getProjectWithVersion(projectId: string): Promise<{
    project: Project | null;
    projectOutput: ProjectOutput | null;
    error?: string;
  }> {
    try {
      // Get project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) {
        return { project: null, projectOutput: null, error: projectError.message };
      }

      // Get project output
      const { data: outputData, error: outputError } = await supabase
        .from('project_outputs')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (outputError && outputError.code !== 'PGRST116') {
        return { project: projectData, projectOutput: null, error: outputError.message };
      }

      return { 
        project: projectData, 
        projectOutput: outputData || null 
      };
    } catch (error: any) {
      console.error('Error in getProjectWithVersion:', error);
      return { project: null, projectOutput: null, error: error.message };
    }
  }
}