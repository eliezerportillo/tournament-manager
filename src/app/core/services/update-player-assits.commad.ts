import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatchSheet } from '@app-core/models/match-sheet';
import { SheetPlayer } from '@app-core/models/sheet-player';

@Injectable({
    providedIn: 'root'
})
export class UpdatePlayerAssistsCommand {
    private matchSheetsCollectionName = 'sheets';

    constructor(private firestore: AngularFirestore) {}

    async execute(player: SheetPlayer, matchId: string, newAssists: number): Promise<void> {
        const matchSheetRef = this.firestore.collection<MatchSheet>(this.matchSheetsCollectionName).doc(matchId);

        await this.firestore.firestore.runTransaction(async (transaction) => {
            const matchSheetDoc = await transaction.get(matchSheetRef.ref);

            if (!matchSheetDoc.exists) {
                throw new Error(`MatchSheet with matchId ${matchId} does not exist.`);
            }

            const matchSheet = matchSheetDoc.data() as MatchSheet;
            const playerIndex = matchSheet.players.findIndex(p => p.playerId === player.id);

            if (playerIndex !== -1) {
                matchSheet.players[playerIndex].assists += newAssists;
            } else {
                matchSheet.players.push({
                    playerId: player.id,
                    team: player.equipo,
                    attended: false,
                    goals: 0,
                    assists: newAssists,
                    yellowCards: 0,
                    redCards: 0
                });
            }

            transaction.update(matchSheetRef.ref, { players: matchSheet.players });
        });
    }
}