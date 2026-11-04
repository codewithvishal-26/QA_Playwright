const ExcelJs = require('exceljs');

/**
 * Searches the worksheet for a cell matching searchText, and returns
 * its row/column position. Returns { row: -1, column: -1 } if not found.
 */
function readExcel(worksheet, searchText) {
  let output = { row: -1, column: -1 };

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (
        cell.value &&
        cell.value.toString().trim().toLowerCase() === searchText.toString().trim().toLowerCase()
      ) {
        output = { row: rowNumber, column: colNumber };
      }
    });
  });

  return output;
}

/**
 * Opens the Excel file at filePath, finds searchText, then writes
 * replaceText into a cell offset from it (using change.colChange),
 * and saves the file back to disk.
 */
async function writeExcelTest(searchText, replaceText, change, filePath) {
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet('Sheet1');

  const output = readExcel(worksheet, searchText);

  if (output.row === -1) {
    throw new Error(`Could not find "${searchText}" in the worksheet.`);
  }

  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replaceText;

  await workbook.xlsx.writeFile(filePath);
}

module.exports = { readExcel, writeExcelTest };