import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";

interface ExportToExcelProps {
  data: Array<Record<string, any>>;
  fileName: string;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data, fileName }) => {
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "binary",
    });

    const buffer = new ArrayBuffer(excelBuffer.length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < excelBuffer.length; i++) {
      view[i] = excelBuffer.charCodeAt(i) & 0xff;
    }

    const blob = new Blob([buffer], { type: "application/octet-stream" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outlined" color="primary" onClick={exportToExcel}>
      Export Data
    </Button>
  );
};

export default ExportToExcel;
