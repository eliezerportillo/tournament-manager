import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as XLSX from 'xlsx';



@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.scss']
})
export class ImportExcelComponent {



  constructor(private db: AngularFirestore, private snackBar: MatSnackBar) {


  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.readExcelFile(file);
    }
  }

  async readExcelFile(file: File) {
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Process each sheet in the Excel file
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        // Trim the values of each property in the Excel data
        const trimmedData = excelData.map((row: any) => {
          const trimmedRow: any = {};
          Object.keys(row).forEach((key) => {
            trimmedRow[key] = typeof row[key] === 'string' ? row[key].trim() : row[key];
          });
          return trimmedRow;
        });

        // Save data to Firestore
        await this.deleteCollection(sheetName);
        await this.saveDataToFirestore(sheetName, trimmedData);
      }
      this.snackBar.open('Información importada con éxito');
    };

    reader.readAsArrayBuffer(file);
  }
  async saveDataToFirestore(sheetName: string, data: any[]) {
    try {
      const collectionRef = this.db.firestore.collection(sheetName);

      // Using batch to perform a batch write for faster insertion
      const batch = this.db.firestore.batch();

      data.forEach((item) => {
        const docRef = collectionRef.doc(); // Auto-generated document ID
        batch.set(docRef, item);
      });

      await batch.commit();
      console.log(`Data from ${sheetName} successfully stored in Firestore.`);
    } catch (error) {
      console.error(`Error saving data from ${sheetName} to Firestore:`, error);
    }
  }

  async deleteCollection(collectionPath: string) {
    try {

      // Get all documents from the collection
      const snapshot = await this.db.firestore.collection(collectionPath).get();
      const batch = this.db.firestore.batch();

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Commit the batch delete
      await batch.commit();
      console.log(`Collection ${collectionPath} successfully deleted.`);
    } catch (error) {
      console.error(`Error deleting collection ${collectionPath}:`, error);
    }
  }
}

