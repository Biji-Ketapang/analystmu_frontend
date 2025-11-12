"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface DataRow {
  [key: string]: string | number;
}

const FileUpload: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0] || {}));
          setData(results.data as DataRow[]);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          const headerRow = jsonData[0] as string[];
          setHeaders(headerRow);
          const rows = jsonData.slice(1).map((row: any) => {
            const obj: DataRow = {};
            headerRow.forEach((header, index) => {
              obj[header] = row[index] || "";
            });
            return obj;
          });
          setData(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a CSV or XLSX file.");
    }
  };

  return (
    <ComponentCard title="File Upload for CSV/XLSX">
      <div className="space-y-4">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    {headers.map((header, idx) => (
                      <td
                        key={idx}
                        className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 10 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing first 10 rows of {data.length} total rows.
              </p>
            )}
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default FileUpload;
