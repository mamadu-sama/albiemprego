// Export utilities for CSV, Excel, and PowerPoint

interface ExportColumn {
  header: string;
  key: string;
}

// Generate CSV content
export function generateCSV(data: Record<string, unknown>[], columns: ExportColumn[]): string {
  const headers = columns.map(col => col.header).join(',');
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [headers, ...rows].join('\n');
}

// Download file helper
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export to CSV
export function exportToCSV(data: Record<string, unknown>[], columns: ExportColumn[], filename: string) {
  const csv = generateCSV(data, columns);
  downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

// Export to Excel (using XML-based format that Excel can open)
export function exportToExcel(data: Record<string, unknown>[], columns: ExportColumn[], filename: string) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?mso-application progid="Excel.Sheet"?>\n';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
  xml += '  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
  xml += '  <Styles>\n';
  xml += '    <Style ss:ID="header">\n';
  xml += '      <Font ss:Bold="1" ss:Size="12"/>\n';
  xml += '      <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>\n';
  xml += '      <Font ss:Color="#FFFFFF"/>\n';
  xml += '    </Style>\n';
  xml += '    <Style ss:ID="currency">\n';
  xml += '      <NumberFormat ss:Format="#,##0€"/>\n';
  xml += '    </Style>\n';
  xml += '  </Styles>\n';
  xml += '  <Worksheet ss:Name="Dados">\n';
  xml += '    <Table>\n';
  
  // Headers
  xml += '      <Row>\n';
  columns.forEach(col => {
    xml += `        <Cell ss:StyleID="header"><Data ss:Type="String">${escapeXml(col.header)}</Data></Cell>\n`;
  });
  xml += '      </Row>\n';
  
  // Data rows
  data.forEach(item => {
    xml += '      <Row>\n';
    columns.forEach(col => {
      const value = item[col.key];
      const type = typeof value === 'number' ? 'Number' : 'String';
      xml += `        <Cell><Data ss:Type="${type}">${escapeXml(String(value ?? ''))}</Data></Cell>\n`;
    });
    xml += '      </Row>\n';
  });
  
  xml += '    </Table>\n';
  xml += '  </Worksheet>\n';
  xml += '</Workbook>';
  
  downloadFile(xml, `${filename}.xls`, 'application/vnd.ms-excel');
}

// Helper to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Export to PowerPoint (using HTML that PowerPoint can import)
export function exportToPowerPoint(
  title: string,
  subtitle: string,
  stats: { label: string; value: string }[],
  tableData: Record<string, unknown>[],
  tableColumns: ExportColumn[],
  filename: string
) {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; }
    .slide { page-break-after: always; padding: 40px; }
    h1 { color: #2563eb; font-size: 36px; margin-bottom: 10px; }
    h2 { color: #1e40af; font-size: 28px; }
    .subtitle { color: #6b7280; font-size: 18px; margin-bottom: 40px; }
    .stats-grid { display: flex; gap: 30px; margin: 40px 0; }
    .stat-card { 
      background: #f3f4f6; 
      padding: 30px; 
      border-radius: 12px; 
      text-align: center;
      flex: 1;
    }
    .stat-value { font-size: 42px; font-weight: bold; color: #2563eb; }
    .stat-label { color: #6b7280; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #2563eb; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { color: #9ca3af; font-size: 12px; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="slide">
    <h1>${escapeXml(title)}</h1>
    <p class="subtitle">${escapeXml(subtitle)}</p>
    
    <div class="stats-grid">
      ${stats.map(stat => `
        <div class="stat-card">
          <div class="stat-value">${escapeXml(stat.value)}</div>
          <div class="stat-label">${escapeXml(stat.label)}</div>
        </div>
      `).join('')}
    </div>
  </div>
  
  <div class="slide">
    <h2>Dados Detalhados</h2>
    <table>
      <thead>
        <tr>
          ${tableColumns.map(col => `<th>${escapeXml(col.header)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${tableData.map(item => `
          <tr>
            ${tableColumns.map(col => `<td>${escapeXml(String(item[col.key] ?? ''))}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <p class="footer">Gerado por AlbiEmprego - ${new Date().toLocaleDateString('pt-PT')}</p>
  </div>
</body>
</html>`;

  downloadFile(html, `${filename}.pptx.html`, 'application/vnd.ms-powerpoint');
}
