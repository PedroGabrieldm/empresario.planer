import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';

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

export class ExportService {
  
  static async exportToPDF(project: Project, projectOutput: ProjectOutput): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) pdf.setFont(undefined, 'bold');
      else pdf.setFont(undefined, 'normal');
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      
      // Check if we need a new page
      if (yPosition + (lines.length * lineHeight) > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      for (const line of lines) {
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      }
      yPosition += 5; // Extra spacing
    };

    // Title page
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('PLANO DE NEGÓCIO', pageWidth / 2, 50, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.text(project.title, pageWidth / 2, 70, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 90, { align: 'center' });
    
    yPosition = 120;
    addText(`Ideia: ${project.idea_text}`, 12);

    // Sections
    const sections = [
      { title: 'ESTUDO DE MERCADO', content: projectOutput.market_analysis },
      { title: 'PROPOSTA DE VALOR', content: projectOutput.value_proposition },
      { title: 'MODELO DE NEGÓCIO', content: projectOutput.business_model },
      { title: 'ESTRATÉGIA DE MARKETING', content: projectOutput.marketing_strategy },
      { title: 'PRECIFICAÇÃO', content: projectOutput.pricing },
      { title: 'JORNADA DO CLIENTE', content: projectOutput.customer_journey },
      { title: 'PITCH', content: projectOutput.pitch },
      { title: 'SCRIPT DE VENDAS', content: projectOutput.sales_script },
    ];

    for (const section of sections) {
      pdf.addPage();
      yPosition = margin;
      addText(section.title, 16, true);
      addText(section.content || 'Conteúdo não disponível', 12);
    }

    // SWOT Analysis
    if (projectOutput.swot) {
      pdf.addPage();
      yPosition = margin;
      addText('ANÁLISE SWOT', 16, true);
      
      const swot = projectOutput.swot;
      if (swot.forcas) {
        addText('FORÇAS:', 14, true);
        swot.forcas.forEach((item: string) => addText(`• ${item}`, 12));
      }
      if (swot.fraquezas) {
        addText('FRAQUEZAS:', 14, true);
        swot.fraquezas.forEach((item: string) => addText(`• ${item}`, 12));
      }
      if (swot.oportunidades) {
        addText('OPORTUNIDADES:', 14, true);
        swot.oportunidades.forEach((item: string) => addText(`• ${item}`, 12));
      }
      if (swot.ameacas) {
        addText('AMEAÇAS:', 14, true);
        swot.ameacas.forEach((item: string) => addText(`• ${item}`, 12));
      }
    }

    // Personas
    if (projectOutput.personas) {
      pdf.addPage();
      yPosition = margin;
      addText('PERSONAS', 16, true);
      
      projectOutput.personas.forEach((persona: any, index: number) => {
        addText(`PERSONA ${index + 1}: ${persona.nome || 'Sem nome'}`, 14, true);
        if (persona.idade) addText(`Idade: ${persona.idade}`, 12);
        if (persona.perfil) addText(`Perfil: ${persona.perfil}`, 12);
        if (persona.necessidades) addText(`Necessidades: ${persona.necessidades}`, 12);
        if (persona.comportamento) addText(`Comportamento: ${persona.comportamento}`, 12);
        yPosition += 10;
      });
    }

    pdf.save(`plano-negocio-${project.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  }

  static async exportToWord(project: Project, projectOutput: ProjectOutput): Promise<void> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'RESUMO EXECUTIVO',
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: project.title,
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            text: `Ideia: ${project.idea_text}`,
          }),
          new Paragraph({
            text: 'PROPOSTA DE VALOR',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: projectOutput.value_proposition || 'Não disponível',
          }),
          new Paragraph({
            text: 'MODELO DE NEGÓCIO',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: projectOutput.business_model || 'Não disponível',
          }),
          new Paragraph({
            text: 'ESTRATÉGIA DE MARKETING',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: projectOutput.marketing_strategy || 'Não disponível',
          }),
          new Paragraph({
            text: 'PITCH',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: projectOutput.pitch || 'Não disponível',
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumo-executivo-${project.title.replace(/\s+/g, '-').toLowerCase()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async exportToPowerPoint(project: Project, projectOutput: ProjectOutput): Promise<void> {
    const pptx = new PptxGenJS();

    // Slide 1: Title
    const slide1 = pptx.addSlide();
    slide1.addText(project.title, {
      x: 1, y: 2, w: 8, h: 1,
      fontSize: 32, bold: true, align: 'center'
    });
    slide1.addText(project.idea_text, {
      x: 1, y: 3.5, w: 8, h: 2,
      fontSize: 16, align: 'center'
    });

    // Slide 2: Proposta de Valor
    const slide2 = pptx.addSlide();
    slide2.addText('Proposta de Valor', {
      x: 0.5, y: 0.5, w: 9, h: 1,
      fontSize: 24, bold: true, color: '363636'
    });
    slide2.addText(projectOutput.value_proposition || 'Não disponível', {
      x: 0.5, y: 1.5, w: 9, h: 4,
      fontSize: 14, valign: 'top'
    });

    // Slide 3: Modelo de Negócio
    const slide3 = pptx.addSlide();
    slide3.addText('Modelo de Negócio', {
      x: 0.5, y: 0.5, w: 9, h: 1,
      fontSize: 24, bold: true, color: '363636'
    });
    slide3.addText(projectOutput.business_model || 'Não disponível', {
      x: 0.5, y: 1.5, w: 9, h: 4,
      fontSize: 14, valign: 'top'
    });

    // Slide 4: SWOT
    const slide4 = pptx.addSlide();
    slide4.addText('Análise SWOT', {
      x: 0.5, y: 0.5, w: 9, h: 1,
      fontSize: 24, bold: true, color: '363636'
    });

    if (projectOutput.swot) {
      const swot = projectOutput.swot;
      
      // Quadrantes SWOT
      slide4.addText('FORÇAS', { x: 0.5, y: 1.5, w: 4, h: 0.5, fontSize: 14, bold: true, color: '22c55e' });
      slide4.addText((swot.forcas || []).join('\n• '), { x: 0.5, y: 2, w: 4, h: 2, fontSize: 12 });
      
      slide4.addText('FRAQUEZAS', { x: 5, y: 1.5, w: 4, h: 0.5, fontSize: 14, bold: true, color: 'dc2626' });
      slide4.addText((swot.fraquezas || []).join('\n• '), { x: 5, y: 2, w: 4, h: 2, fontSize: 12 });
      
      slide4.addText('OPORTUNIDADES', { x: 0.5, y: 4, w: 4, h: 0.5, fontSize: 14, bold: true, color: '3b82f6' });
      slide4.addText((swot.oportunidades || []).join('\n• '), { x: 0.5, y: 4.5, w: 4, h: 2, fontSize: 12 });
      
      slide4.addText('AMEAÇAS', { x: 5, y: 4, w: 4, h: 0.5, fontSize: 14, bold: true, color: 'f59e0b' });
      slide4.addText((swot.ameacas || []).join('\n• '), { x: 5, y: 4.5, w: 4, h: 2, fontSize: 12 });
    }

    // Slide 5: Estratégia de Marketing
    const slide5 = pptx.addSlide();
    slide5.addText('Estratégia de Marketing', {
      x: 0.5, y: 0.5, w: 9, h: 1,
      fontSize: 24, bold: true, color: '363636'
    });
    slide5.addText(projectOutput.marketing_strategy || 'Não disponível', {
      x: 0.5, y: 1.5, w: 9, h: 4,
      fontSize: 14, valign: 'top'
    });

    // Slide 6: Pitch
    const slide6 = pptx.addSlide();
    slide6.addText('Pitch', {
      x: 0.5, y: 0.5, w: 9, h: 1,
      fontSize: 24, bold: true, color: '363636'
    });
    slide6.addText(projectOutput.pitch || 'Não disponível', {
      x: 0.5, y: 1.5, w: 9, h: 4,
      fontSize: 14, valign: 'top'
    });

    pptx.writeFile({ fileName: `pitch-deck-${project.title.replace(/\s+/g, '-').toLowerCase()}.pptx` });
  }

  static exportToExcel(project: Project, projectOutput: ProjectOutput): void {
    const workbook = XLSX.utils.book_new();

    // Projeção Financeira
    if (projectOutput.financial_projection) {
      const financial = projectOutput.financial_projection;
      
      const data = [
        ['Cenário', 'Ano 1 Receita', 'Ano 1 Custos', 'Ano 2 Receita', 'Ano 2 Custos', 'Ano 3 Receita', 'Ano 3 Custos'],
        [
          'Conservador',
          financial.conservador?.receita_ano1 || '',
          financial.conservador?.custos_ano1 || '',
          financial.conservador?.receita_ano2 || '',
          financial.conservador?.custos_ano2 || '',
          financial.conservador?.receita_ano3 || '',
          financial.conservador?.custos_ano3 || ''
        ],
        [
          'Realista',
          financial.realista?.receita_ano1 || '',
          financial.realista?.custos_ano1 || '',
          financial.realista?.receita_ano2 || '',
          financial.realista?.custos_ano2 || '',
          financial.realista?.receita_ano3 || '',
          financial.realista?.custos_ano3 || ''
        ],
        [
          'Agressivo',
          financial.agressivo?.receita_ano1 || '',
          financial.agressivo?.custos_ano1 || '',
          financial.agressivo?.receita_ano2 || '',
          financial.agressivo?.custos_ano2 || '',
          financial.agressivo?.receita_ano3 || '',
          financial.agressivo?.custos_ano3 || ''
        ]
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Projeção Financeira');
    }

    // Resumo do Projeto
    const summaryData = [
      ['Campo', 'Valor'],
      ['Título do Projeto', project.title],
      ['Ideia', project.idea_text],
      ['Data de Criação', new Date(project.created_at).toLocaleDateString('pt-BR')],
      ['Premium', project.is_premium ? 'Sim' : 'Não'],
      ['', ''],
      ['Proposta de Valor', projectOutput.value_proposition || ''],
      ['Modelo de Negócio', projectOutput.business_model || ''],
      ['Estratégia de Marketing', projectOutput.marketing_strategy || ''],
      ['Precificação', projectOutput.pricing || '']
    ];

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumo');

    // SWOT
    if (projectOutput.swot) {
      const swotData = [
        ['Categoria', 'Itens'],
        ['Forças', (projectOutput.swot.forcas || []).join('; ')],
        ['Fraquezas', (projectOutput.swot.fraquezas || []).join('; ')],
        ['Oportunidades', (projectOutput.swot.oportunidades || []).join('; ')],
        ['Ameaças', (projectOutput.swot.ameacas || []).join('; ')]
      ];

      const swotWorksheet = XLSX.utils.aoa_to_sheet(swotData);
      XLSX.utils.book_append_sheet(workbook, swotWorksheet, 'SWOT');
    }

    XLSX.writeFile(workbook, `projecao-financeira-${project.title.replace(/\s+/g, '-').toLowerCase()}.xlsx`);
  }
}