import { Workbook, Worksheet } from 'exceljs';

export interface CellPosition {
  row: number;
  column: number;
}

export interface CellOffset {
  rowChange?: number;
  colChange: number;
}

/**
 * Searches the worksheet for a cell matching searchText (trimmed, case-insensitive)
 * and returns its position. Returns { row: -1, column: -1 } if not found.
 */
export function readExcel(worksheet: Worksheet, searchText: string | number): CellPosition {
  let output: CellPosition = { row: -1, column: -1 };
  const target = searchText.toString().trim().toLowerCase();

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value && cell.value.toString().trim().toLowerCase() === target) {
        output = { row: rowNumber, column: colNumber };
      }
    });
  });

  return output;
}

/**
 * Opens the Excel file, finds searchText, writes replaceText into a cell
 * offset from it (rowChange / colChange), and saves the file back to disk.
 */
export async function writeExcelTest(
  searchText: string,
  replaceText: string | number,
  change: CellOffset,
  filePath: string
): Promise<void> {
  const workbook = new Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet('Sheet1');
  if (!worksheet) {
    throw new Error(`Worksheet "Sheet1" not found in ${filePath}`);
  }

  const output = readExcel(worksheet, searchText);
  if (output.row === -1) {
    throw new Error(`Could not find "${searchText}" in the worksheet.`);
  }

  const cell = worksheet.getCell(
    output.row + (change.rowChange ?? 0),
    output.column + change.colChange
  );
  cell.value = replaceText;

  await workbook.xlsx.writeFile(filePath);
}