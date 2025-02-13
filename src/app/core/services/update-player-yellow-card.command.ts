import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatchSheet } from '@app-core/models/match-sheet';
import { SheetPlayer } from '@app-core/models/sheet-player';

@Injectable({
  providedIn: 'root',
})
export class UpdatePlayerYellowCardCommand {
  private matchSheetsCollectionName = 'sheets';

  constructor(private firestore: AngularFirestore) {}

  async execute(
    player: SheetPlayer,
    matchId: string,
    newYellowCards: number
  ): Promise<void> {
    const matchSheetRef = this.firestore
      .collection<MatchSheet>(this.matchSheetsCollectionName)
      .doc(matchId);

    await this.firestore.firestore.runTransaction(async (transaction) => {
      const matchSheetDoc = await transaction.get(matchSheetRef.ref);

      if (!matchSheetDoc.exists) {
        throw new Error(`MatchSheet with matchId ${matchId} does not exist.`);
      }

      const matchSheet = matchSheetDoc.data() as MatchSheet;
      const playerIndex = matchSheet.players.findIndex(
        (p) => p.playerId === player.id
      );

      if (playerIndex !== -1) {
        matchSheet.players[playerIndex].yellowCards += newYellowCards;
      } else {
        matchSheet.players.push({
          playerId: player.id,
          team: player.equipo,
          attended: false,
          ownGoals: 0,
          goals: 0,
          assists: 0,
          yellowCards: newYellowCards,
          redCards: 0,
        });
      }

      transaction.update(matchSheetRef.ref, { players: matchSheet.players });
    });
  }
}
