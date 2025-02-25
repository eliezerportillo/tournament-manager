import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
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

  convertJavascriptDateToExcel(date: Date | null): number | null {
    if (!date) {
      return null;
    }
    // Adjust the number of days between JavaScript's epoch (January 1, 1970) and Excel epoch (January 1, 1900)
    const excelEpochDiff = 25569; // for Windows (1900) or 24107 for Mac (1904)

    // Convert the JavaScript date to Excel date
    const excelDate =
      excelEpochDiff +
      (date.getTime() - date.getTimezoneOffset() * 60 * 1000) /
        (1000 * 60 * 60 * 24);

    return Math.floor(excelDate);
  }
}
