import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ExcelUploadandEdit() {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (parsedData.length < 2) {
        console.log("No data rows found in the Excel sheet.");
        return;
      }

      // Extract headers from the first row
      const headers = parsedData[1];

      // Map data rows starting from the second row
      const mappedData = parsedData.slice(2).filter(row => row.length > 0).map(row => {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });

      // Update state with the mapped data, replacing the existing data
      setData(mappedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleFieldChange = (e, rowIndex, header) => {
    const newData = [...data];
    newData[rowIndex][header] = e.target.value;
    setData(newData);
    setEditingIndex(rowIndex); // Enable editing
  };

  const handleSubmit = () => {
    // Update Excel file with the changed data
    updateExcelFile();
  };

  const updateExcelFile = () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(data.map(row => Object.values(row)));
    XLSX.utils.book_append_sheet(workbook, sheet);
    XLSX.writeFile(workbook, 'updated_excel.xlsx');
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".xls,.xlsx" />
      <br />
      <div>
        <h2>Uploaded Data:</h2>
        {data.map((item, rowIndex) => (
          <div key={rowIndex}>
            {Object.entries(item).map(([header, value]) => (
              <input
                key={header}
                type="text"
                value={value}
                onChange={(e) => handleFieldChange(e, rowIndex, header)}
                onFocus={() => setEditingIndex(rowIndex)}
                onBlur={() => setEditingIndex(-1)}
                style={{ marginRight: '10px' }}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default ExcelUploadandEdit;
