import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  File,
  ChevronDown 
} from "lucide-react";
import { ExportService } from "@/services/exportService";
import { toast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  idea_text: string;
  is_premium: boolean;
  created_at: string;
}

interface ProjectOutput {
  id: string;
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
  created_at: string;
}

interface ExportDropdownProps {
  project: Project;
  projectOutput: ProjectOutput;
}

export const ExportDropdown = ({ project, projectOutput }: ExportDropdownProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'word' | 'powerpoint' | 'excel') => {
    setIsExporting(true);
    
    try {
      switch (format) {
        case 'pdf':
          await ExportService.exportToPDF(project, projectOutput);
          toast({
            title: "Sucesso",
            description: "Relatório PDF exportado com sucesso!",
          });
          break;
        case 'word':
          await ExportService.exportToWord(project, projectOutput);
          toast({
            title: "Sucesso", 
            description: "Resumo executivo Word exportado com sucesso!",
          });
          break;
        case 'powerpoint':
          await ExportService.exportToPowerPoint(project, projectOutput);
          toast({
            title: "Sucesso",
            description: "Pitch deck PowerPoint exportado com sucesso!",
          });
          break;
        case 'excel':
          ExportService.exportToExcel(project, projectOutput);
          toast({
            title: "Sucesso",
            description: "Planilha Excel exportada com sucesso!",
          });
          break;
      }
    } catch (error) {
      // Export error handled silently
      toast({
        title: "Erro",
        description: "Erro ao exportar arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exportando..." : "Exportar"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Formatos de Exportação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span className="font-medium">PDF Completo</span>
            <span className="text-xs text-muted-foreground">
              Relatório formatado com todos os blocos
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleExport('word')}>
          <File className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span className="font-medium">Word (DOCX)</span>
            <span className="text-xs text-muted-foreground">
              Resumo executivo com blocos essenciais
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleExport('powerpoint')}>
          <Presentation className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span className="font-medium">PowerPoint (PPTX)</span>
            <span className="text-xs text-muted-foreground">
              Pitch deck estruturado para apresentação
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span className="font-medium">Excel (XLSX)</span>
            <span className="text-xs text-muted-foreground">
              Planilha com projeções financeiras
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};