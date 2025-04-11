import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/db/tasks';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { getUserFromRequest } from '@/utils/session';
import { getFullNameById } from '@/lib/db/database';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const userId = await getUserFromRequest(request);
    const username = await getFullNameById(userId);

    // Get tasks
    const tasks = await getTasks(request);
    
    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: 'No tasks found' }, { status: 404 });
    }

    // Create PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'Task Report',
      creator: 'Taskido',
      author: username
    });
    
    // Define theme colors
    const colors: { [key: string]: [number, number, number] } = {
      primary: [42, 42, 42],      // Dark gray for headers
      secondary: [80, 80, 80],    // Medium gray for subheadings
      accent: [0, 122, 204],      // Accent blue
      lightGray: [240, 240, 240], // Light gray for alternating rows
      white: [255, 255, 255]      // White
    };
    
    // Define priority colors with minimalistic palette
    const priorityColors = {
      0: [220, 220, 220],  // Light gray
      1: [180, 220, 250],  // Light blue
      2: [255, 200, 150],  // Light orange
      3: [255, 180, 180]   // Light red
    };
    
    // Priority labels (simplified)
    const priorityLabels = {
      0: 'LOW',
      1: 'MEDIUM',
      2: 'HIGH',
      3: 'URGENT'
    };
    
    // Separate completed and active tasks
    const completedTasks = tasks.filter(task => task.is_completed);
    const activeTasks = tasks.filter(task => !task.is_completed);
    
    // Add minimal header
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, doc.internal.pageSize.width, 25, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TASKIDO', 14, 16);
    
    // Add date and user info with clean layout
    doc.setTextColor(...colors.primary);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${format(new Date(), 'MMMM dd, yyyy')}`, doc.internal.pageSize.width - 14, 16, { align: 'right' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${username}`, 14, 35);
    
    // Add task statistics with minimal design
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const statsY = 45;
    doc.text(`Total: ${tasks.length}`, 14, statsY);
    doc.text(`Active: ${activeTasks.length}`, 50, statsY);
    doc.text(`Completed: ${completedTasks.length}`, 90, statsY);
    
    // Add subtle divider
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.5);
    doc.line(14, statsY + 5, doc.internal.pageSize.width - 14, statsY + 5);
    
    // Prepare table data for active tasks
    const activeTableData = activeTasks.map(task => {
      const dueDate = task.due_date 
        ? format(new Date(task.due_date), 'MMM dd, yyyy')
        : '-';
        
      return [
        task.title,
        task.description ? task.description.substring(0, 50) + (task.description.length > 50 ? '...' : '') : '-',
        dueDate,
        priorityLabels[task.priority as keyof typeof priorityLabels]
      ];
    });
    
    // Generate the active tasks table with minimal styling
    if (activeTasks.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.secondary);
      doc.text('Active Tasks', 14, statsY + 20);
      
      autoTable(doc, {
        head: [['Task', 'Description', 'Due Date', 'Priority']],
        body: activeTableData,
        startY: statsY + 25,
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: 'bold',
          cellPadding: 6
        },
        alternateRowStyles: {
          fillColor: colors.lightGray
        },
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
          fontSize: 9,
          cellPadding: 5,
          halign: 'left',
          valign: 'middle',
          lineColor: [220, 220, 220]
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { cellWidth: 80 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 }
        },
        // Custom cell styling for priority indicators
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 3) {
            const priorityText = data.cell.text[0] as string;
            let priorityValue: number;
            
            if (priorityText === 'LOW') priorityValue = 0;
            else if (priorityText === 'MEDIUM') priorityValue = 1;
            else if (priorityText === 'HIGH') priorityValue = 2;
            else priorityValue = 3;
            
            const color: number[] = priorityColors[priorityValue as keyof typeof priorityColors] || [0, 0, 0];
            
            // Create a rounded rectangle for priority indicator
            doc.setFillColor(...(color as [number, number, number]));
            const rectWidth = 20;
            const rectHeight = 6;
            const rectX = data.cell.x + (data.cell.width - rectWidth) / 2;
            const rectY = data.cell.y + (data.cell.height - rectHeight) / 2;
            
            // Draw rounded rectangle
            doc.roundedRect(rectX, rectY, rectWidth, rectHeight, 1, 1, 'F');
            
            // Draw the text in dark color
            doc.setTextColor(80, 80, 80);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(
              priorityText,
              data.cell.x + data.cell.width / 2,
              data.cell.y + data.cell.height / 2,
              { align: 'center', baseline: 'middle' }
            );
          }
        }
      });
    }
    
    // Prepare table data for completed tasks
    const completedTableData = completedTasks.map(task => {
      const dueDate = task.due_date 
        ? format(new Date(task.due_date), 'MMM dd, yyyy')
        : '-';
        
      return [
        task.title,
        task.description ? task.description.substring(0, 50) + (task.description.length > 50 ? '...' : '') : '-',
        dueDate,
        priorityLabels[task.priority as keyof typeof priorityLabels]
      ];
    });
    
    // Generate the completed tasks section with minimal styling
    if (completedTasks.length > 0) {
      // Get the Y position after the active tasks table
      const finalY = (doc as any).lastAutoTable?.finalY || (statsY + 25);
      
      // Add title for completed tasks
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.secondary);
      doc.text('Completed Tasks', 14, finalY + 15);
      
      // Generate the completed tasks table with subtle styling
      autoTable(doc, {
        head: [['Task', 'Description', 'Due Date', 'Priority']],
        body: completedTableData,
        startY: finalY + 20,
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: 'bold',
          cellPadding: 6
        },
        alternateRowStyles: {
          fillColor: colors.lightGray
        },
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
          fontSize: 9,
          cellPadding: 5,
          halign: 'left',
          valign: 'middle',
          lineColor: [220, 220, 220],
          textColor: [100, 100, 100] // Lighter text for completed items
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { cellWidth: 80 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 }
        },
        // Custom cell styling for priority indicators
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 3) {
            const priorityText = data.cell.text[0] as string;
            let priorityValue: number;
            
            if (priorityText === 'LOW') priorityValue = 0;
            else if (priorityText === 'MEDIUM') priorityValue = 1;
            else if (priorityText === 'HIGH') priorityValue = 2;
            else priorityValue = 3;
            
            const color = priorityColors[priorityValue as keyof typeof priorityColors];
            
            // Create a rounded rectangle for priority indicator (muted for completed tasks)
            doc.setFillColor(...(color.map(c => Math.min(c + 20, 255)) as [number, number, number])); // Lighter version
            const rectWidth = 20;
            const rectHeight = 6;
            const rectX = data.cell.x + (data.cell.width - rectWidth) / 2;
            const rectY = data.cell.y + (data.cell.height - rectHeight) / 2;
            
            // Draw rounded rectangle
            doc.roundedRect(rectX, rectY, rectWidth, rectHeight, 1, 1, 'F');
            
            // Draw the text in dark color
            doc.setTextColor(120, 120, 120); // Lighter text for completed tasks
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(
              priorityText,
              data.cell.x + data.cell.width / 2,
              data.cell.y + data.cell.height / 2,
              { align: 'center', baseline: 'middle' }
            );
          }
        }
      });
    }
    
    // Add minimal footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Add horizontal divider
      const footerY = doc.internal.pageSize.height - 20;
      doc.setDrawColor(...colors.lightGray);
      doc.setLineWidth(0.5);
      doc.line(14, footerY, doc.internal.pageSize.width - 14, footerY);
      
      // Add page number and app name
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.secondary);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 14, footerY + 10, { align: 'right' });
      doc.text('Taskido', 14, footerY + 10);
    }
    
    // Generate the PDF
    const pdfBytes = doc.output('arraybuffer');
    
    // Return the PDF as a download
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        "Content-Disposition": `attachment; filename="taskido-report-${new Date().toISOString().slice(0, 10)}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}