import { MatchSheet } from '@app-core/models/match-sheet';
import { IPlayer } from '@app-core/models/player';
import { IMatch } from '@app-core/models/match';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PublishMatchResultsCommand {
  constructor(private firestore: AngularFirestore) {}

  async execute(sheet: MatchSheet, match: IMatch): Promise<void> {
    if (!match.id) {
      throw new Error('Match ID is required');
    }
    if (!sheet.id) {
      throw new Error('Sheet ID is required');
    }

    const batch = this.firestore.firestore.batch();

    // update match score in `Partidos` collection
    const matchRef = this.firestore.collection('Partidos').doc(match.id).ref;
    batch.update(matchRef, {
      marcadorLocal: sheet.homeScore,
      marcadorVisita: sheet.awayScore,
    });

    // Update player stats
    const playerUpdatePromises = sheet.players.map(async (player) => {
      if (!player.attended) {
        return;
      }
      if (!player.playerId) {
        throw new Error('Player ID is required');
      }
      const playerRef = this.firestore
        .collection('Jugadores')
        .doc(player.playerId).ref;
      const playerDoc = await playerRef.get();
      const playerData = playerDoc.data() as IPlayer;

      batch.update(playerRef, {
        goles: (playerData.goles || 0) + player.goals,
        autogoles: (playerData.autogoles || 0) + player.ownGoals,
        asistencias: (playerData.asistencias || 0) + player.assists,
        amarillas: (playerData.amarillas || 0) + player.yellowCards,
        rojas: (playerData.rojas || 0) + player.redCards,
      });
    });

    await Promise.all(playerUpdatePromises);

    // Update match status
    const matchSheetRef = this.firestore.collection('sheets').doc(sheet.id).ref;
    batch.set(matchSheetRef, { status: 'published' }, { merge: true });

    await batch.commit();
  }
}
