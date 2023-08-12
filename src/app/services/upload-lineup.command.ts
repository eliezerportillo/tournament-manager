import { Injectable, inject } from '@angular/core';
import { LineUp } from '../models/lineup';
import { Player } from '../models/player';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Formation } from '../models/formation';

@Injectable({
  providedIn: 'root'
})
export class UploadLineupCommand {

  db: AngularFirestore = inject(AngularFirestore);


  async execute(startings: LineUp[], substitutes: Player[]) {
    const players = startings.map(p => {
      p.startging = true;      
      return p;
    });


    substitutes.forEach((p, index) => {
      players.push({
        equipo: p.equipo,
        jugador: p.jugador,
        startging: false,
        order: startings.length + index + 1        
      })
    });

    const teamName = players[0].equipo;
    await this.deleteCollection(teamName)
    await this.saveDataToFirestore(teamName, players);

  }

  async saveDataToFirestore(teamName: string, data: any[]) {
    try {
      const collectionRef = this.db.firestore.collection('Alineaciones');

      // Using batch to perform a batch write for faster insertion
      const batch = this.db.firestore.batch();

      data.forEach((item) => {
        const docRef = collectionRef.doc(); // Auto-generated document ID
        batch.set(docRef, item);
      });

      await batch.commit();
      console.log(`Data from ${teamName} successfully stored in Firestore.`);
    } catch (error) {
      console.error(`Error saving data from ${teamName} to Firestore:`, error);
    }
  }

  async deleteCollection(teamName: string) {
    try {

      // Get all documents from the collection
      const snapshot = await this.db.firestore.collection('Alineaciones').where('equipo', '==', teamName).get();
      const batch = this.db.firestore.batch();

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Commit the batch delete
      await batch.commit();
      console.log(`Collection ${teamName} successfully deleted.`);
    } catch (error) {
      console.error(`Error deleting collection ${teamName}:`, error);
    }
  }

}
