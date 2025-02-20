import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IMatch } from '@app-core/models/match';
import { IMatchSheet } from '@app-core/models/match-sheet';
import { SheetPlayer } from '@app-core/models/sheet-player';

@Injectable({
  providedIn: 'root',
})
export class UpdateScoreOnOwnGoalEventCommand {
  private matchSheetsCollectionName = 'sheets';
  constructor(private firestore: AngularFirestore) {}

  async execute(
    player: SheetPlayer,
    match: IMatch,
    newOwnGoals: number
  ): Promise<void> {
    const matchSheetRef = this.firestore
      .collection<IMatchSheet>(this.matchSheetsCollectionName)
      .doc(match.id);

    await this.firestore.firestore.runTransaction(async (transaction) => {
      const matchSheetDoc = await transaction.get(matchSheetRef.ref);

      if (!matchSheetDoc.exists) {
        throw new Error(`MatchSheet with matchId ${match} does not exist.`);
      }

      const matchSheet = matchSheetDoc.data() as IMatchSheet;
      const playerIndex = matchSheet.players.findIndex(
        (p) => p.playerId === player.id && p.team === player.equipo
      );

      if (playerIndex !== -1) {
        matchSheet.players[playerIndex].ownGoals += newOwnGoals;

        matchSheet.homeScore +=
          player.equipo === match.visita ? newOwnGoals : 0;
        matchSheet.awayScore += player.equipo === match.local ? newOwnGoals : 0;

        transaction.update(matchSheetRef.ref, {
          players: matchSheet.players,
          homeScore: matchSheet.homeScore,
          awayScore: matchSheet.awayScore,
        });
      }
    });
  }
}
