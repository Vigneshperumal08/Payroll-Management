
/**
 * Utility functions for handling downloads in the PRMS application
 */

/**
 * Convert data to CSV format
 * @param dataArray Array of objects to convert to CSV
 * @param headers Optional headers to use (will use object keys if not provided)
 * @returns CSV string
 */
export const convertToCSV = <T extends Record<string, any>>(
  dataArray: T[],
  headers?: string[]
): string => {
  if (!dataArray || !dataArray.length) {
    return '';
  }

  // Use provided headers or extract from the first object
  const csvHeaders = headers || Object.keys(dataArray[0]);
  
  // Create the header row
  const headerRow = csvHeaders.join(',');
  
  // Create the data rows
  const dataRows = dataArray.map(item => {
    return csvHeaders.map(header => {
      // Handle values that might need escaping (commas, quotes, etc.)
      const value = item[header] !== undefined ? item[header] : '';
      
      // If value contains commas or quotes, wrap in quotes and escape internal quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
  });
  
  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download data as a CSV file
 * @param data Array of objects to download as CSV
 * @param filename Name of the file to download
 * @param headers Optional headers to use (will use object keys if not provided)
 */
export const downloadCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: string[]
): void => {
  const csvContent = convertToCSV(data, headers);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create a download URL for the blob
  const url = window.URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download data as a JSON file
 * @param data Data to download as JSON
 * @param filename Name of the file to download
 */
export const downloadJSON = <T>(data: T, filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  
  const url = window.URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate PDF and download (basic implementation - in a real app would use jsPDF or similar)
 * @param elementId ID of the element to convert to PDF
 * @param filename Name of the file to download
 */
export const downloadPDF = (elementId: string, filename: string): void => {
  // This is a simplified example
  // In a real app, you would use a library like jsPDF or html2canvas + jsPDF
  
  alert('PDF download functionality would be implemented with a library like jsPDF');
  
  // Example of what the implementation would look like with jsPDF:
  /*
  import { jsPDF } from 'jspdf';
  import html2canvas from 'html2canvas';
  
  const element = document.getElementById(elementId);
  if (!element) return;
  
  html2canvas(element).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
  });
  */
};

/**
 * Download any file from a URL
 * @param url URL of the file to download
 * @param filename Name to give the downloaded file
 */
export const downloadFile = (url: string, filename: string): void => {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(err => {
      console.error('Error downloading file:', err);
    });
};

/**
 * Simple function to mock a download operation with a loading delay
 * @param type Type of file being downloaded
 * @param onComplete Callback when download is complete
 */
export const mockDownload = (
  type: 'csv' | 'pdf' | 'excel' | 'json',
  onComplete?: () => void
): Promise<void> => {
  return new Promise(resolve => {
    // Simulate a download delay
    setTimeout(() => {
      console.log(`Simulated ${type.toUpperCase()} download completed`);
      if (onComplete) onComplete();
      resolve();
    }, 1500);
  });
};
