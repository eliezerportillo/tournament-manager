import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IMatchSheet, MatchSheetPlayer } from '@app-core/models/match-sheet';
import { SheetPlayer } from '@app-core/models/sheet-player';

@Injectable({
  providedIn: 'root',
})
export class UpdatePlayerFaultsCommand {
  private matchSheetsCollectionName = 'sheets';

  constructor(private firestore: AngularFirestore) {}

  async execute(
    player: SheetPlayer,
    matchId: string,
    newFaults: number
  ): Promise<void> {
    const matchSheetRef = this.firestore
      .collection<IMatchSheet>(this.matchSheetsCollectionName)
      .doc(matchId);

    await this.firestore.firestore.runTransaction(async (transaction) => {
      const matchSheetDoc = await transaction.get(matchSheetRef.ref);

      if (!matchSheetDoc.exists) {
        throw new Error(`MatchSheet with matchId ${matchId} does not exist.`);
      }

      const matchSheet = matchSheetDoc.data() as IMatchSheet;
      const playerIndex = matchSheet.players.findIndex(
        (p) => p.playerId === player.id
      );

      if (playerIndex !== -1) {
        matchSheet.players[playerIndex].faults += newFaults;
      } else {
        const sheetPlayer = new MatchSheetPlayer(
          player.id,
          player.jugador,
          player.equipo
        );
        sheetPlayer.faults = newFaults;
        matchSheet.players.push(sheetPlayer.asPlainObject());
      }

      transaction.update(matchSheetRef.ref, { players: matchSheet.players });
    });
  }
}
