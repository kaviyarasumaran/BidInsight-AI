import readXlsxFile from 'read-excel-file';

export const readExcelFile = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    
    // Read Excel file using read-excel-file library
    const rows = await readXlsxFile(arrayBuffer);
    
    if (rows.length === 0) {
      throw new Error('Excel file is empty');
    }
    
    // First row contains headers
    const headers = rows[0].map(header => header?.toString().trim() || '');
    
    // Convert remaining rows to objects
    const data = rows
      .slice(1) // Skip header row
      .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== '')) // Remove empty rows
      .map(row => {
        // Create object with headers as keys
        return headers.reduce((obj, header, index) => {
          obj[header] = row[index]?.toString().trim() || '';
          return obj;
        }, {});
      });
    
    console.log('Parsed Excel data:', data);
    console.log('Headers:', headers);
    return data;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw error;
  }
}; 