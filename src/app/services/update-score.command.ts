import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { IMatch } from '../models/match';

@Injectable({
  providedIn: 'root'
})
export class UpdateScoreCommand {




  constructor(private db: AngularFirestore) {

  }

  async execute(match: IMatch) {

    const ref = this.db.firestore.collection('Partidos').doc(match.id);
    await ref.update({
      marcadorLocal: match.marcadorLocal, 
      marcadorVisita: match.marcadorVisita,
      fecha: match.fecha,
      hora: match.hora,
      campo: match.campo
    });    
  }
}
