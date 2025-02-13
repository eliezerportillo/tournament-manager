import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IMatch } from '@app-core/models/match';
import { MatchSheet } from '@app-core/models/match-sheet';
import { IPlayer } from '@app-core/models/player';
import { SheetPlayer } from '@app-core/models/sheet-player';

@Injectable({
  providedIn: 'root',
})
export class RegisterPlayerAttendanceCommand {
  private matchSheetsCollectionName = 'sheets';

  constructor(private firestore: AngularFirestore) {}

  async execute(
    player: SheetPlayer,
    matchId: string,
    attended: boolean
  ): Promise<void> {
    const matchSheetRef = this.firestore
      .collection<MatchSheet>(this.matchSheetsCollectionName)
      .doc(matchId);

    await this.firestore.firestore.runTransaction(async (transaction) => {
      const matchSheetDoc = await transaction.get(matchSheetRef.ref);

      if (matchSheetDoc.exists) {
        const matchSheet = matchSheetDoc.data() as MatchSheet;
        const playerIndex = matchSheet.players.findIndex(
          (p) => p.playerId === player.id
        );

        if (playerIndex !== -1) {
          matchSheet.players[playerIndex].attended = attended;
        } else {
          matchSheet.players.push({
            playerId: player.id,
            team: player.equipo,
            attended: attended,
            ownGoals: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
          });
        }

        transaction.update(matchSheetRef.ref, { players: matchSheet.players });
      } else {
        const newMatchSheet: MatchSheet = {
          id: matchId,
          matchId: matchId,
          homeScore: 0,
          awayScore: 0,
          players: [
            {
              playerId: player.id,
              team: player.equipo,
              attended: attended,
              ownGoals: 0,
              goals: 0,
              assists: 0,
              yellowCards: 0,
              redCards: 0,
            },
          ],
          comments: '',
          status: 'pending',
        };

        transaction.set(matchSheetRef.ref, newMatchSheet);
      }
    });
  }
}
