import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  convertExcelDateToJSDate(excelDate: number | undefined): Date | null {

    if (!excelDate) {
      return null;
    }
    // Adjust the number of days between Excel epoch (January 1, 1900) and JavaScript's epoch (January 1, 1970)
    const excelEpochDiff = 25568; // for Windows (1900) or 24107 for Mac (1904)

    // Convert the Excel date to JavaScript timestamp (milliseconds since January 1, 1970)
    const javascriptTimestamp = (excelDate - excelEpochDiff) * 86400 * 1000;

    // Create a new Date object with the JavaScript timestamp
    return new Date(javascriptTimestamp);
  }

  convertDateToExcel(date: Date | null): number | null {
    if (!date) {
      return null;
    }
    // Adjust the number of days between JavaScript's epoch (January 1, 1970) and Excel epoch (January 1, 1900)
    const excelEpochDiff = 25568; // for Windows (1900) or 24107 for Mac (1904)

    // Convert the JavaScript date to Excel date
    const excelDate = (date.getTime() / (86400 * 1000)) + excelEpochDiff;

    return Math.floor(excelDate);
  }
}
