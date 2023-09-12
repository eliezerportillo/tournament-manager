import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Player } from '@app-core/models/player';

@Injectable({
  providedIn: 'root'
})
export class DeletePlayerCommand {

  db = inject(AngularFirestore);

  async execute(player: Player) {
    const ref = this.db.firestore.collection('Jugadores').doc(player.id);
    await ref.delete();  
  }
}
