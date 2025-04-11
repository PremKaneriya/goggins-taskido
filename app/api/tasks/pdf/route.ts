// app/api/tasks/pdf/route.ts (Enhanced Version)
import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/db/tasks';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    // Get tasks
    const tasks = await getTasks(request);
    
    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: 'No tasks found' }, { status: 404 });
    }

    // Create PDF document with custom font
    const doc = new jsPDF();
    
    // Add Goggins-style header
    doc.setFillColor(51, 51, 51);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('GOGGINS TASKIDO', 14, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text("WHO'S GONNA CARRY THE BOATS?", 14, 30);
    
    // Add generation date
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(10);
    doc.text(`MISSION REPORT - ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 50);
    
    // Define priority labels and colors
    const priorityLabels = {
      0: 'NO EXCUSES',
      1: 'DO IT ANYWAY',
      2: 'GET AFTER IT',
      3: 'URGENT'
    };
    
    const priorityColors = {
      0: [220, 220, 220],  // Light gray
      1: [173, 216, 230],  // Light blue
      2: [255, 165, 0],    // Orange
      3: [220, 20, 60]     // Crimson
    };
    
    // Count completed vs active tasks
    const completedTasks = tasks.filter(task => task.is_completed).length;
    const activeTasks = tasks.length - completedTasks;
    
    // Add task statistics
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL MISSIONS: ${tasks.length}`, 14, 60);
    doc.text(`ACTIVE: ${activeTasks}`, 60, 60);
    doc.text(`COMPLETED: ${completedTasks}`, 100, 60);
    
    // Prepare table data with custom formatting
    const tableData = tasks.map(task => {
      const dueDate = task.due_date 
        ? format(new Date(task.due_date), 'MMM dd, yyyy')
        : 'No deadline';
        
      const status = task.is_completed 
        ? 'MISSION ACCOMPLISHED' 
        : 'ACTIVE';
        
      return [
        task.title.toUpperCase(),
        task.description ? task.description.substring(0, 50) + (task.description.length > 50 ? '...' : '') : '-',
        dueDate,
        priorityLabels[task.priority as keyof typeof priorityLabels],
        status
      ];
    });
    
    // Generate the table
    autoTable(doc, {
      head: [['MISSION', 'BRIEFING', 'DEADLINE', 'PRIORITY', 'STATUS']],
      body: tableData,
      startY: 70,
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 9,
        cellPadding: 4
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 60 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 30, halign: 'center' }
      },
      // Add custom cell styling for priority colors
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 3) {
          const priorityText = data.cell.text[0] as string;
          let priorityValue: number;
          
          if (priorityText === 'NO EXCUSES') priorityValue = 0;
          else if (priorityText === 'DO IT ANYWAY') priorityValue = 1;
          else if (priorityText === 'GET AFTER IT') priorityValue = 2;
          else priorityValue = 3;
          
          const color = priorityColors[priorityValue as keyof typeof priorityColors];
          
          doc.setFillColor(color[0], color[1], color[2]);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          
          // Re-draw the text in black
          doc.setTextColor(0, 0, 0);
          doc.text(
            priorityText,
            data.cell.x + data.cell.width / 2,
            data.cell.y + data.cell.height / 2,
            { align: 'center', baseline: 'middle' }
          );
        }
      }
    });
    
    // Add footer with motivational quote
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Add page number
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      
      // Add quote
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('STAY HARD. IT\'S NOT WHAT YOU WANT TO DO, IT\'S WHAT YOU NEED TO DO.', 14, doc.internal.pageSize.height - 10);
        }
    
    // Generate the PDF
    const pdfBytes = doc.output('arraybuffer');
    
    // Return the PDF as a download
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="goggins-taskido-missions.pdf"'
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}