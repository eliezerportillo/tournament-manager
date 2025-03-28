import { Injectable, inject } from '@angular/core';
import { IPlayer } from '@app-core/models/player';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class UpdatePlayerCommand {
  db = inject(AngularFirestore);

  async execute(player: IPlayer) {
    const ref = this.db.firestore.collection('Jugadores').doc(player.id);
    await ref.update({
      goles: player.goles,
      asistencias: player.asistencias,
      faltas: player.faltas,
      amarillas: player.amarillas,
      rojas: player.rojas,
      numero: player.numero,
      noAlinea: player.noAlinea,
      capitan: player.capitan,
      portero: player.portero,
      noBautizado: player.noBautizado,
      correo: player.correo,
    });
  }
}
