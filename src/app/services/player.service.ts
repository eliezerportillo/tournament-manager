import { Injectable, } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference, Query, DocumentData, } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Player } from '../models/player';
import { Stats } from '../models/stats';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  playersCollection: AngularFirestoreCollection<Player>;
  
  players$: Observable<Player[]>;

  constructor(private db: AngularFirestore) {
    this.playersCollection = this.db.collection<Player>('Jugadores');
    
    this.players$ = this.playersCollection.valueChanges();
  }



  async getPlayersStats(): Promise<Stats> {
    const promises = [
      this.getFiltered('goles'),
      this.getFiltered('amarillas'),
      this.getFiltered('rojas')
    ];
    const responses = await Promise.all(promises);    

    const s: Stats = {
      goals: responses[0],
      yellows: responses[1],
      reds: responses[2],

    }

    return s;
  }

  private async getFiltered(filterBy: string) {
    const snapshot = await this.playersCollection.ref.where(filterBy, '>', 0).get();
    return snapshot.docs.map(doc => doc.data());
  }
}
