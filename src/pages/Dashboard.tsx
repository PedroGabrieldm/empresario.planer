import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Eye, 
  PenTool, 
  Calendar,
  Clock,
  TrendingUp,
  Lightbulb,
  LogOut,
  User,
  Settings,
  BarChart3
} from "lucide-react";

import { ErrorBoundary } from "@/components/ErrorBoundary";

interface Project {
  id: string;
  title: string;
  idea_text: string;
  is_premium: boolean;
  created_at: string;
  user_id: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    idea_text: ""
  });

  // Carregar projetos (sem autenticação)
  const loadProjects = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os projetos (incluindo anônimos)
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Se API falhar, tentar carregar do localStorage
        console.log('API error, loading from localStorage:', error);
        const localProjects: Project[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('project_')) {
            try {
              const projectData = JSON.parse(localStorage.getItem(key) || '');
              localProjects.push(projectData);
            } catch (e) {
              console.log('Error parsing local project:', e);
            }
          }
        }
        
        setProjects(localProjects);
        if (localProjects.length === 0) {
          toast({
            title: "Nenhum projeto encontrado",
            description: "Crie seu primeiro projeto para começar!",
          });
        }
        return;
      }

      setProjects(projects || []);
      
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Tente recarregar a página.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Criar novo projeto (sem autenticação)
  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.idea_text) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título e descrição da ideia.",
        variant: "destructive",
      });
      return;
    }

    try {
      const projectId = crypto.randomUUID();
      
      const { data: project, error } = await supabase
        .from('projects')
        .insert([
          {
            id: projectId,
            title: newProject.title,
            idea_text: newProject.idea_text,
            is_premium: false,
            user_id: null // Projeto anônimo
          }
        ])
        .select()
        .single();

      if (error) {
        // Fallback para localStorage
        const localProject: Project = {
          id: projectId,
          title: newProject.title,
          idea_text: newProject.idea_text,
          is_premium: false,
          created_at: new Date().toISOString(),
          user_id: null
        };
        
        localStorage.setItem(`project_${projectId}`, JSON.stringify(localProject));
        
        toast({
          title: "Projeto criado localmente!",
          description: "Projeto salvo no seu dispositivo.",
        });
        
        setProjects(prev => [localProject, ...prev]);
      } else {
        toast({
          title: "Projeto criado!",
          description: "Redirecionando para visualização...",
        });
        
        setProjects(prev => [project, ...prev]);
      }

      setIsDialogOpen(false);
      setNewProject({ title: "", idea_text: "" });
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o projeto.",
        variant: "destructive",
      });
    }
  };

  // Deletar projeto
  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.log('API delete failed, removing from localStorage:', error);
      }
      
      // Remove do localStorage também (se existir)
      localStorage.removeItem(`project_${projectId}`);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      toast({
        title: "Projeto excluído",
        description: "O projeto foi removido com sucesso.",
      });
      
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
    }
  };

  // Filtrar projetos por termo de busca
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.idea_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b shadow-sm bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/')} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Lightbulb className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-gradient">Novo Empreendedor</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/create-plan')} className="gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Novo Projeto
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">


          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold mb-2">Seus Projetos</h1>
              <p className="text-muted-foreground">
                Gerencie e acompanhe o desenvolvimento dos seus planos de negócio
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Projeto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Projeto</DialogTitle>
                    <DialogDescription>
                      Descreva sua ideia de negócio para gerar um plano completo
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título do Projeto</Label>
                      <Input
                        id="title"
                        placeholder="Ex: App de Delivery Sustentável"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="idea">Descrição da Ideia</Label>
                      <Textarea
                        id="idea"
                        placeholder="Descreva sua ideia de negócio em detalhes..."
                        value={newProject.idea_text}
                        onChange={(e) => setNewProject({ ...newProject, idea_text: e.target.value })}
                        rows={4}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleCreateProject}
                      className="w-full gradient-primary"
                      disabled={!newProject.title || !newProject.idea_text}
                    >
                      Criar Projeto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Premium</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.filter(p => p.is_premium).length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Básicos</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.filter(p => !p.is_premium).length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => {
                    const created = new Date(p.created_at);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-8 bg-muted rounded w-8"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "Nenhum projeto encontrado" : "Nenhum projeto ainda"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? "Tente ajustar os termos de busca ou criar um novo projeto."
                  : "Comece criando seu primeiro plano de negócio com IA."
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate('/create-plan')} className="gradient-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Meu Primeiro Projeto
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-2">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">
                            {new Date(project.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          {project.is_premium && (
                            <Badge variant="secondary" className="text-xs">Premium</Badge>
                          )}
                        </CardDescription>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/project/${project.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0" onClick={() => navigate(`/project/${project.id}`)}>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {project.idea_text}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant={project.is_premium ? "default" : "outline"} className="text-xs">
                        {project.is_premium ? "Premium" : "Básico"}
                      </Badge>
                      
                      <Button variant="ghost" size="sm" className="h-8 px-3 text-primary">
                        <Eye className="mr-1 h-3 w-3" />
                        Abrir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard; 