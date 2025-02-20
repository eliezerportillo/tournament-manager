import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IMatch } from '@app-core/models/match';
import {
  IMatchSheet,
  IMatchSheetPlayer,
  MatchSheet,
  MatchSheetPlayer,
} from '@app-core/models/match-sheet';
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
    match: IMatch,
    attended: boolean
  ): Promise<void> {
    const matchId = match.id;
    const matchSheetRef = this.firestore
      .collection<IMatchSheet>(this.matchSheetsCollectionName)
      .doc(matchId);

    await this.firestore.firestore.runTransaction(async (transaction) => {
      const matchSheetDoc = await transaction.get(matchSheetRef.ref);

      if (matchSheetDoc.exists) {
        const matchSheet = matchSheetDoc.data() as IMatchSheet;
        const playerIndex = matchSheet.players.findIndex(
          (p) => p.playerId === player.id
        );

        if (playerIndex !== -1) {
          matchSheet.players[playerIndex].attended = attended;
        } else {
          const sheetPlayer = new MatchSheetPlayer(
            player.id,
            player.jugador,
            player.equipo,
            attended
          );
          matchSheet.players.push(sheetPlayer.asPlainObject());
        }

        transaction.update(matchSheetRef.ref, { players: matchSheet.players });
      } else {
        const sheetPlayer = new MatchSheetPlayer(
          player.id,
          player.jugador,
          player.equipo,
          attended
        );
        const newMatchSheet = new MatchSheet(matchId, [sheetPlayer]);
        newMatchSheet.homeTeam = match.local;
        newMatchSheet.awayTeam = match.visita;
        transaction.set(matchSheetRef.ref, newMatchSheet.asPlainObject());
      }
    });
  }
}
