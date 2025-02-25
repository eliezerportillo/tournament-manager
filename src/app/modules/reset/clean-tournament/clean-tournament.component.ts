import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-clean-tournament',
  templateUrl: './clean-tournament.component.html',
  styleUrls: ['./clean-tournament.component.scss']
})
export class CleanTournamentComponent {
  isLoading: boolean = false;
  collections: Collection[] = [
    { exists: false, size: 0, name: 'Alineaciones', data: [{ id: 'placeholder' }] },
    { exists: false, size: 0, name: 'Equipos', data: [{ id: 'placeholder' }] },
    { exists: false, size: 0, name: 'Jugadores', data: [{ id: 'placeholder' }] },
    { exists: false, size: 0, name: 'Partidos', data: [{ id: 'placeholder' }] },
    { exists: false, size: 0, name: 'Patrocinadores', data: [{ id: 'placeholder' }] },
    { exists: false, size: 0, name: 'sheets', data: [{ id: 'placeholder' }] },
    { exists: false, size: 0, name: 'badges', data: [{ id: 'placeholder' }] },
    { exists: false, size: 0, name: 'banners', data: [{ id: 'placeholder', active: false, autoMessge: '', imageUrl: '', phoneNumber: '' }] },
    { exists: false, size: 0, name: 'settings', data: [{ id: 'placeholder', defaultRoute: 'ranking', tournamentName: '', companyName: '', zoneName: '' }] },
  ];
  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.checkIfCollectionsExist();
  }

  checkIfCollectionsExist(): void {
    this.collections.forEach(async collection => {
      await this.checkIfCollection(collection);
    });
  }

  async checkIfCollection(collection: Collection): Promise<void> {
    const snapshot = await firstValueFrom(this.firestore.collection(collection.name).get());
    collection.exists = !snapshot.empty;
    collection.size = snapshot.size;
  }

  async createCollection(collection: Collection): Promise<void> {
    const batch = this.firestore.firestore.batch();
    collection.data.forEach(item => {
      const docRef = this.firestore.collection(collection.name).doc().ref;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  async cleanCollection(collectionName: string): Promise<void> {
    const snapshot = await firstValueFrom(this.firestore.collection(collectionName).get());
    const batch = this.firestore.firestore.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

interface Collection {
  size: number;
  exists: boolean;
  name: string;
  data: any[];
}
