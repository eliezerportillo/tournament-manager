import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatchSheet } from '../models/match-sheet';

@Injectable({
  providedIn: 'root',
})
export class SaveSheetCommentsCommand {
  private readonly collectionName = 'sheets';

  constructor(private firestore: AngularFirestore) {}

  async execute(sheetId: string, comments: string): Promise<void> {
    try {
      const sheetRef = this.firestore
        .collection(this.collectionName)
        .doc(sheetId);
      await sheetRef.update({ comments });
    } catch (error) {
      console.error('Error saving comments:', error);
      throw error;
    }
  }
}
