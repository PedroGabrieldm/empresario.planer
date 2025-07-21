import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { History, RotateCcw, Clock, User } from "lucide-react";
import { VersionService } from "@/services/versionService";
import { toast } from "@/hooks/use-toast";

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

interface VersionHistoryProps {
  projectId: string;
  currentVersion: number;
  onVersionRestored: () => void;
}

export const VersionHistory = ({ projectId, currentVersion, onVersionRestored }: VersionHistoryProps) => {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ProjectVersion | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const { versions: versionData, error } = await VersionService.getVersions(projectId);
      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar histórico de versões",
          variant: "destructive",
        });
      } else {
        setVersions(versionData);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, projectId]);

  const handleRestore = async () => {
    if (!selectedVersion) return;

    setRestoring(true);
    try {
      const { success, error } = await VersionService.restoreVersion(projectId, selectedVersion.id);
      if (success) {
        toast({
          title: "Sucesso",
          description: `Versão ${selectedVersion.version_number} restaurada com sucesso!`,
        });
        setShowRestoreDialog(false);
        setSelectedVersion(null);
        setIsOpen(false);
        onVersionRestored();
      } else {
        toast({
          title: "Erro",
          description: error || "Erro ao restaurar versão",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error restoring version:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao restaurar versão",
        variant: "destructive",
      });
    } finally {
      setRestoring(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            Versões ({versions.length || 0})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <History className="mr-2 h-5 w-5" />
              Histórico de Versões
            </DialogTitle>
            <DialogDescription>
              Visualize e restaure versões anteriores do seu projeto
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando versões...</p>
                </div>
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma versão anterior</h3>
                <p className="text-muted-foreground">
                  Este projeto ainda não possui versões anteriores.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {versions.map((version) => (
                  <Card 
                    key={version.id} 
                    className={`transition-all hover:shadow-md ${
                      version.version_number === currentVersion 
                        ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' 
                        : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={version.version_number === currentVersion ? "default" : "secondary"}
                            className="flex items-center space-x-1"
                          >
                            <span>Versão {version.version_number}</span>
                            {version.version_number === currentVersion && (
                              <span className="text-xs">(Atual)</span>
                            )}
                          </Badge>
                          {version.is_premium && (
                            <Badge variant="outline">Premium</Badge>
                          )}
                        </div>
                        
                        {version.version_number !== currentVersion && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedVersion(version);
                              setShowRestoreDialog(true);
                            }}
                            className="flex items-center space-x-1"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Restaurar</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(version.created_at)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Título</h4>
                          <p className="text-sm">{version.title}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Ideia</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {version.idea_text}
                          </p>
                        </div>
                        
                        {version.project_outputs && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Plano de Negócio</h4>
                              <p className="text-sm text-muted-foreground">
                                Contém análise completa com todos os blocos gerados
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar Versão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja restaurar a versão {selectedVersion?.version_number}?
              <br />
              <br />
              <strong>Atenção:</strong> Esta ação irá:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Substituir o conteúdo atual do projeto</li>
                <li>Restaurar o plano de negócio desta versão (se existir)</li>
                <li>Criar uma nova versão com o estado atual antes da restauração</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoring}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRestore}
              disabled={restoring}
              className="bg-primary hover:bg-primary/90"
            >
              {restoring ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Restaurando...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restaurar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};