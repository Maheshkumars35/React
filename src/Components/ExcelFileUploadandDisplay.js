import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ExcelUploadandDisplay() {
  const [data, setData] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      console.log("Parsed Data:", parsedData);
  
      if (parsedData.length < 2) {
        console.log("No data rows found in the Excel sheet.");
        return;
      }
  
      // Extract headers from the first row
      const headers = parsedData[1];
  
      // Filter out empty rows and map data rows starting from the second row
      const mappedData = parsedData.slice(2).filter(row => row.length > 0).map(row => {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });
  
      console.log("Mapped Data:", mappedData);
  
      // Update state with the mapped data, replacing the existing data
      setData(mappedData);
    };
  
    reader.readAsBinaryString(file);
  };
  

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".xls,.xlsx" />
      <br />
      <div>
        <h2>Uploaded Data:</h2>
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              Name: {item.name}, Age: {item.age}, Place: {item.place}, DOB: {item.DOB ? item.DOB.toLocaleString() : 'N/A'}, Credit Rating: {item.creditRating}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExcelUploadandDisplay;
