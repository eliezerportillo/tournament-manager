import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IPlayer } from '@app-core/models/player';

@Injectable({
  providedIn: 'root'
})
export class CreatePlayerCommand {
  db = inject(AngularFirestore);

  async execute(player: IPlayer) {
    const doc = this.db.firestore.collection('Jugadores').doc();
    
    doc.set(player);
  }

  constructor() { }
}
