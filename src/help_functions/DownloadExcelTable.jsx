import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const CreateExcel = (tableHeaders, tableRows, fileName) => {
    // Create an excel by 3 parameters:
    // params: tableHeaders -> Array[str],
    //         tableRows    -> Array[Object{key: Array[str], key: str, key: str}]
    //         fileName     -> str
    //
    // Please notice that the tableHeaders array's length should be
    // as the same as the "key: Array[str]" in tableRows.

    const createAndDownloadExcel = async () => {
        // Create a new workbook and a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("טבלה");
        let columns = [];
        let row;

        // Define columns
        for (let i = 0; i < tableHeaders.length; i++) {
            columns.push({
                header: tableHeaders[i],
                key: "col" + i,
                width: 10,
            });
        }
        worksheet.columns = columns;

        // Add rows
        for (let i = 0; i < tableRows.length; i++) {
            row = {};

            for (let j = 0; j < tableHeaders.length; j++) {
                row[columns[j].key] = tableRows[i].items[j];
            }
            worksheet.addRow(row);
        }

        // Use a buffer for the Excel file
        const buffer = await workbook.xlsx.writeBuffer();

        // Use file-saver to save the file
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName + ".xlsx");
    };

    createAndDownloadExcel();
};

export default CreateExcel;
