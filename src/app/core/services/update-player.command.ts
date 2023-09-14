import { Injectable, inject } from '@angular/core';
import { IPlayer } from '@app-core/models/player';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UpdatePlayerCommand {

  db = inject(AngularFirestore);

  async execute(player: IPlayer) {
    const ref = this.db.firestore.collection('Jugadores').doc(player.id);
    await ref.update({      
      amarillas: player.amarillas,
      rojas: player.rojas,
      goles: player.goles,
      capitan: player.capitan,
      portero: player.portero,
      noBautizado: player.noBautizado,
      correo: player.correo,
    });  
  }
}
