import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IPlayer } from '@app-core/models/player';
import { IMatchSheet } from '@app-core/models/match-sheet';
import { SheetPlayer } from '@app-core/models/sheet-player';
import { IMatch } from '@app-core/models/match';

@Injectable({
  providedIn: 'root',
})
export class UpdateScoreOnGoalEventCommand {
  private matchSheetsCollectionName = 'sheets';
  constructor(private firestore: AngularFirestore) {}

  async execute(
    player: SheetPlayer,
    match: IMatch,
    newGoals: number
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
        matchSheet.players[playerIndex].goals += newGoals;

        matchSheet.homeScore += player.equipo === match.local ? newGoals : 0;
        matchSheet.awayScore += player.equipo === match.visita ? newGoals : 0;

        transaction.update(matchSheetRef.ref, {
          players: matchSheet.players,
          homeScore: matchSheet.homeScore,
          awayScore: matchSheet.awayScore,
        });
      }
    });
  }
}
